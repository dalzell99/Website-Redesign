<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$minutesPlayed = $_POST['minutesPlayed'];
$gameID = $_POST['gameID'];
$homeScore = $_POST['homeScore'];
$awayScore = $_POST['awayScore'];
$scoringPlay = $_POST['scoringPlay'];
$description = $_POST['description'];
$locked = $_POST['locked'];

$result = mysqli_query($con, " SELECT minutesPlayed, locked, scoringPlays FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);

// If minutesPlayed isn't specified set it to the 
// current value of minutesPlayed from the database.
if ($minutesPlayed == 0) {
    $minutesPlayed = $row['minutesPlayed'];
} 
    
if ($row['locked'] == 'y') {
    echo 'locked';
} else {
    // Retrieve all scoring plays from database to an array by decoding json string
    $allScoringPlays = json_decode($row['scoringPlays'], true);

    // Add new scoring play
    $newScoringPlay = array($minutesPlayed, $scoringPlay, $description);
    array_push($allScoringPlays, $newScoringPlay);

    // Reencode allScoringPlays
    $updatedScoringPlays = json_encode($allScoringPlays);

    $time = date("Y-m-d H:i:s");

    // Update game element with new values
    $update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore ='$awayScore', minutesPlayed='$minutesPlayed', scoringPlays = '$updatedScoringPlays', lastTimeScored = '$time', locked = '$locked' WHERE GameID = '$gameID' ";

    if (mysqli_query($con, $update)) {
        echo 'success';
    } else {
        echo 'update query failed';
    }
}
mysqli_close($con);
?>