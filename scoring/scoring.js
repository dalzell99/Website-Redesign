var backEvents = [];
var NEVER = 100000;
var counter = 0;
var allTeams = [];
var allDivs = [];

$(document).ready(function () {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/getteamsdivs.php', {},
        function (response) {
            var teams = response[0];
            var divs = response[1];

            for (var t = 0; t < divs.length; t += 1) {
                var divID = parseInt(divs[t].divisionID);
                allTeams[divID] = [];
                allDivs[divID] = divs[t];
                allDivs[divID].divisionID = pad(allDivs[divID].divisionID, 2);
            }

            for (var n = 0; n < teams.length; n += 1) {
                allTeams[parseInt(teams[n].division)].push(teams[n]);
            }
        }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while retrieving info from database. Please try again later. If problem persists, use the contact form");
    });

    post.always(function () {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.instructions == 'false') {
                $("#instructions").hide();
            }
            
            if (localStorage.lastTimeUpdatesChecked == null) {
                localStorage.lastTimeUpdatesChecked = new Date().toUTCString();
            }
            
            if (localStorage.userID == null) {
                localStorage.userID = pad(Math.floor(Math.random() * 100000000), 8);
            }
            
            if (sessionStorage.scoringGameID == null) {
                sessionStorage.scoringGameID = JSON.stringify([]);
            }
            
            sessionStorage.backEvents = JSON.stringify([[]]);
            
            if (sessionStorage.currentPage == "drawResults" || sessionStorage.currentPage == null) {
                drawResults(true);
            } else if (sessionStorage.currentPage == "liveScoring" || sessionStorage.currentPage == "gameSelection") {
                liveScoring(true);
            } else if (sessionStorage.currentPage == "gameInfo") {
                gameInfo(sessionStorage.currentGameID, true);
            } else if (sessionStorage.currentPage == "endScoring") {
                endScoring(true);
            } else {
                showContactContainer();
            }
        } else {
            alertError("#alertDiv", "Sorry, you can't use this website. The minimum browser versions are:\nInternet Explorer 8\nFirefox 3.5\nSafari 4\nGoogle Chrome 5\nOpera 10.50");
        }
    });
});

// Catch browser back button event
window.onpopstate = function(event) {
    var state = event.state;
    var backEvents = JSON.parse(sessionStorage.backEvents);
    var previousEvent = backEvents[backEvents.length - 2][0];
    if (previousEvent == undefined) {
        history.back();
    } else {
        if (state != null) {
            if (state.event == 'startGameInfo') {
                showDrawResultsContainer();
                sessionStorage.currentPage = "drawResults";
            } else if (state.event == 'weekChange') {
                changeWeeks(state.weekNumber, false);
            } else if (state.event == 'startGameSelection') {
                if (previousEvent == 'weekChange') {
                    showDrawResultsContainer();
                    sessionStorage.currentPage = "drawResults";
                } else if (previousEvent == 'startDrawResults') {
                    showDrawResultsContainer();
                    sessionStorage.currentPage = "drawResults";
                } else if (previousEvent == 'startGameInfo') {
                    if (backEvents[backEvents.length - 2][1] != sessionStorage.currentGameID) {
                        gameInfo(backEvents[backEvents.length - 2][1], false);
                    } else {
                        showGameInfoContainer();
                        sessionStorage.currentPage = "gameInfo";
                    }
                } else if (previousEvent == 'startEndScoring') {
                    showEndScoringContainer();
                    sessionStorage.currentPage = "endScoring";
                } else if (previousEvent == 'startContactForm') {
                    showContactContainer();
                    sessionStorage.currentPage = "contact";
                }
            } else if (state.event == 'startLiveScoring') {
                if (previousEvent == 'startGameSelection') {
                    showGameSelectionContainer();
                    sessionStorage.currentPage = "gameSelection";
                }
            } else if (state.event == 'startEndScoring') {
                if (previousEvent == 'weekChange') {
                    showDrawResultsContainer();
                    sessionStorage.currentPage = "drawResults";
                } else if (previousEvent == 'startDrawResults') {
                    showDrawResultsContainer();
                    sessionStorage.currentPage = "drawResults";
                } else if (previousEvent == 'startGameInfo') {
                    if (backEvents[backEvents.length - 1][1] != sessionStorage.currentGameID) {
                        gameInfo(backEvents[backEvents.length - 1][1], false);
                    } else {
                        showGameInfoContainer();
                        sessionStorage.currentPage = "gameInfo";
                    }
                } else if (previousEvent == 'startLiveScoring') {
                    showLiveScoringContainer();
                    sessionStorage.currentPage = "liveScoring";
                } else if (previousEvent == 'startGameSelection') {
                    showGameSelectionContainer();
                    sessionStorage.currentPage = "gameSelection";
                } else if (previousEvent == 'startContactForm') {
                    showContactContainer();
                    sessionStorage.currentPage = "contact";
                }
            } else if (state.event == 'startDrawResults') {
                if (previousEvent == 'startGameSelection') {
                    showGameSelectionContainer();
                    sessionStorage.currentPage = "gameSelection";
                } else if (previousEvent == 'startLiveScoring') {
                    showLiveScoringContainer();
                    sessionStorage.currentPage = "liveScoring";
                } else if (previousEvent == 'startGameInfo') {
                    if (backEvents[backEvents.length - 2][1] != sessionStorage.currentGameID) {
                        gameInfo(backEvents[backEvents.length - 2][1], false);
                    } else {
                        showGameInfoContainer();
                        sessionStorage.currentPage = "gameInfo";
                    }
                } else if (previousEvent == 'startEndScoring') {
                    showEndScoringContainer();
                    sessionStorage.currentPage = "endScoring";
                } else if (previousEvent == 'startContactForm') {
                    showContactContainer();
                    sessionStorage.currentPage = "contact";
                }
            } else if (state.event == 'startContactForm') {
                if (previousEvent == 'startGameSelection') {
                    showGameSelectionContainer();
                    sessionStorage.currentPage = "gameSelection";
                } else if (previousEvent == 'startDrawResults' || previousEvent == 'weekChange') {
                    showDrawResultsContainer();
                    sessionStorage.currentPage = "drawResults";
                } else if (previousEvent == 'startLiveScoring') {
                    showLiveScoringContainer();
                    sessionStorage.currentPage = "liveScoring";
                } else if (previousEvent == 'startGameInfo') {
                    if (backEvents[backEvents.length - 2][1] != sessionStorage.currentGameID) {
                        gameInfo(backEvents[backEvents.length - 2][1], false);
                    } else {
                        showGameInfoContainer();
                        sessionStorage.currentPage = "gameInfo";
                    }
                } else if (previousEvent == 'startEndScoring') {
                    showEndScoringContainer();
                    sessionStorage.currentPage = "endScoring";
                }
            }
        }
        setActivePage();
        backEvents.pop();
        sessionStorage.backEvents = JSON.stringify(backEvents);
    }
};

// Hides all the web page containers
function hideAllContainers() {
    clearInterval(lastTimeScored);
    $("#liveScoringPasswordContainer").hide();
    $("#endScoringPasswordContainer").hide();
    $("#drawResultsContainer").hide();
    $("#gameInfoContainer").hide();
    $("#gameSelectionContainer").hide();
    $("#liveScoringContainer").hide();
    $("#endScoringContainer").hide();
    $("#contactContainer").hide();
}

function setActivePage() {
    $("li.active").removeClass("active");
    var currentPage = sessionStorage.currentPage == 'gameSelection' ? 'liveScoring' : sessionStorage.currentPage;
    $("." + currentPage).addClass("active");

    $('.navbar-collapse.in').removeClass('in').prop('aria-expanded', false);
}

function pad(value, length) {
    // Convert to string
    value = '' + value;

    // Add zeros to front until the desired length
    while (value.length < length) {
        value = "0" + value;
    }

    // return padded value as string
    return value;
}

function addBackEvent(eventArray) {
    if (eventArray[0] == 'startDrawResults' || 
        eventArray[0] == 'startGameSelection' || 
        eventArray[0] == 'startLiveScoring' || 
        eventArray[0] == 'startContactForm' || 
        eventArray[0] == 'startEndScoring') {
        var stateObj = { 
            event: eventArray[0]
        };
    } else if (eventArray[0] == 'weekChange') {
        var stateObj = { 
            event: eventArray[0], 
            weekNumber: eventArray[1]
        };
    } else if (eventArray[0] == 'startGameInfo') {
        var stateObj = { 
            event: eventArray[0], 
            gameID: eventArray[1]
        };
    }
    if (history.replaceState){
        history.replaceState(stateObj, "", "");
        history.pushState(stateObj, "", "");
        var backEvents = JSON.parse(sessionStorage.backEvents);
        backEvents.push(eventArray);
        sessionStorage.backEvents = JSON.stringify(backEvents);
    }
}

function setInstructions(page) {
    var text = '';
    switch (page) {
        case 'drawResults':
            text = "If you want the scores to update automatically, choose how often you want that to happen to the right. You can change the week displayed by clicking 'Show Weeks' then selecting the week you want. The games are colour coded to represent the situation in the game. To display the games for a division, click the division title. Clicking the title again will hide them. Clicking a game will take you to a full page display of the game including all the scoring plays (if provided).";
            break;
        case 'liveScoringPassword':
            text = "Input the password provided to you and tap 'Submit'";
            break;
        case 'gameSelection':
            text = "Choose the correct division, home and away teams and tap 'Select Game'";
            break;
        case 'liveScoring':
            text = "To upload a scoring play, tap the name of the team and the scoring play you want to upload, enter the minutes played and description of play (optional), then tap 'Send'. If you missed some plays, you can tap 'Change Score' and enter the current score and minutes played then tap 'Submit'. If you want to delete play/s, tap the plays you want to delete then tap 'Delete Selected Plays'. Tapping the 'Half Time' or 'Full Time' buttons will upload that play to the database. Once you have finished scoring the game, tap 'Stop Scoring' to be logged out.";
            break;
        case 'endScoringPassword':
            text = "Input the password provided to you and tap 'Submit'";
            break;
        case 'endScoring':
            text = "To upload the final score for a game, select the division, home team, away team, enter the score for each team, the date the game was played then tap 'Submit Score'";
            break;
    }

    $("#instructions").text(text);
}

function toggleInstructions() {
    $("#instructions").toggle();
    localStorage.instructions = localStorage.instructions == 'true' ? 'false' : 'true';
}

function getTeamName(teamID, divID) {
    teamID = String(parseInt(teamID));
    divID = parseInt(divID);
    
    for (var e = 0; e < allTeams[divID].length; e += 1) {
        if (teamID == allTeams[divID][e].teamID) {
            return allTeams[divID][e].teamName;
        }
    }
    
    return '';
}

