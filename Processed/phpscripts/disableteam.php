<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$teamID = $_POST['teamID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "UPDATE Teams SET enabled = 'n' WHERE teamID = '" . $teamID . "'")) {
    echo 'success';
} else {
    echo 'Update query failed';
}

mysqli_close($con);
?>