<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$gameID = $_POST['gameID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (mysqli_query($con, "DELETE FROM Game WHERE GameID = '" . $gameID . "'")) {
    echo 'success';
} else {
    echo 'Delete query failed';
}

mysqli_close($con);
?>