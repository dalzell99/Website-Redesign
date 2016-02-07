<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$gameIDArray = json_decode($_POST['gameIDArray']);

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

foreach ($gameIDArray as $gameID) {
    if (!mysqli_query($con, "DELETE FROM Game WHERE GameID = '" . $gameID . "'")) {
        $response = 'Delete query failed';
    }
}

if ($response != 'Delete query failed') {
    $response = 'success';
} 

echo $response;

mysqli_close($con);
?>