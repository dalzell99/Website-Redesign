<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($gameresult = mysqli_query($con, "SELECT * FROM Game ORDER BY 'gameID' ASC")) {
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($gameresult)) {
        $sql = "INSERT INTO GameBackup VALUES ('" . $row['GameID'] . "', '" . mysqli_real_escape_string($con, $row['homeTeamName']) . "', '" . $row['homeTeamScore'] . "', '" . mysqli_real_escape_string($con, $row['awayTeamName']) . "', '" . $row['awayTeamScore'] . "', '" . $row['minutesPlayed'] . "', '" . mysqli_real_escape_string($con, $row['ref']) . "', '" . mysqli_real_escape_string($con, $row['assRef1']) . "', '" . mysqli_real_escape_string($con, $row['assRef2']) . "', '" . mysqli_real_escape_string($con, $row['location']) . "', '" . $row['time'] . "', '" . mysqli_real_escape_string($con, $row['scoringPlays']) . "', '" . $row['changed'] . "', '" . $row['changes'] . "', '" . $row['liveScored'] . "', '" . $row['userID'] . "', '" . $row['lastTimeScored'] . "', '" . $row['locked'] . "')
        ON DUPLICATE KEY UPDATE GameID = '" . $row['GameID'] . "', homeTeamName = '" . mysqli_real_escape_string($con, $row['homeTeamName']) . "', homeTeamScore = '" . $row['homeTeamScore'] . "', awayTeamName = '" . mysqli_real_escape_string($con, $row['awayTeamName']) . "', awayTeamScore = '" . $row['awayTeamScore'] . "', minutesPlayed = '" . $row['minutesPlayed'] . "', ref = '" . mysqli_real_escape_string($con, $row['ref']) . "', assRef1 = '" . mysqli_real_escape_string($con, $row['assRef1']) . "', assRef2 = '" . mysqli_real_escape_string($con, $row['assRef2']) . "', location = '" . mysqli_real_escape_string($con, $row['location']) . "', time = '" . $row['time'] . "', scoringPlays = '" . mysqli_real_escape_string($con, $row['scoringPlays']) . "', changed = '" . $row['changed'] . "', changes = '" . $row['changes'] . "', liveScored = '" . $row['liveScored'] . "', userID = '" . $row['userID'] . "', lastTimeScored = '" . $row['lastTimeScored'] . "', locked = '" . $row['locked'] . "'";
        if (mysqli_query($con, $sql)) {
            
        } else {
            echo $sql . "<br><br>";
        }
    }
} else {
    echo 'Game select query failed';
}

mysqli_close($con);
?>