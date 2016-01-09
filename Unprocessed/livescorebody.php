<!-- Span used to display instructions on each page. Javascript will be used to populate this. -->
<span class='col-xs-48' id='instructions'>To upload a scoring play, tap the name of the team and the scoring play you want to upload, enter the minutes played and description of play (optional), then tap 'Send'. If you missed some plays, you can tap 'Change Score' and enter the current score and minutes played then tap 'Submit'. If you want to delete play/s, tap the plays you want to delete then tap 'Delete Selected Plays'. Tapping the 'Half Time' or 'Full Time' buttons will upload that play to the database. Once you have finished scoring the game, tap 'Stop Scoring' to be logged out.</span>

<!-- Password form with bootstrap formatting. When submitted, 
it add the contents of the password input to a POST variable -->
<form action="<?php htmlspecialchars($_SERVER['PHP_SELF']) ?>" method='post' class='password'>
    <div class='row rowfix'>
        <div class='passwordInputRow'>Password: <input type='text' name='password' class='passwordInput'></div>
    </div>
    <div class='row rowfix'>
        <button type='submit' class='passwordFormButton'>Submit</button>
    </div>
</form>

<!-- Division drop down used by the scorer to choose the division 
of the game. When the selected division is changed, the javascript 
function changeTeamDropdowns reloads the page with a different div 
GET variable which in turns changes the team drop downs to the teams 
in that division -->
<div class='row divDropDownRow rowfix'>
    Division:
    <select id="divDropDown" onchange="changeTeamDropdowns()">
        <option value="00">Div 1</option>
        <option value="01">Womens</option>
        <option value="02">Div 2</option>
        <option value="03">Div 3</option>
        <option value="04">Colts</option>
        <option value="05">U18</option>
        <option value="06">U16</option>
        <option value="07">U14.5</option>
        <option value="08">U13</option>
        <option value="09">U11.5</option>
        <option value="10">U10</option>
        <option value="11">U8.5</option>
        <option value="12">U7</option>
    </select>
</div>

<?php
/* 
Arguments:
$div - the division ID (2 character string e.g. 00 for Div 1 or 12 for U7.5)

Purpose:
Retrieve team names and ID from database

Returns:
$result - an associative array containing the teams in desired division
*/
function getTeams($div) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    // Retrieve record  with given gameID from database
    $result = mysqli_query($con, " SELECT * FROM Teams WHERE division = '$div' ");
    return $result;
}
      
/* 
Arguments:
None

Purpose:
Retrieve all the team records from the database

Returns:
$teamListArray - an array containing the teamID and teamName for all teams
*/
function getAllTeams() {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    // Retrieve all team records from database
    $teams = mysqli_query($con, "SELECT * FROM Teams");
    $teamListArray = array();
    while($row = mysqli_fetch_array($teams)) {
        $array = array($row['teamID'], $row['teamName']);
        array_push($teamListArray, $array);
    }
    
    return $teamListArray;
}

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
    
    // Retrieve record  with given gameID from database
    $result = mysqli_query($con, " SELECT * FROM Game WHERE GameID = '$gameID' ");

    // Set the liveScored attribute to 'y' to indicate this game is being live scored 
    mysqli_query($con, " UPDATE Game SET liveScored = 'y' WHERE GameID = '$gameID' ");
    
    // Retrieve all scoring plays from database to an array by decoding json string
    $row = mysqli_fetch_assoc($result);
    $allScoringPlays = json_decode($row['scoringPlays'], true);
    
    // If there aren't any plays then upload the strtGame play
    if (count($allScoringPlays) == 0) {
        // Add new scoring play
        $newScoringPlay = array('1', 'strtGame', '');
        array_push($allScoringPlays, $newScoringPlay);

        // Reencode allScoringPlays
        $updatedScoringPlays = json_encode($allScoringPlays);

        // Update game element with new values
        $update = " UPDATE Game SET minutesPlayed='1', scoringPlays = '$updatedScoringPlays' WHERE GameID = '$gameID' ";

        mysqli_query($con, $update); 
    }
    
    // Retrieve record  with given gameID from database
    $result = mysqli_query($con, " SELECT * FROM Game WHERE GameID = '$gameID' ");
    return $result;
}

