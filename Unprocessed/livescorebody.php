<form action="<?php htmlspecialchars($_SERVER['PHP_SELF']) ?>" method='post' class='password'>
    Password:
    <input type='text' name='password'>
    <br>
    <input type='submit'>
</form>

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

function createGame($gameID, $homeTeam, $awayTeam) {
    echo $gameID . " " . $homeTeam . " " . $awayTeam;
    $con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $sql = " INSERT INTO Game VALUES ('$gameID', '$homeTeam', '0', '$awayTeam', '0', '0', '', '', '', '$homeTeam', '12pm', '[]', 'n', 'n') ";

    echo $sql;
    if (mysqli_query($con, $sql)) {
        echo "<script>location.href='http://www.possumpam.com/rugby/livescore.php?gameID=" . $gameID . "'</script>";
    } else {
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
} else if (isset($_GET["div"])) {
    $div = $_GET["div"];
    echo '<script>hidePassword();showDivDropDown();setSelectedDivIndex(' . $div . ');</script>';
    switch ($div) {
        case "00":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Ashley</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">Celtic</option>
                   <option value=\"03\">Darfield</option>
                   <option value=\"04\">Glenmark</option>
                   <option value=\"05\">Hampstead</option>
                   <option value=\"06\">Hornby</option>
                   <option value=\"07\">Kaiapoi</option>
                   <option value=\"08\">Lincoln</option>
                   <option value=\"09\">Methven</option>
                   <option value=\"10\">Ohoka</option>
                   <option value=\"11\">Oxford</option>
                   <option value=\"12\">Prebbleton</option>
                   <option value=\"13\">Rakaia</option>
                   <option value=\"14\">Rolleston</option>
                   <option value=\"15\">Saracens</option>
                   <option value=\"16\">Southbridge</option>
                   <option value=\"17\">Southern</option>
                   <option value=\"18\">Waihora</option>
                   <option value=\"19\">West Melton</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Ashley</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">Celtic</option>
                   <option value=\"03\">Darfield</option>
                   <option value=\"04\">Glenmark</option>
                   <option value=\"05\">Hampstead</option>
                   <option value=\"06\">Hornby</option>
                   <option value=\"07\">Kaiapoi</option>
                   <option value=\"08\">Lincoln</option>
                   <option value=\"09\">Methven</option>
                   <option value=\"10\">Ohoka</option>
                   <option value=\"11\">Oxford</option>
                   <option value=\"12\">Prebbleton</option>
                   <option value=\"13\">Rakaia</option>
                   <option value=\"14\">Rolleston</option>
                   <option value=\"15\">Saracens</option>
                   <option value=\"16\">Southbridge</option>
                   <option value=\"17\">Southern</option>
                   <option value=\"18\">Waihora</option>
                   <option value=\"19\">West Melton</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "01":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Hornby</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">University</option>
                   <option value=\"03\">Sydenham</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Hornby</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">University</option>
                   <option value=\"03\">Sydenham</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "02":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">Darfield</option>
                   <option value=\"03\">Diamond Harbour</option>
                   <option value=\"04\">Kirwee</option>
                   <option value=\"05\">Lincoln</option>
                   <option value=\"06\">Prebbleton</option>
                   <option value=\"07\">Southbridge</option>
                   <option value=\"08\">Springston</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">Darfield</option>
                   <option value=\"03\">Diamond Harbour</option>
                   <option value=\"04\">Kirwee</option>
                   <option value=\"05\">Lincoln</option>
                   <option value=\"06\">Prebbleton</option>
                   <option value=\"07\">Southbridge</option>
                   <option value=\"08\">Springston</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "03":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">BDI</option>
                   <option value=\"01\">Hornby</option>
                   <option value=\"02\">Kirwee</option>
                   <option value=\"03\">Lincoln</option>
                   <option value=\"04\">Rolleston</option>
                   <option value=\"05\">Springston</option>
                   <option value=\"06\">Waihora</option>
                   <option value=\"07\">West Melton</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">BDI</option>
                   <option value=\"01\">Hornby</option>
                   <option value=\"02\">Kirwee</option>
                   <option value=\"03\">Lincoln</option>
                   <option value=\"04\">Rolleston</option>
                   <option value=\"05\">Springston</option>
                   <option value=\"06\">Waihora</option>
                   <option value=\"07\">West Melton</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "04":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">Celtic</option>
                   <option value=\"03\">Darfield</option>
                   <option value=\"04\">Kirwee</option>
                   <option value=\"05\">Lincoln Black</option>
                   <option value=\"06\">Lincoln Red</option>
                   <option value=\"07\">Prebbleton</option>
                   <option value=\"08\">Springston</option>
                   <option value=\"09\">Waihora</option>
                   <option value=\"10\">West Melton</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">BDI</option>
                   <option value=\"02\">Celtic</option>
                   <option value=\"03\">Darfield</option>
                   <option value=\"04\">Kirwee</option>
                   <option value=\"05\">Lincoln Black</option>
                   <option value=\"06\">Lincoln Red</option>
                   <option value=\"07\">Prebbleton</option>
                   <option value=\"08\">Springston</option>
                   <option value=\"09\">Waihora</option>
                   <option value=\"10\">West Melton</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "05":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Ashley/Oxford</option>
                   <option value=\"01\">Celtic</option>
                   <option value=\"02\">Hurunui</option>
                   <option value=\"03\">Kaiapoi</option>
                   <option value=\"04\">Lincoln</option>
                   <option value=\"05\">Malvern Combined</option>
                   <option value=\"06\">Methven/Rakaia</option>
                   <option value=\"07\">Rangiora High School</option>
                   <option value=\"08\">Waihora</option>
                   <option value=\"09\">West Melton/Rolleston</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Ashley/Oxford</option>
                   <option value=\"01\">Celtic</option>
                   <option value=\"02\">Hurunui</option>
                   <option value=\"03\">Kaiapoi</option>
                   <option value=\"04\">Lincoln</option>
                   <option value=\"05\">Malvern Combined</option>
                   <option value=\"06\">Methven/Rakaia</option>
                   <option value=\"07\">Rangiora High School</option>
                   <option value=\"08\">Waihora</option>
                   <option value=\"09\">West Melton/Rolleston</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "06":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Ashley/Amberley</option>
                   <option value=\"01\">Celtic</option>
                   <option value=\"02\">Hampstead</option>
                   <option value=\"03\">Hurunui</option>
                   <option value=\"04\">Kaiapoi</option>
                   <option value=\"05\">Lincoln</option>
                   <option value=\"06\">Malvern</option>
                   <option value=\"07\">Methven</option>
                   <option value=\"08\">Oxford</option>
                   <option value=\"09\">Prebbleton</option>
                   <option value=\"10\">Rolleston</option>
                   <option value=\"11\">Saracens</option>
                   <option value=\"12\">Waihora</option>
                   <option value=\"13\">West Melton/Southbridge</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Ashley/Amberley</option>
                   <option value=\"01\">Celtic</option>
                   <option value=\"02\">Hampstead</option>
                   <option value=\"03\">Hurunui</option>
                   <option value=\"04\">Kaiapoi</option>
                   <option value=\"05\">Lincoln</option>
                   <option value=\"06\">Malvern</option>
                   <option value=\"07\">Methven</option>
                   <option value=\"08\">Oxford</option>
                   <option value=\"09\">Prebbleton</option>
                   <option value=\"10\">Rolleston</option>
                   <option value=\"11\">Saracens</option>
                   <option value=\"12\">Waihora</option>
                   <option value=\"13\">West Melton/Southbridge</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "07":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Duns/Irwell/Leeston</option>
                   <option value=\"01\">Lincoln/Springston</option>
                   <option value=\"02\">Malvern Combined</option>
                   <option value=\"03\">Prebbleton</option>
                   <option value=\"04\">Rolleston Black</option>
                   <option value=\"05\">Rolleston Gold</option>
                   <option value=\"06\">Waihora</option>
                   <option value=\"07\">West Melton</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Duns/Irwell/Leeston</option>
                   <option value=\"01\">Lincoln/Springston</option>
                   <option value=\"02\">Malvern Combined</option>
                   <option value=\"03\">Prebbleton</option>
                   <option value=\"04\">Rolleston Black</option>
                   <option value=\"05\">Rolleston Gold</option>
                   <option value=\"06\">Waihora</option>
                   <option value=\"07\">West Melton</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "08":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Darfield</option>
                   <option value=\"01\">Duns/Irwell/Leeston</option>
                   <option value=\"02\">Lincoln</option>
                   <option value=\"03\">Malvern Combined</option>
                   <option value=\"04\">Prebbleton Blue</option>
                   <option value=\"05\">Prebbleton White</option>
                   <option value=\"06\">Rolleston Black</option>
                   <option value=\"07\">Rolleston Gold</option>
                   <option value=\"08\">Southbridge</option>
                   <option value=\"09\">Springston/Lincoln</option>
                   <option value=\"10\">Waihora</option>
                   <option value=\"11\">West Melton</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Darfield</option>
                   <option value=\"01\">Duns/Irwell/Leeston</option>
                   <option value=\"02\">Lincoln</option>
                   <option value=\"03\">Malvern Combined</option>
                   <option value=\"04\">Prebbleton Blue</option>
                   <option value=\"05\">Prebbleton White</option>
                   <option value=\"06\">Rolleston Black</option>
                   <option value=\"07\">Rolleston Gold</option>
                   <option value=\"08\">Southbridge</option>
                   <option value=\"09\">Springston/Lincoln</option>
                   <option value=\"10\">Waihora</option>
                   <option value=\"11\">West Melton</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "09":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">Duns/Irwell</option>
                   <option value=\"02\">Leeston</option>
                   <option value=\"03\">Lincoln</option>
                   <option value=\"04\">Malvern Combined</option>
                   <option value=\"05\">Prebbleton Blue</option>
                   <option value=\"06\">Prebbleton Green</option>
                   <option value=\"07\">Prebbleton Red</option>
                   <option value=\"08\">Prebbleton White</option>
                   <option value=\"09\">Rolleston Black</option>
                   <option value=\"10\">Rolleston Gold</option>
                   <option value=\"11\">Southbridge</option>
                   <option value=\"12\">Springston</option>
                   <option value=\"13\">Waihora</option>
                   <option value=\"14\">West Melton Blue</option>
                   <option value=\"15\">West Melton Gold</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">Duns/Irwell</option>
                   <option value=\"02\">Leeston</option>
                   <option value=\"03\">Lincoln</option>
                   <option value=\"04\">Malvern Combined</option>
                   <option value=\"05\">Prebbleton Blue</option>
                   <option value=\"06\">Prebbleton Green</option>
                   <option value=\"07\">Prebbleton Red</option>
                   <option value=\"08\">Prebbleton White</option>
                   <option value=\"09\">Rolleston Black</option>
                   <option value=\"10\">Rolleston Gold</option>
                   <option value=\"11\">Southbridge</option>
                   <option value=\"12\">Springston</option>
                   <option value=\"13\">Waihora</option>
                   <option value=\"14\">West Melton Blue</option>
                   <option value=\"15\">West Melton Gold</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "10":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">Darfield</option>
                   <option value=\"02\">Duns/Irwell</option>
                   <option value=\"03\">Leeston/Southbridge</option>
                   <option value=\"04\">Lincoln Black</option>
                   <option value=\"05\">Lincoln Red</option>
                   <option value=\"06\">Prebbleton Blue</option>
                   <option value=\"07\">Prebbleton Green</option>
                   <option value=\"08\">Prebbleton Red</option>
                   <option value=\"09\">Prebbleton White</option>
                   <option value=\"10\">Rolleston Black</option>
                   <option value=\"11\">Rolleston Blue</option>
                   <option value=\"12\">Rolleston Gold</option>
                   <option value=\"13\">Rolleston Red</option>
                   <option value=\"14\">Selwyn</option>
                   <option value=\"15\">Springston</option>
                   <option value=\"16\">Waihora Black</option>
                   <option value=\"17\">Waihora White</option>
                   <option value=\"18\">West Melton Blue</option>
                   <option value=\"19\">West Melton Gold</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">Darfield</option>
                   <option value=\"02\">Duns/Irwell</option>
                   <option value=\"03\">Leeston/Southbridge</option>
                   <option value=\"04\">Lincoln Black</option>
                   <option value=\"05\">Lincoln Red</option>
                   <option value=\"06\">Prebbleton Blue</option>
                   <option value=\"07\">Prebbleton Green</option>
                   <option value=\"08\">Prebbleton Red</option>
                   <option value=\"09\">Prebbleton White</option>
                   <option value=\"10\">Rolleston Black</option>
                   <option value=\"11\">Rolleston Blue</option>
                   <option value=\"12\">Rolleston Gold</option>
                   <option value=\"13\">Rolleston Red</option>
                   <option value=\"14\">Selwyn</option>
                   <option value=\"15\">Springston</option>
                   <option value=\"16\">Waihora Black</option>
                   <option value=\"17\">Waihora White</option>
                   <option value=\"18\">West Melton Blue</option>
                   <option value=\"19\">West Melton Gold</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "11":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">Darfield</option>
                   <option value=\"02\">Duns/Irwell</option>
                   <option value=\"03\">Kirwee</option>
                   <option value=\"04\">Leeston Black</option>
                   <option value=\"05\">Leeston Red</option>
                   <option value=\"06\">Leeston White</option>
                   <option value=\"07\">Lincoln Black</option>
                   <option value=\"08\">Lincoln Red</option>
                   <option value=\"09\">Prebbleton Blue</option>
                   <option value=\"10\">Prebbleton Green</option>
                   <option value=\"11\">Prebbleton Red</option>
                   <option value=\"12\">Prebbleton White</option>
                   <option value=\"13\">Rolleston Black</option>
                   <option value=\"14\">Rolleston Gold</option>
                   <option value=\"15\">Rolleston Red</option>
                   <option value=\"16\">Rolleston White</option>
                   <option value=\"17\">Selwyn</option>
                   <option value=\"18\">Sheffield</option>
                   <option value=\"19\">Southbridge</option>
                   <option value=\"20\">Springston Black</option>
                   <option value=\"21\">Springston Green</option>
                   <option value=\"22\">Waihora Black</option>
                   <option value=\"23\">Waihora Red</option>
                   <option value=\"24\">Waihora White</option>
                   <option value=\"25\">West Melton Blue</option>
                   <option value=\"26\">West Melton Gold</option>
                   <option value=\"27\">West Melton White</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Banks Peninsula</option>
                   <option value=\"01\">Darfield</option>
                   <option value=\"02\">Duns/Irwell</option>
                   <option value=\"03\">Kirwee</option>
                   <option value=\"04\">Leeston Black</option>
                   <option value=\"05\">Leeston Red</option>
                   <option value=\"06\">Leeston White</option>
                   <option value=\"07\">Lincoln Black</option>
                   <option value=\"08\">Lincoln Red</option>
                   <option value=\"09\">Prebbleton Blue</option>
                   <option value=\"10\">Prebbleton Green</option>
                   <option value=\"11\">Prebbleton Red</option>
                   <option value=\"12\">Prebbleton White</option>
                   <option value=\"13\">Rolleston Black</option>
                   <option value=\"14\">Rolleston Gold</option>
                   <option value=\"15\">Rolleston Red</option>
                   <option value=\"16\">Rolleston White</option>
                   <option value=\"17\">Selwyn</option>
                   <option value=\"18\">Sheffield</option>
                   <option value=\"19\">Southbridge</option>
                   <option value=\"20\">Springston Black</option>
                   <option value=\"21\">Springston Green</option>
                   <option value=\"22\">Waihora Black</option>
                   <option value=\"23\">Waihora Red</option>
                   <option value=\"24\">Waihora White</option>
                   <option value=\"25\">West Melton Blue</option>
                   <option value=\"26\">West Melton Gold</option>
                   <option value=\"27\">West Melton White</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
        case "12":
            echo"<select id=\"homeTeam\">
                   <option value=\"00\">Banks Peninsula Gold</option>
                   <option value=\"01\">Banks Peninsula Maroon</option>
                   <option value=\"02\">Darfield Blue</option>
                   <option value=\"03\">Darfield Red</option>
                   <option value=\"04\">Diamond Harbour Blue</option>
                   <option value=\"05\">Diamond Harbour White</option>
                   <option value=\"06\">Duns/Irwell Black</option>
                   <option value=\"07\">Duns/Irwell Blue</option>
                   <option value=\"08\">Kirwee Gold</option>
                   <option value=\"09\">Kirwee Red</option>
                   <option value=\"10\">Kirwee White</option>
                   <option value=\"11\">Kirwee Yellow</option>
                   <option value=\"12\">Leeston Black</option>
                   <option value=\"13\">Leeston Red</option>
                   <option value=\"14\">Leeston White</option>
                   <option value=\"15\">Lincoln Black</option>
                   <option value=\"16\">Lincoln Green</option>
                   <option value=\"17\">Lincoln Red</option>
                   <option value=\"18\">Team Removed</option>
                   <option value=\"19\">Lincoln White</option>
                   <option value=\"20\">Prebbleton 1</option>
                   <option value=\"21\">Prebbleton 2</option>
                   <option value=\"22\">Prebbleton 3</option>
                   <option value=\"23\">Prebbleton 4</option>
                   <option value=\"24\">Prebbleton 5</option>
                   <option value=\"25\">Prebbleton 6</option>
                   <option value=\"26\">Prebbleton 7</option>
                   <option value=\"27\">Prebbleton 8</option>
                   <option value=\"28\">Rolleston Black</option>
                   <option value=\"29\">Rolleston Blue</option>
                   <option value=\"30\">Rolleston Gold</option>
                   <option value=\"31\">Rolleston Red</option>
                   <option value=\"32\">Rolleston White</option>
                   <option value=\"33\">Selwyn Black</option>
                   <option value=\"34\">Selwyn Green</option>
                   <option value=\"35\">Sheffield</option>
                   <option value=\"36\">Southbridge Black</option>
                   <option value=\"37\">Southbridge Blue</option>
                   <option value=\"38\">Southbridge White</option>
                   <option value=\"39\">Springston Black</option>
                   <option value=\"40\">Springston Green</option>
                   <option value=\"41\">Springston Red</option>
                   <option value=\"42\">Waihora Black</option>
                   <option value=\"43\">Waihora Blue</option>
                   <option value=\"44\">Waihora Gold</option>
                   <option value=\"45\">Waihora Red</option>
                   <option value=\"46\">Waihora White</option>
                   <option value=\"47\">West Melton Black</option>
                   <option value=\"48\">West Melton Blue</option>
                   <option value=\"49\">West Melton Gold</option>
                   <option value=\"50\">West Melton Red</option>
                   <option value=\"51\">West Melton White</option>
                   <option value=\"52\">Rolleston Silver</option>
                 </select>
                 <br />\n
                 <select id=\"awayTeam\">
                   <option value=\"00\">Banks Peninsula Gold</option>
                   <option value=\"01\">Banks Peninsula Maroon</option>
                   <option value=\"02\">Darfield Blue</option>
                   <option value=\"03\">Darfield Red</option>
                   <option value=\"04\">Diamond Harbour Blue</option>
                   <option value=\"05\">Diamond Harbour White</option>
                   <option value=\"06\">Duns/Irwell Black</option>
                   <option value=\"07\">Duns/Irwell Blue</option>
                   <option value=\"08\">Kirwee Gold</option>
                   <option value=\"09\">Kirwee Red</option>
                   <option value=\"10\">Kirwee White</option>
                   <option value=\"11\">Kirwee Yellow</option>
                   <option value=\"12\">Leeston Black</option>
                   <option value=\"13\">Leeston Red</option>
                   <option value=\"14\">Leeston White</option>
                   <option value=\"15\">Lincoln Black</option>
                   <option value=\"16\">Lincoln Green</option>
                   <option value=\"17\">Lincoln Red</option>
                   <option value=\"18\">Team Removed</option>
                   <option value=\"19\">Lincoln White</option>
                   <option value=\"20\">Prebbleton 1</option>
                   <option value=\"21\">Prebbleton 2</option>
                   <option value=\"22\">Prebbleton 3</option>
                   <option value=\"23\">Prebbleton 4</option>
                   <option value=\"24\">Prebbleton 5</option>
                   <option value=\"25\">Prebbleton 6</option>
                   <option value=\"26\">Prebbleton 7</option>
                   <option value=\"27\">Prebbleton 8</option>
                   <option value=\"28\">Rolleston Black</option>
                   <option value=\"29\">Rolleston Blue</option>
                   <option value=\"30\">Rolleston Gold</option>
                   <option value=\"31\">Rolleston Red</option>
                   <option value=\"32\">Rolleston White</option>
                   <option value=\"33\">Selwyn Black</option>
                   <option value=\"34\">Selwyn Green</option>
                   <option value=\"35\">Sheffield</option>
                   <option value=\"36\">Southbridge Black</option>
                   <option value=\"37\">Southbridge Blue</option>
                   <option value=\"38\">Southbridge White</option>
                   <option value=\"39\">Springston Black</option>
                   <option value=\"40\">Springston Green</option>
                   <option value=\"41\">Springston Red</option>
                   <option value=\"42\">Waihora Black</option>
                   <option value=\"43\">Waihora Blue</option>
                   <option value=\"44\">Waihora Gold</option>
                   <option value=\"45\">Waihora Red</option>
                   <option value=\"46\">Waihora White</option>
                   <option value=\"47\">West Melton Black</option>
                   <option value=\"48\">West Melton Blue</option>
                   <option value=\"49\">West Melton Gold</option>
                   <option value=\"50\">West Melton Red</option>
                   <option value=\"51\">West Melton White</option>
                   <option value=\"52\">Rolleston Silver</option>
                 </select><br />\n";
            echo "<button id=\"select\" onClick=\"selectGame()\">Select Game</button>";
            break;
    }
} else if (isset($_GET["play"])) {
    $scoringPlay = $_GET["team"] . $_GET["play"];
    $minutesPlayed = $_GET["minutesPlayed"];
    $description = $_GET["description"];
    $homeScore = $row['homeTeamScore'];
    $awayScore = $row['awayTeamScore'];
    echo $_GET["gameID"] . " homescore:" . $homeScore . " awayscore:" . $awayScore . " mins:" . $minutesPlayed . " descr:" . $description . " scpl:" . $scoringPlay;
    switch ($_GET["play"]) {
        case "Try":
            if ($_GET["team"] == "home") { $homeScore = intval($homeScore) + 5; }
            else { $awayScore = intval($awayScore) + 5; }
            break;
        case "Penalty":
        case "DropGoal":
            if ($_GET["team"] == "home") { $homeScore = intval($homeScore) + 3; }
            else { $awayScore = intval($awayScore) + 3; }
            break;
        case "Conversion":
            if ($_GET["team"] == "home") { $homeScore = intval($homeScore) + 2; }
            else { $awayScore = intval($awayScore) + 2; }
            break;
    }
    echo $_GET["gameID"] . " homescore:" . $homeScore . " awayscore:" . $awayScore . " mins:" . $minutesPlayed . " descr:" . $description . " scpl:" . $scoringPlay;
    //uploadScoringPlay($_GET["gameID"], $homeScore, $awayScore, $minutesPlayed, $description, $scoringPlay);
    //echo "<script>location.href='" . $_SERVER[PHP_SELF] . "?gameID=" . $_GET['gameID'] . "'</script>";
} else if (isset($_GET["gameID"])) {
    $gameID = $_GET["gameID"];
    if (gameExists($gameID)) {
        echo '<script>hidePassword();</script>';
        $game = getGame($gameID);
        $row = mysqli_fetch_assoc($game);
        echo "<div class='row rowfix teamInfo'>";
        echo "    <div class='homeTeamName col-xs-24' onclick='toggleSelectedTeam(this, `home`)'>" . $row['homeTeamName'] . "</div>";
        echo "    <div class='awayTeamName col-xs-24' onclick='toggleSelectedTeam(this, `away`)'>" . $row['awayTeamName'] . "</div>";
        echo "</div>";
        echo "<div class='row rowfix teamInfo'>";
        echo "    <div class='homeTeamScore col-xs-24'>" . $row['homeTeamScore'] . "</div>";
        echo "    <div class='awayTeamScore col-xs-24'>" . $row['awayTeamScore'] . "</div>";
        echo "</div>";
        
        $gameDateString = substr($gameID, 0, 8);
        $gameDateDate = new DateTime($gameDateString);
        $minutesOrTime = ($row['minutesPlayed'] == '0' ? date_format($gameDateDate, 'D jS M') . " " . $row['time'] : $row['minutesPlayed'] . " mins");
        echo "<div class='row rowfix gameInfo'>";
        echo "    <div class='locationLiveScore col-xs-24'>" . $row['location'] . "</div>";
        echo "    <div class='minutesOrTime col-xs-24'>" . $minutesOrTime . "</div>";
        echo "</div>";
        
        echo "<div class='row rowfix scoringPlayInfo'>";
        echo "    <div class='scoringPlay try col-xs-23' onclick='toggleSelectedScoringPlay(this, `Try`)'>Try</div>";
        echo "    <div class='scoringPlay conversion col-xs-23' onclick='toggleSelectedScoringPlay(this, `Conversion`)'>Conversion</div>";
        echo "</div>";
        echo "<div class='row rowfix scoringPlayInfo'>";
        echo "    <div class='scoringPlay penalty col-xs-23' onclick='toggleSelectedScoringPlay(this, `Penalty`)'>Penalty</div>";
        echo "    <div class='scoringPlay dropGoal col-xs-23' onclick='toggleSelectedScoringPlay(this, `DropGoal`)'>Drop Goal</div>";
        echo "</div>";
        
        echo "<div class='row rowfix scoringInfo'>";
        echo "    <div class='minutesPlayed col-xs-16'>Minutes Played: </div>";
        echo "    <textarea rows='1' class='minutesPlayedInput col-xs-31'></textarea>";
        echo "</div>";
        echo "<div class='row rowfix scoringInfo'>";
        echo "    <div class='description col-xs-16'>Description: </div>";
        echo "    <textarea rows='3' class='descriptionInput col-xs-31'></textarea>";
        echo "</div>";
        echo "<div class='row rowfix scoringInfo'>";
        echo "    <button class='submit col-xs-46' onclick='uploadScoringPlay(" . $_GET['gameID'] . ")'>Send</div>";
        echo "</div>";
        
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
            
            echo "<div class='" . $i . "' onclick='deleteScoringPlay(" . $gameID . ", " . $i . ", \"" . substr($scoringPlay, 0, 4) . "\", \"" . substr($scoringPlay, 4) . "\", " . intval($row['homeTeamScore']) . ", " . intval($row['awayTeamScore']) . ")'>\n";

            if ($play == 'Time') {
                echo "<table class='time'>\n";
                if ($team == 'half') {
                    echo "<tr><td>Half Time</td></tr>\n";
                } else {
                    echo "<tr><td>Full Time</td></tr>\n";
                }
            } else if ($team == 'strt') {
                echo "<table class='time'>\n";
                echo "<tr><td>Game Started</td></tr>\n";
            } else if ($team == 'updt') {
                echo "<table class='time'>\n";
                echo "<tr><td>Score Updated to " . intval(substr($play, 0, 2)) . " - " . intval(substr($play, 2, 2)) . "</td></tr>\n";
            } else {
                echo "<table class='scoringPlay'>\n<tr>\n<td>" . $scoringPlayInfo[0] . "'</td>\n<td>" . $team . "</td>\n<td>" . $play . "</td>\n</tr>\n</table>\n<table><tr><td>" . $scoringPlayInfo[2] . "</td></tr>";
            }
            echo "</table>\n</div>\n<br />\n\n";
        }
    } else {
        // Ask user if the teams are correct.
       createGame($_GET['gameID'], $_GET['homeTeam'], $_GET['awayTeam']);
    }
} 
    
?>
