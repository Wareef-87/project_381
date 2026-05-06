<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function json_response($data, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function clean_input($value)
{
    return htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
}

function current_user()
{
    if (empty($_SESSION['user'])) {
        return null;
    }

    return $_SESSION['user'];
}

function require_login()
{
    $user = current_user();
    if (!$user) {
        json_response(['success' => false, 'message' => 'Please login first.'], 401);
    }

    return $user;
}

function require_admin()
{
    $user = require_login();
    if ($user['role'] !== 'admin') {
        json_response(['success' => false, 'message' => 'Admin access only.'], 403);
    }

    return $user;
}