function columnName(columnName) {
    switch (columnName) {
        case 'homeTeamScore':
            return 'Home Score';
        case 'awayTeamScore':
            return 'Away Score';
        case 'time':
            return 'Start Time';
        case 'location':
            return 'Location';
        case 'ref':
            return 'Referee';
        case 'assRef1' || 'assRef2':
            return 'Assistant Referee';
        case 'locked':
            return 'Locked';
        case 'date':
            return 'Date';
    }
}

function alertError(selector, message) {
    $(selector).after("<div class='alert alert-danger' role='alert'>" + message + "</div>");
    $(selector).next().delay(4000).fadeOut(600);
    setTimeout(function() { $(selector).next().remove(); }, 5000);
}

function alertSuccess(selector, message) {
    $(selector).after("<div class='alert alert-success' role='alert'>" + message + "</div>");
    $(selector).next().delay(4000).fadeOut(600);
    setTimeout(function() { $(selector).next().remove(); }, 5000);
}

function alertNotification(selector, message) {
    $(selector).after("<div class='alert alert-info' role='alert'>" + message + "</div>");
    $(selector).next().delay(4000).fadeOut(600);
    setTimeout(function() { $(selector).next().remove(); }, 5000);
}

/* 
--------------------------------------------------------------------------
----------------------------- Draw/Results -------------------------------
--------------------------------------------------------------------------
*/

var currentWeek = 0;
var numWeeks = 18;
var allGames = [];
var startDateArray = [2015, 2, 23];
var autoUpdateTimer;
var updateDuration;
var expandedDivisions = [];
var gameChangesExpanded = false;
var timer;

function drawResults(createBackEvent) {
    if (localStorage.instructions == null) {
        localStorage.instructions = 'true';
    }
    updateDuration = localStorage.updateDuration != null ? localStorage.updateDuration : 60;
    currentWeek = localStorage.currentWeek != null ? parseInt(localStorage.currentWeek) : 0;
    if (createBackEvent) {
        addBackEvent(['startDrawResults']);
    }
    sessionStorage.currentPage = "drawResults";
    setActivePage();
    generateWeekSelector();
    setActiveUpdateInterval();
    generateChangedGames();
    generateGames();
    showDrawResultsContainer();
}

// Show draw/result container
function showDrawResultsContainer() {
    hideAllContainers();
    setInstructions('drawResults');
    $("#drawResultsContainer").show();
}

function toggleWeeks() {
    $("#weeksList").slideToggle();
}

function toggleGameChanges() {
    $("#gameChanges").toggle();
    localStorage.lastTimeUpdatesChecked = new Date().toUTCString();
    if (gameChangesExpanded) {
        gameChangesExpanded = false;
    } else {
        gameChangesExpanded = true;
    }
}

function generateWeekSelector() {
    var startDate = new Date(startDateArray[0], startDateArray[1], startDateArray[2]);
    var endDate = new Date(startDateArray[0], startDateArray[1], startDateArray[2]).addDays(6);
    html = '';

    html += "<div id='autoUpdateButtonRow'>";
    html += "    Auto Update: ";
    html += "    <button id='au30' class='autoUpdateButton' onclick='changeAutoUpdateInterval(30)'>30s</button>";
    html += "    <button id='au60' class='autoUpdateButton' onclick='changeAutoUpdateInterval(60)'>1m</button>";
    html += "    <button id='au300' class='autoUpdateButton' onclick='changeAutoUpdateInterval(300)'>5m</button>";
    html += "    <button id='au900' class='autoUpdateButton' onclick='changeAutoUpdateInterval(900)'>15m</button>";
    html += "    <button id='au100000' class='autoUpdateButton' onclick='changeAutoUpdateInterval(NEVER)'>Never</button>";
    html += "</div>";

    html += "<div class='weektoggledisplay col-xs-47'>";
    html += "    <div onclick='toggleWeeks()' class='showweeks'>Show Weeks</div>";
    html += "        <nav id='weeksList' class='row'>";
    for (var a = 0; a < numWeeks; a += 1) {
        html += "        <button onclick='changeWeeks(" + a + ", true)' class='weeknav week" + (a + 1) + " col-xs-12 col-sm-8 col-md-4'>";
        html += "            <div class='weektitle'>W" + (a + 1) + "</div>";
        html += "            <div class='date'>" + startDate.toCustomDateString(false) + " - " + endDate.toCustomDateString(false) + "</div>";
        html += "        </button>";
        startDate = startDate.addDays(7);
        endDate = endDate.addDays(7);
    }
    html += "        </nav>";
    html += "    </div>";
    html += "</div>";

    html += "<div class='row colourLegend'>";
    html += "    <div class='colour col-xs-24'>";
    html += "        <div class='blueSquare'></div>";
    html += "        <div class='colourLabel'>Not Started</div>";
    html += "    </div>";
    html += "    <div class='colour col-xs-24'>";
    html += "        <div class='greenSquare'></div>";
    html += "        <div class='colourLabel'>Being Live Scored</div>";
    html += "    </div>";
    html += "</div>";
    html += "<div class='row colourLegend'>";
    html += "    <div class='colour col-xs-24'>";
    html += "        <div class='yellowSquare'></div>";
    html += "        <div class='colourLabel'>Live Scoring Not Completed</div>";
    html += "    </div>";
    html += "    <div class='colour col-xs-24'>";
    html += "        <div class='redSquare'></div>";
    html += "        <div class='colourLabel'>Game Finished</div>";
    html += "    </div>";
    html += "</div>";

    $("#weekSelectorContainer").empty().append(html);
    setActiveWeek();
}

function generateChangedGames(startOfWeek, endOfWeek) {
    var lastTimeUpdatesChecked = new Date(localStorage.lastTimeUpdatesChecked);
    var html = '';
    var hasAGameBeenChanged = false;
    var todaysDate = new Date(2015, 2, 30);
    
    if(todaysDate >= startOfWeek && todaysDate <= endOfWeek) {
        html += "<div class='changestoggledisplay col-xs-47'>";
        html += "    <div onclick='toggleGameChanges()'>Show Game Changes</div>";
        html += "        <div id='gameChanges'>";
        // for each division
        for (var p = 0; p < allGames.length; p += 1) {
            // get the date of the game
            var game = allGames[p];
            var gameID = game.GameID;
            var year = parseInt(gameID.substr(0, 4));
            var month = parseInt(gameID.substr(4, 2)) - 1;
            var day = parseInt(gameID.substr(6, 2));
            var gameDateDate = new Date(year, month, day);
            // check if game happens in the current week
            if (gameDateDate <= endOfWeek && gameDateDate >= startOfWeek) {
                // get changes array from game
                var gameChanges = JSON.parse(allGames[p].changes);
                // for each change
                for (var r = 0; r < gameChanges.length; r += 1) {
                    // get when the change was made
                    var changeDate = new Date(gameChanges[r][0]);
                    // check if the change has occured since the user last checked
                    if (changeDate > lastTimeUpdatesChecked) {
                        // display the change
                        var divID = parseInt(gameID.slice(-2));
                        if (gameID.length == 16) {
                            var homeTeamName = getTeamName(gameID.substr(8, 3), divID);
                            var awayTeamName = getTeamName(gameID.substr(11, 3), divID);
                        } else {
                            var homeTeamName = game.homeTeamName;
                            var awayTeamName = game.awayTeamName;
                        }
                        hasAGameBeenChanged = true;
                        if (gameChanges[r][1] == 'date') {
                            var date = gameChanges[r][2];
                            var changeValue = new Date(date.substr(0, 4), date.substr(4, 2), date.substr(6, 2)).toCustomDateString(true);
                        } else {
                            var changeValue = gameChanges[r][2];
                        }
                        html += "<div>" + allDivs[divID].divisionName + ") " + homeTeamName + " vs " + awayTeamName + " - " + columnName(gameChanges[r][1]) + " was changed to " + changeValue + " (" + changeDate.toChangesString() + ")</div>"
                    }
                }
            }
        }
        html += "        </div>";
        html += "    </div>";
        html += "</div>";

        $("#changedGamesContainer").empty().append(html);

        if (!hasAGameBeenChanged) {
            $(".changestoggledisplay").hide();
        }
        
        if (gameChangesExpanded) {
            $("#gameChanges").show();
        }
    } else {
        $("#changedGamesContainer").empty();
    }
}

