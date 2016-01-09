<!-- Span used to display instructions on each page. Javascript will be used to populate this. -->
<span class='col-xs-48' id='instructions'>To upload the final score for a game, select the division, home team, away team, enter the score for each team, the date the game was played then tap 'Submit Score'</span>

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
<div class='row divDropDownRowEnd rowfix'>
    <div class='titleEnd'>Division</div>
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
$scoringPlay - a code to represent the play

Purpose:
To update the database with the score at the end of the game

Returns:
Nothing
*/
function uploadScore($gameID, $homeScore, $awayScore, $scoringPlay) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    // Retrieve all scoring plays from database to an array by decoding json string
    $result = mysqli_query($con, " SELECT scoringPlays FROM Game WHERE GameID = '$gameID' ");
    $row = mysqli_fetch_assoc($result);
    $allScoringPlays = json_decode($row['scoringPlays'], true);

    // Add new scoring play
    $newScoringPlay = array('80', $scoringPlay, '');
    array_push($allScoringPlays, $newScoringPlay);

    // Reencode allScoringPlays
    $updatedScoringPlays = json_encode($allScoringPlays);

    // Update game element with new values
    $update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore ='$awayScore', minutesPlayed='80', scoringPlays = '$updatedScoringPlays' WHERE GameID = '$gameID' ";

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

    // Create insert string using default values and variables given
    $sql = " INSERT INTO Game VALUES ('$gameID', '$homeTeam', '0', '$awayTeam', '0', '0', '', '', '', '$homeTeam', '12pm', '[]', 'n', 'y') ";

    // Execute insert query. If unsuccessfully created, then there was a problem with the insert string or database and user is prompted to email me. If successfully created, do nothing
    if (!mysqli_query($con, $sql)) {
        echo "Error. There was a problem creating the game. Please send me an email by clicking <a href='mailto:cfd19@hotmail.co.nz'>here</a>";
    }

    mysqli_close($con);
}

if (isset($_POST['password'])) {
    // Occurs after someone have entered a password into the password form and has clicked submit.
    if ($_POST['password'] == '12345') {
        // If password entered equals password below then reload the page with div=00 and gameSelection GET variables
        echo '<script>location.href = window.location.href + "?div=00";</script>';
    } else {
        // If password is not equal to password above then display message informing user and reload page
        echo '<script>
              alert("The password is wrong. Please try again.");
              location.reload();
              </script>';
    }
} else if (isset($_GET["uploadScore"])) {
    // Occurs after user has clicked 'Submit Score' button to upload play
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>Score is being uploaded</div></div>";
    // Add a new game record to thte database if it doesn't already exist
    if (!gameExists($_GET["gameID"])) {
        createGame($_GET['gameID'], $_GET['homeTeam'], $_GET['awayTeam']);
    }
    // Pad the scores to be 3 characters long
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
    // Create update play then upload it to database and reload page
    $scoringPlay = updt . $homeScore . $awayScore;
    uploadScore($_GET["gameID"], $homeScore, $awayScore, $scoringPlay);
    echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?div=" . $_GET["div"] . "'</script>";
} else if (isset($_GET["div"])) {
    // Occurs when the division is changed
    $div = $_GET["div"];
    echo '<script>showDivDropDown();setSelectedDivIndex(' . $div . ');</script>';
    // Get team list from database and iterate through list to create a home and away dropdown
    $teams = getTeams($div);
    echo "
    <div class='row homeTeamRowEnd rowfix'>
        <div class='titleEnd'>Home Team</div>
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

    <div class='row homeScoreRowEnd rowfix'>
        <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
        Defaulted <input type='checkbox' id='homeCheckbox' onchange='toggleScoreInputs()'>
    </div>

    <div class='row awayTeamRowEnd rowfix'>
        <div class='titleEnd'>Away Team</div>
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

    <div class='row awayScoreRowEnd rowfix'>
        <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
        Defaulted <input type='checkbox' id='awayCheckbox' onchange='toggleScoreInputs()'>
    </div>

    <div class='row datePickerRowEnd rowfix'>
        <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
    </div>

    <div class='row submitScoreButtonRow'>
        <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
    </div>";
} else {
    // If page doesn't have an GET variables show the password input
    echo "
    <script>
    togglePassword();
    document.getElementById('instructions').textContent = 'Input the password provided to you and tap \'Submit\'';
    </script>";
}
    
?>
