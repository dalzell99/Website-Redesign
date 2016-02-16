<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];
$homeTeamName = $_POST['homeTeamName'];
$awayTeamName = $_POST['awayTeamName'];

// Create insert string using default values and variables given
$sql = " INSERT INTO Game VALUES ('$gameID', '$homeTeamName', '', '$awayTeamName', '', '0', '', '', '', '', '12pm', '[]', 'n', '[]', 'y', '', '', 'n', '', '', 'n', 'n') ";

if (mysqli_query($con, $sql)) {
    echo "success";
} else {
    echo "Insert query failed";
}

mysqli_close($con);
?>