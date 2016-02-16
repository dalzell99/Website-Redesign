<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

$start = $_POST['start'] . '000000';
$end = $_POST['end'] . '000000';
$sql = "SELECT assRef1, assRef2, awayTeamName, awayTeamScore, homeTeamName, homeTeamScore, changes, GameID, liveScored, location, minutesPlayed, ref, time, userID, locked, cancelled FROM Game WHERE GameID BETWEEN " . $start . " AND " . $end . " OR GameID BETWEEN " . $start . "00 AND " . $end . "00 ORDER BY `gameID` ASC";

if ($gameresult = mysqli_query($con, $sql)) {
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($gameresult)) {
        $game[] = $row;
    }
    
    echo json_encode($game);
} else {
    echo 'Game select query failed';
}

mysqli_close($con);
?>