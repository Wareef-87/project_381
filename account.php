<?php
require_once('includes/auth.php');
require_once('includes/db.php');

$user = current_user();

if (isset($_GET['api'])) {
    $user = require_login();

    $current = $pdo->prepare(
        "SELECT br.id AS borrowing_id, b.title, b.author, br.borrow_date, br.due_date
         FROM borrowings br
         JOIN books b ON b.id = br.book_id
         WHERE br.user_id = ? AND br.status = 'borrowed'
         ORDER BY br.due_date"
    );
    $current->execute([$user['id']]);

    $history = $pdo->prepare(
        "SELECT b.title, br.borrow_date, br.due_date, br.return_date, br.status
         FROM borrowings br
         JOIN books b ON b.id = br.book_id
         WHERE br.user_id = ?
         ORDER BY br.borrow_date DESC"
    );
    $history->execute([$user['id']]);

    $fines = $pdo->prepare(
        "SELECT b.title, f.days_late, f.amount, f.status
         FROM fines f
         JOIN borrowings br ON br.id = f.borrowing_id
         JOIN books b ON b.id = br.book_id
         WHERE br.user_id = ?
         ORDER BY f.created_at DESC"
    );
    $fines->execute([$user['id']]);

    json_response([
        'success' => true,
        'current' => $current->fetchAll(),
        'history' => $history->fetchAll(),
        'fines' => $fines->fetchAll(),
    ]);
}
?>
<!DOCTYPE html>
<html lang="en"> <!-- Starts the HTML document and sets the language to English (important for SEO and accessibility). -->

<head>

  <meta charset="UTF-8"> <!--Allows all characters (including Arabic) to display correctly.-->
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!--Makes the page responsive on mobile devices.-->
  <title>Book Hub | My Account</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body data-page="account">

  <header class="site-header">

    <a href="index.php" class="brand-link" >
      <span class="brand-name">Book Hub</span> <!--Displays the website name.-->
    </a>
    <nav class="site-nav" aria-label="Main navigation"> <!--Navigation menu with ARIA label for accessibility.-->
      <a href="index.php">Home</a>
      <a href="search.php">Search</a>
      <a href="account.php" aria-current="page" data-auth-link="account">My Account</a>
      <a href="contact.php">Contact</a>
      <a href="admin/manage-books.php" data-auth-link="admin">Manage Books</a>
      <a href="login.php" class="button-link" data-auth-link="logout">Log Out</a>
    </nav>

  </header>

  <main class="page-shell">
   

    <section class="section-shell">
      <div class="section-heading">
        <p class="eyebrow">Currently borrowed</p>
        <h2>Books to return</h2>
      </div>
      <div id="currentBorrowings" class="card-stack"></div> <!--card-stack-->
    </section>

    <section class="section-shell table-shell">
      <div class="section-heading">
        <p class="eyebrow">Borrowing history</p>
        <h2>Completed and active transactions</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="historyTable"></tbody>
        </table>
      </div>
    </section>

    <section class="section-shell table-shell">
      <div class="section-heading">
        <p class="eyebrow">Fine tracking</p>
        <h2>Late return penalties</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Days Late</th>
              <th>Fine Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="fineTable"></tbody>
        </table>
      </div>
    </section>
  </main>

  <footer class="page-footer">
    <p>© 2026 Book Hub | All Rights Reserved</p>
  </footer>

  <script src="assets/js/app.js"></script> <!--links an external JavaScript file to the HTML page-->
</body>
</html>

