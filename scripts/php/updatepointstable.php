<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$startOfSeason = date("Ymd", mktime(0, 0, 0, 1, 1, 2016)) . '000000';
$today = date("Ymd", strtotime("tomorrow")) . '000000';
$response = [];

$sql = "SELECT awayTeamScore, homeTeamScore, homeTeamTries, awayTeamTries, GameID, locked FROM Game WHERE processed = 'n' AND (GameID BETWEEN " . $startOfSeason . " AND " . $today . " OR GameID BETWEEN " . $startOfSeason . "00 AND " . $today . "00)";

if ($result = mysqli_query($con, $sql)) {
    
    // fetch associative array
    while ($row = mysqli_fetch_assoc($result)) {
        // If the game isn't locked or is missing home score or away score or the num of home or away tries, then add them to the response so that the user can be informed of the missing information
        if ($row['locked'] == 'n' || 
            $row['homeTeamScore'] == '' || 
            $row['awayTeamScore'] == '' || 
            $row['homeTeamTries'] == '' || 
            $row['awayTeamTries'] == '') {
            $array = [$row['GameID']];
            
            if ($row['locked'] == 'n') {
                array_push($array, 'locked');
            } 
            
            if ($row['homeTeamScore'] == '') {
                array_push($array, 'homeTeamScore');
            } 
            
            if ($row['awayTeamScore'] == '') {
                array_push($array, 'awayTeamScore');
            } 
            
            if ($row['homeTeamTries'] == '') {
                array_push($array, 'homeTeamTries');
            } 
            
            if ($row['awayTeamTries'] == '') {
                array_push($array, 'awayTeamTries');
            }
            
            array_push($response, $array);
        } else {
            $gameID = $row['GameID'];
            $divisionID = substr($gameID, 14, 2);
            $homeTeamID = substr($gameID, 8, 3);
            $awayTeamID = substr($gameID, 11, 3);
            $homeTeamScore = $row['homeTeamScore'];
            $awayTeamScore = $row['awayTeamScore'];
            $homeTeamTries = $row['homeTeamTries'];
            $awayTeamTries = $row['awayTeamTries'];
            $homeCompPoints = 0;
            $awayCompPoints = 0;
            
            addTeam($con, $divisionID, $homeTeamID);
            addTeam($con, $divisionID, $awayTeamID);
            
            $sqlHome = "UPDATE PointsTable SET gamesPlayed = gamesPlayed + 1, ";
            $sqlAway = "UPDATE PointsTable SET gamesPlayed = gamesPlayed + 1, ";
            
            if ($homeTeamScore > $awayTeamScore) {
                $sqlHome .= "gamesWon = gamesWon + 1, ";
                $sqlAway .= "gamesLost = gamesLost + 1, ";
                $homeCompPoints += 4;
            } else if ($homeTeamScore < $awayTeamScore) {
                $sqlAway .= "gamesWon = gamesWon + 1, ";
                $sqlHome .= "gamesLost = gamesLost + 1, ";
                $awayCompPoints += 4;
            } else {
                $sqlHome .= "gamesDrawn = gamesDrawn + 1, ";
                $sqlAway .= "gamesDrawn = gamesDrawn + 1, ";
                $homeCompPoints += 2;
                $awayCompPoints += 2;
            }
            
            if ($homeTeamScore == 2 || $homeTeamScore == 1) {
                $homeTeamScore = 0;
                $homePointsDiff = 0;
                $homeFourTryBonus = 0;
                $homeSevenPointBonus = 0;
                $awayTeamScore = 0;
                $awayPointsDiff = 0;
                $awayFourTryBonus = 0;
                $awaySevenPointBonus = 0;
            } else {
                $homePointsDiff = $homeTeamScore - $awayTeamScore;
                $homeFourTryBonus = ($homeTeamTries > 3 ? 1 : 0);
                $homeSevenPointBonus = ($homePointsDiff < 0 && $homePointsDiff >= -7 ? 1 : 0);
                $homeCompPoints += $homeSevenPointBonus + $homeFourTryBonus;
                $awayPointsDiff = $awayTeamScore - $homeTeamScore;
                $awayFourTryBonus = ($awayTeamTries > 3 ? 1 : 0);
                $awaySevenPointBonus = ($awayPointsDiff < 0 && $awayPointsDiff >= -7 ? 1 : 0);
                $awayCompPoints += $awaySevenPointBonus + $awayFourTryBonus;
            }

            $sqlHome .= "pointsFor = pointsFor + $homeTeamScore, pointsAgainst = pointsAgainst + $awayTeamScore, pointsDiff = pointsDiff + $homePointsDiff, sevenPointBonus = sevenPointBonus + $homeSevenPointBonus, fourTryBonus = fourTryBonus + $homeFourTryBonus, compPoints = compPoints + $homeCompPoints WHERE divisionID = '$divisionID' AND teamID = '$homeTeamID'";

            $sqlAway .= "pointsFor = pointsFor + $awayTeamScore, pointsAgainst = pointsAgainst + $homeTeamScore, pointsDiff = pointsDiff + $awayPointsDiff, sevenPointBonus = sevenPointBonus + $awaySevenPointBonus, fourTryBonus = fourTryBonus + $awayFourTryBonus, compPoints = compPoints + $awayCompPoints WHERE divisionID = '$divisionID' AND teamID = '$awayTeamID'";
            
            $sqlProcessed = "UPDATE Game SET processed = 'y' WHERE GameID = '$gameID'";
            
            if (!(mysqli_query($con, $sqlHome) && mysqli_query($con, $sqlAway) && mysqli_query($con, $sqlProcessed))) {
                array_push($response, ['Error', 'Please use contact form to inform me of this.');
            }
        }
    }
}

echo json_encode($response);

function addTeam($con, $divisionID, $teamID) {
    $sql = "INSERT INTO PointsTable VALUES ('$divisionID', '$teamID', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0')";
    mysqli_query($con, $sql);
}

mysqli_close($con);
?>