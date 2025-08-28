<?php
// **IMPORTANT: Replace with your actual database connection details**
$servername = "localhost";  // Usually "localhost" when using XAMPP
$database = "project"; // Replace with your actual database name
$username = "root";    // Replace with your MySQL username
$password = "";    // Replace with your MySQL password

try {
  // Create connection
  $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

  // Set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Check if the form was submitted
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the username and password from the form
    $username = $_POST["username"];
    $password = $_POST["password"];

    // **IMPORTANT: Hash the password before storing it in the database!**
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare the SQL statement to insert the data
    $sql = "INSERT INTO users (username, password) VALUES (:username, :password)";
    $stmt = $conn->prepare($sql);

    // Bind the parameters
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $hashed_password);

    // Execute the statement
    if ($stmt->execute()) {
      echo "New record created successfully";
       echo "Registration successful! <a href='login.html'>Login here</a>";
    } else {
      echo "Error: " . $sql . "<br>" . $stmt->errorInfo()[2]; // Get specific error message
    }
  }
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

$conn = null;  // Close the connection
?>