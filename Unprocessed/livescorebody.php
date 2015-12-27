<form action="<?php htmlspecialchars($_SERVER['PHP_SELF']) ?>" method='post' class='password'>
    <div class='row rowfix'>
        <div class='passwordInputRow'>Password: <input type='text' name='password' class='passwordInput'></div>
    </div>
    <div class='row rowfix'>
        <button type='submit' class='passwordFormButton'>Submit</button>
    </div>
</form>

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

function getGame($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    $result = mysqli_query($con, " SELECT * FROM Game WHERE GameID = '$gameID' ");

    mysqli_query($con, " UPDATE Game SET liveScored = 'y' WHERE GameID = '$gameID' ");

    return $result;
}

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

    // Update game element with new values
    $update = " UPDATE Game SET homeTeamScore = '$homeScore', awayTeamScore ='$awayScore', minutesPlayed='$minutesPlayed', scoringPlays = '$updatedScoringPlays' WHERE GameID = '$gameID' ";

    mysqli_query($con, $update);

    mysqli_close($con);
}

function stopScoring($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    // Update game element with new values
    $update = " UPDATE Game SET liveScored = 'n' WHERE GameID = '$gameID' ";

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

    if (mysqli_query($con, $sql)) {
        echo "<script>location.href='http://www.possumpam.com/rugby/livescore.php?gameID=" . $gameID . "&liveScore=true'</script>";
    } else {
        echo "Error. There was a problem creating the game. Please send me an email by clicking <a href='mailto:cfd19@hotmail.co.nz'>here</a>";
    }

    mysqli_close($con);
}
      
function isBeingLiveScored($gameID) {
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    $result = mysqli_query($con, " SELECT * FROM Game WHERE GameID = '$gameID' ");
    $row = mysqli_fetch_assoc($result);
    if ($row['liveScored'] == 'n') {
        return false;
    } else {
        return true;
    }
}

