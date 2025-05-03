<?php
session_start();

// Database connection
$host = 'localhost'; 
$user = 'aselke2';      
$pass = 'aselke2';        
$dbname = 'aselke2'; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handling form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];

    // Validate input
    if (empty($username) || empty($password)) {
        echo "Both fields are required!";
    } else {
        // Check if the username exists
        $check_query = "SELECT id, password FROM users WHERE username = '$username' LIMIT 1";
        $result = $conn->query($check_query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $hashed_password = $row['password'];

            // Verify password
            if (password_verify($password, $hashed_password)) {
                // Set session variables
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['username'] = $username;
                
                // Redirect to a dashboard or homepage
                header("Location: index.html?data=" . urlencode($_SESSION['username']));
                exit();
            } else {
                echo "Invalid username or password.";
            }
        } else {
            echo "Username not found!";
        }
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <link rel="stylesheet" href="style_login.css">
</head>
<body>
    <h2>User Login</h2>
    <form method="POST" action="">
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" required><br><br>

        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required><br><br>

        <button type="submit">Login</button>
    </form>

    <a href="signup.php">Register New Account</a>
</body>
</html>
