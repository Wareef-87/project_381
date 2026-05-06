<?php require_once __DIR__ . '/includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Hub | Home</title>
  <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/remixicon.css"
    rel="stylesheet"
  >
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="home">
  <header class="site-header">
    <a href="index.php" class="brand-link">
      <span class="brand-name">Book Hub</span>
    </a>

    <nav class="site-nav" aria-label="Main navigation">
      <a href="index.php" aria-current="page">Home</a>
      <a href="search.php">Search</a>
      <a href="contact.php">Contact</a>
      <a href="account.php" data-auth-link="account">My Account</a>
      <a href="admin/manage-books.php" data-auth-link="admin">Manage Books</a>
      <a href="login.php" class="button-link" data-auth-link="login">Login</a>
      <a href="login.php" class="button-link" data-auth-link="logout">Log Out</a>
    </nav>
  </header>

  <main class="page-shell">
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Book Hub</p>
        <h1>Welcome to Book Hub</h1>
        <p>
          Discover a world full of stories, knowledge, and inspiration.
          Search, explore, and borrow your favorite books anytime, anywhere.
        </p>

        <div class="hero-actions">
          <a class="primary-btn" href="search.php">Explore Books</a>
        </div>
      </div>

      <div class="hero-image">
        <img src="images/section.jpg" alt="Books Image">
      </div>
    </section>

    <section class="section-shell soft-panel">
      <div class="section-heading">
        <p class="eyebrow">Books Types</p>
        <h2>Choose a type and explore the books you love</h2>
      </div>
      <div id="categoryGrid" class="category-grid"></div>
    </section>

    <section class="section-shell soft-panel">
      <div class="section-heading">
        <p class="eyebrow">Featured collection</p>
        <h2>Popular titles</h2>
      </div>
      <div id="featuredBooks" class="book-grid"></div>
    </section>
  </main>

  <footer class="page-footer">
    <p>&copy; 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script>
</body>

</html>
