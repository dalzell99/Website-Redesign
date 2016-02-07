<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$password = mysqli_real_escape_string($con, $_POST['password']);
$page = $_POST['page'];
$response = '';

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "SELECT * FROM Passwords")) {
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($result)) {
        if ($row['page'] == $page) {
            if ($password == $row['password']) {
                $response = 'correct';
            } else {
                $response = 'incorrect';
            }
        }
    }
    
    /* free result set */
    mysqli_free_result($result);
} else {
    $response = 'Select query failed';
}

echo $response;

mysqli_close($con);
?>