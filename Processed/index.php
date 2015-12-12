<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Rugby Draw/Results</title>
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
    <div class="container-fluid">
      <div class="row">
        <div class="weektoggledisplay col-xs-47">
          <div onclick="toggleWeeks()" class="showweeks">Show Weeks</div>
          <nav class="row">
                <button onclick="location.href='/rugby/index.php?weekNumber=0'" class="weeknav col-xs-12 col-sm-8 col-md-4 week1"><div class="weektitle">W1</div><div class="date">23 Mar - 29 Mar</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=1'" class="weeknav col-xs-12 col-sm-8 col-md-4 week2"><div class="weektitle">W2</div><div class="date">30 Mar - 5 Apr</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=2'" class="weeknav col-xs-12 col-sm-8 col-md-4 week3"><div class="weektitle">W3</div><div class="date">6 Apr - 12 Apr</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=3'" class="weeknav col-xs-12 col-sm-8 col-md-4 week4"><div class="weektitle">W4</div><div class="date">13 Apr - 19 Apr</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=4'" class="weeknav col-xs-12 col-sm-8 col-md-4 week5"><div class="weektitle">W5</div><div class="date">20 Apr - 26 Apr</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=5'" class="weeknav col-xs-12 col-sm-8 col-md-4 week6"><div class="weektitle">W6</div><div class="date">27 Apr - 3 May</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=6'" class="weeknav col-xs-12 col-sm-8 col-md-4 week7"><div class="weektitle">W7</div><div class="date">4 May - 9 May</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=7'" class="weeknav col-xs-12 col-sm-8 col-md-4 week8"><div class="weektitle">W8</div><div class="date">11 May - 17 May</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=8'" class="weeknav col-xs-12 col-sm-8 col-md-4 week9"><div class="weektitle">W9</div><div class="date">18 May - 24 May</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=9'" class="weeknav col-xs-12 col-sm-8 col-md-4 week10"><div class="weektitle">W10</div><div class="date">25 May - 31 May</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=10'" class="weeknav col-xs-12 col-sm-8 col-md-4 week11"><div class="weektitle">W11</div><div class="date">1 Jun - 7 Jun</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=11'" class="weeknav col-xs-12 col-sm-8 col-md-4 week12"><div class="weektitle">W12</div><div class="date">8 Jun - 14 Jun</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=12'" class="weeknav col-xs-12 col-sm-8 col-md-4 week13"><div class="weektitle">W13</div><div class="date">15 Jun - 21 Jun</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=13'" class="weeknav col-xs-12 col-sm-8 col-md-4 week14"><div class="weektitle">W14</div><div class="date">22 Jun - 28 Jun</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=14'" class="weeknav col-xs-12 col-sm-8 col-md-4 week15"><div class="weektitle">W15</div><div class="date">29 Jun - 5 Jul</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=15'" class="weeknav col-xs-12 col-sm-8 col-md-4 week16"><div class="weektitle">W16</div><div class="date">6 Jul - 12 Jul</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=16'" class="weeknav col-xs-12 col-sm-8 col-md-4 week17"><div class="weektitle">W17</div><div class="date">13 Jul - 19 Jul</div></button>
                <button onclick="location.href='/rugby/index.php?weekNumber=17'" class="weeknav col-xs-12 col-sm-8 col-md-4 week18"><div class="weektitle">W18</div><div class="date">20 Jul - 26 Jul</div></button>
          </nav>
        </div>
      </div><?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (isset($_GET['weekNumber'])) {
  echo "
  <script language='javascript'>
    setActiveWeekButton(". $_GET['weekNumber'] . ");
  </script>";
  // output the geometry variables
  date_default_timezone_set("Pacific/Auckland");
  $startDate = new DateTime("2015-03-23");

  $startOfWeekModifier = "+" . 7 * $_GET['weekNumber'] . " days";
  $startOfWeek = new DateTime($startDate->format("Y-m-d"));
  $startOfWeek->modify($startOfWeekModifier);

  $endOfWeek = new DateTime($startOfWeek->format("Y-m-d"));
  $endOfWeek->modify("+6 days");

  $divTitles = array("Div 1", "Womens", "Div 2", "Div 3", "Colts", "U18", "U16", "U14.5", "U13", "U11.5", "U10", "U8.5", "U7");
  for ($divID = 0; $divID < 13; $divID++) {
    $gamesInRow = 0;
    $divString = $divID < 10 ? "0" . $divID : (string) $divID;
    echo "
    <div class='row'>
      <div class='col-sm-48 divtitle' onclick='toggleGames(\"div" . $divID . "\");'>
        <h3>" . $divTitles[$divID] . "</h3>
      </div><!-- End of divtitle div -->
      <div class='col-xs-48 gamerowcontainer div" . $divID . "'>
        <div class='row gamerow'>";
        $select = "SELECT * FROM Game WHERE GameID LIKE '%" . $divString . "'";
        $result = mysqli_query($con,$select);
        while($row = mysqli_fetch_array($result)) {
          $gameID = (String) $row['GameID'];
          $gameDateString = substr($gameID, 0, 8);
          $gameDateDate = new DateTime($gameDateString);
          if ($gameDateDate <= $endOfWeek AND $gameDateDate >= $startOfWeek AND substr($gameID, 12) == $divString) {
            $timeString = "";
            $gameSit = ""; // NS = Not Started, IP = In Progress, F = Finished
            if ($row['minutesPlayed'] == 0) {
              $timeString = $gameDateDate->format('D jS M Y');
              $gameSit = "notstarted";
            } else if ($row['minutesPlayed'] == 40) {
              $timeString = "Half Time";
              $gameSit = "inprogress";
            } else if ($row['minutesPlayed'] == 80) {
              $timeString = "Full Time";
              $gameSit = "finished";
            } else {
              $timeString = $row['minutesPlayed'];
              $gameSit = "inprogress";
            }

            $homeTeamScore = "";
            $awayTeamScore = "";

            if ($row['homeTeamScore'] == 2) {
              $homeTeamScore = "Win";
              $awayTeamScore = "Defaulted";
            } else if ($row['homeTeamScore'] == 1) {
              $homeTeamScore = "Defaulted";
              $awayTeamScore = "Win";
            } else {
              $homeTeamScore = $row['homeTeamScore'];
              $awayTeamScore = $row['awayTeamScore'];
            }

            $winningTeam = "";
            if ($row['homeTeamScore'] > $row['awayTeamScore']) {
              $winningTeam = "home";
            } else if ($row['awayTeamScore'] > $row['homeTeamScore']) {
              $winningTeam = "away";
            }

            if ($gamesInRow == 3) {
              // start new bootstrap row as current row is full
              $gamesInRow = 0;
              echo "</div><!-- End of gamerow div -->
              <div class='row gamerow'>";
            }

            $refString = "";
            $ref = $row['ref'];
            $assRef1 = $row['assRef1'];
            $assRef2 = $row['assRef2'];

            if ($ref != "") {
              $refString = "Ref: " . $ref;
              if ($assRef1 != "") {
                $refString = $refString . ", Assis. Ref: " . $assRef1;
                if ($assRef2 != "") {
                  // There is a ref and both first and second assistants
                  $refString = $refString . " and " . $assRef2;
                } else {
                  // There is a ref and a first assistant but no second
                }
              } else {
                if ($assRef2 != "") {
                  // There is a ref and a second assistant but no first
                  $refString = $refString . ", Assis. Ref: " . $assRef2;
                }
              }
            } else {
              if ($assRef1 != "") {
                $refString = $refString . "Assis. Ref: " . $assRef1;
                if ($assRef2 != "") {
                  // There is no ref and both first and second assistants
                  $refString = $refString . " and " . $assRef2;
                } else {
                  // There is only the first assistant
                }
              } else {
                if ($assRef2 != "") {
                  // There is only the second assistant
                  $refString = $refString . "Assis. Ref: " . $assRef2;
                }
              }
            }

            echo "
            <div class='col-sm-15 game " . $gameSit . "' onclick='showGameInfo(" . $row['GameID'] . ");'>
              <div class='row'>
                <div class='col-xs-48 location'>" . $row['location'] . " - " . $timeString . "</div>
              </div>
              <div class='row'>
                <div class='col-xs-48 refs'>" . $refString . "</div>
              </div>
              <div class='row teams hometeam'>";
                if ($winningTeam == 'home') { echo "<strong>"; }
                echo "<div class='teamname col-xs-20 col-sm-33'>" . $row['homeTeamName'] . "</div>
                <div class='score col-xs-16 col-sm-15'>" .  $homeTeamScore . "</div>";
                if ($winningTeam == 'home') { echo "</strong>"; }
              echo "</div>
              <div class='row teams hometeam'>";
                if ($winningTeam == 'away') { echo "<strong>"; }
                echo "<div class='teamname col-xs-20 col-sm-33'>" .  $row['awayTeamName'] . "</div>
                <div class='score col-xs-16 col-sm-15'>" .  $awayTeamScore . "</div>";
                if ($winningTeam == 'away') { echo "</strong>"; }
              echo "</div>
            </div><!-- End of game div -->";
            $gamesInRow += 1;
          }
        }
    echo "
        </div><!-- End of gamerow div -->
      </div><!-- End of gamerowcontainer div -->
    </div><!-- End of row div -->";
  }
} else {
  echo "<script language='javascript'>\n";
  echo "  window.location.replace('http://www.possumpam.com/rugby/index.php?weekNumber=0')";
  echo "</script>\n";
}

mysqli_close($con);
?>

    </div>
  </body>
</html>