function generateGames() {
    html = '';
    var gameInDivisionThisWeekArray = [];
    var startOfWeek = new Date(startDateArray[0], startDateArray[1], startDateArray[2]).addDays(7 * currentWeek);
    var endOfWeek = new Date(startDateArray[0], startDateArray[1], startDateArray[2]).addDays(6 + 7 * currentWeek);

    var post = $.post('http://ccrscoring.co.nz/scripts/php/getallgames.php', {
        start: pad(startOfWeek.getFullYear(), 4) + pad(startOfWeek.getMonth() + 1, 2) + pad(startOfWeek.getDate(), 2),
        end: pad(endOfWeek.getFullYear(), 4) + pad(endOfWeek.getMonth() + 1, 2) + pad(endOfWeek.getDate(), 2)
    },
    function (response) {
        // put all games into array
        allGames = response;
        generateChangedGames(startOfWeek, endOfWeek);

        for (var b = 0; b < allDivs.length; b += 1) {
            var gamesInRow = 0;
            var gameInDivisionThisWeek = false;
            html += "<div id='div" + allDivs[b].divisionID + "Row' class='row rowfix'>";
            html += "    <div class='col-sm-48 divtitle' onclick='toggleGames(\"div" + allDivs[b].divisionID + "\");'>";
            html += "        <h3>" + allDivs[b].divisionName + "</h3>";
            html += "    </div><!-- End of divtitle div -->";
            html += "    <div class='col-xs-48 gamerowcontainer div" + allDivs[b].divisionID + "'>";
            html += "        <div class='row gamerow'>";

            for (var c = 0; c < allGames.length; c += 1) {
                var gameID = allGames[c].GameID;
                var divID = parseInt(gameID.slice(-2));
                var gameDateString = gameID.substr(0, 8);
                var year = parseInt(gameDateString.substr(0, 4));
                var month = parseInt(gameDateString.substr(4, 2)) - 1;
                var day = parseInt(gameDateString.substr(6, 2));
                var gameDateDate = new Date(year, month, day);
                if (gameDateDate <= endOfWeek && gameDateDate >= startOfWeek && gameID.slice(-2) == allDivs[b].divisionID) {
                    gameInDivisionThisWeek = true;
                    if (gameID.length == 16) {
                        var teams = allTeams[divID];
                        for (var k = 0; k < teams.length; k += 1) {
                            if (parseInt(gameID.substr(8, 3)) == parseInt(teams[k].teamID)) {
                                var homeTeamName = teams[k].teamName;
                            } else if (parseInt(gameID.substr(11, 3)) == parseInt(teams[k].teamID)) {
                                var awayTeamName = teams[k].teamName;
                            }
                        }
                    } else {
                        var homeTeamName = allGames[c].homeTeamName;
                        var awayTeamName = allGames[c].awayTeamName;
                    }

                    var timeString = '';
                    var gameSituation = '';
                    if (allGames[c].minutesPlayed == 0) {
                        timeString = gameDateDate.toCustomDateString(true) + " " + allGames[c].time;
                        gameSituation = "notstarted";
                    } else if (allGames[c].minutesPlayed == 80) {
                        timeString = "Full Time";
                        gameSituation = "finished";
                    } else if (allGames[c].minutesPlayed == 40 && allGames[c].liveScored == 'y') {
                        timeString = "Half Time";
                        gameSituation = "inprogress";
                    } else if (allGames[c].minutesPlayed == 40 && allGames[c].liveScored == 'n') {
                        timeString = "Half Time";
                        gameSituation = "startedbutnotscored";
                    } else if (allGames[c].liveScored == 'y') {
                        timeString = allGames[c].minutesPlayed + " mins";
                        gameSituation = "inprogress";
                    } else {
                        timeString = allGames[c].minutesPlayed + " mins";
                        gameSituation = "startedbutnotscored";
                    }

                    var homeTeamScore = "";
                    var awayTeamScore = "";

                    if (allGames[c].homeTeamScore == 2) {
                        homeTeamScore = "Win";
                        awayTeamScore = "Defaulted";
                    } else if (allGames[c].homeTeamScore == 1) {
                        homeTeamScore = "Defaulted";
                        awayTeamScore = "Win";
                    } else {
                        homeTeamScore = allGames[c].homeTeamScore;
                        awayTeamScore = allGames[c].awayTeamScore;
                    }

                    var winningTeam = "";
                    if (parseInt(allGames[c].homeTeamScore) > parseInt(allGames[c].awayTeamScore)) {
                        winningTeam = "home";
                    } else if (parseInt(allGames[c].awayTeamScore) > parseInt(allGames[c].homeTeamScore)) {
                        winningTeam = "away";
                    }

                    var refString = "";
                    var ref = allGames[c].ref;
                    var assRef1 = allGames[c].assRef1;
                    var assRef2 = allGames[c].assRef2;

                    if (ref != "") {
                        refString = "Ref: " + ref;
                        if (assRef1 != "") {
                            refString = refString + ", Assis. Ref: " + assRef1;
                            if (assRef2 != "") {
                                // There is a ref and both first and second assistants
                                refString = refString + " and " + assRef2;
                            } else {
                                // There is a ref and a first assistant but no second
                            }
                        } else {
                            if (assRef2 != "") {
                                // There is a ref and a second assistant but no first
                                refString = refString + ", Assis. Ref: " + assRef2;
                            }
                        }
                    } else {
                        if (assRef1 != "") {
                            refString = refString + "Assis. Ref: " + assRef1;
                            if (assRef2 != "") {
                                // There is no ref and both first and second assistants
                                refString = refString + " and " + assRef2;
                            } else {
                                // There is only the first assistant
                            }
                        } else {
                            if (assRef2 != "") {
                                // There is only the second assistant
                                refString = refString + "Assis. Ref: " + assRef2;
                            }
                        }
                    }

                    html += "            <div class='col-sm-15 game " + gameSituation + "' onclick='gameInfo(" + allGames[c].GameID + ", true);'>";
                    html += "                <div class='row'>";
                    html += "                    <div class='col-xs-48 location'>" + allGames[c].location + " - " + timeString + "</div>";
                    html += "                </div>";
                    html += "                <div class='row'>";
                    html += "                    <div class='col-xs-48 refs'>" + refString + "</div>";
                    html += "                </div>";
                    html += "                <div class='row teams hometeam'>";
                    if (winningTeam == 'home') {
                        html += "<div class='strong'>";
                    }
                    html += "                    <div class='teamname col-xs-20 col-sm-33'>" + homeTeamName + "</div>";
                    html += "                    <div class='score col-xs-16 col-sm-15'>" + homeTeamScore + "</div>";
                    if (winningTeam == 'home') {
                        html += "</div>";
                    }
                    html += "                </div>";
                    html += "                <div class='row teams hometeam'>";
                    if (winningTeam == 'away') {
                        html += "<div class='strong'>";
                    }
                    html += "                    <div class='teamname col-xs-20 col-sm-33'>" + awayTeamName + "</div>";
                    html += "                    <div class='score col-xs-16 col-sm-15'>" + awayTeamScore + "</div>";
                    if (winningTeam == 'away') {
                        html += "</div>";
                    }
                    html += "                </div>";
                    html += "            </div><!-- End of game div -->";

                    gamesInRow += 1;
                    if (gamesInRow == 3) {
                        html += "    </div><!-- End of gamerow div -->";
                        html += "    <div class='row gamerow'>";
                        gamesInRow = 0;
                    }
                }
            }

            html += "        </div><!-- End of gamerow div -->";
            html += "    </div><!-- End of gamerowcontainer div -->";
            html += "</div><!-- End of row div -->";

            if (gameInDivisionThisWeek == false) {
                gameInDivisionThisWeekArray.push(allDivs[b].divisionID);
            }
        }

        $("#gameContainer").empty().append(html);

        for (var f = 0; f < gameInDivisionThisWeekArray.length; f += 1) {
            $("#div" + gameInDivisionThisWeekArray[f] + "Row").hide();
        }

        restoreExpandedDivisions();
        startAutoUpdateTimer();
        setActiveWeek();
    }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while displaying games. Please try again later. If problem persists, use the contact form");
    })
}

function changeWeeks(week, createBackEvent) {
    if (createBackEvent) {
        addBackEvent(['weekChange', parseInt(currentWeek)]);
    }
    currentWeek = week;
    localStorage.currentWeek = currentWeek;
    generateGames();
    alertNotification("#alertDiv", "Week Changed");
}

function setActiveWeek() {
    $(".weeknav.active").removeClass("active");
    $(".week".concat(currentWeek + 1)).addClass("active");
}

function setActiveUpdateInterval() {
    $(".autoUpdateButton.active").removeClass("active");
    $("#au".concat(updateDuration)).addClass("active");
}

function restoreExpandedDivisions() {
    for (var q = 0; q < expandedDivisions.length; q += 1) {
        $("." + expandedDivisions[q]).show();
    }
}

// Show/hide the games for the division that the user clicked on
function toggleGames(divID) {
    $(".".concat(divID)).slideToggle();
    var index = expandedDivisions.indexOf(divID);
    if (index == -1) {
        expandedDivisions.push(divID);
    } else {
        expandedDivisions.splice(index, 1);
    }
}

function startAutoUpdateTimer() {
    stopAutoUpdateTimer();
    autoUpdateTimer = setTimeout(generateGames, updateDuration * 1000);
}

function changeAutoUpdateInterval(interval) {
    if (interval == NEVER) {
        if (updateDuration != NEVER) {
            updateDuration = NEVER;
            stopAutoUpdateTimer();
            alertSuccess("#alertDiv", "Games won't automatically update anymore");
        }
    } else {
        updateDuration = interval;
        startAutoUpdateTimer();
        if (interval == 30) {
            var time = '30 seconds';
        } else if (interval == 60) {
            var time = 'minute';
        } else if (interval == 300) {
            var time = '5 minutes';
        } else if (interval == 900) {
            var time = '15 minutes';
        }
        alertSuccess("#alertDiv", "Games will automatically update every " + time);
    }
    localStorage.updateDuration = updateDuration;
    setActiveUpdateInterval();
}

function stopAutoUpdateTimer() {
    clearTimeout(autoUpdateTimer);
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.toCustomDateString = function (dayOfWeek) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayOfGame = '';
    if (dayOfWeek) {
        dayOfGame = daysOfWeek[this.getDay()];
    }
    return dayOfGame + " " + this.getDate() + " " + months[this.getMonth()];
};

Date.prototype.toChangesString = function () {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (this.getHours() == 0) {
        var hours = 'Midnight';
    } else if (this.getHours() > 12) {
        var hours = (this.getHours() - 12) + "pm";
    } else if (this.getHours() == 12) {
        var hours = 'Noon';
    } else {
        var hours = this.getHours() + 'am';
    }
    
    if (new Date() > this.addDays(6)) {
        this.addDays(-6);
        var date = this.getDate() + " " + months[this.getMonth()];
    } else {
        this.addDays(-6);
        var date = '';
    }
    
    return hours + " " + daysOfWeek[this.getDay()] + date;
};

/* 
--------------------------------------------------------------------------
------------------------------ Game Info ---------------------------------
--------------------------------------------------------------------------
*/

function gameInfo(gameID, backEvent) {
    changeAutoUpdateInterval(NEVER);
    if (backEvent) {
        addBackEvent(['startGameInfo', String(parseInt(gameID))]);
    }
    sessionStorage.currentPage = "gameInfo";
    sessionStorage.currentGameID = gameID;
    generateGameInfo();
    showGameInfoContainer();
}

function showGameInfoContainer() {
    hideAllContainers();
    $("#gameInfoContainer").show();
}

