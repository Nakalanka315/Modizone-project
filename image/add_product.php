<?php
include 'db.php';

$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$category = $_POST['category'];

$image = $_FILES['image']['name'];
$target = "uploads/" . basename($image);
move_uploaded_file($_FILES['image']['tmp_name'], $target);

$sql = "INSERT INTO products (name, description, price, category, image) 
        VALUES ('$name', '$description', '$price', '$category', '$image')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
?>
