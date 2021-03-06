<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];
$homeScore = $_POST['homeScore'];
$awayScore = $_POST['awayScore'];
$indexes = json_decode($_POST['indexes']);
$time = date("Y-m-d H:i:s");

// Retrieve all scoring plays from database to an array by decoding json string
$result = mysqli_query($con, " SELECT scoringPlays, locked, homeTeamTries, awayTeamTries FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);
$allScoringPlays = json_decode($row['scoringPlays'], false);
$homeTeamTries = $row['homeTeamTries'];
$awayTeamTries = $row['awayTeamTries'];

foreach ($indexes as $index) {
    if (substr($allScoringPlays[$index][1], 0, 4) == 'home') {
        if (substr($allScoringPlays[$index][1], 4) == 'Try') {
            $homeTeamTries -= 1;
        }
    } else {
        if (substr($allScoringPlays[$index][1], 4) == 'Try') {
            $awayTeamTries -= 1;
        }
    }
    // Remove element at specified index
    array_splice($allScoringPlays, $index, 1);
}

// Reencode allScoringPlays
$updatedScoringPlays = json_encode($allScoringPlays);

// Update game element with new values
$update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore = '$awayScore', scoringPlays = '$updatedScoringPlays', lastTimeScored = '$time', homeTeamTries = '$homeTeamTries', awayTeamTries = '$awayTeamTries' WHERE GameID = '$gameID' ";

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