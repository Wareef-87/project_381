<?php

function ensure_database_schema(PDO $pdo)
{
    $pdo->exec("ALTER TABLE users MODIFY role ENUM('student','user','admin') NOT NULL DEFAULT 'user'");
    $pdo->exec("UPDATE users SET role = 'user' WHERE role = 'student'");
    $pdo->exec("ALTER TABLE users MODIFY role ENUM('user','admin') NOT NULL DEFAULT 'user'");

    $column = $pdo->prepare(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'books' AND COLUMN_NAME = 'isbn'"
    );
    $column->execute();

    if (!$column->fetch()) {
        $pdo->exec("ALTER TABLE books ADD COLUMN isbn VARCHAR(30) NULL AFTER category");
    }

    $isbnUpdates = [
        'Instruction in Functional Assessment' => '9780132350884',
        'The body keeps the score' => '9780143127741',
        'Come Closer' => '9780425210312',
        'Mrs England' => '9781838772884',
        'Ikigai' => '9780143130727',
        'Ibn Saud' => '9780863569098',
    ];

    $update = $pdo->prepare('UPDATE books SET isbn = ? WHERE title = ? AND (isbn IS NULL OR isbn = "")');
    foreach ($isbnUpdates as $title => $isbn) {
        $update->execute([$isbn, $title]);
    }
}

function seed_default_admin(PDO $pdo)
{
    $emailCheck = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $emailCheck->execute(['admin@bookhub.com']);
    $existing = $emailCheck->fetch();

    if ($existing) {
        $update = $pdo->prepare("UPDATE users SET full_name = ?, password_hash = ?, role = 'admin' WHERE id = ?");
        $update->execute(['Book Hub Admin', 'Admin123', $existing['id']]);
        return;
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    $stmt->execute();

    if ($stmt->fetch()) {
        return;
    }

    $insert = $pdo->prepare("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'admin')");
    $insert->execute(['Book Hub Admin', 'admin@bookhub.com', 'Admin123']);
}

function seed_default_books(PDO $pdo)
{
    $stmt = $pdo->query('SELECT COUNT(*) AS total FROM books');
    $count = (int) $stmt->fetch()['total'];

    if ($count > 0) {
        return;
    }

    $books = [
        [
            'Instruction in Functional Assessment',
            'Robert C. Martin',
            'Educational',
            '9780132350884',
            'Instruction in Functional Assessment introduces learners to functional assessment.',
            2008,
            'images/books/book1.png',
            3,
            3,
            1,
        ],
        [
            'The body keeps the score',
            'Bessel van der Kolk',
            'Psychology',
            '9780143127741',
            'Explores how trauma reshapes both body and brain.',
            2022,
            'images/books/book2.png',
            2,
            2,
            1,
        ],
        [
            'Come Closer',
            'Sara Gran',
            'Horror',
            '9780425210312',
            "A woman's life unravels into violent impulses.",
            2003,
            'images/books/book3.png',
            4,
            4,
            1,
        ],
        [
            'Mrs England',
            'Stacey Halls',
            'Adventure',
            '9781838772884',
            'A nurse uncovers dark secrets in an isolated Yorkshire home.',
            2013,
            'images/books/book4.png',
            1,
            1,
            0,
        ],
        [
            'Ikigai',
            'Hector Garcia',
            'Psychology',
            '9780143130727',
            'Finding purpose in everyday life.',
            2017,
            'images/books/book5.png',
            2,
            2,
            0,
        ],
        [
            'Ibn Saud',
            'Professor Barbara Bray',
            'Historical',
            '9780863569098',
            'The rise of a fearless warrior and leader.',
            2015,
            'images/books/book6.png',
            5,
            5,
            1,
        ],
    ];

    $insert = $pdo->prepare(
        'INSERT INTO books (title, author, category, isbn, description, published_year, cover_path, total_copies, available_copies, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    foreach ($books as $book) {
        $insert->execute($book);
    }
}
