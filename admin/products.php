<?php include 'auth.php'; include '../db.php'; ?>
<h2>Products</h2>
<a href="add_product.php">Add Product</a>


<?php
$res = $conn->query("SELECT * FROM products");
while ($row = $res->fetch_assoc()) {
echo "<p>{$row['name']} - Rs {$row['price']}</p>";
}
?>