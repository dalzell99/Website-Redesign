<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$teamName = mysqli_real_escape_string($con, $_POST['newName']);
$teamID = mysqli_real_escape_string($con, $_POST['teamID']);

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "UPDATE Teams SET teamName = '" . $teamName . "' WHERE teamID = '" . $teamID . "'")) {
    echo 'success';
} else {
    echo 'Update query failed';
}

mysqli_close($con);
?>