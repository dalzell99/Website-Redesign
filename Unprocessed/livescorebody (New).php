<!-- Span used to display instructions on each page. Javascript will be used to populate this. -->
<span class='col-xs-48' id='instructions'>To upload a scoring play, tap the name of the team and the scoring play you want to upload, enter the minutes played and description of play (optional), then tap 'Send'. If you missed some plays, you can tap 'Change Score' and enter the current score and minutes played then tap 'Submit'. If you want to delete play/s, tap the plays you want to delete then tap 'Delete Selected Plays'. Tapping the 'Half Time' or 'Full Time' buttons will upload that play to the database. Once you have finished scoring the game, tap 'Stop Scoring' to be logged out.</span>

<div id='passwordContainer'>
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
</div>

<div id='gameSelectionContainer'>
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


    <script>setSelectedDivIndex();</script>

    <div class='row homeTeamRow rowfix teamList0'>
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

    <div class='rowawayTeamRow rowfix teamList0'>
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

    <div class='row selectGameButtonRow teamList0'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList1'>
        Home Team: 
        <select id='homeTeam'>
            <option value='00'>Hornby</option>
            <option value='01'>BDI</option>
            <option value='02'>University</option>
            <option value='03'>Sydenham</option>
        </select>
    </div>

    <div class='rowawayTeamRow rowfix teamList1'>
        Away Team: 
        <select id='awayTeam'>
            <option value='00'>Hornby</option>
            <option value='01'>BDI</option>
            <option value='02'>University</option>
            <option value='03'>Sydenham</option>
        </select>
    </div>

    <div class='row selectGameButtonRow teamList1'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList2'>
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

    <div class='row awayTeamRow rowfix teamList2'>
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

    <div class='row selectGameButtonRow teamList2'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList3'>
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

    <div class='row awayTeamRow rowfix teamList3'>
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

    <div class='row selectGameButtonRow teamList3'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList4'>
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

    <div class='row awayTeamRow rowfix teamList4'>
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

    <div class='row selectGameButtonRow teamList4'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList5'>
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

    <div class='row awayTeamRow rowfix teamList5'>
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

    <div class='row selectGameButtonRow teamList5'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList6'>
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

    <div class='row awayTeamRow rowfix teamList6'>
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

    <div class='row selectGameButtonRow teamList6'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList7'>
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

    <div class='row awayTeamRow rowfix teamList7'>
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

    <div class='row selectGameButtonRow teamList7'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList8'>
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

    <div class='row awayTeamRow rowfix teamList8'>
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

    <div class='row selectGameButtonRow teamList8'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList9'>
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

    <div class='row awayTeamRow rowfix teamList9'>
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

    <div class='row selectGameButtonRow teamList9'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList10'>
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

    <div class='row awayTeamRow rowfix teamList10'>
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

    <div class='row selectGameButtonRow teamList10'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList11'>
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

    <div class='row awayTeamRow rowfix teamList11'>
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

    <div class='row selectGameButtonRow teamList11'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>

    <div class='row homeTeamRow rowfix teamList12'>
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

    <div class='row awayTeamRow rowfix teamList12'>
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

    <div class='row selectGameButtonRow teamList12'>
        <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame();'>Select Game</button></div>
    </div>
</div>

<div id='liveScoreContainer'>
    // Every minute the user is live scoring a game, the current time is uploaded to the server.
    // A cron task then checks all the games every 5 minutes. If the last time scored is more than 5 minutes
    // old then the liveScored attribute is changed to 'n'.
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
    </script>
    
    <?php
    // Occurs after user has select the game they want to live score and the game has 
    // be found to exist and not being live scored already
    $gameID = $_GET["gameID"];
    // Get game info from database
    $game = getGame($gameID);
    // As the game already exists and the gameID is unique there will be only 1 game returned be getGame
    $row = mysqli_fetch_assoc($game);
  
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
    </div>";
    
    // The half and full time buttons are next. Clicking either will call methods to upload the half or full time play
    echo "
    <div class='row rowfix timingInfoLive'>
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
    ?>
</div>
