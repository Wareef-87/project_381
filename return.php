<?php
require_once('includes/auth.php');
require_once('includes/db.php');

$user = require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Invalid request.'], 405);
}

$borrowingId = isset($_POST['borrowing_id']) ? (int) $_POST['borrowing_id'] : 0;

if ($borrowingId <= 0) {
    json_response(['success' => false, 'message' => 'Invalid borrowing id.'], 422);
}

$pdo->beginTransaction();

$sql = "SELECT * FROM borrowings WHERE id = ? AND user_id = ? AND status = 'borrowed' FOR UPDATE";
$stmt = $pdo->prepare($sql);
$stmt->execute([$borrowingId, $user['id']]);
$borrowing = $stmt->fetch();

if (!$borrowing) {
    $pdo->rollBack();
    json_response(['success' => false, 'message' => 'Borrowing record not found.'], 404);
}

$sql = "UPDATE borrowings SET return_date = CURDATE(), status = 'returned' WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$borrowingId]);

$sql = 'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute([$borrowing['book_id']]);

$sql = 'SELECT GREATEST(DATEDIFF(CURDATE(), due_date), 0) AS late_days FROM borrowings WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute([$borrowingId]);
$lateDays = (int) $stmt->fetch()['late_days'];

if ($lateDays > 0) {
    $amount = $lateDays * 2.00;
    $sql = "INSERT INTO fines (borrowing_id, days_late, amount, status) VALUES (?, ?, ?, 'unpaid')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$borrowingId, $lateDays, $amount]);
}

$pdo->commit();

json_response(['success' => true, 'message' => 'Book returned successfully.']);
