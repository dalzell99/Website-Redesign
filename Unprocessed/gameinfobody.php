<?php
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
    $gameID = $_GET["gameID"];
    $game = getGame($gameID);
    $row = mysqli_fetch_assoc($game);
  
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

    $gameDateString = substr($gameID, 0, 8);
    $gameDateDate = new DateTime($gameDateString);
    $minutesOrTime = ($row['minutesPlayed'] == '0' ? date_format($gameDateDate, 'D jS M') . " " . $row['time'] : $row['minutesPlayed'] . " mins");
    echo "<div class='row gameInfo'><div class='col-xs-48'>" . $row['location'] . "</div></div>";
    echo "<div class='row gameInfo'><div class='col-xs-48'>" . $minutesOrTime . "</div></div>";

    echo "<div class='row scoringPlays'>";
    $allScoringPlays = json_decode($row['scoringPlays'], false);
    for ($i = 0; $i < count($allScoringPlays); $i++) {
        // echo scoring play   
        $scoringPlayInfo = $allScoringPlays[$i];
        $scoringPlay = $scoringPlayInfo[1];
        $team;
        if (substr($scoringPlay, 0, 4) == 'home') {
            $team = $row['homeTeamName'];
        } else if (substr($scoringPlay, 0, 4) == 'away') {
            $team = $row['awayTeamName'];
        } else {
            $team = substr($scoringPlay, 0, 4);
        }

        $play = substr($scoringPlay, 4);
        if ($play == 'DropGoal') { 
            $play = 'Drop Goal'; 
        } 
        
        if ($play == 'Time') {
            echo "<div class='row time'><div class='col-xs-48'>";
            if ($team == 'half') {
                echo "Half Time";
            } else {
                echo "Full Time";
            }
            echo "</div></div>";
        } else if ($team == 'strt') {
            echo "<div class='row'><div class='col-xs-48'>Game Started</div></div>";
        } else if ($team == 'updt') {
            if (intval(substr($play, 0, 2) == 2) {
                $scoreString = "Game Update: " . $row['awayTeamName'] . " defaulted";
            } else if (intval(substr($play, 0, 2) == 1) {
                $scoreString = $row['homeTeamName'] . " defaulted";
            } else {
                $scoreString = "Score Update: " . intval(substr($play, 0, 2)) . " - " . intval(substr($play, 2, 2));
            }
            echo "<div class='row update'><div class='col-xs-48'>" . $scoreString . "</div></div>";
        } else {
            echo "<div class='row scoringPlay'>";
            echo "<div class='col-xs-22 homeScoringPlay'>";
            if (substr($scoringPlay, 0, 4) == 'home') { echo $play; }
            echo "</div><div class='col-xs-4 minutesPlayed'>" . $scoringPlayInfo[0] . "'</div>";
            echo "<div class='col-xs-22 awayScoringPlay'>";
            if (substr($scoringPlay, 0, 4) == 'away') { echo $play; }
            echo "</div>";
            
            echo "<div class='col-xs-48'>" . $scoringPlayInfo[2] . "</div>";
            echo "</div>";
          
        }
    }
    echo "</div>";
}

?>