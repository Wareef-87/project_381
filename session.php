<?php
require_once __DIR__ . '/includes/auth.php';

$user = current_user();

json_response([
    'success' => true,
    'loggedIn' => $user !== null,
    'user' => $user,
]);
