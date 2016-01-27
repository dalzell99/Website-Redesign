<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$gameID = $_POST['gameID'];
$column = $_POST['column'];
$newValue = $_POST['newValue'];

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$update = '';

switch ($column) {
    case "homeTeamScore":
        $update = "UPDATE Game SET homeTeamScore = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "awayTeamScore":
        $update = "UPDATE Game SET awayTeamScore = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "time":
        $update = "UPDATE Game SET time = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "location":
        $update = "UPDATE Game SET location = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "ref":
        $update = "UPDATE Game SET ref = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "assRef1":
        $update = "UPDATE Game SET assRef1 = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "assRef2":
        $update = "UPDATE Game SET assRef2 = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
    case "locked":
        $update = "UPDATE Game SET locked = '" . $newValue . "' WHERE GameID = '" . $gameID . "'";
        break;
}

if ($result = mysqli_query($con, $update)) {
    echo 'success';
} else {
    echo 'Update query failed';
}

mysqli_close($con);
?>