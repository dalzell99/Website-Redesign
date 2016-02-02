var backEvents = [];
var allDivs = [];
var allTeams = [];
var allGames = [];

$(document).ready(function () {    
    var post = $.post('http://ccrscoring.co.nz/phpscripts/getallinfo.php', {},
        function (response) {
            var teams = response[0];
            var games = response[1];
            var divs = response[2];
            
            for (var t = 0; t < divs.length; t += 1) {
                var divID = parseInt(divs[t].divisionID);
                allTeams[divID] = [];
                allGames[divID] = [];
                allDivs[divID] = divs[t];
                allDivs[divID].divisionID = pad(allDivs[divID].divisionID, 2);
            }
        
            for (var n = 0; n < teams.length; n += 1) {
                allTeams[parseInt(teams[n].division)].push(teams[n]);
            }
        
            for (var o = 0; o < games.length; o += 1) {
                allGames[parseInt(games[o].GameID.slice(-2))].push(games[o]);
            }
        }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while retrieving info from database. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    });
    
    post.always(function () {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.instructionsAdmin == null) {
                localStorage.instructionsAdmin = 'true';
            } else if (localStorage.instructionsAdmin == 'false') {
                $("#instructions").hide();
            }
            if (sessionStorage.password == "correct") {
                // I used not equal to gameEditor because the scoring pages also use sessionStorage.currentPage
                // so the start page should only be gameEditor if sessionStorage.currentPage is set to 'gameEditor'
                if (sessionStorage.currentPage != "gameEditor" || sessionStorage.currentPage == null) {
                    teamEditor(true);
                } else {
                    gameEditor(true);
                }
            } else {
                showPassword();
            }
        } else {
            alert("Sorry, you can't use this website. The minimum browser versions are:\nInternet Explorer 8\nFirefox 3.5\nSafari 4\nGoogle Chrome 5\nOpera 10.50");
        }
    })
});

// Catch browser back button event
window.onpopstate = function(event) {
    var state = event.state;
    if (state != null) {
        if (state.event == 'startTeamEditor') {
            sessionStorage.currentPage = "gameEditor";
            showGameEditorContainer();
        } else if (state.event == 'startGameEditor') {
            sessionStorage.currentPage = "teamEditor";
            showTeamEditorContainer();
        } else if (state.event == 'changeTeamName') {
            changeTeamName(state.teamID, state.oldName, state.divisionID, false);
        } else if (state.event == 'addTeam') {
            deleteTeam(state.teamName, state.divisionID);
        } else if (state.event == 'gameInfoChanged') {
            changeGameInfo(state.gameID, state.column, state.oldValue, '', state.rowIndex, false);
        } else if (state.event == 'addGame') {
            selectedRowGameID.push(state.gameID);
            deleteGame(state.gameID);
        }
    }
};

// Shows password div
function showPassword() {
    hideAllContainers();
    setInstructions('password');
    $("#passwordContainer").show();
}

// Hides all the web page containers
function hideAllContainers() {
    $("#loadingMessage").hide();
    $("#passwordContainer").hide();
    $("#teamEditorContainer").hide();
    $("#gameEditorContainer").hide();
}

