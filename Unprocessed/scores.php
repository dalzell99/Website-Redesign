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
  
  // Colour legend
  echo "
  <div class='row colourLegend'>
      <div class='colour col-xs-24'>
          <div class='blueSquare'></div>
          <div class='colourLabel'>Not Started</div>
      </div>
      <div class='colour col-xs-24'>
          <div class='greenSquare'></div>
          <div class='colourLabel'>Being Live Scored</div>
      </div>
  </div>
  <div class='row colourLegend'>
      <div class='colour col-xs-24'>
          <div class='yellowSquare'></div>
          <div class='colourLabel'>Live Scoring Started but Not Finished</div>
      </div>
      <div class='colour col-xs-24'>
          <div class='redSquare'></div>
          <div class='colourLabel'>Game Finished</div>
      </div>
  </div>";
  
  // Start date for first week of draw
  date_default_timezone_set("Pacific/Auckland");
  $startDate = new DateTime("2015-03-23");

  // Gets the date for first day of selected week
  $startOfWeekModifier = "+" . 7 * $_GET['weekNumber'] . " days";
  $startOfWeek = new DateTime($startDate->format("Y-m-d"));
  $startOfWeek->modify($startOfWeekModifier);

  // Gets the date for last day of selected week
  $endOfWeek = new DateTime($startOfWeek->format("Y-m-d"));
  $endOfWeek->modify("+6 days");

  // The division titles
  $divTitles = array("Div 1", "Womens", "Div 2", "Div 3", "Colts", "U18", "U16", "U14.5", "U13", "U11.5", "U10", "U8.5", "U7");
    
  // Get team list from database and create array with teamID and teamName
  $teams = mysqli_query($con, "SELECT * FROM Teams");
  $teamListArray = array();
  while($row = mysqli_fetch_array($teams)) {
    $array = array($row['teamID'], $row['teamName']);
    array_push($teamListArray, $array);
  }
  
  // Generate html for one division at a time
  for ($divID = 0; $divID < 13; $divID++) {
    $gamesInRow = 0;
    // Add division title
    $divString = $divID < 10 ? "0" . $divID : (string) $divID;
    echo "
    <div class='row'>
      <div class='col-sm-48 divtitle' onclick='toggleGames(\"div" . $divID . "\");'>
        <h3>" . $divTitles[$divID] . "</h3>
      </div><!-- End of divtitle div -->
      <div class='col-xs-48 gamerowcontainer div" . $divID . "'>
        <div class='row gamerow'>";
        // Get all the games in current division
        $select = "SELECT * FROM Game WHERE GameID LIKE '%" . $divString . "'";
        $result = mysqli_query($con,$select);
        while($row = mysqli_fetch_array($result)) {
          $gameID = (String) $row['GameID'];
          $gameDateString = substr($gameID, 0, 8);
          $gameDateDate = new DateTime($gameDateString);
          // For each game returned check if game occurs in selected week and division
          if ($gameDateDate <= $endOfWeek AND $gameDateDate >= $startOfWeek AND substr($gameID, -2) == $divString) {
            // If gameID uses new 3 character teamID then retrieve team name from array 
            // created above, otherwise use team names from when the game was added to database
            if (strlen($gameID) > 14) {
              $homeTeamID = intval(substr($gameID, 8, 3));
              $awayTeamID = intval(substr($gameID, 11, 3));
              for ($l = 0; $l < count($teamListArray); $l++) {
                if ($teamListArray[$l][0] == $homeTeamID) {
                  $homeTeamName = $teamListArray[$l][1];
                } else if ($teamListArray[$l][0] == $awayTeamID) {
                  $awayTeamName = $teamListArray[$l][1];
                }
              }
            } else {
              $homeTeamName = $row['homeTeamName'];
              $awayTeamName = $row['awayTeamName'];
            }
            
            // If game hasn't had any updated then display when it is/was to be played
            // If minutesPlayed is 40 or 80 display Half Time or Full Time
            // If liveScored is y then game is being live scored at the moment
            // If minutesPlayed > 0 and < 80 and liveScored is n then someone started live scoring it but stopped before finishing
            $timeString = "";
            $gameSit = "";
            if ($row['minutesPlayed'] == 0) {
              $timeString = $gameDateDate->format('D jS M Y');
              $gameSit = "notstarted";
            } else if ($row['minutesPlayed'] == 80) {
              $timeString = "Full Time";
              $gameSit = "finished";
            } else if ($row['minutesPlayed'] == 40 && $row['liveScored'] == 'y') {
              $timeString = "Half Time";
              $gameSit = "inprogress";
            } else if ($row['minutesPlayed'] == 40 && $row['liveScored'] == 'n') {
              $timeString = "Half Time";
              $gameSit = "startedbutnotscored";
            } else if ($row['liveScored'] == 'y') {
              $timeString = $row['minutesPlayed'] . " mins";
              $gameSit = "inprogress";
            } else {
              $timeString = $row['minutesPlayed'] . " mins";
              $gameSit = "startedbutnotscored";
            }

            // If score is 2 then other team defaulted
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

            // Winning team are displayed in bold
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

            // Create string containing the names of the ref and assisstant refs (if given)
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

            // Now put it all together and display game
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
                echo "<div class='teamname col-xs-20 col-sm-33'>" . $homeTeamName . "</div>
                <div class='score col-xs-16 col-sm-15'>" .  $homeTeamScore . "</div>";
                if ($winningTeam == 'home') { echo "</strong>"; }
              echo "</div>
              <div class='row teams hometeam'>";
                if ($winningTeam == 'away') { echo "<strong>"; }
                echo "<div class='teamname col-xs-20 col-sm-33'>" .  $awayTeamName . "</div>
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
  // if a week hasn't been selected then set selected week to 0
  echo "<script language='javascript'>\n";
  echo "  window.location.replace('http://www.possumpam.com/rugby/index.php?weekNumber=0')";
  echo "</script>\n";
}

mysqli_close($con);
?>
