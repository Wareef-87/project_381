<?php
require_once('includes/auth.php');
require_once('includes/db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $fullName = trim($_POST['fullName'] ?? '');
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';

    if ($fullName === '' || $email === '' || $password === '' || $confirmPassword === '') {
        json_response(['success' => false, 'message' => 'All fields required'], 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['success' => false, 'message' => 'Invalid email'], 422);
    }

    if (strlen($password) < 6) {
        json_response(['success' => false, 'message' => 'Password must be at least 6 characters'], 422);
    }

    if ($password !== $confirmPassword) {
        json_response(['success' => false, 'message' => 'Passwords do not match'], 422);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $sql = "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'user')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullName, $email, $hashedPassword]);
    } catch (PDOException $e) {
        json_response(['success' => false, 'message' => 'Email already exists or database error.'], 409);
    }

    json_response(['success' => true, 'message' => 'Account created successfully. You can login now.']);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Hub | Register</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="register">
  <header class="site-header">
    <a href="index.php" class="brand-link" aria-label="Book Hub home page">
      <span class="brand-name">Book Hub</span>
    </a>

    <nav class="site-nav" aria-label="Main navigation">
      <a href="index.php">Home</a>
      <a href="search.php">Search</a>
      <a href="login.php">Login</a>
      <a href="contact.php">Contact</a>
    </nav>
  </header>

  <main class="page-shell auth-shell">
    <section class="section-shell auth-card">
      <div class="section-heading">
        <p class="eyebrow"></p>
        <h2>Sign up for Reading Books</h2>
      </div>

      <form id="registerForm" class="stacked-form" method="post" action="register.php" novalidate>
        <label class="field">
          <span>Full name</span>
          <input type="text" name="fullName" placeholder="Enter your full name" required>
          <small class="error-text"></small>
        </label>

        <label class="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="example@gmail.com" required>
          <small class="error-text"></small>
        </label>

        <label class="field">
          <span>Password</span>
          <input type="password" name="password" placeholder="At least 6 characters" required minlength="6">
          <small class="error-text"></small>
        </label>

        <label class="field">
          <span>Confirm password</span>
          <input type="password" name="confirmPassword" placeholder="Re-enter password" required minlength="6">
          <small class="error-text"></small>
        </label>

        <button type="submit" class="primary-btn">Create Account</button>
      </form>

      <p id="registerMessage" class="status-message"></p>
    </section>
  </main>

  <footer class="page-footer">
    <p>© 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script>
</body>
</html>
