<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (mysqli_query($con, "UPDATE Game SET liveScored = 'n' WHERE GameID = '" . $_POST['gameID'] . "'")) {
    echo 'success';
} else {
    echo 'Update query failed';
}

mysqli_close($con);
?>