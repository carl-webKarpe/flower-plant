<?php
if (is_file(__DIR__ . '/config.local.php')) {
    return require __DIR__ . '/config.local.php';
}

/**
 * Database connection settings.
 *
 * TIP: to keep your real password off GitHub, copy this file to `api/config.local.php`
 * and put your password there instead. config.local.php is ignored by git and, when it
 * exists, it is used instead of this file.
 * Use the SAME values you use to connect in MySQL Workbench
 * (Workbench → home screen → your connection → Edit Connection).
 */
return [
    'db_host' => '127.0.0.1',
    'db_port' => 3306,          // MySQL Server default. Change if your Workbench connection uses another port.
    'db_name' => 'lunhaw',
    'db_user' => 'root',
    'db_pass' => '',            // <-- put your MySQL root password here

    // Required in the "X-API-Key" header for POST / PUT / DELETE (adding, editing, deleting records).
    // Reading data (GET) is public. Change this to your own secret value.
    'api_key' => 'change-this-key',
];
