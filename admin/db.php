<?php
$conn = new mysqli("localhost", "root", "", "modizone_db");
if ($conn->connect_error) {
die("DB Connection Failed");
}
?>