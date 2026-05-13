<?php
require_once('includes/auth.php');
require_once('includes/db.php');

require_admin();

$sql = "SELECT u.full_name, b.title, br.due_date, DATEDIFF(CURDATE(), br.due_date) AS days_late
        FROM borrowings br
        JOIN users u ON u.id = br.user_id
        JOIN books b ON b.id = br.book_id
        WHERE br.status = 'borrowed' AND br.due_date < CURDATE()
        ORDER BY br.due_date";
$stmt = $pdo->query($sql);

json_response(['success' => true, 'overdue' => $stmt->fetchAll()]);