// Uses jquery ajax to call php script to check password entered is correct
function checkPassword() {
    var passwordInput = $("#passwordInput").val();
    $.post(
        'http://ccrscoring.co.nz/phpscripts/checkpassword.php', {
            page: 'admin',
            password: passwordInput
        },
        function (response) {
            if (response == 'correct') {
                // Correct password. Hide password and generate team lists
                if (typeof (Storage) !== "undefined") {
                    sessionStorage.password = "correct";
                    if (sessionStorage.currentPage == "teamEditor" || sessionStorage.currentPage == null) {
                        teamEditor(true);
                    } else {
                        gameEditor(true);
                    }
                } else {
                    teamEditor(true);
                }
            } else if (response == 'incorrect') {
                // Incorrect password. Do nothing
                alert("Incorrect password. Please try again.")
                $("#passwordInput").val = "";
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        }).fail(function () {
        alert("Error while checking password. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function setActivePage() {
    $("li.active").removeClass("active");
    $("." + sessionStorage.currentPage).addClass("active");

    $('.navbar-collapse.in').removeClass('in').prop('aria-expanded', false);
}

function addBackEvent(eventArray) {
    if (eventArray[0] == 'startTeamEditor' || eventArray[0] == 'startGameEditor') {
        var stateObj = { 
            event: eventArray[0]
        };
    } else if (eventArray[0] == 'changeTeamName') {
        var stateObj = { 
            event: eventArray[0], 
            teamID: eventArray[1], 
            oldName: eventArray[2],
            divisionID: eventArray[3]
        };
    } else if (eventArray[0] == 'addTeam') {
        var stateObj = { 
            event: eventArray[0], 
            teamName: eventArray[1], 
            divisionID: eventArray[2]
        };
    } else if (eventArray[0] == 'gameInfoChanged') {
        var stateObj = { 
            event: eventArray[0], 
            gameID: eventArray[1], 
            column: eventArray[2], 
            oldValue: eventArray[3], 
            rowIndex: eventArray[4]
        };
    } else if (eventArray[0] == 'addGame') {
        var stateObj = { 
            event: eventArray[0], 
            gameID: eventArray[1]
        };
    }
    history.replaceState(stateObj, "", "");
    history.pushState(stateObj, "", "");
}

function setInstructions(page) {
    var text = '';
    switch (page) {
        case 'teamEditor':
            text = "To add a team, click 'Click to Add Team', enter the teams name, select the division they are in and click 'Add Team' button. To change a teams name, click the team name you want to change and enter the new name in the text area that opens then click 'Ok'.";
            break;
        case 'password':
            text = "Input the password provided to you and tap 'Submit'";
            break;
        case 'gameEditor':
            text = "To add a game, click 'Add Games', choose the division, home and away teams and date for the game and click 'Click to Add Game' button. You can filter the games so only those between certain dates are shown by selecting a start and/or end date and clicking 'Filter' button. In the table, you can edit the information like Excel. All columns except the date, division, home and awy team names are editable. All changes are saved automatically. Pressing enter on keyboard will move one box down and tab will move one box to the right. Holding shift while pressing enter will move up one box and holding shift while pressing tab will move one box left. To delete some games, double click the games to select them and click 'Delete Selected Games' at the top of the page.";
            break;
    }

    $("#instructions").text(text);
}

function toggleInstructions() {
    $("#instructions").toggle();
    localStorage.instructionsAdmin = localStorage.instructionsAdmin == 'true' ? 'false' : 'true';
}

Date.prototype.toAddGameDateString = function() {
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return this.getDate() + " " + months[this.getMonth()];
};

Date.prototype.toInitialString = function() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayOfGame = daysOfWeek[this.getDay()];
    return dayOfGame + " " + this.getDate() + " " + months[this.getMonth()] + " " + String(this.getFullYear()).substr(2, 2);
};

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

/* 
--------------------------------------------------------------------------
----------------------------- Team Editor --------------------------------
--------------------------------------------------------------------------
*/

function teamEditor(backEvent) {
    if (sessionStorage.password == "correct") {
        if (backEvent) {
            addBackEvent(['startTeamEditor']);
        }
        sessionStorage.currentPage = "teamEditor";
        generateAddTeam();
        generateTeamList();
        showTeamEditorContainer()
    } else {
        showPassword();
    }
}

// Show team editor container
function showTeamEditorContainer() {
    hideAllContainers();
    setInstructions('teamEditor');
    setActivePage();
    $("#teamEditorContainer").show();
}

// Toggles the display attribute of the addTeamForm div
function toggleAddTeam() {
    $("#addTeamForm").toggle();
}

// Dynamically generates add team stuff
function generateAddTeam() {
    var html = "";
    html += "<div id='addTeamFormToggle' onclick='toggleAddTeam()'>Click to add new team</div>";
    html += "<div id='addTeamForm'>";
    html += "    Team Name: <input type='text' id='addTeamName'>";
    html += "    Division: <select id='divisionDropDown'>";
    for (var j = 0; j < allDivs.length; j += 1) {
        html += "        <option value='" + allDivs[j].divisionID + "'>" + allDivs[j].divisionName + "</option>";
    }
    html += "    </select>";
    html += "    <button type='button' id='addTeamButton' onclick='addTeam()'>Add Team</button>";
    html += "</div>";
    $("#addTeamContainer").empty().append(html);
}

// Dynamically generates team lists
function generateTeamList() {
    sortTeamList();
    var html = "";
    for (var i = 0; i < allTeams.length; i += 1) {
        for (var p = 0; p < allTeams[i].length; p += 1) {
            html += "<div class='teamRow'>";
            html += "   <div class='division " + allTeams[i][p].division + "'>" + allDivs[parseInt(allTeams[i][p].division)].divisionName + "</div>";
            html += "   <div class='teamName " + allTeams[i][p].teamID + "' contenteditable='true'>" + allTeams[i][p].teamName + "</div>";
            if (allTeams[i][p].enabled == 'y') {
                html += "   <button class='disableButton' onclick='disableTeam(" + allTeams[i][p].teamID + "," + allTeams[i][p].division + ")'>Remove Team from Competition</button>";
            } else {
                html += "   <button class='enableButton' onclick='enableTeam(" + allTeams[i][p].teamID + ", " + allTeams[i][p].division + ")'>Add Team to Competition</button>";
            }
            html += "</div>";
        }
    }
    $("#teamListContainer").empty().append(html);
    addEventsTeam();
}

function sortTeamList() {
    for (var i = 0; i < allTeams.length; i += 1) {
        allTeams[i].sort(function(a, b) {
            if(a.teamName.toUpperCase() < b.teamName.toUpperCase()) return -1;
            if(a.teamName.toUpperCase() > b.teamName.toUpperCase()) return 1;
            return 0;
        });
    }
}

function addEventsTeam() {
    $(".teamName").on({
        blur: function () {
            // check if content changed
            if (sessionStorage.contenteditable != this.innerHTML) {
                var teamID = this.classList[1];
                var divisionID = this.previousElementSibling.classList[1];
                var newName = this.innerHTML;
                // add to unsaved changes list if content changed
                changeTeamName(teamID, newName, divisionID, true);
            }
        },

        focus: function () {
            sessionStorage.contenteditable = this.innerHTML;
        }
    });
}

// Changes team name in database
function changeTeamName(teamID, newName, divisionID, backEvent) {
    var oldName = sessionStorage.contenteditable;
    var post = $.post('http://ccrscoring.co.nz/phpscripts/changeteamname.php', {
            teamID: teamID,
            newName: newName
        },
        function (response) {
            if (response == 'success') {
                if (backEvent) {
                    addBackEvent(['changeTeamName', teamID, oldName, divisionID]);
                }
                var teams = allTeams[parseInt(divisionID)];
                for (var q = 0; q < teams.length; q += 1) {
                    if (teams[q].teamID == teamID) {
                        teams[q].teamName = newName;
                        break;
                    }
                }
                // Name has been changed. Regenerate team list.
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while changing the teams name. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

// Adds team to database
function addTeam() {
    var teamName = $("#addTeamName").val();
    var divisionID = $('#divisionDropDown option:selected').val()

    var post = $.post('http://ccrscoring.co.nz/phpscripts/addnewteam.php', {
            teamName: teamName,
            divisionID: divisionID
        },
        function (response) {
            if (response[0] == 'success') {
                // Name has been changed. Regenerate team list.
                addBackEvent(['addTeam', teamName, divisionID]);
                allTeams[parseInt(divisionID)].push({division:divisionID, enabled:'y', teamID:response[1], teamName:teamName});
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while adding new team. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function deleteTeam(teamName, divisionID) {
    var post = $.post('http://ccrscoring.co.nz/phpscripts/deleteteam.php', {
            teamName: teamName,
            divisionID: divisionID
        },
        function (response) {
            if (response == 'success') {
                // Name has been changed. Regenerate team list.
                allTeams[parseInt(divisionID)].pop();
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while deleting team. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function disableTeam(teamID, division) {
    var post = $.post('http://ccrscoring.co.nz/phpscripts/disableteam.php', {
            teamID: teamID
        },
        function (response) {
            if (response == 'success') {
                // Name has been changed. Regenerate team list.
                var teams = allTeams[parseInt(division)];
                for (var r = 0; r < teams.length; r += 1) {
                    if (teams[r].teamID == teamID) {
                        teams[r].enabled = 'n';
                    }
                }
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while removing team. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function enableTeam(teamID, division) {
    var post = $.post('http://ccrscoring.co.nz/phpscripts/enableteam.php', {
            teamID: teamID
        },
        function (response) {
            if (response == 'success') {
                // Name has been changed. Regenerate team list.
                var teams = allTeams[parseInt(division)];
                for (var s = 0; s < teams.length; s += 1) {
                    if (teams[s].teamID == teamID) {
                        teams[s].enabled = 'y';
                    }
                }
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while readding team. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

/* 
--------------------------------------------------------------------------
----------------------------- Game Editor --------------------------------
--------------------------------------------------------------------------
*/

var selectedRowGameID = [];
var selectedDivisionIndex = 0;
var numGamesDeleted = 0;
var numGamesLocked = 0;
var datePickers = [];

function gameEditor(backEvent) {
    if (sessionStorage.password == "correct") {
        if (backEvent) {
            addBackEvent(['startGameEditor']);
        }
        sessionStorage.currentPage = "gameEditor";
        generateToolbar();
        generateGameTable(new Date(2000, 1, 1), new Date(2050, 1, 1));
        showGameEditorContainer();
    } else {
        showPassword();
    }
}

// Show game editor container
function showGameEditorContainer() {
    hideAllContainers();
    setInstructions('gameEditor');
    setActivePage();
    $("#gameEditorContainer").show();
}

function toggleAddGameForm() {
    $("#addGameForm").toggle();
}

function generateToolbar() {
    var html = '';

    html += "<div id='gameEditorToolbarButtons'>";
    html += "    <button id='addGameButton' onclick='toggleAddGameForm()'>Add Games</button>";
    html += "    <button id='deleteSelectedGameButton' onclick='deleteSelectedGames()'>Delete Selected Games</button>";
    html += "    <button id='lockSelectedGameButton' onclick='lockSelectedGames()'>Lock Selected Games</button>";
    html += "    <button id='unlockSelectedGameButton' onclick='unlockSelectedGames()'>Unlock Selected Games</button>";
    html += "</div>";

    html += "<div id='addGameForm'>";
    html += "    Division: <select id='addGameDivisionDropDown' onchange='changeTeamDropDowns()'>";
    for (var q = 0; q < allDivs.length; q += 1) {
        html += "    <option value='" + allDivs[q].divisionID + "'>" + allDivs[q].divisionName + "</option>";
    }
    html += "    </select>";
    html += "    Home Team: <select id='addGameHomeTeamDropDown'>";
    for (var r = 0; r < allTeams[selectedDivisionIndex].length; r += 1) {
        if (allTeams[selectedDivisionIndex][r].enabled == 'y') {
            html += "    <option value='" + allTeams[selectedDivisionIndex][r].teamID + "'>" + allTeams[selectedDivisionIndex][r].teamName + "</option>";
        }
    }
    html += "    </select>";
    html += "    Away Team: <select id='addGameAwayTeamDropDown'>";
    for (var s = 0; s < allTeams[selectedDivisionIndex].length; s += 1) {
        if (allTeams[selectedDivisionIndex][s].enabled == 'y') {
            html += "    <option value='" + allTeams[selectedDivisionIndex][s].teamID + "'>" + allTeams[selectedDivisionIndex][s].teamName + "</option>";
        }
    }
    html += "    </select>";
    html += "    Date: <input type='date' id='addGameDatePicker'>";
    html += "    <button id='addGameButton' onclick='addGame()'>Click to Add Game</button>";
    html += "</div>";

    html += "<div id='dateFilter'>";
    html += "    Start Date: <input type='date' id='dateFilterStart'>";
    html += "    End Date: <input type='date' id='dateFilterEnd'>";
    html += "    <button id='dateFilterButton'  onclick='filterDates()'>Filter</button>";
    html += "</div>";

    $("#gameEditorToolbar").empty().append(html);

    // if there was an error retrieving the team list then disable the add 
    // game button as user can't add game without the team lists.
    if (allTeams[0].length == 0) {
        $("#addGameButton").prop('disabled', true);
    }

    $("#addGameDivisionDropDown").prop('selectedIndex', selectedDivisionIndex);
}

function generateGameTable(startDate, endDate) {
    var html = '';
    $("#gameEditorTable").empty().append("<div id='tablePlaceholderText'>Table is being created</div>");

    html += "<table id='gameEditorTable'>";
    html += "    <thead>";
    html += "        <tr>";
    html += "            <th id='tableHeaderDate'>Date</th>";
    html += "            <th id='tableHeaderDivision'>Division</th>";
    html += "            <th id='tableHeaderHomeTeam'>Home Team</th>";
    html += "            <th id='tableHeaderHomeScore'>Home Score</th>";
    html += "            <th id='tableHeaderAwayTeam'>Away Team</th>";
    html += "            <th id='tableHeaderAwayScore'>Away Score</th>";
    html += "            <th id='tableHeaderTime'>Time</th>";
    html += "            <th id='tableHeaderLocation'>Location</th>";
    html += "            <th id='tableHeaderRef'>Ref</th>";
    html += "            <th id='tableHeaderAssRef1'>Assistant Ref 1</th>";
    html += "            <th id='tableHeaderAssRef2'>Assistant Ref 2</th>";
    html += "            <th id='tableHeaderLocked'>Locked</th>";
    html += "        </tr>";
    html += "    </thead>";
    
    html += "    <tbody>";
    var offset = 0;
    for (var u = 0; u < allGames.length; u += 1) {
        for (var l = 0; l < allGames[u].length; l += 1) {
            var game = allGames[u][l];
            var gameID = game.GameID;
            var divID = parseInt(gameID.slice(-2));
            var dateFromGameID = gameID.substr(0, 8);
            var year = parseInt(dateFromGameID.substr(2, 2));
            var month = parseInt(dateFromGameID.substr(4, 2)) - 1;
            var day = parseInt(dateFromGameID.substr(6, 2));
            var gameDate = new Date(parseInt('20' + year), month, day);
            var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dateToDisplay = dateFromGameID.substr(6, 2) + "/" + dateFromGameID.substr(4, 2) + "/" + dateFromGameID.substr(0, 4);

            if (gameDate >= startDate && gameDate <= endDate) {
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
                    var homeTeamName = game.homeTeamName;
                    var awayTeamName = game.awayTeamName;
                }

                var division = allDivs[divID].divisionName;                
                html += "        <tr class='gameRow " + gameID + " " + (offset + l) + "'>";
                html += "            <td class='date' sorttable_customkey='" + dateFromGameID + "'><input class='datepicker " + (offset + l) + "' data-value='" + dateToDisplay + "' value='" + gameDate.toInitialString() + "'></td>";
                html += "            <td class='divisionName' sorttable_customkey='" + divID + "'>" + division + "</td>";
                html += "            <td class='homeTeamName'>" + homeTeamName + "</td>";
                html += "            <td class='homeTeamScore' contenteditable='true'>" + game.homeTeamScore + "</td>";
                html += "            <td class='awayTeamName'>" + awayTeamName + "</td>";
                html += "            <td class='awayTeamScore' contenteditable='true'>" + game.awayTeamScore + "</td>";
                html += "            <td class='time' contenteditable='true'>" + game.time + "</td>";
                html += "            <td class='location' contenteditable='true'>" + game.location + "</td>";
                html += "            <td class='ref' contenteditable='true'>" + game.ref + "</td>";
                html += "            <td class='assRef1' contenteditable='true'>" + game.assRef1 + "</td>";
                html += "            <td class='assRef2' contenteditable='true'>" + game.assRef2 + "</td>";
                html += "            <td class='locked' contenteditable='true'>" + game.locked + "</td>";
                html += "        </tr>";
            }
        }
        offset += allGames[u].length;
    }
    html += "    </tbody>"
    html += "    <tfoot></tfoot>"
    html += "</table>";
    $("#gameEditorTable").empty().append(html);

    // Make the table sortable
    newTableObject = $("table#gameEditorTable")[0];
    sorttable.makeSortable(newTableObject);
    // Sort by division
    var divisionTableHeader = $("#tableHeaderDivision")[0];
    sorttable.innerSortFunction.apply(divisionTableHeader, []);
    // Then by date. This means games with same date will be sorted by division.
    var dateTableHeader = $("#tableHeaderDate")[0];
    sorttable.innerSortFunction.apply(dateTableHeader, []);

    // Add event listeners for content editable cells after the table has been created
    addEventsGame();
    selectedRowGameID = [];
}

function filterDates() {
    var startDateString = $("#dateFilterStart")[0].nextElementSibling.nextElementSibling.value;
    if (startDateString != "") {
        var yearStart = parseInt(startDateString.substr(6, 4));
        var monthStart = parseInt(startDateString.substr(3, 2)) - 1;
        var dayStart = parseInt(startDateString.substr(0, 2));
        var startDate = new Date(yearStart, monthStart, dayStart);
    } else {
        var startDate = new Date(2000, 1, 1);
    }

    var endDateString = $("#dateFilterEnd")[0].nextElementSibling.nextElementSibling.value;
    if (endDateString != "") {
        var yearEnd = parseInt(endDateString.substr(6, 4));
        var monthEnd = parseInt(endDateString.substr(3, 2)) - 1;
        var dayEnd = parseInt(endDateString.substr(0, 2));
        var endDate = new Date(yearEnd, monthEnd, dayEnd);
    } else {
        var endDate = new Date(2050, 1, 1);
    }

    generateGameTable(startDate, endDate);
}

function addEventsGame() {
    $("input.datepicker").click(function() {
        $(this).off('click');
        $(this).pickadate({
            format: 'ddd d mmm yy',
            today: 'Today',
            clear: '',
            close: 'Cancel',
            labelMonthNext: 'Go to the next month',
            labelMonthPrev: 'Go to the previous month',
            formatSubmit: 'dd/mm/yyyy',
            hiddenPrefix: 'prefix__',
            onSet: function(context) {
                var oldGameID = this.$node[0].parentElement.parentElement.classList[1];
                var date = this._hidden.value;
                var newGameID = date.substr(6, 4) + date.substr(3, 2) + date.substr(0, 2) + oldGameID.substr(8, oldGameID.length - 8);
                // delete game
                // create new one with date change added to changes
                var post = $.post('http://ccrscoring.co.nz/phpscripts/changedate.php', {
                    oldGameID: oldGameID,
                    newGameID: newGameID
                },
                function (response) {
                    if (response == 'success') {
                        // do nothing
                    } else {
                        // Error
                        alert("Error while changing date. Please refresh page and try again. If problem persists, send me an email (cfd19@hotmail.co.nz)");
                    }
                });

                post.fail(function (request, textStatus, errorThrown) {
                    alert("Error while changing date. Please refresh page and try again. If problem persists, send me an email (cfd19@hotmail.co.nz)");
                });
            }
        });
        $(this).click();
    });
    
    $("input[type='date']").pickadate({
        format: 'ddd d mmm yy',
        today: 'Today',
        clear: 'Clear',
        close: 'Cancel',
        labelMonthNext: 'Go to the next month',
        labelMonthPrev: 'Go to the previous month',
        formatSubmit: 'dd/mm/yyyy',
        hiddenPrefix: 'prefix__'
    });
    
    $("tr > [contenteditable=true]").on({
        keydown: function (event) {
            if (event.which == 13 && event.shiftKey) { // Shift + enter
                // Stop a line break being added
                event.preventDefault();
                // Get the parent of element currently focused, move to previous sibling, get the child with the same class name and focus it.
                $(this).parent().prev().children("." + this.className).focus();
                placeCaretAtEnd(document.activeElement);
            } else if (event.which == 13) { // Enter without shift
                // Stop a line break being added
                event.preventDefault();
                // Get the parent of element currently focused, move to next sibling, get the child with the same class name and focus it.
                $(this).parent().next().children("." + this.className).focus();
                placeCaretAtEnd(document.activeElement);
            }
        },

        blur: function () {
            var oldValue = sessionStorage.contenteditable;
            var gameID = this.parentElement.classList.item(1);
            var column = this.classList.item(0);
            var newValue = this.innerHTML;
            var rowIndex = this.parentElement.classList.item(2);
            var homeTeam = $("." + gameID + " > .homeTeamName").html();
            var awayTeam = $("." + gameID + " > .awayTeamName").html();
            var date = $("." + gameID + " > .date")[0].firstElementChild.value;
            // check if content changed
            if (oldValue != newValue) {
                changeGameInfo(gameID, column, newValue, oldValue, rowIndex, true, homeTeam, awayTeam, date);
            }
        },

        focus: function () {
            sessionStorage.contenteditable = this.innerHTML;
        }
    });
    
    $("tr.gameRow").on({
        click: function(event) {
            if (event.shiftKey) {
                var startRowGameID = selectedRowGameID[selectedRowGameID.length - 1];
                var startRowDate = new Date(parseInt(startRowGameID.substr(0, 4)), parseInt(startRowGameID.substr(4, 2)) - 1, parseInt(startRowGameID.substr(6, 2)));
                var startRowIndex = parseInt($("." + selectedRowGameID[selectedRowGameID.length - 1])[0].classList[2]);
                
                var endRowGameID = this.classList[1];
                var endRowDate = new Date(parseInt(endRowGameID.substr(0, 4)), parseInt(endRowGameID.substr(4, 2)) - 1, parseInt(endRowGameID.substr(6, 2)));
                var endRowIndex = parseInt(this.classList[2]);
                
                if (endRowDate > startRowDate || (endRowDate.toDateString() == startRowDate.toDateString() && endRowIndex > startRowIndex)) {
                    var endRow = this;
                    var currentRow = $("." + selectedRowGameID[selectedRowGameID.length - 1])[0].nextElementSibling;
                    while (currentRow != endRow.nextElementSibling) {
                        addRowSelection(currentRow);
                        currentRow = currentRow.nextElementSibling;
                    }
                }
            } else {
                toggleRowSelection(this);
            }
        }
    });
}

function changeGameInfo(gameID, column, newValue, oldValue, rowIndex, backEvent, homeTeam, awayTeam, date) {
    // add to unsaved changes list if content changed
    var post = $.post('http://ccrscoring.co.nz/phpscripts/uploadchange.php', {
            gameID: gameID,
            column: column,
            newValue: newValue
        },
        function (response) {
            if (response == 'success') {
                if (backEvent) { 
                    addBackEvent(['gameInfoChanged', gameID, column, oldValue, rowIndex]); 
                } else {
                    var selector = "." + rowIndex + " > ." + column;
                    $(selector).empty().append(newValue);
                }
                
                var games = allGames[parseInt(gameID.slice(-2))];
                for (var v = 0; v < games.length; v += 1) {
                    if (games[v].GameID == gameID) {
                        games[v][column] = newValue;
                        break;
                    }
                }
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while saving change. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    });
}

function addRowSelection(elem) {
    var gameID = elem.classList.item(1);
    selectedRowGameID.push(gameID);
    elem.classList.add('selectedRow');
}

function toggleRowSelection(elem) {
    var gameID = elem.classList.item(1);
    if (selectedRowGameID.indexOf(gameID) == -1) {
        selectedRowGameID.push(gameID);
        elem.classList.add('selectedRow');
    } else {
        selectedRowGameID.splice(selectedRowGameID.indexOf(gameID), 1);
        elem.classList.remove('selectedRow');
    }
}

function deleteSelectedGames() {
    if (confirm("Are you sure you want to delete the selected games? They will be gone forever if deleted")) {
        for (var n = 0; n < selectedRowGameID.length; n += 1) {
            deleteGame(selectedRowGameID[n]);
        }
    }
}

function lockSelectedGames() {
    for (var n = 0; n < selectedRowGameID.length; n += 1) {
        lockGame(selectedRowGameID[n]);
    }
}

function unlockSelectedGames() {
    for (var n = 0; n < selectedRowGameID.length; n += 1) {
        unlockGame(selectedRowGameID[n]);
    }
}

function changeTeamDropDowns() {
    selectedDivisionIndex = parseInt($("#addGameDivisionDropDown").val());
    generateToolbar();
    $("#addGameForm").show();
}

function addGame() {
    var division = (('' + selectedDivisionIndex).length == 1 ? '0' + selectedDivisionIndex : '' + selectedDivisionIndex);

    var homeText = $("#addGameHomeTeamDropDown option:selected").text();
    var homeVal = $("#addGameHomeTeamDropDown").val();
    if (homeVal.length == 1) {
        var homeTeamID = '00' + homeVal;
    } else if (homeVal.length == 2) {
        var homeTeamID = '0' + homeVal;
    } else {
        var homeTeamID = '' + homeVal;
    }

    var awayText = $("#addGameAwayTeamDropDown option:selected").text();
    var awayVal = $("#addGameAwayTeamDropDown").val();
    if (awayVal.length == 1) {
        var awayTeamID = '00' + awayVal;
    } else if (awayVal.length == 2) {
        var awayTeamID = '0' + awayVal;
    } else {
        var awayTeamID = '' + awayVal;
    }

    var dateVal = $("#addGameDatePicker")[0].nextElementSibling.nextElementSibling.value;
    var date = dateVal.substr(6, 4) + dateVal.substr(3, 2) + dateVal.substr(0, 2);
    var dateString = new Date(parseInt(date.substr(0,4)), parseInt(date.substr(4,2)) - 1, parseInt(date.substr(6,2))).toAddGameDateString();

    var gameID = date + homeTeamID + awayTeamID + division;
    if (homeText == awayText) {
        alert("Please change one of the teams as they can't play themselves");
    } else if (gameID.length == 16) {
        var post = $.post('http://ccrscoring.co.nz/phpscripts/addgame.php', {
                gameID: gameID,
                homeTeamName: homeText,
                awayTeamName: awayText
            },
            function (response) {
                if (response == 'success') {
                    // add game to local game array if it doesn't already exist
                    allGames[parseInt(gameID.slice(-2))].push({GameID: gameID, assRef1: '', assRef2: '', awayTeamName: awayText, awayTeamScore: '0', homeTeamName: homeText, homeTeamScore: '0', lastTimeScore: "2016-01-01 11:11:11", liveScored: 'n', location: '', minutesPlayed: '0', ref: '', scoringPlays: '[]', time: '', changed: '', locked: 'n', changes: '[]', userID: ''});
                    addBackEvent(['addGame', gameID, homeText, awayText, dateString, allDivs[selectedDivisionIndex].divisionName]);
                    filterDates();
                } else {
                    alert('Game already exists');
                }
            });

        post.fail(function (xhr, textStatus, errorThrown) {
            alert("Error while adding game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
        })
    } else if (gameID.length == 8) {
        alert("Please enter a date for the game");
    } else {
        alert("Error while creating gameID. Please send me an email (cfd19@hotmail.co.nz) informing me of this error")
    }
}

function deleteGame(gameID) {
    var post = $.post('http://ccrscoring.co.nz/phpscripts/deletegame.php', {
            gameID: gameID
        },
        function (response) {
            if (response == 'success') {
                var games = allGames[parseInt(gameID.slice(-2))];
                for (var w = 0; w < games.length; w += 1) {
                    if (games[w].GameID == gameID) {
                        games.splice(w, 1);
                        break;
                    }
                }
                
                numGamesDeleted += 1;
                if (numGamesDeleted == selectedRowGameID.length) {
                    selectedRowGameID = [];
                    numGamesDeleted = 0;
                    filterDates();
                }
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while deleting game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function lockGame(gameID) {
    var post = $.post('http://ccrscoring.co.nz/phpscripts/lockgame.php', {
            gameID: gameID
        },
        function (response) {
            if (response == 'success') {
                var games = allGames[parseInt(gameID.slice(-2))];
                for (var w = 0; w < games.length; w += 1) {
                    if (games[w].GameID == gameID) {
                        games[w].locked = 'y';
                        break;
                    }
                }
                
                numGamesLocked += 1;
                if (numGamesLocked == selectedRowGameID.length) {
                    selectedRowGameID = [];
                    numGamesLocked = 0;
                    filterDates();
                }
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while deleting game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function unlockGame(gameID) {
    var post = $.post('http://ccrscoring.co.nz/phpscripts/unlockgame.php', {
            gameID: gameID
        },
        function (response) {
            if (response == 'success') {
                var games = allGames[parseInt(gameID.slice(-2))];
                for (var w = 0; w < games.length; w += 1) {
                    if (games[w].GameID == gameID) {
                        games[w].locked = 'n';
                        break;
                    }
                }
                
                numGamesLocked += 1;
                if (numGamesLocked == selectedRowGameID.length) {
                    selectedRowGameID = [];
                    numGamesLocked = 0;
                    filterDates();
                }
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while deleting game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}