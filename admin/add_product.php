<?php include 'auth.php'; include '../db.php'; ?>


<form method="post">
<input type="text" name="name" placeholder="Product Name" required>
<input type="number" name="price" placeholder="Price" required>
<button name="add">Add</button>
</form>


<?php
if (isset($_POST['add'])) {
$n = $_POST['name'];
$p = $_POST['price'];
$conn->query("INSERT INTO products (name, price) VALUES ('$n','$p')");
header("Location: products.php");
}
?>