/* 
Arguments:
$gameID - the unqiue ID given to each game

Purpose:
Checks whether there is an record in the database with the given gameID

Returns:
true if record exists, false otherwise
*/
function gameExists($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    // Retrieve record from database in the form of an associative array
    $select = " SELECT * FROM Game WHERE GameID = '$gameID' ";
    $result = mysqli_query($con,$select);

    // Check whether any records were found and retrieved
    if (mysqli_num_rows($result) == 0) {
        // Return false if none were found
        return false;
    } else {
        // Return true if a record with given gameID found
        return true;
    }
}

/* 
Arguments:
$gameID - the unqiue ID given to each game
$homeScore - the number of points the home team has before this play occured
$awayScore - the number of points the away team has before this play occured
$minutesPlayed - the number of minutes played when this play occurs
$description - a description of the play
$scoringPlay - a code to represent the play

Purpose:
To update the database with the current state of the game

Returns:
Nothing
*/
function uploadScoringPlay($gameID, $homeScore, $awayScore, $minutesPlayed, $description, $scoringPlay) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    // If minutesPlayed isn't specified set it to the 
    // current value of minutesPlayed from the database.
    if ($minutesPlayed == 0) {
        $result = mysqli_query($con, " SELECT minutesPlayed FROM Game WHERE GameID = '$gameID' ");
        $row = mysqli_fetch_assoc($result);
        $minutesPlayed = $row['minutesPlayed'];
    }

    // Retrieve all scoring plays from database to an array by decoding json string
    $result = mysqli_query($con, " SELECT scoringPlays FROM Game WHERE GameID = '$gameID' ");
    $row = mysqli_fetch_assoc($result);
    $allScoringPlays = json_decode($row['scoringPlays'], true);

    // Add new scoring play
    $newScoringPlay = array($minutesPlayed, $scoringPlay, $description);
    array_push($allScoringPlays, $newScoringPlay);

    // Reencode allScoringPlays
    $updatedScoringPlays = json_encode($allScoringPlays);

    $time = date("Y-m-d H:i:s");
    
    // Update game element with new values
    $update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore ='$awayScore', minutesPlayed='$minutesPlayed', scoringPlays = '$updatedScoringPlays', lastTimeScored = '$time' WHERE GameID = '$gameID' ";

    mysqli_query($con, $update);

    mysqli_close($con);
}

/* 
Arguments:
gameID - the unqiue ID given to each game

Purpose:
Change liveScored attribute in database to indicate game is no longer being live scored 

Returns:
Nothing
*/
function stopScoring($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    $update = " UPDATE Game SET liveScored = 'n' WHERE GameID = '$gameID' ";

    mysqli_query($con, $update);

    mysqli_close($con);
}

/* 
Arguments:
gameID - the unqiue ID given to each game
$homeTeam - the name of the home team
$awayTeam - the name of the away team

Purpose:
Create a new record in database with default values

Returns:
Nothing
*/
function createGame($gameID, $homeTeam, $awayTeam) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
  
    $time = date("Y-m-d H:i:s");

    // Create insert string using default values and variables given
    $sql = " INSERT INTO Game VALUES ('$gameID', '$homeTeam', '0', '$awayTeam', '0', '0', '', '', '', '$homeTeam', '12pm', '[]', 'n', 'y', '$time') ";

    // Execute insert query
    if (mysqli_query($con, $sql)) {
        // If successfully created, reload page with gameID and liveScore GET variables
        echo "<script>location.href='http://www.possumpam.com/rugby/livescore.php?gameID=" . $gameID . "&liveScore=true'</script>";
    } else {
        // If unsuccessfully created, then there was a problem with the insert string or database and user is prompted to email me
        echo "Error. There was a problem creating the game. Please send me an email by clicking <a href='mailto:cfd19@hotmail.co.nz'>here</a>";
    }

    mysqli_close($con);
}