function generateGameInfo() {
    var gameID = sessionStorage.currentGameID;
    html = '';

    var post = $.post('http://ccrscoring.co.nz/scripts/php/getgameinfo.php', {
            gameID: gameID
        },
        function (response) {
            var homeScore = '';
            var awayScore = '';
            // If score is 2 then the team won by default. 
            if (response[0].homeTeamScore == '2') {
                homeScore = 'Win';
                awayScore = 'Defaulted';
            } else if (response[0].homeTeamScore == '1') {
                homeScore = 'Defaulted';
                awayScore = 'Win';
            } else {
                homeScore = response[0].homeTeamScore;
                awayScore = response[0].awayTeamScore;
            }

            // Display team names and scores
            html += "<div class='row teamInfo'>";
            html += "    <div class='col-xs-22'>";
            html += "        <div class='row'>" + response[0].homeTeamName + "</div>";
            html += "        <div class='row'>" + homeScore + "</div>";
            html += "    </div>";
            html += "    <div class='col-xs-4 versus'>vs</div>";
            html += "    <div class='col-xs-22'>";
            html += "        <div class='row'>" + response[0].awayTeamName + "</div>";
            html += "        <div class='row'>" + awayScore + "</div>";
            html += "    </div>";
            html += "</div>";

            // Retrieve game date and time from gameID
            var gameDateString = gameID.substr(0, 8);
            var year = parseInt(gameDateString.substr(0, 4));
            var month = parseInt(gameDateString.substr(4, 2)) - 1;
            var day = parseInt(gameDateString.substr(6, 2));
            var gameDateDate = new Date(year, month, day);
            // If game is being lve scored, display the minutes played.
            // If game has had any updates (minutesPlayed == 0) then display when the game is/was to be played
            var minutesOrTime = '';
            if (response[0].minutesPlayed == '0') {
                minutesOrTime = gameDateDate.toCustomDateString(true) + " " + response[0].time;
            } else if (response[0].minutesPlayed == '80') {
                minutesOrTime = 'Full Time';
            } else if (response[0].minutesPlayed == '40') {
                minutesOrTime = 'Half Time';
            } else {
                minutesOrTime = response[0].minutesPlayed + " mins";
            }
            html += "<div class='row gameInfo'><div class='col-xs-48'>" + response[0].location + "</div></div>";
            html += "<div class='row gameInfo'><div class='col-xs-48'>" + minutesOrTime + "</div></div>";

            // Next is a list of the previously uploaded plays for this game
            html += "<div class='row scoringPlays rowfix'>\n\n";
            // Decode the json into an array
            var allScoringPlays = JSON && JSON.parse(response[0].scoringPlays) || $.parseJSON(response[0].scoringPlays);
            var homeScoreCurrent = 0;
            var awayScoreCurrent = 0;
            // For each scoring play in the allScoringPlays array display a row with it's information. 
            // When the user clicks on a scoring play they are asked if they want to delete it.
            for (var g = 0; g < allScoringPlays.length; g += 1) {
                // Retrieve a single play
                var scoringPlayInfo = allScoringPlays[g];
                // Retrieve the play code of the scoring play. 
                // The first 4 (team) characters of the code can be: 
                // home, away, strt (start of game), updt (score update), half (half time), full (full time)
                // The rest of the code (play) is: the play ('Try', 'Penalty', 'Conversion', 'DropGoal') for home and away, 
                // 'Game' for strt, the score in the form of HHAA (eg 010006 for 10-6 to the home team) and 'Time' for half and full.
                var scoringPlay = scoringPlayInfo[1];
                var team = scoringPlay.substr(0, 4);
                var play = scoringPlay.substr(4);
                if (play == 'DropGoal') {
                    play = 'Drop Goal';
                }

                if (play == 'Time') {
                    // For the halfTime and fullTime plays, display the score on first row and 'Half Time' or 'Full Time' on the second row
                    html += "<div class='row time rowfix'>\n";
                    html += "<div class='col-xs-48'>" + homeScoreCurrent + "-" + awayScoreCurrent + "</div>\n";
                    html += "<div class='col-xs-48'>";
                    if (team == 'half') {
                        html += "Half Time";
                    } else {
                        html += "Full Time";
                    }
                    html += "</div>\n</div>\n\n";
                } else if (team == 'strt') {
                    // For strtGame, display a single row with 'Game Started' in the middle
                    html += "<div class='row gameStart rowfix'>\n<div class='col-xs-48'>Game Started</div>\n</div>\n\n";
                } else if (team == 'updt') {
                    if (play.length == 6) {
                        // For updtXXXYYY, first check if the update is a team defaulting and display appropriate 
                        // message. If not then extract new score from XXXX (play), display it and update the score.
                        if (parseInt(play.substr(0, 3)) == 2) {
                            var scoreString = "Game Update: " + response[0].awayTeamName + " defaulted";
                        } else if (parseInt(substr(play, 0, 3)) == 1) {
                            var scoreString = "Game Update: " + response[0].homeTeamName + " defaulted";
                        } else {
                            var scoreString = "Score Update: " + parseInt(play.substr(0, 3)) + " - " + parseInt(play.substr(3, 3)) + " (" + scoringPlayInfo[0] + "')";
                        }
                        html += "<div class='row update rowfix'>\n\t<div class='col-xs-48'>" + scoreString + "</div>\n</div>\n\n";
                        homeScoreCurrent = parseInt(play.substr(0, 3));
                        awayScoreCurrent = parseInt(play.substr(3, 3));
                    } else {
                        // For legacy updtXXYY, first check if the update is a team defaulting and display appropriate 
                        // message. If not then extract new score from XXXX (play), display it and update the score.
                        if (parseInt(play.substr(0, 2)) == 2) {
                            scoreString = "Game Update: " + response[0].awayTeamName + " defaulted";
                        } else if (parseInt(play.substr(0, 2)) == 1) {
                            scoreString = "Game Update: " + response[0].homeTeamName + " defaulted";
                        } else {
                            scoreString = "Score Update: " + parseInt(play.substr(0, 2)) + " - " + parseInt(play.substr(2, 2)) + " (" + scoringPlayInfo[0] + "')";
                        }
                        html += "<div class='row update rowfix'>\n\t<div class='col-xs-48'>" + scoreString + "</div>\n</div>\n\n";
                        homeScoreCurrent = parseInt(play.substr(0, 2));
                        awayScoreCurrent = parseInt(play.substr(2, 2));
                    }
                } else {
                    // For all the scoring plays, get the team (home or away), change the score based of the play (play) and team.
                    var team = scoringPlay.substr(0, 4);
                    switch (play) {
                        case "Try":
                            if (team == "home") {
                                homeScoreCurrent = homeScoreCurrent + 5;
                            } else {
                                awayScoreCurrent = awayScoreCurrent + 5;
                            }
                            break;
                        case "Penalty":
                        case "Drop Goal":
                            if (team == "home") {
                                homeScoreCurrent = homeScoreCurrent + 3;
                            } else {
                                awayScoreCurrent = awayScoreCurrent + 3;
                            }
                            break;
                        case "Conversion":
                            if (team == "home") {
                                homeScoreCurrent = homeScoreCurrent + 2;
                            } else {
                                awayScoreCurrent = awayScoreCurrent + 2;
                            }
                            break;
                    }
                    // If the home team scored, then output play into first div (left). If away team scored, output 
                    // play into 3rd div (right). The score after that scoring play and minutes played are displayed 
                    // in the second div (center) in format "HH - AA (MM')"
                    html += "<div class='row scoringPlay rowfix'>\n";
                    html += "\t<div class='col-xs-20 homeScoringPlay'>";
                    if (team == 'home') {
                        html += play;
                    }
                    html += "</div>\n\t<div class='col-xs-8 minutesPlayed'>" + homeScoreCurrent + " - " + awayScoreCurrent + " (" + scoringPlayInfo[0] + "')</div>\n";
                    html += "\t<div class='col-xs-20 awayScoringPlay'>";
                    if (team == 'away') {
                        html += play;
                    }
                    html += "</div>\n";
                    // The second row displays the description for the scoring play if given
                    html += "\t<div class='col-xs-48'>" + scoringPlayInfo[2] + "</div>\n";
                    html += "</div>\n\n";

                }
            }
            // close scoringplays div from just before "for" loop
            html += "</div>\n\n";

            $("#gameInfoContainer").empty().append(html);
        },
        'json');

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while getting game info. Please try again later. If problem persists, use the contact form");
    });
}

/* 
--------------------------------------------------------------------------
----------------------------- Live Scoring -------------------------------
--------------------------------------------------------------------------
*/

var selectedDivisionIndex = 0;
var selectedScoringPlay = "";
var selectedPlays = [];
var lastTimeScored = null;

function liveScoring(createBackEvent) {
    changeAutoUpdateInterval(NEVER);
    if (sessionStorage.liveScoringPassword == "correct") {
        generateGameSelection();
    } else {
        sessionStorage.currentPage = 'gameSelection';
        setActivePage();
        showLiveScoringPasswordContainer();
    }
    addEventsLive();
}

function addEventsLive() {
    $("#liveScoringPasswordContainer").on({
        keydown: function (event) {
            if (event.which == 13) { // Enter
                // Stop a line break being added
                event.preventDefault();
                $("#checkLiveScoringPasswordButton").click();
            }
        }
    });
}

// Shows password div
function showLiveScoringPasswordContainer() {
    hideAllContainers();
    setInstructions('liveScoringPassword');
    $("#liveScoringPasswordContainer").show();
}

