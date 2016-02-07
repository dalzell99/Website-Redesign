<?php
$config = parse_ini_file('/home/ccrsc638/config.ini');

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$oldGameID = $_POST['oldGameID'];
$newGameID = $_POST['newGameID'];
$time = date('D M d Y H:i:s O');

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "SELECT * FROM Game WHERE GameID = '" . $oldGameID . "'")) {
    $row = mysqli_fetch_assoc($result);
    
    $allChanges = json_decode($row['changes'], true);
    $newChange = array($time, 'date', substr($newGameID, 0, 8));
    array_push($allChanges, $newChange);
    $updatedChanges = json_encode($allChanges);

    
    $newSQL = "INSERT INTO Game VALUES ('" . $newGameID . "', '" . mysqli_real_escape_string($con, $row['homeTeamName']) . "', '" . $row['homeTeamScore'] . "', '" . mysqli_real_escape_string($con, $row['awayTeamName']) . "', '" . $row['awayTeamScore'] . "', '" . $row['minutesPlayed'] . "', '" . mysqli_real_escape_string($con, $row['ref']) . "', '" . mysqli_real_escape_string($con, $row['assRef1']) . "', '" . mysqli_real_escape_string($con, $row['assRef2']) . "', '" . mysqli_real_escape_string($con, $row['location']) . "', '" . $row['time'] . "', '" . mysqli_real_escape_string($con, $row['scoringPlays']) . "', 'y', '" . $updatedChanges . "', '" . $row['liveScored'] . "', '" . $row['userID'] . "', '" . $row['lastTimeScored'] . "', '" . $row['locked'] . "')";

    if (mysqli_query($con, $newSQL)) {
        if (mysqli_query($con, "DELETE FROM Game WHERE GameID = '" . $oldGameID . "'")) {
            echo 'success';
        } else {
            echo 'failed to delete game';
        }
    } else {
        echo 'failed to add new game to database' . $newSQL;
    }
} else {
    $response = 'Select query failed';
}

mysqli_close($con);
?>