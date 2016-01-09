<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_GET['gameID'];
$scoringPlayIndex = $_GET['index'];
$homeScore = $_GET['homeScore'];
$awayScore = $_GET['awayScore'];
$time = date("Y-m-d H:i:s");

// Retrieve all scoring plays from database to an array by decoding json string
$result = mysqli_query($con, " SELECT scoringPlays FROM Game WHERE GameID = '$gameID' ");
$row = mysqli_fetch_assoc($result);
$allScoringPlays = json_decode($row['scoringPlays'], false);

// Remove element at specified index
unset($allScoringPlays[$scoringPlayIndex]);
$allScoringPlays = array_values($allScoringPlays);

// Reencode allScoringPlays
$updatedScoringPlays = json_encode($allScoringPlays);

// Update game element with new values
$update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore = '$awayScore', scoringPlays = '$updatedScoringPlays', lastTimeScored = '$time' WHERE GameID = '$gameID' ";

mysqli_query($con, $update);

mysqli_close($con);
?>