<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];
$scoringPlayIndex = $_POST['index'];
$homeScore = $_POST['homeScore'];
$awayScore = $_POST['awayScore'];
$time = date("Y-m-d H:i:s");

// Retrieve all scoring plays from database to an array by decoding json string
$result = mysqli_query($con, " SELECT scoringPlays, locked FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);
$allScoringPlays = json_decode($row['scoringPlays'], false);

// Remove element at specified index
unset($allScoringPlays[$scoringPlayIndex]);
$allScoringPlays = array_values($allScoringPlays);

// Reencode allScoringPlays
$updatedScoringPlays = json_encode($allScoringPlays);

// Update game element with new values
$update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore = '$awayScore', scoringPlays = '$updatedScoringPlays', lastTimeScored = '$time' WHERE GameID = '$gameID' ";

if ($row['locked'] == 'y') {
    echo 'locked';
} else {
    if (mysqli_query($con, $update)) {
        echo 'success';
    } else {
        echo 'Update query failed';
    }
}

mysqli_close($con);
?>