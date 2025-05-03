<?php

header('Content-Type: application/json');

session_start();


// Check if the user is authenticated as 'admin'
if (!isset($_SESSION['username']) || $_SESSION['username'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    http_response_code(403);
    exit();
}

// Database connection
$host = 'localhost'; 
$user = 'aselke2';      
$pass = 'aselke2';        
$dbname = 'aselke2'; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



// Fetch all users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query('SELECT * FROM users');
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch users: ' . $e->getMessage()]);
        http_response_code(500);
    }
}

// Delete user
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['id'];

    if (!$userId) {
        echo json_encode(['error' => 'User ID is required']);
        http_response_code(400);
        exit();
    }

    try {
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        echo json_encode(['success' => 'User deleted successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to delete user: ' . $e->getMessage()]);
        http_response_code(500);
    }
}
?>
