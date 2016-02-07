<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);
 
$teamName = $_POST['teamName'];
$divisionID = $_POST['divisionID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}
$sql = "DELETE FROM Teams WHERE division = '" . $divisionID . "' AND teamName = '" . $teamName . "'";
if (mysqli_query($con, $sql)) {
    echo 'success';
} else {
    echo 'Delete query failed.';
}

mysqli_close($con);
?>