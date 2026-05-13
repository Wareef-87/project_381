<?php
require_once('includes/auth.php');
require_once('includes/db.php');

$user = require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Invalid request.'], 405);
}

$bookId = isset($_POST['book_id']) ? (int) $_POST['book_id'] : 0;
$loanDays = 14;

if ($bookId <= 0) {
    json_response(['success' => false, 'message' => 'Invalid book.'], 422);
}

$pdo->beginTransaction();

// Lock the book row so two users cannot borrow the last copy at the same time.
$sql = 'SELECT id, available_copies FROM books WHERE id = ? FOR UPDATE';
$stmt = $pdo->prepare($sql);
$stmt->execute([$bookId]);
$book = $stmt->fetch();

if (!$book || (int) $book['available_copies'] < 1) {
    $pdo->rollBack();
    json_response(['success' => false, 'message' => 'Book is not available.'], 409);
}

$sql = 'INSERT INTO borrowings (user_id, book_id, borrow_date, due_date, status)
        VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ' . (int) $loanDays . ' DAY), ?)';
$stmt = $pdo->prepare($sql);
$stmt->execute([$user['id'], $bookId, 'borrowed']);

$sql = 'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute([$bookId]);

$pdo->commit();

json_response(['success' => true, 'message' => 'Book borrowed successfully.']);
