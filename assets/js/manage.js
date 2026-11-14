/**
 * Manage data page — talks to the REST API directly so every request is visible.
 *   GET    api/species.php, api/categories.php, api/municipalities.php
 *   POST   api/species.php               (create)
 *   PUT    api/species.php?id={slug}     (update)
 *   DELETE api/species.php?id={slug}     (delete)
 */
(function () {
  const cfg = window.LUNHAW_CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const base = cfg.API_BASE.replace(/\/$/, '');

  let apiKey = '';
  try { apiKey = sessionStorage.getItem('sf-api-key') || ''; } catch (e) { /* storage blocked */ }
  let species = [];
  let editing = null; // slug of the species being edited, or null when adding

  /* ---------- request helper with a visible log ---------- */
  async function api(method, path, body) {
    const url = `${base}/${path}`;
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (method !== 'GET' && apiKey) headers['X-API-Key'] = apiKey;

    const started = performance.now();
    let status = 0, data = null, error = null;
    try {
      const res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
      status = res.status;
      const text = await res.text();
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    } catch (e) {
      error = 'Network error — is Apache running and is the API reachable?';
    }
    logRequest({ method, url, body, status, data, error, ms: Math.round(performance.now() - started) });
    if (error) throw new Error(error);
    if (status >= 400) throw new Error((data && data.error) || `Request failed (${status})`);
    return data;
  }

  function logRequest({ method, url, body, status, data, error, ms }) {
    const ok = status >= 200 && status < 300;
    const li = document.createElement('li');
    li.className = 'apilog__item';
    const pretty = (v) => esc(typeof v === 'string' ? v : JSON.stringify(v, null, 2));
    const shownResponse = data && data.data && Array.isArray(data.data) && data.data.length > 3
      ? { ...data, data: [...data.data.slice(0, 3), `… ${data.data.length - 3} more`] } : data;
    li.innerHTML = `
      <details>
        <summary>
          <span class="m-badge m-${method.toLowerCase()}">${method}</span>
          <code class="apilog__url">${esc(url.replace(location.origin, ''))}</code>
          <span class="apilog__status ${error ? 'is-err' : ok ? 'is-ok' : 'is-err'}">${error ? 'ERR' : status}</span>
          <span class="apilog__time">${ms} ms · ${new Date().toLocaleTimeString()}</span>
        </summary>
        <div class="apilog__body">
          ${body !== undefined ? `<div><h4>Request body (JSON)</h4><pre>${pretty(body)}</pre></div>` : ''}
          ${method !== 'GET' ? `<div><h4>Request header</h4><pre>X-API-Key: ${apiKey ? '••••••••' : '(none)'}</pre></div>` : ''}
          <div><h4>Response (JSON)</h4><pre>${error ? esc(error) : pretty(shownResponse)}</pre></div>
        </div>
      </details>`;
    $('#apiLog').prepend(li);
    if (method !== 'GET') li.querySelector('details').open = true;
  }

  function toast(msg, tone = 'ok') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = `toast is-on toast--${tone}`;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('is-on'), 3200);
  }

  /* ---------- API key ---------- */
  function showKeyStatus() {
    $('#keyStatus').innerHTML = apiKey
      ? '<span class="status-dot is-live"></span> Key set for this session'
      : '<span class="status-dot"></span> No key — read only';
  }
  $('#keyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    apiKey = $('#apiKey').value.trim();
    try { apiKey ? sessionStorage.setItem('sf-api-key', apiKey) : sessionStorage.removeItem('sf-api-key'); } catch (err) { /* ignore */ }
    $('#apiKey').value = '';
    showKeyStatus();
    toast(apiKey ? 'API key saved for this session.' : 'API key cleared.');
  });

  /* ---------- list ---------- */
  function renderList() {
    const term = $('#listSearch').value.trim().toLowerCase();
    const rows = species.filter((s) => !term || `${s.local_name} ${s.scientific_name} ${s.category}`.toLowerCase().includes(term));
    $('#speciesCount').textContent = species.length;
    $('#speciesRows').innerHTML = rows.length ? rows.map((s) => `
      <tr class="${editing === s.id ? 'is-editing' : ''}">
        <td><span class="swatch" style="background:${esc(s.color || '#5b8a4a')}"></span>
          <b>${esc(s.local_name)}</b><small><i>${esc(s.scientific_name)}</i></small></td>
        <td>${esc(s.category)}</td>
        <td class="muted">${(s.municipalities || []).length}</td>
        <td class="ta-r nowrap">
          <a class="icon-btn" href="species.php?id=${encodeURIComponent(s.id)}" title="View on website" aria-label="View ${esc(s.local_name)}">
            <svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></a>
          <button class="icon-btn" type="button" data-edit="${esc(s.id)}" title="Edit (PUT)" aria-label="Edit ${esc(s.local_name)}">
            <svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14 6 4 4"/></svg></button>
          <button class="icon-btn icon-btn--danger" type="button" data-delete="${esc(s.id)}" title="Delete (DELETE)" aria-label="Delete ${esc(s.local_name)}">
            <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button>
        </td>
      </tr>`).join('') : '<tr><td colspan="4" class="muted">No species found.</td></tr>';
  }

  async function loadSpecies() {
    const res = await api('GET', 'species.php');
    species = res.data || [];
    renderList();
  }

  /* ---------- form ---------- */
  const form = $('#speciesForm');
  const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

  function fillForm(s) {
    editing = s ? s.id : null;
    form.reset();
    $('#formError').hidden = true;
    $('#formTitle').textContent = s ? `Edit: ${s.local_name}` : 'Add a species';
    $('#formMethod').textContent = s ? 'PUT' : 'POST';
    $('#formMethod').className = `m-badge ${s ? 'm-put' : 'm-post'}`;
    $('#saveBtn').textContent = s ? 'Update species' : 'Save species';
    if (s) {
      ['local_name', 'scientific_name', 'common_name', 'family', 'category', 'status', 'habitat', 'blooming', 'origin', 'description', 'uses']
        .forEach((k) => { form.elements[k].value = s[k] || ''; });
      form.elements.native.checked = !!s.native;
      form.elements.color.value = /^#[0-9a-f]{6}$/i.test(s.color || '') ? s.color : '#5b8a4a';
      $$('#muniChecks input').forEach((c) => { c.checked = (s.municipalities || []).includes(c.value); });
      form.elements.photos.value = (s.photos || []).map((p) => [p.src, p.caption].filter(Boolean).join(' | ')).join('\n');
      form.elements.videos.value = (s.videos || []).map((v) => [v.src, v.title].filter(Boolean).join(' | ')).join('\n');
    }
    renderList();
  }

  function formToJson() {
    const f = form.elements;
    const v = (k) => f[k].value.trim();
    const split = (line) => line.split('|').map((x) => x.trim());
    return {
      local_name: v('local_name'),
      scientific_name: v('scientific_name'),
      common_name: v('common_name') || null,
      family: v('family') || null,
      category: v('category'),
      color: v('color'),
      native: f.native.checked,
      origin: v('origin') || null,
      status: v('status') || null,
      habitat: v('habitat') || null,
      blooming: v('blooming') || null,
      uses: v('uses') || null,
      description: v('description') || null,
      municipalities: $$('#muniChecks input:checked').map((c) => c.value),
      photos: lines(f.photos.value).map((l) => { const [src, caption] = split(l); return { src, caption: caption || null }; }),
      videos: lines(f.videos.value).map((l) => { const [src, title] = split(l); return { src, title: title || null }; }),
    };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('#formError');
    err.hidden = true;
    const body = formToJson();
    if (!body.local_name || !body.scientific_name || !body.category) {
      err.textContent = 'Local name, scientific name and plant group are required.';
      err.hidden = false;
      return;
    }
    if (!apiKey) {
      err.textContent = 'Enter the API key at the top of the page first.';
      err.hidden = false;
      $('#apiKey').focus();
      return;
    }
    const btn = $('#saveBtn');
    btn.disabled = true;
    try {
      const res = editing
        ? await api('PUT', `species.php?id=${encodeURIComponent(editing)}`, body)
        : await api('POST', 'species.php', body);
      toast(res.message || 'Saved.');
      await loadSpecies();
      fillForm(species.find((s) => s.id === res.data.id) || null);
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      toast(ex.message, 'err');
    } finally {
      btn.disabled = false;
    }
  });

  $('#speciesRows').addEventListener('click', async (e) => {
    const edit = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-delete]');
    if (edit) {
      fillForm(species.find((s) => s.id === edit.dataset.edit));
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (del) {
      const s = species.find((x) => x.id === del.dataset.delete);
      if (!apiKey) { toast('Enter the API key first.', 'err'); $('#apiKey').focus(); return; }
      if (!confirm(`Delete "${s.local_name}"? This removes it from the database, including its photo and video records.`)) return;
      try {
        const res = await api('DELETE', `species.php?id=${encodeURIComponent(s.id)}`);
        toast(res.message || 'Deleted.');
        if (editing === s.id) fillForm(null);
        await loadSpecies();
      } catch (ex) {
        toast(ex.message, 'err');
      }
    }
  });

  $('#newBtn').addEventListener('click', () => { fillForm(null); form.elements.local_name.focus(); });
  $('#cancelBtn').addEventListener('click', () => fillForm(null));
  $('#listSearch').addEventListener('input', renderList);
  $('#clearLog').addEventListener('click', () => { $('#apiLog').innerHTML = ''; });

  /* ---------- start ---------- */
  (async function init() {
    showKeyStatus();
    try {
      const [cats, munis] = await Promise.all([api('GET', 'categories.php'), api('GET', 'municipalities.php')]);
      $('#categorySelect').innerHTML = '<option value="">Choose a group…</option>' +
        cats.data.map((c) => `<option>${esc(c.name)}</option>`).join('');
      $('#muniChecks').innerHTML = munis.data.map((m) =>
        `<label class="check"><input type="checkbox" value="${esc(m)}"><span>${esc(m)}</span></label>`).join('');
      await loadSpecies();
    } catch (ex) {
      $('#speciesRows').innerHTML = `<tr><td colspan="4" class="form-error">Could not reach the API: ${esc(ex.message)}<br>Check that Apache is running and the database is set up.</td></tr>`;
    }
  })();
})();
