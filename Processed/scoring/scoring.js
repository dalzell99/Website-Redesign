var divTitles = [];

$(document).ready(function () {
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getalldivisions.php', {}, 
        function (response) {
            for (var t = 0; t < response.length; t += 1) {
                var divisionID = response[t].divisionID.length == 1 ? '0' + response[t].divisionID : '' + response[t].divisionID;
                divTitles.push([divisionID, response[t].divisionName])
            }
        }, 
    'json');
    
    post.fail(function() {
        alert("Error while getting division list. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    });
    
    post.always(function () {
        if(typeof(Storage) !== "undefined") {
            if (sessionStorage.currentPage == "drawResults" || sessionStorage.currentPage == null) {
                drawResults();
            } else if (sessionStorage.currentPage == "liveScoring" || sessionStorage.currentPage == "gameSelection") {
                liveScoring();
            } else if (sessionStorage.currentPage == "gameInfo") {
                gameInfo(sessionStorage.currentGameID);
            } else {
                endScoring();
            }
        } else {
            alert("Sorry, you can't use this website until you update your browser/device to the latest version");
        }
    });
});

// Hides all the web page containers
function hideAllContainers() {
    $("#liveScoringPasswordContainer").hide();
    $("#endScoringPasswordContainer").hide();
    $("#drawResultsContainer").hide();
    $("#gameInfoContainer").hide();
    $("#gameSelectionContainer").hide();
    $("#liveScoringContainer").hide();
    $("#endScoringContainer").hide();
}

function setActivePage() {
    $("li.active").removeClass("active");
    var currentPage = sessionStorage.currentPage == 'gameSelection' ? 'liveScoring' : sessionStorage.currentPage;
    $("." + currentPage).addClass("active");
}

/* 
--------------------------------------------------------------------------
----------------------------- Draw/Results -------------------------------
--------------------------------------------------------------------------
*/

var currentWeek = 0;
var numWeeks = 18;
var allGames = [];
var allTeams = [];
var startDateArray = [2015, 2, 23];

function drawResults() {
    sessionStorage.currentPage = "drawResults";
    setActivePage();
    generateWeekSelector();
    generateGames();
    showDrawResultsContainer()
}

// Show draw/result container
function showDrawResultsContainer() {
    hideAllContainers();
    $("#drawResultsContainer").show();
}

function toggleWeeks() {
    $("#weeksList").toggle();
}

function generateWeekSelector() {
    var startDate = new Date(startDateArray[0], startDateArray[1], startDateArray[2]);
    var endDate = new Date(startDateArray[0], startDateArray[1], startDateArray[2]).addDays(6);
    html = '';
    
    html += "<div class='weektoggledisplay col-xs-47'>";
    html += "    <div onclick='toggleWeeks()' class='showweeks'>Show Weeks</div>";
    html += "        <nav id='weeksList' class='row'>";
    for (var a = 0; a < numWeeks; a += 1) {
        html += "        <button onclick='changeWeeks(" + a + ")' class='weeknav week" + (a + 1) + " col-xs-12 col-sm-8 col-md-4'>";
        html += "            <div class='weektitle'>W" + (a + 1) + "</div>";
        html += "            <div class='date'>" + startDate.toString() + " - " + endDate.toString() + "</div>";
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
    html += "        <div class='colourLabel'>Live Scoring Started but Not Finished</div>";
    html += "    </div>";
    html += "    <div class='colour col-xs-24'>";
    html += "        <div class='redSquare'></div>";
    html += "        <div class='colourLabel'>Game Finished</div>";
    html += "    </div>";
    html += "</div>";
    
    $("#weekSelectorContainer").empty().append(html);
    setActiveWeek();
}

function generateGames() {
    html = '';
    var gameInDivisionThisWeekArray = [];
    
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getallgames.php', {}, 
        function(response) {
            // put all games into array
            allTeams = response[0];
            allGames = response[1];
        
            var gamesInRow = 0;
            var startOfWeek = new Date(startDateArray[0], startDateArray[1], startDateArray[2]).addDays(7 * currentWeek);
            var endOfWeek = new Date(startDateArray[0], startDateArray[1], startDateArray[2]).addDays(6 + 7 * currentWeek);

            for (var b = 0; b < divTitles.length; b += 1) {
                var gameInDivisionThisWeek = false;
                html += "<div id='div" + divTitles[b][0] + "Row' class='row rowfix'>";
                html += "    <div class='col-sm-48 divtitle' onclick='toggleGames(`div" + divTitles[b][0] + "`);'>";
                html += "        <h3>" + divTitles[b][1] + "</h3>";
                html += "    </div><!-- End of divtitle div -->";
                html += "    <div class='col-xs-48 gamerowcontainer div" + divTitles[b][0] + "'>";
                html += "        <div class='row gamerow'>";

                for (var c = 0; c < allGames.length; c += 1) {
                    var gameID = allGames[c].GameID;
                    var gameDateString = gameID.substr(0, 8);
                    var year = parseInt(gameDateString.substr(0, 4));
                    var month = parseInt(gameDateString.substr(4, 2)) - 1;
                    var day = parseInt(gameDateString.substr(6, 8));
                    var gameDateDate = new Date(year, month, day);
                    if (gameDateDate <= endOfWeek && gameDateDate >= startOfWeek && gameID.slice(-2) == divTitles[b][0]) {
                        gameInDivisionThisWeek = true;
                        if (gameID.length > 14) {
                            var homeTeamID = parseInt(gameID.substr(8, 3));
                            var awayTeamID = parseInt(gameID.substr(11, 3));
                            for (var d = 0; d < allTeams.length; d += 1) {
                                if (allTeams[d].teamID == homeTeamID.toString()) {
                                    var homeTeamName = allTeams[d].teamName;
                                } else if (allTeams[d].teamID == awayTeamID.toString()) {
                                    var awayTeamName = allTeams[d].teamName;
                                }
                            }
                        } else {
                            var homeTeamName = allGames[c].homeTeamName;
                            var awayTeamName = allGames[c].awayTeamName;
                        }

                        var timeString = '';
                        var gameSituation = '';
                        if (allGames[c].minutesPlayed == 0) {
                            timeString = gameDateDate.toString;
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
                        if (allGames[c].homeTeamScore > allGames[c].awayTeamScore) {
                            winningTeam = "home";
                        } else if (allGames[c].awayTeamScore > allGames[c].homeTeamScore) {
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

                        html += "            <div class='col-sm-15 game " + gameSituation + "' onclick='gameInfo(" + allGames[c].GameID + ");'>";
                        html += "                <div class='row'>";
                        html += "                    <div class='col-xs-48 location'>" + allGames[c].location + " - " + timeString + "</div>";
                        html += "                </div>";
                        html += "                <div class='row'>";
                        html += "                    <div class='col-xs-48 refs'>" + refString + "</div>";
                        html += "                </div>";
                        if (winningTeam == 'home') { html += "<strong>"; }
                        html += "                <div class='row teams hometeam'>";
                        html += "                    <div class='teamname col-xs-20 col-sm-33'>" + homeTeamName + "</div>";
                        html += "                    <div class='score col-xs-16 col-sm-15'>" + homeTeamScore + "</div>";
                        html += "                </div>";
                        if (winningTeam == 'home') { html += "</strong>"; }
                        if (winningTeam == 'away') { html += "<strong>"; }
                        html += "                <div class='row teams hometeam'>";
                        html += "                    <div class='teamname col-xs-20 col-sm-33'>" + awayTeamName + "</div>";
                        html += "                    <div class='score col-xs-16 col-sm-15'>" + awayTeamScore + "</div>";
                        if (winningTeam == 'away') { html += "</strong>"; }
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
                    gameInDivisionThisWeekArray.push(divTitles[b][0]);
                }
            }

            $("#gameContainer").empty().append(html);
            
            for (var f = 0; f < gameInDivisionThisWeekArray.length; f += 1) {
                $("#div" + gameInDivisionThisWeekArray[f] + "Row").hide();
            }
            
            setActiveWeek();
        }, 
    'json');
    
    post.fail(function() {
        alert("Error while displaying games. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function changeWeeks(week) {
    currentWeek = week;
    generateGames();
}

function setActiveWeek() {
    $(".weeknav.active").removeClass("active");
    $(".week".concat(currentWeek + 1)).addClass("active");
}

// Show/hide the games for the division that the user clicked on
function toggleGames(divID) {
    $(".".concat(divID)).toggle();
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.toString = function() {
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return this.getDate() + " " + months[this.getMonth()];
};

/* 
--------------------------------------------------------------------------
------------------------------ Game Info ---------------------------------
--------------------------------------------------------------------------
*/

function gameInfo(gameID) {
    sessionStorage.currentPage = "gameInfo";
    sessionStorage.currentGameID = gameID;
    hideAllContainers();
    generateGameInfo();
    showGameInfoContainer();
}

function showGameInfoContainer() {
    $("#gameInfoContainer").show();
}

function generateGameInfo() {
    var gameID = sessionStorage.currentGameID;
    html = '';
    
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getgameinfo.php', 
        { gameID: gameID }, 
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
                minutesOrTime = gameDateDate.toString() + " " + response[0].time;
            } else if(response[0].minutesPlayed == '80') {
                minutesOrTime = 'Full Time';
            } else if(response[0].minutesPlayed == '40') {
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
                            if (team == "home") { homeScoreCurrent = homeScoreCurrent + 5; }
                            else { awayScoreCurrent = awayScoreCurrent + 5; }
                            break;
                        case "Penalty":
                        case "Drop Goal":
                            if (team == "home") { homeScoreCurrent = homeScoreCurrent + 3; }
                            else { awayScoreCurrent = awayScoreCurrent + 3; }
                            break;
                        case "Conversion":
                            if (team == "home") { homeScoreCurrent = homeScoreCurrent + 2; }
                            else { awayScoreCurrent = awayScoreCurrent + 2; }
                            break;
                    }
                    // If the home team scored, then output play into first div (left). If away team scored, output 
                    // play into 3rd div (right). The score after that scoring play and minutes played are displayed 
                    // in the second div (center) in format "HH - AA (MM')"
                    html += "<div class='row scoringPlay rowfix'>\n";
                    html += "\t<div class='col-xs-20 homeScoringPlay'>";
                    if (team == 'home') { html += play; }
                    html += "</div>\n\t<div class='col-xs-8 minutesPlayed'>" + homeScoreCurrent + " - " + awayScoreCurrent + " (" + scoringPlayInfo[0] + "')</div>\n";
                    html += "\t<div class='col-xs-20 awayScoringPlay'>";
                    if (team == 'away') { html += play; }
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
    
    post.fail(function() {
        alert("Error while getting game info. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    });
}

/* 
--------------------------------------------------------------------------
----------------------------- Live Scoring -------------------------------
--------------------------------------------------------------------------
*/

var teamList = [];
var selectedDivisionIndex = 0;
var selectedScoringPlay = "";
var selectedTeam = "";
var selectedPlays = [];

function liveScoring() {
    if (sessionStorage.liveScoringPassword == "correct") {
        getTeamList();
    } else {
        showLiveScoringPasswordContainer();
    }
}

// Shows password div
function showLiveScoringPasswordContainer() {
    hideAllContainers();
    $("#liveScoringPasswordContainer").show();
}

// Uses jquery ajax to call php script to check live scoring password entered is correct
function checkLiveScoringPassword() {
    var passwordInput = $("#liveScoringPasswordInput").val();
    $.post(
        'http://www.possumpam.com/rugby/phpscripts/checkpassword.php', 
        { page: 'liveScoring', password: passwordInput }, 
        function(response) { 
            if (response == 'correct') {
                // Correct password. Hide password and generate team lists
                sessionStorage.liveScoringPassword = "correct";
                sessionStorage.currentPage = "gameSelection";
                setActivePage();
                liveScoring();
            } else if (response == 'incorrect') {
                // Incorrect password. Do nothing
                alert("Incorrect password. Please try again.")
                $("#liveScoringPasswordInput").val = "";
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        }).fail(function() {
            alert("Error while checking password. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
        })
}

// Show game editor container
function showGameSelectionContainer() {
    hideAllContainers();
    $("#gameSelectionContainer").show();
}

function showLiveScoringContainer() {
    hideAllContainers();
    $("#liveScoringContainer").show();   
}

function toggleChangeScoreForm() {
    $(".changeScoreForm").toggle();
}

function getTeamList() {
    for (var o = 0; o < divTitles.length; o += 1) {
        teamList.push([]);
    }
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getallteams.php', {}, 
        function(response) {
            for (var p = 0; p < response.length; p += 1) {
                teamList[parseInt(response[p].division)].push([response[p].teamID, response[p].teamName]);
            }
            setActivePage();
            if (sessionStorage.currentPage == "liveScoring") {
                generateLiveScoring();
            } else {
                generateGameSelection();
            }
        }, 
    'json');
    
    post.fail(function() {
        alert("Error while getting team list. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function generateGameSelection() {
    var html = '';
    
    html += "<div class='row divDropDownRow rowfix'>";
    html += "    Division:";
    html += "    <select id='teamSelectionDivisionDropDown' onchange='changeTeamDropdowns()'>";
    for (var h = 0; h < divTitles.length; h += 1) {
        html += "<option value=" + divTitles[h][0] + ">" + divTitles[h][1] + "</option>";
    }
    html += "    </select>";
    html += "</div>";
    
    html += "<div class='row homeTeamRow rowfix'>";
    html += "    Home Team: <select id='teamSelectionHomeTeamDropDown'>";
    for (var r = 0; r < teamList[selectedDivisionIndex].length; r += 1) {
        html += "    <option value='" + teamList[selectedDivisionIndex][r][0] + "'>" + teamList[selectedDivisionIndex][r][1] + "</option>";
    }
    html += "    </select>";
    html += "</div>";
    
    html += "<div class='row awayTeamRow rowfix'>";
    html += "    Away Team: <select id='teamSelectionAwayTeamDropDown'>";
    for (var s = 0; s < teamList[selectedDivisionIndex].length; s += 1) {
        html += "    <option value='" + teamList[selectedDivisionIndex][s][0] + "'>" + teamList[selectedDivisionIndex][s][1] + "</option>";
    }
    html += "    </select>";
    html += "</div>";
    
    html += "<div class='row selectGameButtonRow'>";
    html += "    <div class='col-xs-48'><button class='selectGameButton' onClick='selectGame()'>Select Game</button></div>";
    html += "</div>";
    
    $("#gameSelectionContainer").empty().append(html);
    showGameSelectionContainer();
    sessionStorage.currentPage = "gameSelection";
}

function changeTeamDropDowns() {
    selectedDivisionIndex = $("#teamSelectionDivisionDropDown").prop('selectedIndex');
    generateGameSelection();
}

function selectGame() {
    var today = new Date();
    var dd = today.getDate().toString().length == 1 ? '0' + today.getDate() : today.getDate().toString();
    var mm = (today.getMonth() + 1).toString().length == 1 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1).toString(); //January is 0!
    var yyyy = today.getFullYear().toString();
    var date = yyyy + mm + dd;

    var division = $("#teamSelectionDivisionDropDown").val();
    
    var homeText = $("#teamSelectionHomeTeamDropDown option:selected").text();
    var homeVal = $("#teamSelectionHomeTeamDropDown").val();
    if (homeVal.length == 1) {
        var homeTeamID = '00' + homeVal;
    } else if (homeVal.length == 2) {
        var homeTeamID = '0' + homeVal;
    } else {
        var homeTeamID = '' + homeVal;
    }
    
    var awayText = $("#teamSelectionAwayTeamDropDown option:selected").text();
    var awayVal = $("#teamSelectionAwayTeamDropDown").val();
    if (awayVal.length == 1) {
        var awayTeamID = '00' + awayVal;
    } else if (awayVal.length == 2) {
        var awayTeamID = '0' + awayVal;
    } else {
        var awayTeamID = '' + awayVal;
    }
    
    var gameID = date + homeTeamID + awayTeamID + division;
    if (homeText == awayText) {
        alert("Please change one of the teams as they can't play themselves");
    } else if (gameID.length == 16) {
        sessionStorage.currentGameID = gameID;
        checkGame(homeText, awayText);
    } else if (gameID.length == 8) {
        alert("Please enter a date for the game");
    } else {
        alert ("Error while creating gameID. Please send me an email (cfd19@hotmail.co.nz) informing me of this error")
    }
}

function checkGame(homeTeam, awayTeam) {
    var gameID = sessionStorage.currentGameID;
    
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/checkgame.php', 
        { gameID: gameID, homeTeam: homeTeam, awayTeam: awayTeam }, 
        function(response) {
            if (response == 'success') {
                generateLiveScoring(homeTeam, awayTeam);
            } else if (response == 'beingscored') {
                alert("This game is already being live scored. Please try again later or select another game.");
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });
    
    post.fail(function() {
        alert("Error while checking game status. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function generateLiveScoring(homeTeam, awayTeam) {
    var html = '';
    var gameID = sessionStorage.currentGameID;
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getgameinfo.php', 
        { gameID: gameID }, 
        function(response) {
            // Every minute the user is live scoring a game, the current time is uploaded to the server.
            // A cron task then checks all the games every 5 minutes. If the last time scored is more than 5 minutes
            // old then the liveScored attribute is changed to 'n'.
            setInterval(updateLastTimeScored, 60000);

            if (gameID.length > 14) {
                var divID = parseInt(gameID.slice(-2));
                for (var k = 0; k < teamList[divID].length; k += 1) {
                    var idFromArray = teamList[divID][k][0];
                    var homeTeamID = '' + parseInt(gameID.substr(8, 3));
                    var awayTeamID = '' + parseInt(gameID.substr(11, 3));
                    if (homeTeamID == idFromArray) {
                        var homeTeamName = teamList[divID][k][1];
                    } else if (awayTeamID == idFromArray) {
                        var awayTeamName = teamList[divID][k][1];
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
            html += "            <input id='changeScoreFormButton' type='submit' onclick='changeScore(" + gameID + ")'>";
            html += "        </div>";
            html += "    </div>";
            html += "</div>\n\n";

            // The half and full time buttons are next. Clickingeither will call methods to upload the half or full time play
            html += "<div class='row rowfix timingInfoLive'>";
            html += "    <button type='button' class='halftime col-xs-23' onclick='sendHalfTime(" + gameID + "," + 
                          homeTeamScore + ","  + awayTeamScore + ")'>Half Time</button>";
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

            // The team names and scores are added next. Once clicked, the team name will have a 
            // grey background and the previously selected team will be changed to a white background
            html += "<div class='row rowfix teamInfoLive'>";
            html += "    <div class='homeTeamName col-xs-24' onclick='toggleSelectedTeam(this, `home`)'>" + homeTeamName + "</div>";
            html += "    <div class='awayTeamName col-xs-24' onclick='toggleSelectedTeam(this, `away`)'>" + awayTeamName + "</div>";
            html += "</div>";
            html += "<div class='row rowfix scoreInfoLive'>";
            html += "    <div class='homeTeamScore col-xs-24'>" + homeScore + "</div>";
            html += "    <div class='awayTeamScore col-xs-24'>" + awayScore + "</div>";
            html += "</div>\n\n";

            // The 4 scoring plays are next. Once clicked, the scoring play will have a 
            // grey background and the previously selected play will be changed to a white background
            html += "<div class='row rowfix scoringPlayInfoLive'>";
            html += "    <div class='scoringPlayLive try col-xs-24' onclick='toggleSelectedScoringPlay(this, `Try`)'>Try</div>";
            html += "    <div class='scoringPlayLive conversion col-xs-24' onclick='toggleSelectedScoringPlay(this, `Conversion`)'>Conversion</div>";
            html += "</div>";
            html += "<div class='row rowfix scoringPlayInfoLive'>";
            html += "    <div class='scoringPlayLive penalty col-xs-24' onclick='toggleSelectedScoringPlay(this, `Penalty`)'>Penalty</div>";
            html += "    <div class='scoringPlayLive dropGoal col-xs-24' onclick='toggleSelectedScoringPlay(this, `DropGoal`)'>Drop Goal</div>";
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
            html += "    <button type='submit' class='submit col-xs-48' onclick='uploadScoringPlay(" + gameID + ", " + homeTeamScore + ", " + awayTeamScore + ")'>Send</button>";
            html += "</div>\n\n";

            html += "<div class='row deletePlayButtonRow rowfix'>";
            html += "    <button class='deletePlayButton col-xs-48' type='button' onclick='deleteSelectedPlays()'>Delete Selected Plays</button>";
            html += "</div>\n\n";

            // Next is a list of the previously uploaded plays for this game
            html += "<div class='row scoringPlays rowfix'>\n\n";
            // Decode the json into an array
            var allScoringPlays =  JSON && JSON.parse(response[0].scoringPlays) || $.parseJSON(response[0].scoringPlays);
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
                    html += "<div class='row time rowfix' onclick='togglePlayInSelectedPlays(this, `" + gameID + "`, " + j + ", `" + scoringPlay.substr(0, 4) + "`, `" + scoringPlay.substr(4) + "`, " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", 0, 0)'>\n";
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
                        html += "<div class='row update rowfix' onclick='togglePlayInSelectedPlays(this, `" + gameID + "`, " + j + ", `" + scoringPlay.substr(0, 4) + "`, `" + scoringPlay.substr(4) + "`, " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", " + homeScoreCurrent + ", " + awayScoreCurrent + ")'>\n\t<div class='col-xs-48'>" + scoreString + "</div>\n</div>\n\n";
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
                        html += "<div class='row update rowfix' onclick='togglePlayInSelectedPlays(this, `" + gameID + "`, " + j + ", `" + scoringPlay.substr(0, 4) + "`, `" + scoringPlay.substr(4) + "`, " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", " + homeScoreCurrent + ", " + awayScoreCurrent + ")'>\n\t<div class='col-xs-48'>" + scoreString + "</div>\n</div>\n\n";
                        homeScoreCurrent = parseInt(play.substr(0, 2));
                        awayScoreCurrent = parseInt(play.substr(2, 2));
                    }
                } else {
                    // For all the scoring plays, get the team (home or away), change the score based of the play (play) and team.
                    team = scoringPlay.substr(0, 4);
                    switch (play) {
                        case "Try":
                            if (team == "home") { homeScoreCurrent = homeScoreCurrent + 5; }
                            else { awayScoreCurrent = awayScoreCurrent + 5; }
                            break;
                        case "Penalty":
                        case "Drop Goal":
                            if (team == "home") { homeScoreCurrent = homeScoreCurrent + 3; }
                            else { awayScoreCurrent = awayScoreCurrent + 3; }
                            break;
                        case "Conversion":
                            if (team == "home") { homeScoreCurrent = homeScoreCurrent + 2; }
                            else { awayScoreCurrent = awayScoreCurrent + 2; }
                            break;
                    }
                    // If the home team scored, then output play into first div (left). If away team scored, output 
                    // play into 3rd div (right). The score after that scoring play and minutes played are displayed 
                    // in the second div (center) in format "HH - AA (MM')"
                    html += "<div class='row scoringPlay rowfix' onclick='togglePlayInSelectedPlays(this, `" + gameID + "`, " + j + ", `" + scoringPlay.substr(0, 4) + "`, `" + scoringPlay.substr(4) + "`, " + parseInt(homeTeamScore) + ", " + parseInt(awayTeamScore) + ", 0, 0)'>\n";
                    html += "\t<div class='col-sm-20 col-xs-15 homeScoringPlay'>";
                    if (team == 'home') { html += play; }
                    html += "</div>\n\t<div class='col-sm-8 col-xs-18 minutesPlayed'>" + homeScoreCurrent + " - " + awayScoreCurrent + " (" + scoringPlayInfo[0] + "')</div>\n";
                    html += "\t<div class='col-sm-20 col-xs-15 awayScoringPlay'>";
                    if (team == 'away') { html += play; }
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
        }, 'json');

    post.fail(function() {
        alert("Error while adding game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function updateLastTimeScored() {
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/updatelasttimescored.php', 
        { gameID: sessionStorage.currentGameID }, 
        function(response) {
            
        });
}

function stopScoring(gameID) {
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/stopscoring.php', 
        { gameID: sessionStorage.currentGameID }, 
        function(response) {
            // go back to game selection
            if (response != 'success') { 
                // Error
                alert("Error: " + response + ". Please send me an email (cfd19@hotmail.co.nz) informing me of this.");
            }
            generateGameSelection();
        });
    
    post.fail(function() {
        alert("Error while logging out. Please send me an email (cfd19@hotmail.co.nz) informing me of this.");
        generateGameSelection();
    })
}

function changeScore(gameID) {
    var homeScore = $('#newhomescore').val();
    var awayScore = $('#newawayscore').val();
    var minutesPlayed = $('#newminutesplayed').val();
    var result = areInputsValidChange(homeScore, awayScore, minutesPlayed);
    if (result[0]) {
        if (homeScore.length == 1) {
            homeScore = '00' + homeScore
        } else if (homeScore.length == 2) {
            homeScore = '0' + homeScore
        }
        
        if (awayScore.length == 1) {
            awayScore = '00' + awayScore
        } else if (awayScore.length == 2) {
            awayScore = '0' + awayScore
        }
        var scoringPlay = 'updt' + homeScore + awayScore;
        uploadPlay(gameID, homeScore, awayScore, minutesPlayed, scoringPlay, '');
    } else {
        alert(result[1]);
    }
}

function sendHalfTime(gameID, homeScore, awayScore) {
    uploadPlay(gameID, homeScore, awayScore, '40', 'halfTime', '');
}

function sendFullTime(gameID, homeScore, awayScore) {
    uploadPlay(gameID, homeScore, awayScore, '80', 'fullTime', '');
}

function uploadScoringPlay(gameID, homeScore, awayScore) {
    team = this.selectedTeam;
    play = this.selectedScoringPlay;
    minutesPlayed = document.getElementsByClassName("minutesPlayedInput")[0].value;
    description = document.getElementsByClassName("descriptionInput")[0].value;
    var result = areInputsValidUpload(team, play, minutesPlayed);
    if (result[0]) {
        // Change the current score based on the play and team passed in
        switch (play) {
            case "Try":
                if (team == "home") { homeScore += 5; }
                else { awayScore += 5; }
                break;
            case "Penalty":
            case "DropGoal":
                if (team == "home") { homeScore += 3; }
                else { awayScore += 3; }
                break;
            case "Conversion":
                if (team == "home") { homeScore += 2; }
                else { awayScore += 2; }
                break;
        }
        var scoringPlay = team + play;
        uploadPlay(gameID, homeScore, awayScore, minutesPlayed, scoringPlay, description);
    } else {
        alert(result[1]);
    }
}

function uploadPlay(gameID, homeScore, awayScore, minutesPlayed, scoringPlay, description) {
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/uploadplay.php', 
        { gameID: sessionStorage.currentGameID, homeScore: homeScore, awayScore: awayScore, 
          minutesPlayed: minutesPlayed, scoringPlay: scoringPlay, description: description }, 
        function(response) {
            if (response == 'success') {
                generateLiveScoring('', '');
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });
    
    post.fail(function() {
        alert("Error while uploading play. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

// Changes background of selected scoring play to light grey and the rest to transparent
function toggleSelectedScoringPlay(elem, play) {
    document.getElementsByClassName("try")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("penalty")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("conversion")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("dropGoal")[0].style.backgroundColor = "transparent";
    elem.style.backgroundColor = '#bcbcbc';
    this.selectedScoringPlay = play;
}

// Changes background of selected team to light grey and other to transparent
function toggleSelectedTeam(elem, team) {
    document.getElementsByClassName("homeTeamName")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("awayTeamName")[0].style.backgroundColor = "transparent";
    elem.style.backgroundColor = '#bcbcbc';
    this.selectedTeam = team;
}

// Checks if all the inputs are valid when uploading a scoring play
function areInputsValidUpload(team, play, minutesPlayed) {
    var message = "";
    var valid = true;
    if (team == "") {
        message += "Please select a team\n";
        valid = false;
    } 
    
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

// Checks if input are valid when submitting end game score
function areInputsValidEnd(homeValue, awayValue, homeCheckbox, awayCheckbox, homeScore, awayScore, date) {
    var message = "";
    var valid = true;
    
    if (homeValue == awayValue) {
        message += "Teams can't play themselves. Change one of the teams\n";
        valid = false;
    }
    
    if (homeCheckbox && awayCheckbox) {
        message += "Both teams can't default. Uncheck one of the checkboxes\n";
        valid = false;
    }
    
    if (!(homeCheckbox || awayCheckbox) && (isNaN(homeScore) || !(parseInt(Number(homeScore)) == homeScore) || 
        isNaN(parseInt(homeScore, 10)) || parseInt(homeScore) < 0 || parseInt(homeScore) > 200)) {
        message += "Please enter a valid home score\n";
        valid = false;
    } 
    
    if (!(homeCheckbox || awayCheckbox) && (isNaN(awayScore) || !(parseInt(Number(awayScore)) == awayScore) || 
        isNaN(parseInt(awayScore, 10)) || parseInt(awayScore) < 0 || parseInt(awayScore) > 200)) {
        message += "Please enter a valid away score\n";
        valid = false;
    }
    
    if (date == "") {
        message += "Please enter a date\n";
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
    selectedPlays.sort(function(a,b) { 
        return parseInt(b[1]) - parseInt(a[1]); 
    });
    
    // Show delete button if there is at least 1 play selected, otherwise hide it
    if (selectedPlays.length > 0) {
        $(".deletePlayButtonRow").show();
    } else {
        $(".deletePlayButtonRow").hide();
    }
    
    // Debug problems with adding games to selectedPlays array
    //alert(selectedPlays.join('\n'));
}

// Delete the plays selected by the user
function deleteSelectedPlays() {
    var string = '';
    // Keep track of num of plays deleted so that the plays are deleted before emptying array and reloading page.
    var playsDeleted = 0;
    var error = false;
    // Keep track of current score as the play are deleted
    var currentscores = [-1, -1]
    var gameID = '';
    // There will always be at least 1 play to be deleted as the button which calls this is only visible if a play is selected
    for (i = 0; i < selectedPlays.length; i += 1) {
        // Get scoring play to be deleted
        var p = selectedPlays[i];
        // On the first pass through set the current scores and gameID
        if (i == 0) { currentscores[0] = p[4]; currentscores[1] = p[5]; gameID = p[0]; }
        
        // Check whether the score should be changed. The score shouldn't be changed 
        // if there was an update play uploaded after the one being deleted
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
            
        // Send info to deleteScoringPlay php script
        $.ajax({
            data: 'gameID=' + p[0] + '&index=' + p[1] + '&homeScore=' + currentscores[0] + '&awayScore=' + currentscores[1],
            url: 'http://www.possumpam.com/rugby/phpscripts/deletescoringplay.php',
            method: 'GET',
            complete: function() { 
                playsDeleted += 1; 
                //alert("plays deleted: " + playsDeleted);
                if (playsDeleted == selectedPlays.length) {
                    // Empty selected plays array
                    selectedPlays.length = 0;

                    //alert(string);
                    // Reload page
                    generateLiveScoring('', '');
                } 
            },
            error: function(xhr, status, error) {
                //var err = eval("(" + xhr.responseText + ")");
                //alert(err.Message + "\n" + status + "\n" + error);
            }
        });
    }
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
        diffHomeScore = parseInt(play.substr(0,3)) - oldHomeScore;
        diffAwayScore = parseInt(play.substr(3,3)) - oldAwayScore;
    } else {
        diffHomeScore = parseInt(play.substr(0,2)) - oldHomeScore;
        diffAwayScore = parseInt(play.substr(2,2)) - oldAwayScore;
    }
    // Adjust current scores by amounts above
    newHomeScore = homeScore - diffHomeScore;
    newAwayScore = awayScore - diffAwayScore;

    return [newHomeScore, newAwayScore];
}