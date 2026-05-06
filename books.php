<?php
require_once('includes/auth.php');
require_once('includes/db.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $keyword = clean_input($_GET['keyword'] ?? '');
    $category = clean_input($_GET['category'] ?? '');
    $featured = isset($_GET['featured']) ? (int) $_GET['featured'] : null;

    $sql = 'SELECT * FROM books WHERE 1=1';
    $params = [];

    if ($id > 0) {
        $sql .= ' AND id = ?';
        $params[] = $id;
    }

    if ($keyword !== '') {
        $sql .= ' AND (title LIKE ? OR author LIKE ?)';
        $params[] = "%$keyword%";
        $params[] = "%$keyword%";
    }

    if ($category !== '') {
        $sql .= ' AND category = ?';
        $params[] = $category;
    }

    if ($featured !== null) {
        $sql .= ' AND featured = ?';
        $params[] = $featured;
    }

    $sql .= ' ORDER BY title';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $books = $stmt->fetchAll();

    json_response(['success' => true, 'books' => $books]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();

    $bookId = isset($_POST['bookId']) ? (int) $_POST['bookId'] : 0;
    $title = clean_input($_POST['title'] ?? '');
    $author = clean_input($_POST['author'] ?? '');
    $category = clean_input($_POST['category'] ?? '');
    $isbn = clean_input($_POST['isbn'] ?? '');
    $description = clean_input($_POST['description'] ?? '');

    if ($title === '' || $author === '' || $category === '' || $isbn === '' || $description === '') {
        json_response(['success' => false, 'message' => 'Please complete all book fields.'], 422);
    }

    if ($bookId > 0) {
        $stmt = $pdo->prepare('UPDATE books SET title = ?, author = ?, category = ?, isbn = ?, description = ? WHERE id = ?');
        $stmt->execute([$title, $author, $category, $isbn, $description, $bookId]);
        json_response(['success' => true, 'message' => 'Book updated successfully.']);
    }

    $stmt = $pdo->prepare('INSERT INTO books (title, author, category, isbn, description, published_year, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$title, $author, $category, $isbn, $description, date('Y'), 1, 1]);

    json_response(['success' => true, 'message' => 'Book added successfully.']);
}

json_response(['success' => false, 'message' => 'Invalid request.'], 405);
