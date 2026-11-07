<?php
session_start(); // start a session to remember the user
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // check if user exists
    $sql = "SELECT id, fullname, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // verify the password
        if (password_verify($password, $user['password'])) {
            // password is correct, start session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['fullname'] = $user['fullname'];
            
            // redirect to home page
            header("Location: ../index.html"); 
            exit();
        } else {
            echo "<script>alert('Invalid Password!'); window.location.href='../login.html';</script>";
        }
    } else {
        echo "<script>alert('User not found!'); window.location.href='../login.html';</script>";
    }

    $stmt->close();
    $conn->close();
}
?>