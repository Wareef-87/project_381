<?php
require_once('includes/auth.php');
require_once('includes/db.php');

require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Invalid request.'], 405);
}

$bookId = isset($_POST['bookId']) ? (int) $_POST['bookId'] : 0;

if ($bookId <= 0) {
    json_response(['success' => false, 'message' => 'Invalid book id.'], 422);
}

// Do not delete a book if someone is still borrowing it.
$sql = "SELECT id FROM borrowings WHERE book_id = ? AND status = 'borrowed'";
$stmt = $pdo->prepare($sql);
$stmt->execute([$bookId]);

if ($stmt->fetch()) {
    json_response(['success' => false, 'message' => 'Cannot delete a borrowed book.'], 409);
}

$sql = 'DELETE FROM books WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute([$bookId]);

json_response(['success' => true, 'message' => 'Book deleted successfully.']);
