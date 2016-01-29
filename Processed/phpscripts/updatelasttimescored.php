<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];
$time = date("Y-m-d H:i:s");

// Update game element with new values
$update = " UPDATE Game SET lastTimeScored = '$time' WHERE GameID = '$gameID' ";

mysqli_query($con, $update);

mysqli_close($con);
?>