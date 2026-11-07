<?php
// 1. database Connection
$host = "localhost";
$user = "root";
$pass = "";
$db_name = "modizone_db";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database Connection Failed"]));
}

// 2. receive json data from frontend
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

// 3. extract data
$name = $conn->real_escape_string($input['name']);
$address = $conn->real_escape_string($input['address']);
$phone = $conn->real_escape_string($input['phone']);
$total = $conn->real_escape_string($input['total']);
$items = $conn->real_escape_string(json_encode($input['items'])); // convert items array to string

// 4. insert into database
$sql = "INSERT INTO orders (name, address, phone, total_amount, order_items) 
        VALUES ('$name', '$address', '$phone', '$total', '$items')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Order placed successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

$conn->close();
?>