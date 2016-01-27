<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$teamName = mysqli_real_escape_string($con, $_POST['teamName']);
$divisionID = $_POST['divisionID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "INSERT INTO `Teams` (`teamID`, `division`, `teamName`) VALUES (NULL,'" . $divisionID . "','" . $teamName . "')")) {
    echo json_encode(['success', mysqli_insert_id($con)]);
} else {
    echo 'Update query failed';
}

mysqli_close($con);
?>