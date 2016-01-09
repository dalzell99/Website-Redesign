<?php
/* 
Arguments:
$gameID - the unqiue ID given to each game

Purpose:
Retrieve game information from database

Returns:
$result - an associative array containing the contents of the record
*/
function getGame($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    $select = " SELECT * FROM Game WHERE GameID = '$gameID' ";
    $result = mysqli_query($con,$select);

    return $result;
}

if (isset($_GET["gameID"])) {
    // Occurs when user clicks on game in draw/result page
    $gameID = $_GET["gameID"];
    // Retrieve game record from database
    $game = getGame($gameID);
    $row = mysqli_fetch_assoc($game);
  
    // If score is 2 then the team won by default. 
    if ($row['homeTeamScore'] == '2') {
        $homeScore = 'Win';
        $awayScore = 'Defaulted';
    } else if ($row['homeTeamScore'] == '1') {
        $homeScore = 'Defaulted';
        $awayScore = 'Win';
    } else {
        $homeScore = $row['homeTeamScore'];
        $awayScore = $row['awayTeamScore'];
    }
    
    // Display team names and scores
    echo "
    <div class='row teamInfo'>
      <div class='col-xs-22'>
        <div class='row'>" . $row['homeTeamName'] . "</div>
        <div class='row'>" . $homeScore . "</div>
      </div>
      <div class='col-xs-4 versus'>vs</div>
      <div class='col-xs-22'>
        <div class='row'>" . $row['awayTeamName'] . "</div>
        <div class='row'>" . $awayScore . "</div>
      </div>
    </div>";

    // Retrieve game date and time from gameID
    $gameDateString = substr($gameID, 0, 8);
    $gameDateDate = new DateTime($gameDateString);
    // If game is being lve scored, display the minutes played.
    // If game has had any updates (minutesPlayed == 0) then display when the game is/was to be played
    $minutesOrTime = ($row['minutesPlayed'] == '0' ? date_format($gameDateDate, 'D jS M') . " " . $row['time'] : $row['minutesPlayed'] . " mins");
    echo "<div class='row gameInfo'><div class='col-xs-48'>" . $row['location'] . "</div></div>";
    echo "<div class='row gameInfo'><div class='col-xs-48'>" . $minutesOrTime . "</div></div>";

    // Next is a list of the previously uploaded plays for this game
    echo "<div class='row scoringPlays rowfix'>\n\n";
    // Decode the json into an array
    $allScoringPlays = json_decode($row['scoringPlays'], false);
    $homeScoreCurrent = 0;
    $awayScoreCurrent = 0;
    // For each scoring play in the $allScoringPlays array display a row with it's information. 
    // When the user clicks on a scoring play they are asked if they want to delete it.
    for ($i = 0; $i < count($allScoringPlays); $i++) {
        // Retrieve a single play
        $scoringPlayInfo = $allScoringPlays[$i];
        // Retrieve the play code of the scoring play. 
        // The first 4 ($team) characters of the code can be: 
        // home, away, strt (start of game), updt (score update), half (half time), full (full time)
        // The rest of the code ($play) is: the play ('Try', 'Penalty', 'Conversion', 'DropGoal') for home and away, 
        // 'Game' for strt, the score in the form of HHAA (eg 010006 for 10-6 to the home team) and 'Time' for half and full.
        $scoringPlay = $scoringPlayInfo[1];
        $team = substr($scoringPlay, 0, 4);
        $play = substr($scoringPlay, 4);
        if ($play == 'DropGoal') { 
            $play = 'Drop Goal'; 
        }

        if ($play == 'Time') {
            // For the halfTime and fullTime plays, display the score on first row and 'Half Time' or 'Full Time' on the second row
            echo "<div class='row time rowfix'>\n";
            echo "<div class='col-xs-48'>" . $homeScoreCurrent . "-" . $awayScoreCurrent . "</div>\n";
            echo "<div class='col-xs-48'>";
            if ($team == 'half') {
                echo "Half Time";
            } else {
                echo "Full Time";
            }
            echo "</div>\n</div>\n\n";
        } else if ($team == 'strt') {
            // For strtGame, display a single row with 'Game Started' in the middle
            echo "<div class='row gameStart rowfix'>\n<div class='col-xs-48'>Game Started</div>\n</div>\n\n";
        } else if ($team == 'updt') {
            if (strlen($play) == 6) {
                // For updtXXXYYY, first check if the update is a team defaulting and display appropriate 
                // message. If not then extract new score from XXXX ($play), display it and update the score.
                if (intval(substr($play, 0, 3)) == 2) {
                    $scoreString = "Game Update: " . $row['awayTeamName'] . " defaulted";
                } else if (intval(substr($play, 0, 3)) == 1) {
                    $scoreString = "Game Update: " . $row['homeTeamName'] . " defaulted";
                } else {
                    $scoreString = "Score Update: " . intval(substr($play, 0, 3)) . " - " . intval(substr($play, 3, 3)) . " (" . $scoringPlayInfo[0] . "')";
                }
                echo "<div class='row update rowfix'>\n\t<div class='col-xs-48'>" . $scoreString . "</div>\n</div>\n\n";
                $homeScoreCurrent = intval(substr($play, 0, 3));
                $awayScoreCurrent = intval(substr($play, 3, 3));
            } else {
                // For legacy updtXXYY, first check if the update is a team defaulting and display appropriate 
                // message. If not then extract new score from XXXX ($play), display it and update the score.
                if (intval(substr($play, 0, 2)) == 2) {
                    $scoreString = "Game Update: " . $row['awayTeamName'] . " defaulted";
                } else if (intval(substr($play, 0, 2)) == 1) {
                    $scoreString = "Game Update: " . $row['homeTeamName'] . " defaulted";
                } else {
                    $scoreString = "Score Update: " . intval(substr($play, 0, 2)) . " - " . intval(substr($play, 2, 2)) . " (" . $scoringPlayInfo[0] . "')";
                }
                echo "<div class='row update rowfix'>\n\t<div class='col-xs-48'>" . $scoreString . "</div>\n</div>\n\n";
                $homeScoreCurrent = intval(substr($play, 0, 2));
                $awayScoreCurrent = intval(substr($play, 2, 2));
            }
        } else {
            // For all the scoring plays, get the team (home or away), change the score based of the play ($play) and team.
            $team = substr($scoringPlay, 0, 4);
            switch ($play) {
                case "Try":
                    if ($team == "home") { $homeScoreCurrent = $homeScoreCurrent + 5; }
                    else { $awayScoreCurrent = $awayScoreCurrent + 5; }
                    break;
                case "Penalty":
                case "Drop Goal":
                    if ($team == "home") { $homeScoreCurrent = $homeScoreCurrent + 3; }
                    else { $awayScoreCurrent = $awayScoreCurrent + 3; }
                    break;
                case "Conversion":
                    if ($team == "home") { $homeScoreCurrent = $homeScoreCurrent + 2; }
                    else { $awayScoreCurrent = $awayScoreCurrent + 2; }
                    break;
            }
            // If the home team scored, then output play into first div (left). If away team scored, output 
            // play into 3rd div (right). The score after that scoring play and minutes played are displayed 
            // in the second div (center) in format "HH - AA (MM')"
            echo "<div class='row scoringPlay rowfix'>\n";
            echo "\t<div class='col-xs-20 homeScoringPlay'>";
            if ($team == 'home') { echo $play; }
            echo "</div>\n\t<div class='col-xs-8 minutesPlayed'>" . $homeScoreCurrent . " - " . $awayScoreCurrent . " (" . $scoringPlayInfo[0] . "')</div>\n";
            echo "\t<div class='col-xs-20 awayScoringPlay'>";
            if ($team == 'away') { echo $play; }
            echo "</div>\n";
            // The second row displays the description for the scoring play if given
            echo "\t<div class='col-xs-48'>" . $scoringPlayInfo[2] . "</div>\n";
            echo "</div>\n\n";

        }
    }
    // close scoringplays div from just before "for" loop
    echo "</div>\n\n";
}

?>