// Uses jquery ajax to call php script to check live scoring password entered is correct
function checkLiveScoringPassword() {
    var passwordInput = $("#liveScoringPasswordInput").val();
    $.post(
        'http://ccrscoring.co.nz/scripts/php/checkpassword.php', {
            page: 'liveScoring',
            password: passwordInput
        },
        function (response) {
            if (response == 'correct') {
                // Correct password. Hide password and generate team lists
                sessionStorage.liveScoringPassword = "correct";
                sessionStorage.currentPage = "gameSelection";
                setActivePage();
                liveScoring();
            } else if (response == 'incorrect') {
                // Incorrect password. Do nothing
                alertError("#alertDiv", "Incorrect password. Please try again.")
                $("#liveScoringPasswordInput").val = "";
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        }).fail(function () {
        alertError("#alertDiv", "Error while checking password. Please try again later. If problem persists, use the contact form");
    })
}

// Show game editor container
function showGameSelectionContainer() {
    hideAllContainers();
    setInstructions('gameSelection');
    $("#gameSelectionContainer").show();
    
    // Every 30 seconds the user is live scoring a game, the current time is uploaded to the server.
    // A cron task then checks all the games every 5 minutes. If the last time scored is more than 5 minutes
    // old then the liveScored attribute is changed to 'n'.
    lastTimeScored = setInterval(updateLastTimeScored, 30000);
}

function showLiveScoringContainer() {
    hideAllContainers();
    setInstructions('liveScoring');
    $("#liveScoringContainer").show();
    
    // Every 30 seconds the user is live scoring a game, the current time is uploaded to the server.
    // A cron task then checks all the games every 5 minutes. If the last time scored is more than 5 minutes
    // old then the liveScored attribute is changed to 'n'.
    lastTimeScored = setInterval(updateLastTimeScored, 30000);
}

function toggleChangeScoreForm() {
    $(".changeScoreForm").toggle();
}

function generateGameSelection() {
    var html = '';

    html += "<div class='row divDropDownRow rowfix'>";
    html += "    Grade:";
    html += "    <select id='teamSelectionDivisionDropDown' onchange='changeTeamDropdowns()'>";
    for (var h = 0; h < allDivs.length; h += 1) {
        html += "<option value=" + allDivs[h].divisionID + ">" + allDivs[h].divisionName + "</option>";
    }
    html += "    </select>";
    html += "</div>";

    html += "<div class='row homeTeamRow rowfix'>";
    html += "    Home Team: <select id='teamSelectionHomeTeamDropDown'>";
    for (var r = 0; r < allTeams[selectedDivisionIndex].length; r += 1) {
        html += "    <option value='" + allTeams[selectedDivisionIndex][r].teamID + "'>" + allTeams[selectedDivisionIndex][r].teamName + "</option>";
    }
    html += "    </select>";
    html += "</div>";

    html += "<div class='row awayTeamRow rowfix'>";
    html += "    Away Team: <select id='teamSelectionAwayTeamDropDown'>";
    for (var s = 0; s < allTeams[selectedDivisionIndex].length; s += 1) {
        html += "    <option value='" + allTeams[selectedDivisionIndex][s].teamID + "'>" + allTeams[selectedDivisionIndex][s].teamName + "</option>";
    }
    html += "    </select>";
    html += "</div>";

    html += "<div class='row selectGameButtonRow'>";
    html += "    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame()'>Select Game</button></div>";
    html += "</div>";
    
    var scoringGameIDArray = JSON.parse(sessionStorage.scoringGameID);
    html += "<div id='currentScoringContainer' class='col-xs-47'>";
    html += "<div id='currentScoringContainerTitle'>Games you are scoring</div>";
    for (var j = 0; j < scoringGameIDArray.length; j += 1) {
        var game = scoringGameIDArray[j];
        var divID = parseInt(game[0].slice(-2));
        html += "<div class='currentScoringGameRow " + game[0] + "' onclick='startLiveScoring(" + game[0] + ")'>" + allDivs[divID].divisionName + " - " + game[1] + " vs " + game[2] + "</div>"
    }
    html += "</div>"
    
    $("#gameSelectionContainer").empty().append(html);
    if (scoringGameIDArray.length == 0) { $("#currentScoringContainer").hide(); }
    $("#teamSelectionDivisionDropDown").prop('selectedIndex', selectedDivisionIndex);
    showGameSelectionContainer();
    addBackEvent(['startGameSelection']);
    sessionStorage.currentPage = "gameSelection";
    setActivePage();
}

function startLiveScoring(gameID) {
    sessionStorage.currentGameID = gameID;
    checkGameLive('', '', true);
}

function changeTeamDropdowns() {
    selectedDivisionIndex = $("#teamSelectionDivisionDropDown").prop('selectedIndex');
    generateGameSelection();
}

function selectGame() {
    var today = new Date();
    var dd = pad(today.getDate(), 2);
    var mm = pad(today.getMonth() + 1, 2); //January is 0!
    var yyyy = String(today.getFullYear());
    var date = yyyy + mm + dd;

    var division = $("#teamSelectionDivisionDropDown").val();

    var homeText = $("#teamSelectionHomeTeamDropDown option:selected").text();
    var homeVal = $("#teamSelectionHomeTeamDropDown").val();
    var homeTeamID = pad(homeVal, 3);

    var awayText = $("#teamSelectionAwayTeamDropDown option:selected").text();
    var awayVal = $("#teamSelectionAwayTeamDropDown").val();
    var awayTeamID = pad(awayVal, 3);

    var gameID = date + homeTeamID + awayTeamID + division;
    if (homeText == awayText) {
        alertError("#alertDiv", "Please change one of the teams as they can't play themselves");
    } else if (gameID.length == 16) {
        sessionStorage.currentGameID = gameID;
        checkGameLive(homeText, awayText, false);
    } else if (gameID.length == 8) {
        alertError("#alertDiv", "Please enter a date for the game");
    } else {
        alertError("#alertDiv", "Error while creating gameID. Please use the contact form informing me of this error")
    }
}

function checkGameLive(homeTeam, awayTeam, alreadyScored) {
    var gameID = sessionStorage.currentGameID;

    var post = $.post('http://ccrscoring.co.nz/scripts/php/checkgame.php', {
            gameID: gameID,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            userID: localStorage.userID
        },
        function (response) {
            var scoringGameIDArray = JSON.parse(sessionStorage.scoringGameID);
            if (response == 'success') {
                if (!alreadyScored) {
                    scoringGameIDArray.push([gameID, homeTeam, awayTeam]);
                    sessionStorage.scoringGameID = JSON.stringify(scoringGameIDArray);
                }
                generateLiveScoring();
            } else if (response.substr(0, 11) == 'beingscored') {
                var scorersID = response.slice(-8);
                if (alreadyScored && (scorersID != localStorage.userID)) {
                    for (var a = 0; a < scoringGameIDArray.length; a += 1) {
                        if (scoringGameIDArray[a][0] == gameID) {
                            scoringGameIDArray.splice(a, 1);
                            a -= 1;
                            sessionStorage.scoringGameID = JSON.stringify(scoringGameIDArray);
                        }
                    }
                    generateGameSelection();
                    alertError("#alertDiv", "This game is already being live scored. Please try again later or select another game.");
                } else if (alreadyScored && (scorersID == localStorage.userID)) {
                    generateLiveScoring();
                } else {
                    alertError("#alertDiv", "This game is already being live scored. Please try again later or select another game.");
                }
            } else if (response == 'locked') {
                if (alreadyScored) {
                    for (var b = 0; b < scoringGameIDArray.length; b += 1) {
                        if (scoringGameIDArray[b][0] == gameID) {
                            scoringGameIDArray.splice(b, 1);
                            b -= 1;
                            sessionStorage.scoringGameID = JSON.stringify(scoringGameIDArray);
                        }
                    }
                    generateGameSelection();
                }
                alertError("#alertDiv", "This game is locked so it can\'t be updated.");
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while checking game status. Please try again later. If problem persists, use the contact form");
    });
}

function generateLiveScoring() {
    var html = '';
    var gameID = sessionStorage.currentGameID;
    var post = $.post('http://ccrscoring.co.nz/scripts/php/getgameinfo.php', {
            gameID: gameID
        },
        function (response) {
            if (gameID.length == 16) {
                var divID = parseInt(gameID.slice(-2));
                for (var k = 0; k < allTeams[divID].length; k += 1) {
                    var idFromArray = allTeams[divID][k].teamID;
                    var homeTeamID = '' + parseInt(gameID.substr(8, 3));
                    var awayTeamID = '' + parseInt(gameID.substr(11, 3));
                    if (homeTeamID == idFromArray) {
                        var homeTeamName = allTeams[divID][k].teamName;
                    } else if (awayTeamID == idFromArray) {
                        var awayTeamName = allTeams[divID][k].teamName;
                    }
                }
            } else {
                var homeTeamName = response[0].homeTeamName;
                var awayTeamName = response[0].awayTeamName;
            }

            var homeTeamScore = response[0].homeTeamScore;
            var awayTeamScore = response[0].awayTeamScore;

            // The stop scoring button, change score button and change score form. 
            // The form starts hidden and is toggled by clciking the change score button.
            // Bootstrap grid with width of 48 is used
            html += "<div class='row stopScoringButtonRow rowfix'>";
            html += "    <button type='submit' class='stopScoringButton col-xs-48' onclick='stopScoring(" + gameID + ")'>Stop Scoring</button>";
            html += "</div>";

            html += "<div class='row changeScoreFormButtonRow rowfix'>";
            html += "    <button type='button' class='changeScoreFormToggleButton col-xs-48' onclick='toggleChangeScoreForm()'>Change Score</button>";
            html += "</div>";

            html += "<div class='row rowfix'>";
            html += "    <div class='changeScoreForm col-xs-48'>";
            html += "        <div class='row changeScoreInputRow rowfix'>";
            html += "            <div class='changeScoreFormLabel col-xs-10'>" + homeTeamName + ":</div><input class='col-xs-18' type='number' id='newhomescore'><br>";
            html += "        </div>";
            html += "        <div class='row changeScoreInputRow rowfix'>";
            html += "            <div class='changeScoreFormLabel col-xs-10'>" + awayTeamName + ":</div><input class='col-xs-18' type='number' id='newawayscore'><br>";
            html += "        </div>";
            html += "        <div class='row changeScoreInputRow rowfix'>";
            html += "            <div class='changeScoreFormLabel col-xs-10'>Minutes Played:</div><input class='col-xs-18' type='number' id='newminutesplayed'><br>";
            html += "        </div>";
            html += "        <div class='row changeScoreInputRow rowfix'>";
            html += "            <button id='changeScoreFormButton' onclick='changeScore(" + gameID + ")'>Submit New Score</button>";
            html += "        </div>";
            html += "    </div>";
            html += "</div>\n\n";

            // The half and full time buttons are next. Clickingeither will call methods to upload the half or full time play
            html += "<div class='row rowfix timingInfoLive'>";
            html += "    <button type='button' class='halftime col-xs-23' onclick='sendHalfTime(" + gameID + "," +
                homeTeamScore + "," + awayTeamScore + ")'>Half Time</button>";
            html += "    <button type='button' class='fulltime col-xs-23' onclick='sendFullTime(" + gameID + "," +
                homeTeamScore + "," + awayTeamScore + ")'>Full Time</button>";
            html += "</div>\n\n";

            // If the score is 2-1 or 1-2 then the team with 1 defaulted
            var homeScore = '';
            var awayScore = '';
            if (homeTeamScore == '2') {
                homeScore = 'Win';
                awayScore = 'Defaulted';
            } else if (homeTeamScore == '1') {
                homeScore = 'Defaulted';
                awayScore = 'Win';
            } else {
                homeScore = homeTeamScore;
                awayScore = awayTeamScore;
            }

            // The team names and scores are added next.
            html += "<div class='row rowfix teamInfoLive'>";
            html += "    <div class='homeTeamName col-xs-24'>" + homeTeamName + "</div>";
            html += "    <div class='awayTeamName col-xs-24'>" + awayTeamName + "</div>";
            html += "</div>";
            html += "<div class='row rowfix scoreInfoLive'>";
            html += "    <div class='homeTeamScore col-xs-24'>" + homeScore + "</div>";
            html += "    <div class='awayTeamScore col-xs-24'>" + awayScore + "</div>";
            html += "</div>\n\n";

            // The 4 scoring plays are next. Once clicked, the scoring play will have a 
            // grey background and the previously selected play will be changed to a white background
            html += "<div class='row rowfix scoringPlayInfoLive'>";
            html += "    <div class='scoringPlayLive homeTry col-xs-24' onclick='toggleSelectedScoringPlay(this, \"homeTry\")'>Try</div>";
            html += "    <div class='scoringPlayLive awayTry col-xs-24' onclick='toggleSelectedScoringPlay(this, \"awayTry\")'>Try</div>";
            html += "</div>";
            html += "<div class='row rowfix scoringPlayInfoLive'>";
            html += "    <div class='scoringPlayLive homePenalty col-xs-24' onclick='toggleSelectedScoringPlay(this, \"homePenalty\")'>Penalty</div>";
            html += "    <div class='scoringPlayLive awayPenalty col-xs-24' onclick='toggleSelectedScoringPlay(this, \"awayPenalty\")'>Penalty</div>";
            html += "</div>";
            html += "<div class='row rowfix scoringPlayInfoLive'>";
            html += "    <div class='scoringPlayLive homeDropGoal col-xs-24' onclick='toggleSelectedScoringPlay(this, \"homeDropGoal\")'>Drop Goal</div>";
            html += "    <div class='scoringPlayLive awayDropGoal col-xs-24' onclick='toggleSelectedScoringPlay(this, \"awayDropGoal\")'>Drop Goal</div>";
            html += "</div>\n\n";

            // Next are the minutes played, description inputs and the 'Send' button. 
            // Clicking the 'Send' button will upload the information entered.
            html += "<div class='row rowfix scoringInfoLive'>";
            html += "    <div class='minutesPlayedLive col-xs-17'>Minutes Played</div>";
            html += "    <input type='number' class='minutesPlayedInput col-xs-31' value='" + response[0].minutesPlayed + "' step='1' min='1' max='125'></input>";
            html += "</div>";
            html += "<div class='row rowfix scoringInfoLive'>";
            html += "    <div class='descriptionLive col-xs-17'>Description</div>";
            html += "    <textarea rows='3' class='descriptionInput col-xs-31'></textarea>";
            html += "</div>";
            html += "<div class='row rowfix scoringInfoLive'>";
            html += "    <button type='submit' class='submitPlay col-xs-48' onclick='uploadScoringPlay(" + gameID + ", " + homeTeamScore + ", " + awayTeamScore + ")'>Submit Play</button>";
            html += "</div>\n\n";

            html += "<div class='row deletePlayButtonRow rowfix'>";
            html += "    <button class='deletePlayButton col-xs-48' type='button' onclick='deleteSelectedPlays()'>Delete Selected Plays</button>";
            html += "</div>\n\n";

            // Next is a list of the previously uploaded plays for this game
            html += "<div class='row scoringPlays rowfix'>\n\n";
            // Decode the json into an array
            var allScoringPlays = JSON && JSON.parse(response[0].scoringPlays) || $.parseJSON(response[0].scoringPlays);
            var homeScoreCurrent = 0;
            var awayScoreCurrent = 0;
            var updatePlayIndexes = '';
            // For each scoring play in the allScoringPlays array display a row with it's information. 
            // When the user clicks on a scoring play they are asked if they want to delete it.
            for (var j = 0; j < allScoringPlays.length; j += 1) {
                // Retrieve a single play
                var scoringPlayInfo = allScoringPlays[j];
                // Retrieve the play code of the scoring play. 
                // The first 4 (team) characters of the code can be: 
                // home, away, strt (start of game), updt (score update), half (half time), full (full time)
                // The rest of the code (play) is: the play ('Try', 'Penalty', 'Conversion', 'DropGoal') for home and away, 
                // 'Game' for strt, the score in the form of HHAA (eg 010006 for 10-6 to the home team) and 'Time' for half and full.
                var scoringPlay = scoringPlayInfo[1];
                var team = scoringPlay.substr(0, 4);
                var play = scoringPlay.substr(4);
                if (play == 'DropGoal') {
                    play = 'Drop Goal';
                }

                if (play == 'Time') {
                    // For the halfTime and fullTime plays, display the score on first row and 'Half Time' or 'Full Time' on the second row
                    html += "<div class='row time rowfix' onclick='togglePlayInSelectedPlays(this, \"" + gameID + "\", " + j + ", \"" + scoringPlay.substr(0, 4) + "\", \"" + scoringPlay.substr(4) + "\", " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", 0, 0)'>\n";
                    html += "<div class='col-xs-48'>" + homeScoreCurrent + "-" + awayScoreCurrent + "</div>\n";
                    html += "<div class='col-xs-48'>";
                    if (team == 'half') {
                        html += "Half Time";
                    } else {
                        html += "Full Time";
                    }
                    html += "</div>\n</div>\n\n";
                } else if (team == 'strt') {
                    // For strtGame, display a single row with 'Game Started' in the middle
                    html += "<div class='row gameStart rowfix'>\n<div class='col-xs-48'>Game Started</div>\n</div>\n\n";
                } else if (team == 'updt') {
                    // Add i to updatePlayIndexes
                    updatePlayIndexes = updatePlayIndexes + ',' + j;
                    if (play.length == 6) {
                        // For updtXXXYYY, first check if the update is a team defaulting and display appropriate 
                        // message. If not then extract new score from XXXX (play), display it and update the score.
                        if (parseInt(play.substr(0, 3)) == 2) {
                            scoreString = "Game Update: " + awayTeamName + " defaulted";
                        } else if (parseInt(play.substr(0, 3)) == 1) {
                            scoreString = "Game Update: " + homeTeamName + " defaulted";
                        } else {
                            scoreString = "Score Update: " + parseInt(play.substr(0, 3)) + " - " + parseInt(play.substr(3, 3)) + " (" + scoringPlayInfo[0] + "')";
                        }
                        html += "<div class='row update rowfix' onclick='togglePlayInSelectedPlays(this, \"" + gameID + "\", " + j + ", \"" + scoringPlay.substr(0, 4) + "\", \"" + scoringPlay.substr(4) + "\", " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", " + homeScoreCurrent + ", " + awayScoreCurrent + ")'>\n\t<div class='col-xs-48'>" + scoreString + "</div>\n</div>\n\n";
                        homeScoreCurrent = parseInt(play.substr(0, 3));
                        awayScoreCurrent = parseInt(play.substr(3, 3));
                    } else {
                        // For legacy updtXXYY, first check if the update is a team defaulting and display appropriate 
                        // message. If not then extract new score from XXXX (play), display it and update the score.
                        if (parseInt(play.substr(0, 2)) == 2) {
                            scoreString = "Game Update: " + awayTeamName + " defaulted";
                        } else if (parseInt(play.substr(0, 2)) == 1) {
                            scoreString = "Game Update: " + homeTeamName + " defaulted";
                        } else {
                            scoreString = "Score Update: " + parseInt(play.substr(0, 2)) + " - " + parseInt(play.substr(2, 2)) + " (" + scoringPlayInfo[0] + "')";
                        }
                        html += "<div class='row update rowfix' onclick='togglePlayInSelectedPlays(this, \"" + gameID + "\", " + j + ", \"" + scoringPlay.substr(0, 4) + "\", \"" + scoringPlay.substr(4) + "\", " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", " + homeScoreCurrent + ", " + awayScoreCurrent + ")'>\n\t<div class='col-xs-48'>" + scoreString + "</div>\n</div>\n\n";
                        homeScoreCurrent = parseInt(play.substr(0, 2));
                        awayScoreCurrent = parseInt(play.substr(2, 2));
                    }
                } else {
                    // For all the scoring plays, get the team (home or away), change the score based of the play (play) and team.
                    team = scoringPlay.substr(0, 4);
                    switch (play) {
                        case "Try":
                            if (team == "home") {
                                homeScoreCurrent = homeScoreCurrent + 5;
                            } else {
                                awayScoreCurrent = awayScoreCurrent + 5;
                            }
                            break;
                        case "Penalty":
                        case "Drop Goal":
                            if (team == "home") {
                                homeScoreCurrent = homeScoreCurrent + 3;
                            } else {
                                awayScoreCurrent = awayScoreCurrent + 3;
                            }
                            break;
                        case "Conversion":
                            if (team == "home") {
                                homeScoreCurrent = homeScoreCurrent + 2;
                            } else {
                                awayScoreCurrent = awayScoreCurrent + 2;
                            }
                            break;
                    }
                    // If the home team scored, then output play into first div (left). If away team scored, output 
                    // play into 3rd div (right). The score after that scoring play and minutes played are displayed 
                    // in the second div (center) in format "HH - AA (MM')"
                    html += "<div class='row scoringPlay rowfix' onclick='togglePlayInSelectedPlays(this, \"" + gameID + "\", " + j + ", \"" + scoringPlay.substr(0, 4) + "\", \"" + scoringPlay.substr(4) + "\", " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", 0, 0)'>\n";
                    html += "\t<div class='col-sm-20 col-xs-15 homeScoringPlay'>";
                    if (team == 'home') {
                        html += play;
                    }
                    html += "</div>\n\t<div class='col-sm-8 col-xs-18 minutesPlayed'>" + homeScoreCurrent + " - " + awayScoreCurrent + " (" + scoringPlayInfo[0] + "')</div>\n";
                    html += "\t<div class='col-sm-20 col-xs-15 awayScoringPlay'>";
                    if (team == 'away') {
                        html += play;
                    }
                    html += "</div>\n";
                    // The second row displays the description for the scoring play if given
                    html += "\t<div class='col-xs-48'>" + scoringPlayInfo[2] + "</div>\n";
                    html += "</div>\n\n";

                }
            }
            // close scoringplays div from just before "for" loop
            html += "</div>\n\n";
            html += "<span id='updatePlayIndexes' style='display: none'>" + updatePlayIndexes + "</span>";

            $("#liveScoringContainer").empty().append(html);
            showLiveScoringContainer();
            sessionStorage.currentPage = "liveScoring";
            setActivePage();
            addBackEvent(['startLiveScoring']);
        }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while adding game. Please try again later. If problem persists, use the contact form");
    })
}

function updateLastTimeScored() {
    var scoringGameIDArray = JSON.parse(sessionStorage.scoringGameID);
    for (var e = 0; e < scoringGameIDArray.length; e += 1) {
        var post = $.post('http://ccrscoring.co.nz/scripts/php/updatelasttimescored.php', {
            gameID: scoringGameIDArray[e][0]
        },
        function (response) {
            if (response == 'success') {
                if (1) {}
            }
        });
    }
}

function stopScoring(gameID) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/stopscoring.php', {
            gameID: sessionStorage.currentGameID
        },
        function (response) {
            // go back to game selection
            if (response != 'success') {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please use the contact form informing me of this.");
            } else {
                var scoringGameIDArray = JSON.parse(sessionStorage.scoringGameID);
                for (var g = 0; g < scoringGameIDArray.length; g += 1) {
                    if (scoringGameIDArray[g][0] == gameID) {
                        scoringGameIDArray.splice(g, 1);
                        g -= 1;
                    }
                }
                sessionStorage.scoringGameID = JSON.stringify(scoringGameIDArray);
                generateGameSelection();
                alertNotification("#alertDiv", "You have been logged out");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while logging out. Please use the contact form informing me of this.");
        generateGameSelection();
    })
}

