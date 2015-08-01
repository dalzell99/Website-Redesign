<?php
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
