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
$newValue = mysqli_real_escape_string($con, $_POST['newValue']);
$newValueUnescaped = $_POST['newValue'];
$time = date('D M d Y H:i:s O');
$changed = 'n';

$result = mysqli_query($con, " SELECT changes, scoringPlays FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);



if ($column == 'homeTeamScore' || $column == 'awayTeamScore' ||
    $column == 'homeTeamTries' || $column == 'awayTeamTries') {
    // Don't a change change to chnages array for score or try changes
    // Try and score changes are only made at the end of the game so set minutesPlayed to 80 and
    // add fullTime play to scoringPlays array
    
    // Retrieve all scoring plays from database to an array by decoding json string
    $allScoringPlays = json_decode($row['scoringPlays'], true);

    // Add fullTime play
    $newScoringPlay = array('80', 'fullTime', '');
    array_push($allScoringPlays, $newScoringPlay);

    // Reencode allScoringPlays
    $updatedScoringPlays = mysqli_real_escape_string($con, json_encode($allScoringPlays));
    
    $update = "UPDATE Game SET " . $column . " = '" . $newValue . "', scoringPlays = '" . $updatedScoringPlays . "', minutesPlayed = '80' WHERE GameID = '" . $gameID . "'";
} else {
    // Retrieve all changes from database to an array by decoding json string
    $allChanges = json_decode($row['changes'], true);
    // Add new change
    $newChange = array($time, $column, $newValueUnescaped);
    array_push($allChanges, $newChange);
    $changed = 'y';
    // Reencode allChanges
    $updatedChanges = mysqli_real_escape_string($con, json_encode($allChanges));

    $update = "UPDATE Game SET " . $column . " = '" . $newValue . "', changed = '" . $changed . "', changes = '" . $updatedChanges . "' WHERE GameID = '" . $gameID . "'";
}



if ($result = mysqli_query($con, $update)) {
    echo 'success';
} else {
    echo 'Update query failed ' . $update;
}

mysqli_close($con);
?>