function changeScore(gameID) {
    var homeScore = $('#newhomescore').val();
    var awayScore = $('#newawayscore').val();
    var minutesPlayed = $('#newminutesplayed').val();
    var result = areInputsValidChange(homeScore, awayScore, minutesPlayed);
    if (result[0]) {
        var scoringPlay = 'updt' + pad(homeScore, 3) + pad(awayScore, 3);
        uploadPlayLive(gameID, homeScore, awayScore, minutesPlayed, scoringPlay, '');
    } else {
        alertError("#alertDiv", result[1]);
    }
}

function sendHalfTime(gameID, homeScore, awayScore) {
    selectedScoringPlay = '';
    uploadPlayLive(gameID, homeScore, awayScore, '40', 'halfTime', '', 'n');
}

function sendFullTime(gameID, homeScore, awayScore) {
    selectedScoringPlay = '';
    uploadPlayLive(gameID, homeScore, awayScore, '80', 'fullTime', '', 'y');
}

function uploadScoringPlay(gameID, homeScore, awayScore) {
    team = selectedScoringPlay.substr(0, 4);
    play = selectedScoringPlay.substr(4);
    minutesPlayed = document.getElementsByClassName("minutesPlayedInput")[0].value;
    description = document.getElementsByClassName("descriptionInput")[0].value;
    var result = areInputsValidUpload(play, minutesPlayed);
    if (result[0]) {
        // Change the current score based on the play and team passed in
        switch (play) {
            case "Try":
                if (team == "home") {
                    homeScore += 5;
                } else {
                    awayScore += 5;
                }
                break;
            case "Penalty":
            case "DropGoal":
                if (team == "home") {
                    homeScore += 3;
                } else {
                    awayScore += 3;
                }
                break;
            case "Conversion":
                if (team == "home") {
                    homeScore += 2;
                } else {
                    awayScore += 2;
                }
                break;
        }
        var scoringPlay = team + play;
        uploadPlayLive(gameID, homeScore, awayScore, minutesPlayed, scoringPlay, description, 'n');
    } else {
        alertError("#alertDiv", result[1]);
    }
}

