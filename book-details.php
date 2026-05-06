<?php require_once __DIR__ . '/includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Hub | Book Details</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="details">
  <header class="site-header">
    <a href="index.php" class="brand-link" >
      <span class="brand-name">Book Hub</span>
    </a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="index.php">Home</a>
      <a href="search.php">Search</a>
      <a href="account.php" data-auth-link="account">My Account</a>
      <a href="contact.php">Contact</a>
      <a href="admin/manage-books.php" data-auth-link="admin">Manage Books</a>
      <a href="login.php" class="button-link" data-auth-link="login">Login</a>
      <a href="login.php" class="button-link" data-auth-link="logout">Log Out</a>
    </nav>
  </header>

  <main class="page-shell">
    <section id="bookDetails" class="section-shell details-shell"></section>
  </main>

  <footer class="page-footer">
    <p>&copy; 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script>
</body>
</html>
