<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

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

// If minutesPlayed isn't specified set it to the 
// current value of minutesPlayed from the database.
if ($minutesPlayed == 0) {
    $result = mysqli_query($con, " SELECT minutesPlayed FROM Game WHERE GameID = '$gameID' ");
    $row = mysqli_fetch_assoc($result);
    $minutesPlayed = $row['minutesPlayed'];
}

// Retrieve all scoring plays from database to an array by decoding json string
$result = mysqli_query($con, " SELECT scoringPlays FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);
$allScoringPlays = json_decode($row['scoringPlays'], true);

// Add new scoring play
$newScoringPlay = array($minutesPlayed, $scoringPlay, $description);
array_push($allScoringPlays, $newScoringPlay);

// Reencode allScoringPlays
$updatedScoringPlays = json_encode($allScoringPlays);

$time = date("Y-m-d H:i:s");

// Update game element with new values
$update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore ='$awayScore', minutesPlayed='$minutesPlayed', scoringPlays = '$updatedScoringPlays', lastTimeScored = '$time' WHERE GameID = '$gameID' ";

if (mysqli_query($con, $update)) {
    echo 'success';
} else {
    echo 'update query failed';
}

mysqli_close($con);
?>