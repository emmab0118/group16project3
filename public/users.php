<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = 'localhost'; 
$user = 'aselke2';      
$pass = 'aselke2';        
$dbname = 'aselke2'; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Get JSON input for POST requests
$input = json_decode(file_get_contents('php://input'), true);

// Fetch all users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $result = $conn->query('SELECT * FROM users');
        
        if ($result) {
            $users = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($users);
        } else {
            echo json_encode(['error' => 'Failed to fetch users: ' . $conn->error]);
            http_response_code(500);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
        http_response_code(500);
    }
}

// Handle POST requests (delete)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($input['action']) && $input['action'] === 'delete' && isset($input['id'])) {
        $userId = (int)$input['id'];

        // Prepare DELETE statement
        $stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
        $stmt->bind_param('i', $userId);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['error' => 'No user found with that ID']);
                http_response_code(404);
            }
        } else {
            echo json_encode(['error' => 'Error deleting user: ' . $stmt->error]);
            http_response_code(500);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Missing or invalid parameters']);
        http_response_code(400);
    }
}

$conn->close();
?>