if (isset($_POST['password'])) {
    if ($_POST['password'] == '12345') {
        // refresh the page with div GET variable set to 00
        echo '<script>location.href = window.location.href + "?div=00&gameSelection=true";</script>';
    } else {
        echo 'The password is wrong. Please try again.';
    }
} else if (isset($_GET["stopScoring"])) {
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>You are being logged out</div></div>";
    stopScoring($_GET["gameID"]);
    echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?div=00&gameSelection=true'</script>";
} else if (isset($_GET["gameSelection"])) {
    $div = $_GET["div"];
    echo '<script>showDivDropDown();setSelectedDivIndex(' . $div . ');</script>';
    switch ($div) {
        case "00":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "01":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
                    <select id='homeTeam'>
                        <option value='00'>Hornby</option>
                        <option value='01'>BDI</option>
                        <option value='02'>University</option>
                        <option value='03'>Sydenham</option>
                    </select>
                </div>
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
                    <select id='awayTeam'>
                        <option value='00'>Hornby</option>
                        <option value='01'>BDI</option>
                        <option value='02'>University</option>
                        <option value='03'>Sydenham</option>
                    </select>
                </div>
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "02":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "03":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "04":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "05":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "06":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "07":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "08":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "09":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "10":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "11":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
        case "12":
            echo "
                <div class='row homeTeamRow rowfix'>
                    Home Team: 
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
                
                <div class='row awayTeamRow rowfix'>
                    Away Team: 
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
                
                <div class='row selectGameButtonRow'>
                    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
                </div>";
            break;
    }
} else if (isset($_GET["changeScore"])) {
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>The score is being changed</div></div>";
    $minutesPlayed = $_GET["minutesPlayed"];
    if (strlen($_GET["homeScore"]) == 1) { $homeScore = '0' . $_GET["homeScore"]; } else { $homeScore = $_GET["homeScore"]; };
    if (strlen($_GET["awayScore"]) == 1) { $awayScore = '0' . $_GET["awayScore"]; } else { $awayScore = $_GET["awayScore"]; };
    $gameID = $_GET["gameID"];
    $scoringPlay = updt . $homeScore . $awayScore;
    uploadScoringPlay($gameID, $homeScore, $awayScore, $minutesPlayed, '', $scoringPlay);
    echo '<script>window.open("http://possumpam.com/rugby/livescore.php?gameID=' . $gameID . '", "_self");</script>';
} else if (isset($_GET["uploadPlay"])) {
    echo "<div class='row'><div class='col-xs-48 playuploadmessage'>Play is being uploaded</div></div>";
    $scoringPlay = $_GET["team"] . $_GET["play"];
    $minutesPlayed = $_GET["minutesPlayed"];
    $description = $_GET["description"];
    $homeScore = intval($_GET["homeScore"]);
    $awayScore = intval($_GET["awayScore"]);
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
    uploadScoringPlay($_GET["gameID"], $homeScore, $awayScore, $minutesPlayed, $description, $scoringPlay);
    echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?gameID=" . $_GET['gameID'] . "'</script>";
} else if (isset($_GET["checkGame"])) {
    if (gameExists($_GET["gameID"])) {
        if (isBeingLiveScored($_GET["gameID"]) == true) {
            $div = substr($_GET["gameID"], 12, 2);
            echo "<script>alert('Someone else is already live scoring this game.');
                  window.open('http://possumpam.com/rugby/livescore.php?div=" . $div . "', '_self');</script>";
        } else {
            echo "<script>window.open('http://possumpam.com/rugby/livescore.php?gameID=" . 
                  $_GET["gameID"] . "&homeTeam=" . $_GET["homeTeam"] . "&awayTeam=" . 
                  $_GET["awayTeam"] . "&liveScore=true', '_self');</script>";
        }
    } else {
        createGame($_GET['gameID'], $_GET['homeTeam'], $_GET['awayTeam']);
    }
} else if (isset($_GET["liveScore"])) {
    $gameID = $_GET["gameID"];
    $game = getGame($gameID);
    $row = mysqli_fetch_assoc($game);
  
    echo "<div class='row'>
              <div class='stopScoringDiv col-xs-46'>
                  <button type='submit' onclick='stopScoring(" . $gameID . ")'>Stop Scoring</button>
              </div>
          </div>
          
          <div class='row changeScoreFormButtonRow rowfix'>
              <button type='button' class='changeScoreFormToggleButton col-xs-48' onclick='toggleChangeScoreForm();'>Change Score</button>
          </div>
          
          <div class='row rowfix'>
              <div class='changeScoreForm col-xs-48'>
                  " . $row['homeTeamName'] . ": <input type='text' id='newhomescore'><br>
                  " . $row['awayTeamName'] . ": <input type='text' id='newawayscore'><br>
                  Minutes Played: <input type='number' id='newminutesplayed'><br>
                  <input type='submit' onclick='changeScore(" . $gameID . ")'>
              </div>
          </div>";
    
    echo "<div class='row rowfix timingInfoLive'>
              <button type='button' class='halftime col-xs-23' onclick='sendHalfTime(" . $_GET['gameID'] . "," . 
                  $row['homeTeamScore'] . ","  . $row['awayTeamScore'] . ")'>Half Time</button>
              <button type='button' class='fulltime col-xs-23' onclick='sendFullTime(" . $_GET['gameID'] . "," . 
                  $row['homeTeamScore'] . "," . $row['awayTeamScore'] . ")'>Full Time</button>
          </div>";
    
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
    
    echo "<div class='row rowfix teamInfoLive'>";
    echo "    <div class='homeTeamName col-xs-24' onclick='toggleSelectedTeam(this, `home`)'>" . $row['homeTeamName'] . "</div>";
    echo "    <div class='awayTeamName col-xs-24' onclick='toggleSelectedTeam(this, `away`)'>" . $row['awayTeamName'] . "</div>";
    echo "</div>";
    echo "<div class='row rowfix scoreInfoLive'>";
    echo "    <div class='homeTeamScore col-xs-24'>" . $homeScore . "</div>";
    echo "    <div class='awayTeamScore col-xs-24'>" . $awayScore . "</div>";
    echo "</div>";

    /*
    $gameDateString = substr($gameID, 0, 8);
    $gameDateDate = new DateTime($gameDateString);
    $minutesOrTime = ($row['minutesPlayed'] == '0' ? date_format($gameDateDate, 'D jS M') . " " . $row['time'] : $row['minutesPlayed'] . " mins");
    echo "<div class='row rowfix gameInfoLive'>";
    echo "    <div class='locationLiveScore col-xs-24'>" . $row['location'] . "</div>";
    echo "    <div class='minutesOrTime col-xs-24'>" . $minutesOrTime . "</div>";
    echo "</div>";
    */
    
    echo "<div class='row rowfix scoringPlayInfoLive'>";
    echo "    <div class='scoringPlayLive try col-xs-24' onclick='toggleSelectedScoringPlay(this, `Try`)'>Try</div>";
    echo "    <div class='scoringPlayLive conversion col-xs-24' onclick='toggleSelectedScoringPlay(this, `Conversion`)'>Conversion</div>";
    echo "</div>";
    echo "<div class='row rowfix scoringPlayInfoLive'>";
    echo "    <div class='scoringPlayLive penalty col-xs-24' onclick='toggleSelectedScoringPlay(this, `Penalty`)'>Penalty</div>";
    echo "    <div class='scoringPlayLive dropGoal col-xs-24' onclick='toggleSelectedScoringPlay(this, `DropGoal`)'>Drop Goal</div>";
    echo "</div>";

    echo "<div class='row rowfix scoringInfoLive'>";
    echo "    <div class='minutesPlayedLive col-xs-17'>Minutes Played</div>";
    echo "    <textarea rows='1' class='minutesPlayedInput col-xs-31'></textarea>";
    echo "</div>";
    echo "<div class='row rowfix scoringInfoLive'>";
    echo "    <div class='descriptionLive col-xs-17'>Description</div>";
    echo "    <textarea rows='3' class='descriptionInput col-xs-31'></textarea>";
    echo "</div>";
    echo "<div class='row rowfix scoringInfoLive'>";
    echo "    <button type='submit' class='submit col-xs-48' onclick='uploadScoringPlay(" . $_GET['gameID'] . ", " . $row['homeTeamScore'] . ", " . $row['awayTeamScore'] . ")'>Send</button>";
    echo "</div>";

    echo "<div class='row scoringPlays rowfix'>";
    $allScoringPlays = json_decode($row['scoringPlays'], false);
    $homeScoreCurrent = 0;
    $awayScoreCurrent = 0;
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
            echo "<div class='row time rowfix'>";
            echo "<div class='col-xs-48'>" . $homeScoreCurrent . "-" . $awayScoreCurrent . "</div>";
            echo "<div class='col-xs-48'>";
            if ($team == 'half') {
                echo "Half Time";
            } else {
                echo "Full Time";
            }
            echo "</div></div>";
        } else if ($team == 'strt') {
            echo "<div class='row rowfix'><div class='col-xs-48'>Game Started</div></div>";
        } else if ($team == 'updt') {
            if (intval(substr($play, 0, 2)) == 2) {
                $scoreString = "Game Update: " . $row['awayTeamName'] . " defaulted";
            } else if (intval(substr($play, 0, 2)) == 1) {
                $scoreString = "Game Update: " . $row['homeTeamName'] . " defaulted";
            } else {
                $scoreString = "Score Update: " . intval(substr($play, 0, 2)) . " - " . intval(substr($play, 2, 2));
            }
            echo "<div class='row update rowfix'><div class='col-xs-48'>" . $scoreString . "</div></div>";
            $homeScoreCurrent = intval(substr($play, 0, 2));
            $awayScoreCurrent = intval(substr($play, 2, 2));
        } else {
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
            echo "<div class='row scoringPlay rowfix'>";
            echo "<div class='col-xs-20 homeScoringPlay'>";
            if ($team == 'home') { echo $play; }
            echo "</div><div class='col-xs-8 minutesPlayed'>" . $homeScoreCurrent . "-" . $awayScoreCurrent . " (" . $scoringPlayInfo[0] . "')</div>";
            echo "<div class='col-xs-20 awayScoringPlay'>";
            if ($team == 'away') { echo $play; }
            echo "</div>";

            echo "<div class='col-xs-48'>" . $scoringPlayInfo[2] . "</div>";
            echo "</div>";

        }
    }
} else {
  echo "<script>togglePassword();</script>";
}
    
?>