function uploadPlayLive(gameID, homeScore, awayScore, minutesPlayed, scoringPlay, description, locked) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/uploadplay.php', {
        gameID: gameID,
        homeScore: homeScore,
        awayScore: awayScore,
        minutesPlayed: minutesPlayed,
        scoringPlay: scoringPlay,
        description: description,
        locked: locked
    },
    function (response) {
        if (response == 'success') {
            if (selectedScoringPlay.substr(4) == 'Try') {
                $('#dialog').dialog({
                    buttons: {
                        "Yes": function() {
                            selectedScoringPlay = selectedScoringPlay.substr(0, 4) + "Conversion";
                            uploadScoringPlay(gameID, homeScore, awayScore);
                            $('#dialog').dialog('close');
                        },
                        "No":  function() {
                            selectedScoringPlay = '';
                            generateLiveScoring();
                            alertSuccess("#alertDiv", "Play successfully uploaded");
                            $('#dialog').dialog('close');
                        }
                    }, 
                    modal: true,
                    resizable: false,
                    draggable: false
                });
            } else {
                selectedScoringPlay = '';
                generateLiveScoring();
                alertSuccess("#alertDiv", "Play successfully uploaded");
            }
        } else if (response == 'locked') {
            alertError("#alertDiv", "This game is locked so it can\'t be updated. If you have uploaded the 'Full Time' play, you can unlock the game by deleting it, otherwise an admin locked the game.");
        } else {
            // Error
            alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
        }
        
    });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while uploading play. Please try again later. If problem persists, use the contact form");
    })
}

// Changes background of selected scoring play to light grey and the rest to transparent
function toggleSelectedScoringPlay(elem, play) {
    $(".scoringPlayLive").css('background-color', 'transparent');
    elem.style.backgroundColor = '#bcbcbc';
    this.selectedScoringPlay = play;
}

// Checks if all the inputs are valid when uploading a scoring play
function areInputsValidUpload(play, minutesPlayed) {
    var message = "";
    var valid = true;

    if (play == "") {
        message += "Please select a play\n";
        valid = false;
    }

    // Tests if minutesPlayed is not an integer
    if (isNaN(minutesPlayed) || !(parseInt(Number(minutesPlayed)) == minutesPlayed) ||
        isNaN(parseInt(minutesPlayed, 10)) || parseInt(minutesPlayed) < 0 || parseInt(minutesPlayed) > 120) {
        message += "Please enter a valid minutes played (min: 0, max: 120, no decimal)\n";
        valid = false;
    }

    return [valid, message];
}

// Checks if inputs are valid when user submits change score form
function areInputsValidChange(homeScore, awayScore, minutesPlayed) {
    var message = "";
    var valid = true;
    if (isNaN(homeScore) || !(parseInt(Number(homeScore)) == homeScore) ||
        isNaN(parseInt(homeScore, 10)) || parseInt(homeScore) < 0 || parseInt(homeScore) > 200) {
        message += "Please enter a valid home score\n";
        valid = false;
    }

    if (isNaN(awayScore) || !(parseInt(Number(awayScore)) == awayScore) ||
        isNaN(parseInt(awayScore, 10)) || parseInt(awayScore) < 0 || parseInt(awayScore) > 200) {
        message += "Please enter a valid away score\n";
        valid = false;
    }

    // Tests if minutesPlayed is not an integer
    if (isNaN(minutesPlayed) || !(parseInt(Number(minutesPlayed)) == minutesPlayed) ||
        isNaN(parseInt(minutesPlayed, 10)) || parseInt(minutesPlayed) < 0 || parseInt(minutesPlayed) > 120) {
        message += "Please enter a valid minutes played (min: 0, max: 120, no decimal)\n";
        valid = false;
    }

    return [valid, message];
}

// Change appearance of the selected plays in live scoring page
function togglePlayInSelectedPlays(elem, gameID, index, team, play, homeScore, awayScore, oldHomeScore, oldAwayScore) {
    // Check if play is already in selected play array. If it is store index of it in playInArray
    var playInArray = -1;
    for (k = 0; k < selectedPlays.length && playInArray == -1; k += 1) {
        if (selectedPlays[k][1] == index) {
            playInArray = k;
        }
    }

    if (playInArray == -1) {
        // Add play to selectedPlays if not already in array
        if (team == 'updt') {
            var array = [gameID, index, team, play, homeScore, awayScore, oldHomeScore, oldAwayScore];
            selectedPlays.push(array);
        } else {
            var array = [gameID, index, team, play, homeScore, awayScore];
            selectedPlays.push(array);
        }
        // Change background to yellowish to show user play has been selected
        elem.style.backgroundColor = '#fdffd2';
    } else {
        // remove play from selectedPlays
        selectedPlays.splice(playInArray, 1);
        // remove background colour to show play not selected anymore
        elem.style.backgroundColor = 'transparent';
    }

    // Sort array in descending index order
    selectedPlays.sort(function (a, b) {
        return parseInt(b[1]) - parseInt(a[1]);
    });

    // Show delete button if there is at least 1 play selected, otherwise hide it
    if (selectedPlays.length > 0) {
        $(".deletePlayButtonRow").show();
    } else {
        $(".deletePlayButtonRow").hide();
    }

    // Debug problems with adding games to selectedPlays array
    //alertError("#alertDiv", selectedPlays.join('\n'));
}

