<?php
require_once('includes/auth.php');
require_once('includes/db.php');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $bookId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $keyword = trim($_GET['keyword'] ?? '');
    $category = trim($_GET['category'] ?? '');
    $featured = isset($_GET['featured']) ? (int) $_GET['featured'] : null;

    // Start with all books, then add filters if the user sends them.
    $sql = 'SELECT * FROM books WHERE 1 = 1';
    $values = [];

    if ($bookId > 0) {
        $sql .= ' AND id = ?';
        $values[] = $bookId;
    }

    if ($keyword !== '') {
        $sql .= ' AND (title LIKE ? OR author LIKE ?)';
        $values[] = "%$keyword%";
        $values[] = "%$keyword%";
    }

    if ($category !== '') {
        $sql .= ' AND category = ?';
        $values[] = $category;
    }

    if ($featured !== null) {
        $sql .= ' AND featured = ?';
        $values[] = $featured;
    }

    $sql .= ' ORDER BY title';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $books = $stmt->fetchAll();

    json_response(['success' => true, 'books' => $books]);
}

if ($method === 'POST') {
    require_admin();

    $bookId = isset($_POST['bookId']) ? (int) $_POST['bookId'] : 0;
    $title = trim($_POST['title'] ?? '');
    $author = trim($_POST['author'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $isbn = trim($_POST['isbn'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if ($title === '' || $author === '' || $category === '' || $isbn === '' || $description === '') {
        json_response(['success' => false, 'message' => 'Please complete all book fields.'], 422);
    }

    if ($bookId > 0) {
        $sql = 'UPDATE books SET title = ?, author = ?, category = ?, isbn = ?, description = ? WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $values = [$title, $author, $category, $isbn, $description, $bookId];
        $stmt->execute($values);

        json_response(['success' => true, 'message' => 'Book updated successfully.']);
    }

    $sql = 'INSERT INTO books (title, author, category, isbn, description, published_year, total_copies, available_copies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $pdo->prepare($sql);
    $values = [$title, $author, $category, $isbn, $description, date('Y'), 1, 1];
    $stmt->execute($values);

    json_response(['success' => true, 'message' => 'Book added successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request.'], 405);