/* 
Arguments:
gameID - the unqiue ID given to each game

Purpose:
Checks whether a game is being live scored by someone else

Returns:
true if game is being live scored already, false otherwise
*/
function isBeingLiveScored($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    // Retrieve record from database as associative array
    $result = mysqli_query($con, " SELECT * FROM Game WHERE GameID = '$gameID' ");
    $row = mysqli_fetch_assoc($result);
  
    // Check if livescored attribute is equal to 'n'
    if ($row['liveScored'] == 'n') {
        // If equal to 'n' then game isn't being live scored and return false
        return false;
    } else {
        // If not equal to 'n' then game is being live scored and return true
        return true;
    }
}

if (isset($_POST['password'])) {
    // Occurs after someone have entered a password into the password form and has clicked submit.
    if ($_POST['password'] == '12345') {
        // If password entered equals password below then reload the page with div=00 and gameSelection GET variables
        echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?div=00&gameSelection=true'</script>";
    } else {
        // If password is not equal to password above then display message informing user and reload page
        echo '<script>
              alert("The password is wrong. Please try again.");
              location.reload();
              </script>';
    }
} 
else if (isset($_GET["stopScoring"])) {
    // Occurs when user has clicked 'Stop Scoring' button
    // Display message informing user they are being logged out then reload page at game selection 
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>You are being logged out</div></div>";
    stopScoring($_GET["gameID"]);
    echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?div=00&gameSelection=true'</script>";
} 
else if (isset($_GET["gameSelection"])) {
    echo "
    <script>
    document.getElementById('instructions').textContent = 'Choose the correct division, wait for the team lists to change then select the home and away teams and tap \'Select Game\'';
    </script>";
    // Occurs after user enters correct password
    $div = $_GET["div"];
    // Use javascript to display division dropdown and set the index for division drop down
    echo '<script>showDivDropDown();setSelectedDivIndex(' . $div . ');</script>';
    // Get team list from database
    $teams = getTeams($div);
    // Display the drop downs for home and away teams with the correct list of teams for 
    // the selected division as well as button to select the game the user wants to score.
    // When button clicked, run selectGame javascript method.
    echo "
    <div class='row homeTeamRow rowfix'>
        Home Team: 
        <select id='homeTeam'>";
            
    while ($row = mysqli_fetch_assoc($teams)) {
        $teamID = $row['teamID'];
        $teamName = $row['teamName'];

        // Pad teamID to be 3 chars long
        if (strlen($teamID) == 1) { 
            $teamID = "00" . $teamID; 
        } else if (strlen($teamID) == 2) {
            $teamID = "0" . $teamID; 
        }
        
        echo "<option value='" . $teamID . "'>" . $teamName . "</option>";
    }
    
    echo "
        </select>
    </div>

    <div class='row awayTeamRow rowfix'>
        Away Team: 
        <select id='awayTeam'>";
            
    $teams2 = getTeams($div);
    while ($row = mysqli_fetch_assoc($teams2)) {
        $teamID = $row['teamID'];
        $teamName = $row['teamName'];
        
        // Pad teamID to be 3 chars long
        if (strlen($teamID) == 1) { 
            $teamID = "00" . $teamID; 
        } else if (strlen($teamID) == 2) {
            $teamID = "0" . $teamID; 
        }
        
        echo "<option value='" . $teamID . "'>" . $teamName . "</option>";
    }
    
    echo "
        </select>
    </div>

    <div class='row selectGameButtonRow'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>";
} 
else if (isset($_GET["changeScore"])) {
    // Occurs after user has clicked submit button on the change score form
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>The score is being changed</div></div>";
    $minutesPlayed = $_GET["minutesPlayed"];
    // Pad the score with leading zero to ensure the play code is always 8 characters long
    if (strlen($_GET["homeScore"]) == 1) { 
        $homeScore = '00' . $_GET["homeScore"]; 
    } else if (strlen($_GET["homeScore"]) == 2) { 
        $homeScore = '0' . $_GET["homeScore"]; 
    } else { 
        $homeScore = $_GET["homeScore"]; 
    }
    if (strlen($_GET["awayScore"]) == 1) { 
        $awayScore = '00' . $_GET["awayScore"]; 
    } else if (strlen($_GET["awayScore"]) == 2) { 
        $awayScore = '0' . $_GET["awayScore"]; 
    } else { 
        $awayScore = $_GET["awayScore"]; 
    }
    $gameID = $_GET["gameID"];
    $scoringPlay = updt . $homeScore . $awayScore;
    // Upload the change of score play to the database and reload page
    uploadScoringPlay($gameID, $homeScore, $awayScore, $minutesPlayed, '', $scoringPlay);
    echo '<script>window.open("http://possumpam.com/rugby/livescore.php?gameID=' . $gameID . '&liveScore=true", "_self");</script>';
} 
else if (isset($_GET["uploadPlay"])) {
    // Occurs after user has clicked 'Send' button to upload play
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>Play is being uploaded</div></div>";
    // Retrieve all the GET variables
    $scoringPlay = $_GET["team"] . $_GET["play"];
    $minutesPlayed = $_GET["minutesPlayed"];
    $description = $_GET["description"];
    $homeScore = intval($_GET["homeScore"]);
    $awayScore = intval($_GET["awayScore"]);
  
    // Change the current score based on the play and team passed in
    switch ($_GET["play"]) {
        case "Try":
            if ($_GET["team"] == "home") { $homeScore = $homeScore + 5; }
            else { $awayScore = $awayScore + 5; }
            break;
        case "Penalty":
        case "DropGoal":
            if ($_GET["team"] == "home") { $homeScore = $homeScore + 3; }
            else { $awayScore = $awayScore + 3; }
            break;
        case "Conversion":
            if ($_GET["team"] == "home") { $homeScore = $homeScore + 2; }
            else { $awayScore = $awayScore + 2; }
            break;
    }
    // Upload play to database and reload page
    uploadScoringPlay($_GET["gameID"], $homeScore, $awayScore, $minutesPlayed, $description, $scoringPlay);
    echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?gameID=" . $_GET['gameID'] . "&liveScore=true'</script>";
} 
else if (isset($_GET["checkGame"])) {
    // Occurs after user clicks 'Select Game' when they are choose the game to be scored
    // Check if the game exists in the database
    if (gameExists($_GET["gameID"])) {
        // If the game exists, then check if it being livescored
        if (isBeingLiveScored($_GET["gameID"]) == true) {
            // If the game is being livescored by someone else then display message 
            // to user stating that and reload page back to game selection page
            $div = substr($_GET["gameID"], 12, 2);
            echo "<script>alert('Someone else is already live scoring this game.');
                  window.open('http://possumpam.com/rugby/livescore.php?div=" . $div . "', '_self');</script>";
        } else {
            // If game isn't being live scored, then reload the page with the liveScore GET variable
            echo "<script>window.open('http://possumpam.com/rugby/livescore.php?gameID=" . 
                  $_GET["gameID"] . "&homeTeam=" . $_GET["homeTeam"] . "&awayTeam=" . 
                  $_GET["awayTeam"] . "&liveScore=true', '_self');</script>";
        }
    } else {
        // If the game doesn't already exist, then create it
        createGame($_GET['gameID'], $_GET['homeTeam'], $_GET['awayTeam']);
    }
} 
else if (isset($_GET["liveScore"])) {
    // Every minute the user is live scoring a game, the current time is uploaded to the server.
    // A cron task then checks all the games every 5 minutes. If the last time scored is more than 5 minutes
    // old then the liveScored attribute is changed to 'n'.
    echo "
    <script>
        setInterval(updateLastTimeScored, 60000);

        function updateLastTimeScored() {
            //alert('timer goes off');
            $.ajax({
                url: 'http://www.possumpam.com/rugby/updatelasttimescored.php',
                data: 'gameID=" . $_GET["gameID"] . "',
                method: 'GET',
                success: function() { 
                    //alert('time updated');
                },
                error: function() { 
                    //alert('Error updating time')
                }
            });
        }
    </script>";
    // Occurs after user has select the game they want to live score and the game has 
    // be found to exist and not being live scored already
    $gameID = $_GET["gameID"];
    // Get game info from database
    $game = getGame($gameID);
    // As the game already exists and the gameID is unique there will be only 1 game returned be getGame
    $row = mysqli_fetch_assoc($game);
    
    if (strlen($gameID) > 14) {
        $teamListArray = getAllTeams();
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
  
    // The stop scoring button, change score button and change score form. 
    // The form starts hidden and is toggled by clciking the change score button.
    // Bootstrap grid with width of 48 is used
    echo "    
    <div class='row stopScoringButtonRow rowfix'>
        <button type='submit' class='stopScoringButton col-xs-48' onclick='stopScoring(" . $gameID . ")'>Stop Scoring</button>
    </div>

    <div class='row changeScoreFormButtonRow rowfix'>
        <button type='button' class='changeScoreFormToggleButton col-xs-48' onclick='toggleChangeScoreForm();'>Change Score</button>
    </div>

    <div class='row rowfix'>
        <div class='changeScoreForm col-xs-48'>
            <div class='row changeScoreInputRow rowfix'>
                <div class='changeScoreFormLabel col-xs-10'>" . $row['homeTeamName'] . ":</div><input class='col-xs-18' type='number' id='newhomescore'><br>
            </div>
            <div class='row changeScoreInputRow rowfix'>
                <div class='changeScoreFormLabel col-xs-10'>" . $row['awayTeamName'] . ":</div><input class='col-xs-18' type='number' id='newawayscore'><br>
            </div>
            <div class='row changeScoreInputRow rowfix'>
                <div class='changeScoreFormLabel col-xs-10'>Minutes Played:</div><input class='col-xs-18' type='number' id='newminutesplayed'><br>
            </div>
            <div class='row changeScoreInputRow rowfix'>
                <input id='changeScoreFormButton' type='submit' onclick='changeScore(" . $gameID . ")'>
            </div>
        </div>
    </div>\n\n";
    
    // The half and full time buttons are next. Clickingeither will call methods to upload the half or full time play
    echo "<div class='row rowfix timingInfoLive'>
              <button type='button' class='halftime col-xs-23' onclick='sendHalfTime(" . $_GET['gameID'] . "," . 
                  $row['homeTeamScore'] . ","  . $row['awayTeamScore'] . ")'>Half Time</button>
              <button type='button' class='fulltime col-xs-23' onclick='sendFullTime(" . $_GET['gameID'] . "," . 
                  $row['homeTeamScore'] . "," . $row['awayTeamScore'] . ")'>Full Time</button>
          </div>\n\n";
    
    // If the score is 2-1 or 1-2 then the team with 1 defaulted
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
    
    // The team names and scores are added next. Once clicked, the team name will have a 
    // grey background and the previously selected team will be changed to a white background
    echo "<div class='row rowfix teamInfoLive'>
              <div class='homeTeamName col-xs-24' onclick='toggleSelectedTeam(this, `home`)'>" . $row['homeTeamName'] . "</div>
              <div class='awayTeamName col-xs-24' onclick='toggleSelectedTeam(this, `away`)'>" . $row['awayTeamName'] . "</div>
          </div>
          <div class='row rowfix scoreInfoLive'>
              <div class='homeTeamScore col-xs-24'>" . $homeScore . "</div>
              <div class='awayTeamScore col-xs-24'>" . $awayScore . "</div>
          </div>\n\n";
    
    // The 4 scoring plays are next. Once clicked, the scoring play will have a 
    // grey background and the previously selected play will be changed to a white background
    echo "<div class='row rowfix scoringPlayInfoLive'>
              <div class='scoringPlayLive try col-xs-24' onclick='toggleSelectedScoringPlay(this, `Try`)'>Try</div>
              <div class='scoringPlayLive conversion col-xs-24' onclick='toggleSelectedScoringPlay(this, `Conversion`)'>Conversion</div>
          </div>
          <div class='row rowfix scoringPlayInfoLive'>
              <div class='scoringPlayLive penalty col-xs-24' onclick='toggleSelectedScoringPlay(this, `Penalty`)'>Penalty</div>
              <div class='scoringPlayLive dropGoal col-xs-24' onclick='toggleSelectedScoringPlay(this, `DropGoal`)'>Drop Goal</div>
          </div>\n\n";

    // Next are the minutes played, description inputs and the 'Send' button. 
    // Clicking the 'Send' button will upload the information entered.
    echo "<div class='row rowfix scoringInfoLive'>
              <div class='minutesPlayedLive col-xs-17'>Minutes Played</div>
              <input type='number' class='minutesPlayedInput col-xs-31' value='" . $row['minutesPlayed'] . "' step='1' min='1' max='125'></input>
          </div>
          <div class='row rowfix scoringInfoLive'>
              <div class='descriptionLive col-xs-17'>Description</div>
              <textarea rows='3' class='descriptionInput col-xs-31'></textarea>
          </div>
          <div class='row rowfix scoringInfoLive'>
              <button type='submit' class='submit col-xs-48' onclick='uploadScoringPlay(" . $_GET['gameID'] . ", " . $row['homeTeamScore'] . ", " . $row['awayTeamScore'] . ")'>Send</button>
          </div>\n\n";

    echo "<div class='row deletePlayButtonRow rowfix'>
              <button class='deletePlayButton col-xs-48' type='button' onclick='deleteSelectedPlays()'>Delete Selected Plays</button>
          </div>\n\n";
    
    // Next is a list of the previously uploaded plays for this game
    echo "<div class='row scoringPlays rowfix'>\n\n";
    // Decode the json into an array
    $allScoringPlays = json_decode($row['scoringPlays'], false);
    $homeScoreCurrent = 0;
    $awayScoreCurrent = 0;
    $updatePlayIndexes = '';
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
            echo "<div class='row time rowfix' onclick='togglePlayInSelectedPlays(this, `" . $gameID . "`, " . $i . ", `" . substr($scoringPlay, 0, 4) . "`, `" . substr($scoringPlay, 4) . "`, " . intval($row['homeTeamScore']) . ", " . intval($row['awayTeamScore']) . ", 0, 0)'>\n";
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
            // Add $i to $updatePlayIndexes
            $updatePlayIndexes = $updatePlayIndexes . ',' . $i;
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
                echo "<div class='row update rowfix' onclick='togglePlayInSelectedPlays(this, `" . $gameID . "`, " . $i . ", `" . substr($scoringPlay, 0, 4) . "`, `" . substr($scoringPlay, 4) . "`, " . intval($row['homeTeamScore']) . ", " . intval($row['awayTeamScore']) . ", " . $homeScoreCurrent . ", " . $awayScoreCurrent . ")'>\n\t<div class='col-xs-48'>" . $scoreString . "</div>\n</div>\n\n";
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
                echo "<div class='row update rowfix' onclick='togglePlayInSelectedPlays(this, `" . $gameID . "`, " . $i . ", `" . substr($scoringPlay, 0, 4) . "`, `" . substr($scoringPlay, 4) . "`, " . intval($row['homeTeamScore']) . ", " . intval($row['awayTeamScore']) . ", " . $homeScoreCurrent . ", " . $awayScoreCurrent . ")'>\n\t<div class='col-xs-48'>" . $scoreString . "</div>\n</div>\n\n";
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
            echo "<div class='row scoringPlay rowfix' onclick='togglePlayInSelectedPlays(this, `" . $gameID . "`, " . $i . ", `" . substr($scoringPlay, 0, 4) . "`, `" . substr($scoringPlay, 4) . "`, " . intval($row['homeTeamScore']) . ", " . intval($row['awayTeamScore']) . ", 0, 0)'>\n";
            echo "\t<div class='col-sm-20 col-xs-15 homeScoringPlay'>";
            if ($team == 'home') { echo $play; }
            echo "</div>\n\t<div class='col-sm-8 col-xs-18 minutesPlayed'>" . $homeScoreCurrent . " - " . $awayScoreCurrent . " (" . $scoringPlayInfo[0] . "')</div>\n";
            echo "\t<div class='col-sm-20 col-xs-15 awayScoringPlay'>";
            if ($team == 'away') { echo $play; }
            echo "</div>\n";
            // The second row displays the description for the scoring play if given
            echo "\t<div class='col-xs-48'>" . $scoringPlayInfo[2] . "</div>\n";
            echo "</div>\n\n";

        }
    }
    // close scoringplays div from just before "for" loop
    echo "</div>\n\n";
    echo "<span id='updatePlayIndexes' style='display: none'>" . $updatePlayIndexes . "</span>";
} 
else {
  // If no GET or POST variable given then display the password input and button
  echo "
  <script>
  togglePassword();
  document.getElementById('instructions').textContent = 'Input the password provided to you and tap \'Submit\'';
  </script>";
}
    
?>
