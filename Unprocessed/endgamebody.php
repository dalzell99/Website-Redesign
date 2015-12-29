<form action="<?php htmlspecialchars($_SERVER['PHP_SELF']) ?>" method='post' class='password'>
    <div class='row rowfix'>
        <div class='passwordInputRow'>Password: <input type='text' name='password' class='passwordInput'></div>
    </div>
    <div class='row rowfix'>
        <button type='submit' class='passwordFormButton'>Submit</button>
    </div>
</form>

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

function gameExists($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    $select = " SELECT * FROM Game WHERE GameID = '$gameID' ";
    $result = mysqli_query($con,$select);

    if (mysqli_num_rows($result) == 0) {
        return false;
    } else {
        return true;
    }
}

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

function createGame($gameID, $homeTeam, $awayTeam) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $sql = " INSERT INTO Game VALUES ('$gameID', '$homeTeam', '0', '$awayTeam', '0', '0', '', '', '', '$homeTeam', '12pm', '[]', 'n', 'y') ";

    if (!mysqli_query($con, $sql)) {
        echo "Error. There was a problem creating the game. Please send me an email by clicking <a href='mailto:cfd19@hotmail.co.nz'>here</a>";
    }

    mysqli_close($con);
}

if (isset($_POST['password'])) {
    if ($_POST['password'] == '12345') {
        // refresh the page with div GET variable set to 00
        echo '<script>location.href = window.location.href + "?div=00";</script>';
    } else {
        echo 'The password is wrong. Please try again.';
    }
} else if (isset($_GET["uploadScore"])) {
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>Score is being uploaded</div></div>";
    if (!gameExists($_GET["gameID"])) {
        createGame($_GET['gameID'], $_GET['homeTeam'], $_GET['awayTeam']);
    }
    if (strlen($_GET["homeScore"]) == 1) { $homeScore = '0' . $_GET["homeScore"]; } else { $homeScore = $_GET["homeScore"]; };
    if (strlen($_GET["awayScore"]) == 1) { $awayScore = '0' . $_GET["awayScore"]; } else { $awayScore = $_GET["awayScore"]; };
    $scoringPlay = updt . $homeScore . $awayScore;
    uploadScore($_GET["gameID"], $homeScore, $awayScore, $scoringPlay);
    echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?div=" . $_GET["div"] . "'</script>";
} else if (isset($_GET["div"])) {
    $div = $_GET["div"];
    echo '<script>showDivDropDown();setSelectedDivIndex(' . $div . ');</script>';
    switch ($div) {
        case "00":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Ashley</option>
                        <option value='01'>BDI</option>
                        <option value='02'>Celtic</option>
                        <option value='03'>Darfield</option>
                        <option value='04'>Glenmark</option>
                        <option value='05'>Hampstead</option>
                        <option value='06'>Hornby</option>
                        <option value='07'>Kaiapoi</option>
                        <option value='08'>Lincoln</option>
                        <option value='09'>Methven</option>
                        <option value='10'>Ohoka</option>
                        <option value='11'>Oxford</option>
                        <option value='12'>Prebbleton</option>
                        <option value='13'>Rakaia</option>
                        <option value='14'>Rolleston</option>
                        <option value='15'>Saracens</option>
                        <option value='16'>Southbridge</option>
                        <option value='17'>Southern</option>
                        <option value='18'>Waihora</option>
                        <option value='19'>West Melton</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Ashley</option>
                        <option value='01'>BDI</option>
                        <option value='02'>Celtic</option>
                        <option value='03'>Darfield</option>
                        <option value='04'>Glenmark</option>
                        <option value='05'>Hampstead</option>
                        <option value='06'>Hornby</option>
                        <option value='07'>Kaiapoi</option>
                        <option value='08'>Lincoln</option>
                        <option value='09'>Methven</option>
                        <option value='10'>Ohoka</option>
                        <option value='11'>Oxford</option>
                        <option value='12'>Prebbleton</option>
                        <option value='13'>Rakaia</option>
                        <option value='14'>Rolleston</option>
                        <option value='15'>Saracens</option>
                        <option value='16'>Southbridge</option>
                        <option value='17'>Southern</option>
                        <option value='18'>Waihora</option>
                        <option value='19'>West Melton</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "01":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Hornby</option>
                        <option value='01'>BDI</option>
                        <option value='02'>University</option>
                        <option value='03'>Sydenham</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                        <select id='awayTeam'>
                            <option value='00'>Hornby</option>
                            <option value='01'>BDI</option>
                            <option value='02'>University</option>
                            <option value='03'>Sydenham</option>
                        </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "02":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>BDI</option>
                        <option value='02'>Darfield</option>
                        <option value='03'>Diamond Harbour</option>
                        <option value='04'>Kirwee</option>
                        <option value='05'>Lincoln</option>
                        <option value='06'>Prebbleton</option>
                        <option value='07'>Southbridge</option>
                        <option value='08'>Springston</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>BDI</option>
                        <option value='02'>Darfield</option>
                        <option value='03'>Diamond Harbour</option>
                        <option value='04'>Kirwee</option>
                        <option value='05'>Lincoln</option>
                        <option value='06'>Prebbleton</option>
                        <option value='07'>Southbridge</option>
                        <option value='08'>Springston</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "03":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>BDI</option>
                        <option value='01'>Hornby</option>
                        <option value='02'>Kirwee</option>
                        <option value='03'>Lincoln</option>
                        <option value='04'>Rolleston</option>
                        <option value='05'>Springston</option>
                        <option value='06'>Waihora</option>
                        <option value='07'>West Melton</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>BDI</option>
                        <option value='01'>Hornby</option>
                        <option value='02'>Kirwee</option>
                        <option value='03'>Lincoln</option>
                        <option value='04'>Rolleston</option>
                        <option value='05'>Springston</option>
                        <option value='06'>Waihora</option>
                        <option value='07'>West Melton</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "04":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>BDI</option>
                        <option value='02'>Celtic</option>
                        <option value='03'>Darfield</option>
                        <option value='04'>Kirwee</option>
                        <option value='05'>Lincoln Black</option>
                        <option value='06'>Lincoln Red</option>
                        <option value='07'>Prebbleton</option>
                        <option value='08'>Springston</option>
                        <option value='09'>Waihora</option>
                        <option value='10'>West Melton</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>BDI</option>
                        <option value='02'>Celtic</option>
                        <option value='03'>Darfield</option>
                        <option value='04'>Kirwee</option>
                        <option value='05'>Lincoln Black</option>
                        <option value='06'>Lincoln Red</option>
                        <option value='07'>Prebbleton</option>
                        <option value='08'>Springston</option>
                        <option value='09'>Waihora</option>
                        <option value='10'>West Melton</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "05":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Ashley/Oxford</option>
                        <option value='01'>Celtic</option>
                        <option value='02'>Hurunui</option>
                        <option value='03'>Kaiapoi</option>
                        <option value='04'>Lincoln</option>
                        <option value='05'>Malvern Combined</option>
                        <option value='06'>Methven/Rakaia</option>
                        <option value='07'>Rangiora High School</option>
                        <option value='08'>Waihora</option>
                        <option value='09'>West Melton/Rolleston</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Ashley/Oxford</option>
                        <option value='01'>Celtic</option>
                        <option value='02'>Hurunui</option>
                        <option value='03'>Kaiapoi</option>
                        <option value='04'>Lincoln</option>
                        <option value='05'>Malvern Combined</option>
                        <option value='06'>Methven/Rakaia</option>
                        <option value='07'>Rangiora High School</option>
                        <option value='08'>Waihora</option>
                        <option value='09'>West Melton/Rolleston</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "06":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Ashley/Amberley</option>
                        <option value='01'>Celtic</option>
                        <option value='02'>Hampstead</option>
                        <option value='03'>Hurunui</option>
                        <option value='04'>Kaiapoi</option>
                        <option value='05'>Lincoln</option>
                        <option value='06'>Malvern</option>
                        <option value='07'>Methven</option>
                        <option value='08'>Oxford</option>
                        <option value='09'>Prebbleton</option>
                        <option value='10'>Rolleston</option>
                        <option value='11'>Saracens</option>
                        <option value='12'>Waihora</option>
                        <option value='13'>West Melton/Southbridge</option>
                        </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Ashley/Amberley</option>
                        <option value='01'>Celtic</option>
                        <option value='02'>Hampstead</option>
                        <option value='03'>Hurunui</option>
                        <option value='04'>Kaiapoi</option>
                        <option value='05'>Lincoln</option>
                        <option value='06'>Malvern</option>
                        <option value='07'>Methven</option>
                        <option value='08'>Oxford</option>
                        <option value='09'>Prebbleton</option>
                        <option value='10'>Rolleston</option>
                        <option value='11'>Saracens</option>
                        <option value='12'>Waihora</option>
                        <option value='13'>West Melton/Southbridge</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "07":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Duns/Irwell/Leeston</option>
                        <option value='01'>Lincoln/Springston</option>
                        <option value='02'>Malvern Combined</option>
                        <option value='03'>Prebbleton</option>
                        <option value='04'>Rolleston Black</option>
                        <option value='05'>Rolleston Gold</option>
                        <option value='06'>Waihora</option>
                        <option value='07'>West Melton</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Duns/Irwell/Leeston</option>
                        <option value='01'>Lincoln/Springston</option>
                        <option value='02'>Malvern Combined</option>
                        <option value='03'>Prebbleton</option>
                        <option value='04'>Rolleston Black</option>
                        <option value='05'>Rolleston Gold</option>
                        <option value='06'>Waihora</option>
                        <option value='07'>West Melton</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "08":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Darfield</option>
                        <option value='01'>Duns/Irwell/Leeston</option>
                        <option value='02'>Lincoln</option>
                        <option value='03'>Malvern Combined</option>
                        <option value='04'>Prebbleton Blue</option>
                        <option value='05'>Prebbleton White</option>
                        <option value='06'>Rolleston Black</option>
                        <option value='07'>Rolleston Gold</option>
                        <option value='08'>Southbridge</option>
                        <option value='09'>Springston/Lincoln</option>
                        <option value='10'>Waihora</option>
                        <option value='11'>West Melton</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Darfield</option>
                        <option value='01'>Duns/Irwell/Leeston</option>
                        <option value='02'>Lincoln</option>
                        <option value='03'>Malvern Combined</option>
                        <option value='04'>Prebbleton Blue</option>
                        <option value='05'>Prebbleton White</option>
                        <option value='06'>Rolleston Black</option>
                        <option value='07'>Rolleston Gold</option>
                        <option value='08'>Southbridge</option>
                        <option value='09'>Springston/Lincoln</option>
                        <option value='10'>Waihora</option>
                        <option value='11'>West Melton</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "09":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>Duns/Irwell</option>
                        <option value='02'>Leeston</option>
                        <option value='03'>Lincoln</option>
                        <option value='04'>Malvern Combined</option>
                        <option value='05'>Prebbleton Blue</option>
                        <option value='06'>Prebbleton Green</option>
                        <option value='07'>Prebbleton Red</option>
                        <option value='08'>Prebbleton White</option>
                        <option value='09'>Rolleston Black</option>
                        <option value='10'>Rolleston Gold</option>
                        <option value='11'>Southbridge</option>
                        <option value='12'>Springston</option>
                        <option value='13'>Waihora</option>
                        <option value='14'>West Melton Blue</option>
                        <option value='15'>West Melton Gold</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>Duns/Irwell</option>
                        <option value='02'>Leeston</option>
                        <option value='03'>Lincoln</option>
                        <option value='04'>Malvern Combined</option>
                        <option value='05'>Prebbleton Blue</option>
                        <option value='06'>Prebbleton Green</option>
                        <option value='07'>Prebbleton Red</option>
                        <option value='08'>Prebbleton White</option>
                        <option value='09'>Rolleston Black</option>
                        <option value='10'>Rolleston Gold</option>
                        <option value='11'>Southbridge</option>
                        <option value='12'>Springston</option>
                        <option value='13'>Waihora</option>
                        <option value='14'>West Melton Blue</option>
                        <option value='15'>West Melton Gold</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "10":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>Darfield</option>
                        <option value='02'>Duns/Irwell</option>
                        <option value='03'>Leeston/Southbridge</option>
                        <option value='04'>Lincoln Black</option>
                        <option value='05'>Lincoln Red</option>
                        <option value='06'>Prebbleton Blue</option>
                        <option value='07'>Prebbleton Green</option>
                        <option value='08'>Prebbleton Red</option>
                        <option value='09'>Prebbleton White</option>
                        <option value='10'>Rolleston Black</option>
                        <option value='11'>Rolleston Blue</option>
                        <option value='12'>Rolleston Gold</option>
                        <option value='13'>Rolleston Red</option>
                        <option value='14'>Selwyn</option>
                        <option value='15'>Springston</option>
                        <option value='16'>Waihora Black</option>
                        <option value='17'>Waihora White</option>
                        <option value='18'>West Melton Blue</option>
                        <option value='19'>West Melton Gold</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>Darfield</option>
                        <option value='02'>Duns/Irwell</option>
                        <option value='03'>Leeston/Southbridge</option>
                        <option value='04'>Lincoln Black</option>
                        <option value='05'>Lincoln Red</option>
                        <option value='06'>Prebbleton Blue</option>
                        <option value='07'>Prebbleton Green</option>
                        <option value='08'>Prebbleton Red</option>
                        <option value='09'>Prebbleton White</option>
                        <option value='10'>Rolleston Black</option>
                        <option value='11'>Rolleston Blue</option>
                        <option value='12'>Rolleston Gold</option>
                        <option value='13'>Rolleston Red</option>
                        <option value='14'>Selwyn</option>
                        <option value='15'>Springston</option>
                        <option value='16'>Waihora Black</option>
                        <option value='17'>Waihora White</option>
                        <option value='18'>West Melton Blue</option>
                        <option value='19'>West Melton Gold</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "11":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>Darfield</option>
                        <option value='02'>Duns/Irwell</option>
                        <option value='03'>Kirwee</option>
                        <option value='04'>Leeston Black</option>
                        <option value='05'>Leeston Red</option>
                        <option value='06'>Leeston White</option>
                        <option value='07'>Lincoln Black</option>
                        <option value='08'>Lincoln Red</option>
                        <option value='09'>Prebbleton Blue</option>
                        <option value='10'>Prebbleton Green</option>
                        <option value='11'>Prebbleton Red</option>
                        <option value='12'>Prebbleton White</option>
                        <option value='13'>Rolleston Black</option>
                        <option value='14'>Rolleston Gold</option>
                        <option value='15'>Rolleston Red</option>
                        <option value='16'>Rolleston White</option>
                        <option value='17'>Selwyn</option>
                        <option value='18'>Sheffield</option>
                        <option value='19'>Southbridge</option>
                        <option value='20'>Springston Black</option>
                        <option value='21'>Springston Green</option>
                        <option value='22'>Waihora Black</option>
                        <option value='23'>Waihora Red</option>
                        <option value='24'>Waihora White</option>
                        <option value='25'>West Melton Blue</option>
                        <option value='26'>West Melton Gold</option>
                        <option value='27'>West Melton White</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Banks Peninsula</option>
                        <option value='01'>Darfield</option>
                        <option value='02'>Duns/Irwell</option>
                        <option value='03'>Kirwee</option>
                        <option value='04'>Leeston Black</option>
                        <option value='05'>Leeston Red</option>
                        <option value='06'>Leeston White</option>
                        <option value='07'>Lincoln Black</option>
                        <option value='08'>Lincoln Red</option>
                        <option value='09'>Prebbleton Blue</option>
                        <option value='10'>Prebbleton Green</option>
                        <option value='11'>Prebbleton Red</option>
                        <option value='12'>Prebbleton White</option>
                        <option value='13'>Rolleston Black</option>
                        <option value='14'>Rolleston Gold</option>
                        <option value='15'>Rolleston Red</option>
                        <option value='16'>Rolleston White</option>
                        <option value='17'>Selwyn</option>
                        <option value='18'>Sheffield</option>
                        <option value='19'>Southbridge</option>
                        <option value='20'>Springston Black</option>
                        <option value='21'>Springston Green</option>
                        <option value='22'>Waihora Black</option>
                        <option value='23'>Waihora Red</option>
                        <option value='24'>Waihora White</option>
                        <option value='25'>West Melton Blue</option>
                        <option value='26'>West Melton Gold</option>
                        <option value='27'>West Melton White</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
        case "12":
            echo "
                <div class='row homeTeamRowEnd rowfix'>
                    <div class='titleEnd'>Home Team</div>
                    <select id='homeTeam'>
                        <option value='00'>Banks Peninsula Gold</option>
                        <option value='01'>Banks Peninsula Maroon</option>
                        <option value='02'>Darfield Blue</option>
                        <option value='03'>Darfield Red</option>
                        <option value='04'>Diamond Harbour Blue</option>
                        <option value='05'>Diamond Harbour White</option>
                        <option value='06'>Duns/Irwell Black</option>
                        <option value='07'>Duns/Irwell Blue</option>
                        <option value='08'>Kirwee Gold</option>
                        <option value='09'>Kirwee Red</option>
                        <option value='10'>Kirwee White</option>
                        <option value='11'>Kirwee Yellow</option>
                        <option value='12'>Leeston Black</option>
                        <option value='13'>Leeston Red</option>
                        <option value='14'>Leeston White</option>
                        <option value='15'>Lincoln Black</option>
                        <option value='16'>Lincoln Green</option>
                        <option value='17'>Lincoln Red</option>
                        <option value='18'>Team Removed</option>
                        <option value='19'>Lincoln White</option>
                        <option value='20'>Prebbleton 1</option>
                        <option value='21'>Prebbleton 2</option>
                        <option value='22'>Prebbleton 3</option>
                        <option value='23'>Prebbleton 4</option>
                        <option value='24'>Prebbleton 5</option>
                        <option value='25'>Prebbleton 6</option>
                        <option value='26'>Prebbleton 7</option>
                        <option value='27'>Prebbleton 8</option>
                        <option value='28'>Rolleston Black</option>
                        <option value='29'>Rolleston Blue</option>
                        <option value='30'>Rolleston Gold</option>
                        <option value='31'>Rolleston Red</option>
                        <option value='32'>Rolleston White</option>
                        <option value='33'>Selwyn Black</option>
                        <option value='34'>Selwyn Green</option>
                        <option value='35'>Sheffield</option>
                        <option value='36'>Southbridge Black</option>
                        <option value='37'>Southbridge Blue</option>
                        <option value='38'>Southbridge White</option>
                        <option value='39'>Springston Black</option>
                        <option value='40'>Springston Green</option>
                        <option value='41'>Springston Red</option>
                        <option value='42'>Waihora Black</option>
                        <option value='43'>Waihora Blue</option>
                        <option value='44'>Waihora Gold</option>
                        <option value='45'>Waihora Red</option>
                        <option value='46'>Waihora White</option>
                        <option value='47'>West Melton Black</option>
                        <option value='48'>West Melton Blue</option>
                        <option value='49'>West Melton Gold</option>
                        <option value='50'>West Melton Red</option>
                        <option value='51'>West Melton White</option>
                        <option value='52'>Rolleston Silver</option>
                    </select>
                </div>
                
                <div class='row homeScoreRowEnd rowfix'>
                    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>
                    Defaulted <input type='checkbox' id='homeCheckbox' value='Defaulted'>
                </div>
                
                <div class='row awayTeamRowEnd rowfix'>
                    <div class='titleEnd'>Away Team</div>
                    <select id='awayTeam'>
                        <option value='00'>Banks Peninsula Gold</option>
                        <option value='01'>Banks Peninsula Maroon</option>
                        <option value='02'>Darfield Blue</option>
                        <option value='03'>Darfield Red</option>
                        <option value='04'>Diamond Harbour Blue</option>
                        <option value='05'>Diamond Harbour White</option>
                        <option value='06'>Duns/Irwell Black</option>
                        <option value='07'>Duns/Irwell Blue</option>
                        <option value='08'>Kirwee Gold</option>
                        <option value='09'>Kirwee Red</option>
                        <option value='10'>Kirwee White</option>
                        <option value='11'>Kirwee Yellow</option>
                        <option value='12'>Leeston Black</option>
                        <option value='13'>Leeston Red</option>
                        <option value='14'>Leeston White</option>
                        <option value='15'>Lincoln Black</option>
                        <option value='16'>Lincoln Green</option>
                        <option value='17'>Lincoln Red</option>
                        <option value='18'>Team Removed</option>
                        <option value='19'>Lincoln White</option>
                        <option value='20'>Prebbleton 1</option>
                        <option value='21'>Prebbleton 2</option>
                        <option value='22'>Prebbleton 3</option>
                        <option value='23'>Prebbleton 4</option>
                        <option value='24'>Prebbleton 5</option>
                        <option value='25'>Prebbleton 6</option>
                        <option value='26'>Prebbleton 7</option>
                        <option value='27'>Prebbleton 8</option>
                        <option value='28'>Rolleston Black</option>
                        <option value='29'>Rolleston Blue</option>
                        <option value='30'>Rolleston Gold</option>
                        <option value='31'>Rolleston Red</option>
                        <option value='32'>Rolleston White</option>
                        <option value='33'>Selwyn Black</option>
                        <option value='34'>Selwyn Green</option>
                        <option value='35'>Sheffield</option>
                        <option value='36'>Southbridge Black</option>
                        <option value='37'>Southbridge Blue</option>
                        <option value='38'>Southbridge White</option>
                        <option value='39'>Springston Black</option>
                        <option value='40'>Springston Green</option>
                        <option value='41'>Springston Red</option>
                        <option value='42'>Waihora Black</option>
                        <option value='43'>Waihora Blue</option>
                        <option value='44'>Waihora Gold</option>
                        <option value='45'>Waihora Red</option>
                        <option value='46'>Waihora White</option>
                        <option value='47'>West Melton Black</option>
                        <option value='48'>West Melton Blue</option>
                        <option value='49'>West Melton Gold</option>
                        <option value='50'>West Melton Red</option>
                        <option value='51'>West Melton White</option>
                        <option value='52'>Rolleston Silver</option>
                    </select>
                </div>
                
                <div class='row awayScoreRowEnd rowfix'>
                    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>
                    Defaulted <input type='checkbox' id='awayCheckbox' value='Defaulted'>
                </div>
                
                <div class='row datePickerRowEnd rowfix'>
                    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>
                </div>
                
                <div class='row submitScoreButtonRow'>
                    <button class='submitScoreButton' onClick='submitScore();'>Submit Score</button>
                </div>";
            break;
    }
} else {
    echo "<script>togglePassword();</script>";
}
    
?>
