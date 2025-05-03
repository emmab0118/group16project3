<?php
session_start();

// Set the Content-Type to application/json to avoid any issues
header('Content-Type: application/json');

if (isset($_SESSION['username'])) {
    echo json_encode(['username' => $_SESSION['username']]);
} else {
    echo json_encode(['username' => null]);
}
?>
