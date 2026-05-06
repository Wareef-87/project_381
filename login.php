<?php
require_once('includes/auth.php');
require_once('includes/db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $email = strtolower(clean_input($_POST['email'] ?? ''));
  $password = (string) ($_POST['password'] ?? '');
  $role = clean_input($_POST['role'] ?? '');

  if ($email === '' || $password === '' || $role === '') {
    json_response(['success' => false, 'message' => 'Please fill all fields.'], 422);
  }

  $selectedRole = $role === 'User' ? 'user' : $role;
  $stmt = $pdo->prepare('SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? AND role = ?');
  $stmt->execute([$email, $selectedRole]);
  $user = $stmt->fetch();

  $passwordMatches = false;
  if ($user) {
    $savedPassword = (string) $user['password_hash'];
    $passwordMatches = $password === $savedPassword || password_verify($password, $savedPassword);
  }

  if (!$passwordMatches) {
    json_response(['success' => false, 'message' => 'Wrong email, password, or role.'], 401);
  }

  if ($user['password_hash'] !== $password) {
    $updatePassword = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $updatePassword->execute([$password, $user['id']]);
  }

  $_SESSION['user'] = [
    'id' => (int) $user['id'],
    'name' => $user['full_name'],
    'email' => $user['email'],
    'role' => $user['role'],
  ];

  json_response(['success' => true, 'user' => $_SESSION['user']]);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Hub | Login</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="login">
  <header class="site-header">
    <a href="index.php" class="brand-link">
      <span class="brand-name">Book Hub</span>
    </a>

    <nav class="site-nav" aria-label="Main navigation">
      <a href="index.php">Home</a>
      <a href="search.php">Search</a>
      <a href="register.php">Register</a>
      <a href="contact.php">Contact</a>
    </nav>
  </header>

  <main class="page-shell auth-shell">
    <section class="section-shell auth-card">
      <div class="section-heading">
      
        <h2>Log in to continue</h2>
      </div>

      <form id="loginForm" class="stacked-form" method="post" action="login.php" novalidate>
        <label class="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="example@gmail.com" required>
          <small class="error-text"></small>
        </label>

        <label class="field">
          <span>Password</span>
          <input type="password" name="password" placeholder="Enter your password" required minlength="6">
          <small class="error-text"></small>
        </label>

        <label class="field">
          <span>Role</span>
          <select name="role" required>
            <option value="">Choose role</option>
            <option value="User">User</option>
            <option value="admin">Admin</option>
          </select>

          <small class="error-text"></small>
        </label>
        <button type="submit" class="primary-btn">Login</button>
      </form>

      <p id="loginMessage" class="status-message"></p>
      <p class="subtle-copy">New here? <a href="register.php">Create an account!</a>.</p>
    </section>
  </main>

  <footer class="page-footer">
    <p>© 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script>
</body>
</html>
