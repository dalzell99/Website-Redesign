<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];
$column = $_POST['column'];
$newValue = $_POST['newValue'];
$time = date('D M d Y H:i:s O');

$result = mysqli_query($con, " SELECT changes FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);

// Retrieve all changes from database to an array by decoding json string
$allChanges = json_decode($row['changes'], true);

// Add new change
$newChange = array($time, $column);
array_push($allChanges, $newChange);

// Reencode allChanges
$updatedChanges = json_encode($allChanges);

$update = "UPDATE Game SET " . $column . " = '" . $newValue . "', changed = 'y', changes = '" . $updatedChanges . "' WHERE GameID = '" . $gameID . "'";

if ($result = mysqli_query($con, $update)) {
    echo 'success';
} else {
    echo 'Update query failed ' . $update;
}

mysqli_close($con);
?>