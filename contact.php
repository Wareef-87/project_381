<?php require_once __DIR__ . '/includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Hub | Contact</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="contact">
  <header class="site-header">
    <a href="index.php" class="brand-link">
      <span class="brand-name">Book Hub</span>
    </a>

    <nav class="site-nav" aria-label="Main navigation">
      <a href="index.php">Home</a>
      <a href="search.php">Search</a>
      <a href="account.php" data-auth-link="account">My Account</a>
      <a href="contact.php" aria-current="page">Contact</a>
      <a href="admin/manage-books.php" data-auth-link="admin">Manage Books</a>
      <a href="login.php" class="button-link" data-auth-link="login">Login</a>
      <a href="login.php" class="button-link" data-auth-link="logout">Log Out</a>
    </nav>
  </header>

  <main class="page-shell">
    <section class="section-shell contact-simple-header">
      <h1>We are here to help.</h1>
      <p class="contact-intro">
        Contact us if you need help with books, borrowing, or your account.
      </p>
    </section>

    <section class="contact-layout">
      <article class="info-card contact-info-card">
        <p class="eyebrow">Library Desk</p>
        <h2>Reach the team</h2>

        <div class="contact-info-list">
          <div class="contact-info-item">
            <span class="contact-info-title">Email</span>
            <p>example@gmail.com</p>
          </div>
          <div class="contact-info-item">
            <span class="contact-info-title">Phone</span>
            <p>+966 14 123 4567</p>
          </div>
          <div class="contact-info-item">
            <span class="contact-info-title">Location</span>
            <p>Yanbu Industrial City, Saudi Arabia</p>
          </div>
          <div class="contact-info-item">
            <span class="contact-info-title">Hours</span>
            <p>Sunday to Thursday, 8:00 AM to 8:00 PM</p>
          </div>
        </div>
      </article>

      <section class="info-card contact-form-card">
        <p class="eyebrow">Support Request</p>
        <h2>Send a message</h2>

        <form id="contactForm" class="stacked-form" novalidate>
          <div class="contact-form-grid">
            <label class="field">
              <span>Name</span>
              <input type="text" name="name" required placeholder="Your name">
              <small class="error-text"></small>
            </label>

            <label class="field">
              <span>Email</span>
              <input type="email" name="email" required placeholder="example@gmail.com">
              <small class="error-text"></small>
            </label>
          </div>

          <label class="field">
            <span>Message</span>
            <textarea name="message" rows="6" required placeholder="How can we help you today?"></textarea>
            <small class="error-text"></small>
          </label>

          <button type="submit" class="primary-btn contact-submit">Send Message</button>
        </form>

        <p id="contactMessage" class="status-message"></p>
      </section>
    </section>
  </main>

  <footer class="page-footer">
    <p>&copy; 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script>
</body>

</html>
