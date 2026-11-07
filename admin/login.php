<?php
session_start();
include_once __DIR__ . "/../db.php";
?>


if (isset($_POST['login'])) {
$u = $_POST['username'];
$p = md5($_POST['password']);


$sql = "SELECT * FROM admin WHERE username='$u' AND password='$p'";
$res = $conn->query($sql);


if ($res->num_rows == 1) {
$_SESSION['admin'] = $u;
header("Location: dashboard.php");
} else {
$error = "Invalid Login";
}
}
?>


<form method="post">
<h2>Admin Login</h2>
<input type="text" name="username" placeholder="Username" required>
<input type="password" name="password" placeholder="Password" required>
<button name="login">Login</button>
<p style="color:red;"> <?php echo $error ?? ''; ?> </p>
</form>