// Delete the plays selected by the user
function deleteSelectedPlays() {
    var string = '';
    // Keep track of num of plays deleted so that the plays are deleted before emptying array and reloading page.
    var playsDeleted = 0;
    var error = false;
    // Keep track of current score as the play are deleted
    var currentscores = [-1, -1];
    var indexes = [];
    var gameID = '';
    // There will always be at least 1 play to be deleted as the button which calls this is only visible if a play is selected
    for (i = 0; i < selectedPlays.length; i += 1) {
        // Get scoring play to be deleted
        var p = selectedPlays[i];
        
        // On the first pass through set the current scores and gameID
        if (i == 0) {
            currentscores[0] = p[4];
            currentscores[1] = p[5];
            gameID = p[0];
        }
        
        // Add index to array of indexes to be deleted
        indexes.push(p[1]);

        // Check whether the score should be changed. The score shouldn't be changed 
        // if there was an update play uploaded after the play being deleted
        if (shouldScoreBeChanged(p[1])) {
            string += "i=" + i + ", index=" + p[1] + ", Score Changed\n";
            // Calculate score after removing play. The score for update plays needs to calculated differently.
            // Time plays don't change score so skip this part
            if (p[2] == 'updt') {
                currentscores = calcScoresUpdate(p[2], p[3], currentscores[0], currentscores[1], p[6], p[7]);
            } else if (p[2] == 'home' || p[2] == 'away') {
                currentscores = calcScores(p[2], p[3], currentscores[0], currentscores[1]);
            }
        } else {
            string += "i=" + i + ", index=" + p[1] + ", Score Not Changed\n";
        }
    }

    var post = $.post('http://ccrscoring.co.nz/scripts/php/deletescoringplay.php', {
            gameID: gameID,
            indexes: JSON.stringify(indexes),
            homeScore: currentscores[0],
            awayScore: currentscores[1]
        },
        function (response) {
            if (response == 'success') {
                // Empty selected plays array
                selectedPlays.length = 0;

                // Reload page
                generateLiveScoring();
                
                alertSuccess("#alertDiv", "Scoring plays have been deleted");
            } else if (response == 'locked') {
                alertError("#alertDiv", "This game is locked so it can\'t be updated. If you have uploaded the 'Full Time' play, you can unlock the game by deleting it, otherwise an admin locked the game."); 
            } else {
                alertError("#alertDiv", 'Error. Please try again later. If problem persists, use the contact form');
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while deleting games. Please try again later. If problem persists, use the contact form");
    });
}

// Checks whether the score should be changed. The score shouldn't be changed 
// if there was an update play uploaded after the one being deleted
function shouldScoreBeChanged(index) {
    // Get the string containing the indexes of all the update plays and split them at each comma
    var elem = document.getElementById('updatePlayIndexes').textContent;
    var split = elem.split(",");
    // Iterate through all the update play indexes
    for (j = 1; j < split.length; j += 1) {
        // If there is an update play with an index higher (occurred after play being deleted)
        // then the score shouldn't be changed so return false.
        if (parseInt(split[j]) > parseInt(index)) {
            return false;
        } else if (parseInt(split[j]) == parseInt(index)) {
            split.splice(j, 1);
            j -= 1;
            document.getElementById('updatePlayIndexes').textContent = split.join(",");
        }
    }

    // If none of the update play indexes are higher than the index of the play being deleted then return true.
    return true;
}

// Calculate the score after deleting the scoring play
function calcScores(team, play, homeScore, awayScore) {
    switch (play) {
        case "Try":
            if (team == "home") {
                homeScore -= 5;
            } else {
                awayScore -= 5;
            }
            break;
        case "Penalty":
        case "DropGoal":
            if (team == "home") {
                homeScore -= 3;
            } else {
                awayScore -= 3;
            }
            break;
        case "Conversion":
            if (team == "home") {
                homeScore -= 2;
            } else {
                awayScore -= 2;
            }
            break;
    }

    return [homeScore, awayScore];
}

// Calculate the score after deleting an update play
function calcScoresUpdate(team, play, homeScore, awayScore, oldHomeScore, oldAwayScore) {
    // The update play length was increased to handle scores above 99 so it 6 characters long (XXXYYY e.g. 145005 for 145-5) instead of 4.
    // Work out the amount the home and away scores were increased by when update was uploaded
    if (play.length == 6) {
        diffHomeScore = parseInt(play.substr(0, 3)) - oldHomeScore;
        diffAwayScore = parseInt(play.substr(3, 3)) - oldAwayScore;
    } else {
        diffHomeScore = parseInt(play.substr(0, 2)) - oldHomeScore;
        diffAwayScore = parseInt(play.substr(2, 2)) - oldAwayScore;
    }
    // Adjust current scores by amounts above
    newHomeScore = homeScore - diffHomeScore;
    newAwayScore = awayScore - diffAwayScore;

    return [newHomeScore, newAwayScore];
}

/* 
--------------------------------------------------------------------------
--------------------------- End Game Scoring -----------------------------
--------------------------------------------------------------------------
*/

var selectedDivisionIndexEnd = 0;

function endScoring(createBackEvent) {
    changeAutoUpdateInterval(NEVER);
    if (createBackEvent) {
        addBackEvent(['startEndScoring']);
    }
    sessionStorage.currentPage = 'endScoring';
    setActivePage();
    if (sessionStorage.endScoringPassword == "correct") {
        generateEndScoring();
    } else {
        showEndScoringPasswordContainer();
    }
}

function addEventsEnd() {
    $("#endScoringPasswordContainer").on({
        keydown: function (event) {
            if (event.which == 13) { // Enter
                // Stop a line break being added
                event.preventDefault();
                $("#checkEndScoringPasswordButton").click();
            }
        }
    });
    
    $("#datePicker").pickadate({
        format: 'ddd d mmm yy',
        today: 'Today',
        clear: 'Clear',
        close: 'Cancel',
        labelMonthNext: 'Go to the next month',
        labelMonthPrev: 'Go to the previous month',
        formatSubmit: 'dd/mm/yyyy',
        hiddenPrefix: 'prefix__'
    });
}

// Shows password div
function showEndScoringPasswordContainer() {
    hideAllContainers();
    setInstructions('endScoringPassword');
    $("#endScoringPasswordContainer").show();
}

// Uses jquery ajax to call php script to check live scoring password entered is correct
function checkEndScoringPassword() {
    var passwordInput = $("#endScoringPasswordInput").val();
    $.post(
        'http://ccrscoring.co.nz/scripts/php/checkpassword.php', {
            page: 'endScoring',
            password: passwordInput
        },
        function (response) {
            if (response == 'correct') {
                // Correct password. Hide password and generate team lists
                sessionStorage.endScoringPassword = "correct";
                endScoring();
            } else if (response == 'incorrect') {
                // Incorrect password. Do nothing
                alertError("#alertDiv", "Incorrect password. Please try again.")
                $("#endScoringPasswordInput").val = "";
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        }).fail(function () {
        alertError("#alertDiv", "Error while checking password. Please try again later. If problem persists, use the contact form");
    })
}

// Show game editor container
function showEndScoringContainer() {
    hideAllContainers();
    setInstructions('endScoring');
    $("#endScoringContainer").show();
}

function generateEndScoring() {
    var html = '';

    html += "<div class='row divDropDownRowEnd rowfix'>";
    html += "    <div class='titleEnd'>Grade:</div>";
    html += "    <select id='endScoringDivisionDropDown' onchange='changeTeamDropdownsEnd()'>";
    for (var l = 0; l < allDivs.length; l += 1) {
        html += "<option value=" + allDivs[l].divisionID + ">" + allDivs[l].divisionName + "</option>";
    }
    html += "    </select>";
    html += "</div>";

    html += "<div class='row homeTeamRowEnd rowfix'>";
    html += "    <div class='titleEnd'>Home Team</div>";
    html += "    <select id='endScoringHomeTeamDropDown'>";
    for (var m = 0; m < allTeams[selectedDivisionIndexEnd].length; m += 1) {
        html += "    <option value='" + allTeams[selectedDivisionIndexEnd][m].teamID + "'>" + allTeams[selectedDivisionIndexEnd][m].teamName + "</option>";
    }
    html += "    </select>";
    html += "</div>";

    html += "<div class='row homeScoreRowEnd rowfix'>";
    html += "    <div class='titleEnd'>Home Score</div> <input type='number' id='homeScore'>";
    html += "    Defaulted <input type='checkbox' id='homeCheckbox' onchange='toggleScoreInputs()'>";
    html += "</div>";

    html += "<div class='row awayTeamRowEnd rowfix'>";
    html += "    <div class='titleEnd'>Away Team</div>";
    html += "    <select id='endScoringAwayTeamDropDown'>";
    for (var n = 0; n < allTeams[selectedDivisionIndexEnd].length; n += 1) {
        html += "    <option value='" + allTeams[selectedDivisionIndexEnd][n].teamID + "'>" + allTeams[selectedDivisionIndexEnd][n].teamName + "</option>";
    }
    html += "    </select>";
    html += "</div>";

    html += "<div class='row awayScoreRowEnd rowfix'>";
    html += "    <div class='titleEnd'>Away Score</div> <input type='number' id='awayScore'>";
    html += "    Defaulted <input type='checkbox' id='awayCheckbox' onchange='toggleScoreInputs()'>";
    html += "</div>";

    html += "<div class='row datePickerRowEnd rowfix'>";
    html += "    <div class='titleEnd'>Date</div> <input type='date' id='datePicker'>";
    html += "</div>";

    html += "<div class='row submitScoreButtonRow rowfix'>";
    html += "    <button class='submitScoreButton' onClick='submitScore()'>Submit Score</button>";
    html += "</div>";

    $("#endScoringContainer").empty().append(html);
    $("#endScoringDivisionDropDown").prop('selectedIndex', selectedDivisionIndexEnd);
    addEventsEnd();
    showEndScoringContainer();
}

function changeTeamDropdownsEnd() {
    selectedDivisionIndexEnd = $("#endScoringDivisionDropDown").prop('selectedIndex');
    generateEndScoring();
}

// Disable score input on end game scoring page if a checkbox is checked
function toggleScoreInputs() {
    var homeCheckbox = document.getElementById("homeCheckbox").checked;
    var awayCheckbox = document.getElementById("awayCheckbox").checked;

    // if either checkbox is checked, disable score inputs
    if (homeCheckbox || awayCheckbox) {
        document.getElementById('homeScore').disabled = true;
        document.getElementById('awayScore').disabled = true;
    } else {
        document.getElementById('homeScore').disabled = false;
        document.getElementById('awayScore').disabled = false;
    }
}

function checkGameEnd(gameID, homeScore, awayScore, scoringPlay, homeTeam, awayTeam) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/checkgame.php', {
            gameID: gameID,
            homeTeam: homeTeam,
            awayTeam: awayTeam
        },
        function (response) {
            if (response == 'success') {
                uploadPlayEnd(gameID, homeScore, awayScore, scoringPlay);
            } else if (response == 'beingscored') {
                alertError("#alertDiv", "This game is already being live scored. Please try again later or select another game.");
            } else if (response == 'locked') {
                alertError("#alertDiv", "This game is locked so can\'t be updated. If you think the score is wrong then use the contact form to send me a message.");
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while checking game status. Please try again later. If problem persists, use the contact form");
    })
}

function submitScore() {
    var today = $("#datePicker")[0].nextElementSibling.nextElementSibling.value;
    var dd = today.substr(0, 2);
    var mm = today.substr(3, 2);
    var yyyy = today.substr(6, 4);

    var division = $("#endScoringDivisionDropDown").val();

    var homeVal = $("#endScoringHomeTeamDropDown").val();
    var homeText = $("#endScoringHomeTeamDropDown option:selected").text();
    var homeTeamID = pad(homeVal, 3);

    var awayVal = $("#endScoringAwayTeamDropDown").val();
    var awayText = $("#endScoringAwayTeamDropDown option:selected").text();
    var awayTeamID = pad(awayVal, 3);

    var homeCheckbox = document.getElementById("homeCheckbox").checked;
    var awayCheckbox = document.getElementById("awayCheckbox").checked;
    var homeScore = document.getElementById("homeScore").value;
    var awayScore = document.getElementById("awayScore").value;

    var result = areInputsValidEnd(homeVal, awayVal, homeCheckbox, awayCheckbox, homeScore, awayScore, today);
    if (result[0]) {
        var gameID = String(yyyy) + String(mm) + String(dd) + homeTeamID + awayTeamID + division;

        if (homeCheckbox) {
            homeScore = 1;
            awayScore = 2;
        } else if (awayCheckbox) {
            homeScore = 2;
            awayScore = 1;
        }

        var scoringPlay = 'updt' + pad(homeScore, 3) + pad(awayScore, 3);

        checkGameEnd(gameID, homeScore, awayScore, scoringPlay, homeText, awayText);
    } else {
        alertError("#alertDiv", result[1]);
    }
}

// Checks if input are valid when submitting end game score
function areInputsValidEnd(homeValue, awayValue, homeCheckbox, awayCheckbox, homeScore, awayScore, date) {
    var message = "";
    var valid = true;

    if (homeValue == awayValue) {
        message += "Please change one of the teams as they can't play themselves.<br>";
        valid = false;
    }

    if (homeCheckbox && awayCheckbox) {
        message += "Uncheck one of the checkboxes because both teams can't default.<br>";
        valid = false;
    }

    if (!(homeCheckbox || awayCheckbox) && (isNaN(homeScore) || !(parseInt(Number(homeScore)) == homeScore) ||
            isNaN(parseInt(homeScore, 10)) || parseInt(homeScore) < 0 || parseInt(homeScore) > 200)) {
        message += "Please enter a valid home score.<br>";
        valid = false;
    }

    if (!(homeCheckbox || awayCheckbox) && (isNaN(awayScore) || !(parseInt(Number(awayScore)) == awayScore) ||
            isNaN(parseInt(awayScore, 10)) || parseInt(awayScore) < 0 || parseInt(awayScore) > 200)) {
        message += "Please enter a valid away score.<br>";
        valid = false;
    }

    if (date == "") {
        message += "Please enter a date.<br>";
        valid = false;
    }

    return [valid, message];
}

function uploadPlayEnd(gameID, homeScore, awayScore, scoringPlay) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/uploadplay.php', {
            gameID: gameID,
            homeScore: homeScore,
            awayScore: awayScore,
            minutesPlayed: '80',
            scoringPlay: scoringPlay,
            description: '',
            locked: 'y'
        },
        function (response) {
            if (response == 'success') {
                generateEndScoring();
                alertSuccess("#alertDiv", "Game successfully uploaded");
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while uploading score. Please try again later. If problem persists, use the contact form");
    })
}

/* 
--------------------------------------------------------------------------
------------------------------- Contact ----------------------------------
--------------------------------------------------------------------------
*/

function showContactContainer() {
    hideAllContainers();
    setInstructions('contact');
    sessionStorage.currentPage = 'contact';
    addBackEvent(['startContactForm']);
    setActivePage();
    addEventsContact();
    $("#contactContainer").show();
}

function addEventsContact() {
    $("#contactContainer").on({
        keydown: function (event) {
            if (event.which == 13) { // Enter
                // Stop a line break being added
                event.preventDefault();
                $("#contactFormButton").click();
            }
        }
    });
}

function submitContactForm() {
    var name = $("#contactFormName").val();
    var email = $("#contactFormEmail").val();
    var message = $("#contactFormMessage").val();

    if (message != "") {
        var post = $.post('http://ccrscoring.co.nz/scripts/php/contactform.php', {
                name: name,
                email: email,
                message: message
            },
            function (response) {
                if (response == 'success') {
                    $("#contactFormName").val('');
                    $("#contactFormEmail").val('');
                    $("#contactFormMessage").val('');
                    alertSuccess("#alertDiv", 'Message sent');
                } else {
                    alertError("#alertDiv", 'Message not sent. Please try again later. If problem persists, use the contact form');
                }
            });

        post.fail(function (request, textStatus, errorThrown) {
            alertError("#alertDiv", "Error while sending message. Please try again later. If problem persists, use the contact form");
        })
    } else {
        alertError("#alertDiv", 'Please enter a message');
    }
}