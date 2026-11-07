<?php
// backend/get_products.php
include 'db_connect.php';

header('Content-Type: application/json');

// select specific columns to be safe
$sql = "SELECT id, name, price, image FROM products";
$result = $conn->query($sql);

$products = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // we manually create the array to ensure 'id' is definitely an integer
        $products[] = array(
            "id" => intval($row['id']),       // force it to be a number
            "name" => $row['name'],
            "price" => $row['price'],
            "image" => $row['image']
        );
    }
}

echo json_encode($products);
?>