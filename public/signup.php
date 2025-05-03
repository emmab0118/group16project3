<?php
session_start();

// Database connection
$host = 'localhost'; 
$user = 'aselke2';      
$pass = 'aselke2';        
$dbname = 'aselke2'; 

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo "Could not connect to server\n";
    die("Connection failed: " . $conn->connect_error);
}


// Handling form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Capture user input
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];

    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        echo "All fields are required!";
    } else {
        // Hash the password for security
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Check if username already exists
        $check_query = "SELECT id FROM users WHERE username = '$username' OR email = '$email'";
        $result = $conn->query($check_query);

        if ($result->num_rows > 0) {
            echo "Username or Email already exists!";
        } else {
            // Insert new user into database
            $insert_query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
            if ($conn->query($insert_query) === TRUE) {
                echo "New user registered successfully!";
                header("Location: index.html");
            } else {
                echo "Error: " . $insert_query . "<br>" . $conn->error;
            }
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
    <title>User Registration</title>
    <link rel="stylesheet" type="text/css" media="all" href="style_login.css">
</head>
<body>
    <h2>User Registration</h2>
    <form method="POST" action="">
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" required><br><br>

        <label for="email">Email:</label>
        <input type="email" name="email" id="email" required><br><br>

        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required><br><br>

        <button type="submit">Register</button>
    </form>

    <a href="login.php">Already have an account? Log In</a>
</body>
</html>
