<?php require_once __DIR__ . '/includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Hub | Search</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="search">
  <header class="site-header">
    <a href="index.php" class="brand-link" aria-label="Book Hub home page">
      <span class="brand-name">Book Hub</span>
    </a>

    <nav class="site-nav" aria-label="Main navigation">
      <a href="index.php">Home</a>
      <a href="search.php" aria-current="page">Search</a>
      <a href="contact.php">Contact</a>
      <a href="account.php" data-auth-link="account">My Account</a>
      <a href="admin/manage-books.php" data-auth-link="admin">Manage Books</a>
      <a href="login.php" class="button-link" data-auth-link="login">Login</a>
      <a href="login.php" class="button-link" data-auth-link="logout">Log Out</a>
    </nav>
  </header>

  <main class="page-shell">
    <section class="section-shell search-shell">
      <div class="section-heading">
        <h2>Search across the full book catalog</h2>
      </div>

      <form id="searchForm" class="search-form" novalidate>
        <label class="field">
          <span></span>
          <input id="searchInput" type="search" name="keyword" placeholder="Search by title or author">
        </label>

        <label class="field">
          <span></span>
          <select id="categorySelect" name="category">
            <option value="">All categories</option>
          </select>
        </label>

        <button class="primary-btn" type="submit">Search</button>
      </form>
      <p id="searchSummary" class="subtle-copy"></p>
      <div id="searchResults" class="book-grid"></div>
    </section>
  </main>

  <footer class="page-footer">
    <p>&copy; 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script>
</body>
</html>
