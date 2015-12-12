<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Game Info</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="bootstrap/js/bootstrap.js"></script>
    <script src="javascript.js"></script>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
        <nav class="navbar navbar-default">
          <div class="container">
            <div class="navbar-header">
              <button type="button" data-toggle="collapse" data-target=".navbar-collapse" class="navbar-toggle collapsed"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a href="#" class="navbar-brand">ERSU Rugby Scoring</a>
            </div>
            <div class="navbar-collapse collapse">
              <ul class="nav navbar-nav">
                <li class="draw active"><a href="index.php">Draw/Results</a></li>
                <li class="live"><a href="livescore.php">Live Score</a></li>
                <li class="end"><a href="endgame.php">End Game Score</a></li>
              </ul>
            </div>
          </div>
        </nav>
    <div class="container-fluid"><?php
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
    echo "
    <div class='row teamInfo'>
      <div class='col-xs-22'>
        <div class='row'>" . $row['homeTeamName'] . "</div>
        <div class='row'>" . $row['homeTeamScore'] . "</div>
      </div>
      <div class='col-xs-4 versus'>vs</div>
      <div class='col-xs-22'>
        <div class='row'>" . $row['awayTeamName'] . "</div>
        <div class='row'>" . $row['awayTeamScore'] . "</div>
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
            echo "<div class='row update'><div class='col-xs-48'>";
            echo "Score Updated to " . intval(substr($play, 0, 2)) . " - " . intval(substr($play, 2, 2));
            echo "</div></div>";
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
    </div>
  </body>
</html>