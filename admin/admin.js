var backEvents = [];
var allDivs = [];
var allTeams = [];
var allGames = [];

// Stuff to run on page load
$(document).ready(function () {    
    // Get all the games, teams and divisions from the database. The teams and games 
    // from store within an array with the index of the division they are in
    var post = $.post('http://ccrscoring.co.nz/scripts/php/getallinfo.php', {},
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
        alertError("#alertDiv", "Error while retrieving info from database. Please try again later. If problem persists, use the contact form");
    });
    
    post.always(function () {
        // If the user can't use Web Storage then the website won't work
        if (typeof (Storage) !== "undefined") {
            if (localStorage.instructionsAdmin == null) {
                localStorage.instructionsAdmin = 'true';
            } else if (localStorage.instructionsAdmin == 'false') {
                $("#instructions").hide();
            }
            if (sessionStorage.password == "correct") {
                if (sessionStorage.currentPage == "teamEditor" || sessionStorage.currentPage == null) {
                    teamEditor(true);
                } else if (sessionStorage.currentPage == "gameEditor") {
                    gameEditor(true);
                } else {
                    showContactContainer();
                }
            } else {
                showPassword();
            }
        } else {
            alertError("#alertDiv", "Sorry, you can't use this website. The minimum browser versions are:\nInternet Explorer 9\nFirefox 3.5\nSafari 4\nGoogle Chrome 5\nOpera 10.50");
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
    addEventPassword();
    $("#passwordContainer").show();
}

// Capture enter button press and click submit button
function addEventPassword() {
    $("#passwordContainer").on({
        keydown: function (event) {
            if (event.which == 13) { // Enter
                // Stop a line break being added
                event.preventDefault();
                $("#checkPasswordButton").click();
            }
        }
    });
}

// Hides all the web page containers
function hideAllContainers() {
    $("#loadingMessage").hide();
    $("#passwordContainer").hide();
    $("#teamEditorContainer").hide();
    $("#gameEditorContainer").hide();
    $("#contactContainer").hide();
}

// Uses jquery ajax to call php script to check password entered is correct
function checkPassword() {
    var passwordInput = $("#passwordInput").val();
    $.post('http://ccrscoring.co.nz/scripts/php/checkpassword.php', {
        page: 'admin',
        password: passwordInput
    },
    function (response) {
        if (response == 'correct') {
            // Correct password. Hide password and go to last visited page
            sessionStorage.password = "correct";
            if (sessionStorage.currentPage == "teamEditor" || sessionStorage.currentPage == null) {
                teamEditor(true);
            } else {
                gameEditor(true);
            }
        } else if (response == 'incorrect') {
            // Incorrect password. Display error message and empty pasword input
            alertError("#alertDiv", "Incorrect password. Please try again.")
            $("#passwordInput").val = "";
        } else {
            // Error
            alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
        }
    }).fail(function () {
        alertError("#alertDiv", "Error while checking password. Please try again later. If problem persists, use the contact form");
    })
}

// Set the highlighted page in nav
function setActivePage() {
    $("li.active").removeClass("active");
    $("." + sessionStorage.currentPage).addClass("active");

    // Close nav bar when user is on mobile
    $('.navbar-collapse.in').removeClass('in').prop('aria-expanded', false);
}

// Add event to browser back button
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

// Change the instruction based on the page
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

// Show or hide instructions
function toggleInstructions() {
    $("#instructions").toggle();
    localStorage.instructionsAdmin = localStorage.instructionsAdmin == 'true' ? 'false' : 'true';
}

// Get the name of a team based on teamID and divisionID
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

// Return string with date and short month
Date.prototype.toAddGameDateString = function() {
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return this.getDate() + " " + months[this.getMonth()];
};

// Return string with short day of week, date, short month and 2 digit year
Date.prototype.toInitialString = function() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayOfGame = daysOfWeek[this.getDay()];
    return dayOfGame + " " + this.getDate() + " " + months[this.getMonth()] + " " + String(this.getFullYear()).substr(2, 2);
};

// Return string with short day of week, date and short month
Date.prototype.toPDFString = function() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayOfGame = daysOfWeek[this.getDay()];
    return dayOfGame + " " + this.getDate() + " " + months[this.getMonth()];
};

// Return string with number padding with leadng zeros to certain length
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

// Display Bootstrap error alert in footer
function alertError(selector, message) {
    $(".footer").show();
    $(selector).after("<div class='alert alert-danger' role='alert'>" + message + "</div>");
    $(selector).next().delay(4000).fadeOut(600);
    setTimeout(function() { $(selector).next().remove(); $(".footer").hide(); }, 5000);
}

// Display Bootstrap success alert in footer
function alertSuccess(selector, message) {
    $(".footer").show();
    $(selector).after("<div class='alert alert-success' role='alert'>" + message + "</div>");
    $(selector).next().delay(4000).fadeOut(600);
    setTimeout(function() { $(selector).next().remove(); $(".footer").hide(); }, 5000);
}

// Display Bootstrap info alert in footer
function alertNotification(selector, message) {
    $(".footer").show();
    $(selector).after("<div class='alert alert-info' role='alert'>" + message + "</div>");
    $(selector).next().delay(4000).fadeOut(600);
    setTimeout(function() { $(selector).next().remove(); $(".footer").hide(); }, 5000);
}

/* 
--------------------------------------------------------------------------
----------------------------- Team Editor --------------------------------
--------------------------------------------------------------------------
*/

// Start team editor
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
    html += "<button id='addTeamFormToggle' onclick='toggleAddTeam()'>Add New Team</button>";
    html += "<div id='addTeamForm'>";
    html += "    Team Name: <input type='text' id='addTeamName'>";
    html += "    Grade: <select id='divisionDropDown'>";
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

// Sort the team lists for each division in alphabetical order
function sortTeamList() {
    for (var i = 0; i < allTeams.length; i += 1) {
        allTeams[i].sort(function(a, b) {
            if(a.teamName.toUpperCase() < b.teamName.toUpperCase()) return -1;
            if(a.teamName.toUpperCase() > b.teamName.toUpperCase()) return 1;
            return 0;
        });
    }
}

// Add events to elements on team editor page
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
    var post = $.post('http://ccrscoring.co.nz/scripts/php/changeteamname.php', {
        teamID: teamID,
        newName: newName
    },
    function (response) {
        if (response == 'success') {
            if (backEvent) {
                addBackEvent(['changeTeamName', teamID, oldName, divisionID]);
            }
            // Change team name in locally storage array
            var teams = allTeams[parseInt(divisionID)];
            for (var q = 0; q < teams.length; q += 1) {
                if (teams[q].teamID == teamID) {
                    teams[q].teamName = newName;
                    break;
                }
            }
            // Name has been changed. Regenerate team list.
            generateTeamList();
            alertSuccess("alertDiv", "Team name has been changed");
        } else {
            // Error
            alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
        }
    });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while changing the teams name. Please try again later. If problem persists, use the contact form");
    })
}

// Adds team to database
function addTeam() {
    var teamName = $("#addTeamName").val();
    var divisionID = $('#divisionDropDown option:selected').val()
    var teamExists = false;
    
    // Find if team already exists in that division
    var teams = allTeams[parseInt(divisionID)];
    for (var p = 0; p < teams.length; p += 1) {
        if (teams[p].teamName == teamName) {
            teamExists = true;
            break;
        }
    }

    if (!teamExists) {
        var post = $.post('http://ccrscoring.co.nz/scripts/php/addnewteam.php', {
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
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        }, 'json');

        post.fail(function (request, textStatus, errorThrown) {
            alertError("#alertDiv", "Error while adding new team. Please try again later. If problem persists, use the contact form");
        });
    } else {
        var alertMessage = teamName + " already exists in " + allDivs[parseInt(divisionID)].divisionName;
        alertError("#alertDiv", alertMessage); 
    }
}

// Delete team that was just created
function deleteTeam(teamName, divisionID) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/deleteteam.php', {
        teamName: teamName,
        divisionID: divisionID
    },
    function (response) {
        if (response == 'success') {
            // Team has been deleted. Remove team from locally storage team list
            var teams = allTeams[parseInt(divisionID)];
            for (var p = 0; p < teams.length; p += 1) {
                if (teams[p].teamName == teamName) {
                    teams.splice(p, 1);
                    break;
                }
            }
            generateTeamList();
            alertSuccess("#alertDiv", "Team has been deleted");
        } else {
            // Error
            alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
        }
    });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while deleting team. Please try again later. If problem persists, use the contact form");
    })
}

// Remove team from competition without deleting them
function disableTeam(teamID, division) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/disableteam.php', {
        teamID: teamID
    },
    function (response) {
        if (response == 'success') {
            // Team has been removed from competition. Set that team as disabled in local storage
            var teams = allTeams[parseInt(division)];
            for (var r = 0; r < teams.length; r += 1) {
                if (teams[r].teamID == teamID) {
                    teams[r].enabled = 'n';
                }
            }
            generateTeamList();
            alertSuccess("#alertDiv", "Team has been removed from competition");
        } else {
            // Error
            alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
        }
    });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while removing team. Please try again later. If problem persists, use the contact form");
    })
}

// Add team back into competition
function enableTeam(teamID, division) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/enableteam.php', {
        teamID: teamID
    },
    function (response) {
        if (response == 'success') {
            // Teams has been added back into competition
            var teams = allTeams[parseInt(division)];
            for (var s = 0; s < teams.length; s += 1) {
                if (teams[s].teamID == teamID) {
                    teams[s].enabled = 'y';
                }
            }
            generateTeamList();
            alertSuccess("#alertDiv", "Team has been added back into competition");
        } else {
            // Error
            alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
        }
    });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while readding team. Please try again later. If problem persists, use the contact form");
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
var lastRowSelected;

// Start game editor
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

// Show/hide add game form
function toggleAddGameForm() {
    $("#addGameForm").toggle();
}

// Generate the buttons and add game form and add to toolbar container
function generateToolbar() {
    var html = '';

    // Add buttons
    html += "<div>";
    html += "    <div class='row gameEditorToolbarButtons'>"
    html += "        <button id='createDrawPDFButton' onclick='createDrawPDF()'>Create Draw PDF</button>";
    html += "        <button id='createResultsPDFButton' onclick='createResultsPDF()'>Create Results PDF</button>";
    html += "        <button id='updatePointsTable' onclick='updatePointsTable()'>Update Point Tables</button>";
    html += "        <button id='resetTableButton' onclick='filterDates()'>Reset Table</button>";
    html += "    </div>";
    html += "    <div class='row gameEditorToolbarButtons'>"
    html += "        <button id='addGameButton' onclick='toggleAddGameForm()'>Add Games</button>";
    html += "        <button id='deleteSelectedGameButton' onclick='deleteSelectedGames()'>Delete Selected Games</button>";
    html += "        <button id='lockSelectedGameButton' onclick='lockSelectedGames()'>Lock Selected Games</button>";
    html += "        <button id='unlockSelectedGameButton' onclick='unlockSelectedGames()'>Unlock Selected Games</button>";
    html += "    </div>";
    html += "</div>";

    // Add add game form
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

// Generate the table with games between the start and end dates
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
    html += "            <th id='tableHeaderHomeTries'>Home Tries</th>";
    html += "            <th id='tableHeaderAwayTeam'>Away Team</th>";
    html += "            <th id='tableHeaderAwayScore'>Away Score</th>";
    html += "            <th id='tableHeaderAwayTries'>Away Tries</th>";
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

            // If game occurs between the dates passed add to table
            if (gameDate >= startDate && gameDate <= endDate) {
                if (gameID.length == 16) {
                    var homeTeamName = getTeamName(gameID.substr(8, 3), gameID.slice(-2));
                    var awayTeamName = getTeamName(gameID.substr(11, 3), gameID.slice(-2));
                } else {
                    // Legacy support for old gameIDs
                    var homeTeamName = game.homeTeamName;
                    var awayTeamName = game.awayTeamName;
                }

                var division = allDivs[divID].divisionName;                
                html += "        <tr class='gameRow " + gameID + "'>";
                html += "            <td class='date' sorttable_customkey='" + dateFromGameID + "'><input class='datepicker " + (offset + l) + "' data-value='" + dateToDisplay + "' value='" + gameDate.toInitialString() + "'></td>";
                html += "            <td class='divisionName' sorttable_customkey='" + divID + "'>" + division + "</td>";
                html += "            <td class='homeTeamName'>" + homeTeamName + "</td>";
                html += "            <td class='homeTeamScore' contenteditable='true'>" + game.homeTeamScore + "</td>";
                html += "            <td class='homeTeamTries' contenteditable='true'>" + game.homeTeamTries + "</td>";
                html += "            <td class='awayTeamName'>" + awayTeamName + "</td>";
                html += "            <td class='awayTeamScore' contenteditable='true'>" + game.awayTeamScore + "</td>";
                html += "            <td class='awayTeamTries' contenteditable='true'>" + game.awayTeamTries + "</td>";
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
    setRowIndexes();
    selectedRowGameID = [];
}

// Regenerate game table with new dates
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

// Add events to elements on game editor page
function addEventsGame() {
    // Set date picker to only be added once date is clicked. This saves waiting 
    // for 1300+ datepickers to be initialised before table displays.
    $("input.datepicker").click(function() {
        // Remove this click event
        $(this).off('click');
        // Add date picker with it's own click event
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
                var index = this.$node[0].parentElement.parentElement.classList[2];
                var date = this._hidden.value;
                var newGameID = date.substr(6, 4) + date.substr(3, 2) + date.substr(0, 2) + oldGameID.substr(8, oldGameID.length - 8);
                // delete game
                // create new one with date change added to changes
                var post = $.post('http://ccrscoring.co.nz/scripts/php/changedate.php', {
                    oldGameID: oldGameID,
                    newGameID: newGameID
                },
                function (response) {
                    if (response == 'success') {
                        // Change the gameID stored as a class in tr. Then remove and add the index and 
                        // selectedRow classes to maintain the correct class order
                        var row = $(".gameRow." + oldGameID);
                        row.removeClass(oldGameID).addClass(newGameID).removeClass(index).addClass(index);
                        if (row.hasClass('selectedRow')) { row.removeClass('selectedRow').addClass('selectedRow'); }
                        alertSuccess("#alertDiv", "Date has been changed");
                    } else {
                        // Error
                        alertError("#alertDiv", "Error while changing date. Please refresh page and try again. If problem persists, use the contact form");
                    }
                });

                post.fail(function (request, textStatus, errorThrown) {
                    alertError("#alertDiv", "Error while changing date. Please refresh page and try again. If problem persists, use the contact form");
                });
            }
        });
        // Trigger date pickers click event
        $(this).click();
    });
    
    // Add datepicker to the filter inputs
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
    
    // Add event to the editable columns of the table. Tab moves tight one cell and shift + tab moves left one cell.
    $("tr > [contenteditable=true]").on({
        keydown: function (event) {
            if (event.which == 13 && event.shiftKey) { // Shift + enter moves up one cell
                // Stop a line break being added
                event.preventDefault();
                // Get the parent of element currently focused, move to previous sibling, get the child with the same class name and focus it.
                $(this).parent().prev().children("." + this.className).focus();
                placeCaretAtEnd(document.activeElement);
            } else if (event.which == 13) { // Enter without shift moves down one cell
                // Stop a line break being added
                event.preventDefault();
                // Get the parent of element currently focused, move to next sibling, get the child with the same class name and focus it.
                $(this).parent().next().children("." + this.className).focus();
                placeCaretAtEnd(document.activeElement);
            }
        },

        // When the user clicks out of a cell.
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
                // Upload change
                changeGameInfo(gameID, column, newValue, oldValue, rowIndex, true, homeTeam, awayTeam, date);
            }
        },

        // When user clicks into cell
        focus: function () {
            sessionStorage.contenteditable = this.innerHTML;
        }
    });
    
    // When user clicks cell.
    $("tr.gameRow").on({
        click: function(event) {
            // If shift + click, then highlight all cells between the last selected cell and this one.
            if (event.shiftKey && selectedRowGameID.length > 0) {
                var startRowIndex = $("." + selectedRowGameID[selectedRowGameID.length - 1])[0].classList[2];
                var endRowIndex = this.classList[2];
                
                if (startRowIndex != endRowIndex) {
                    if (startRowIndex > endRowIndex) {
                        var endRow = $("." + selectedRowGameID[selectedRowGameID.length - 1])[0];
                        var currentRow = this;
                    } else if (startRowIndex < endRowIndex) {
                        var endRow = this;
                        var currentRow = $("." + selectedRowGameID[selectedRowGameID.length - 1])[0].nextElementSibling;
                    }

                    while (currentRow != endRow.nextElementSibling) {
                        addRowSelection(currentRow);
                        currentRow = currentRow.nextElementSibling;
                    }
                } else {
                    // clicked on an already selected row
                }
            } else {
                toggleRowSelection(this);
            }
        }
    });
    
    // When header is clicked, add an index to indicate where that row is located in the table.
    // Runs after the table has been sorted
    $("th").on({
        click: function(event) {
            // Remove all row selections
            $(".selectedRow").removeClass("selectedRow");
            selectedRowGameID = [];
            // Set new row indexes
            setRowIndexes();
        }
    });
}

// Set the row indexes
function setRowIndexes() {
    var gameRows = $("#gameEditorTable tbody tr");
    for (var s = 0; s < gameRows.length; s += 1) {
        if (gameRows[s].classList.length == 3) {
            // Remove the old index
            $(gameRows[s]).removeClass(gameRows[s].classList[2]);
        }
        // Add new index
        gameRows[s].className += ' ' + s;
    }
}

// Upload changed data to the database
function changeGameInfo(gameID, column, newValue, oldValue, rowIndex, backEvent, homeTeam, awayTeam, date) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/uploadchange.php', {
            gameID: gameID,
            column: column,
            newValue: newValue
        },
        function (response) {
            if (response == 'success') {
                if (backEvent) { 
                    addBackEvent(['gameInfoChanged', gameID, column, oldValue, rowIndex]); 
                } else {
                    // If this was called after user clicked browser back button then changed 
                    // the value in the last cell changed to previous value.
                    var selector = "." + rowIndex + " > ." + column;
                    $(selector).empty().append(newValue);
                }
                
                // Change value in locally storage game array
                var games = allGames[parseInt(gameID.slice(-2))];
                for (var v = 0; v < games.length; v += 1) {
                    if (games[v].GameID == gameID) {
                        games[v][column] = newValue;
                        break;
                    }
                }
                
                alertSuccess("#alertDiv", "The change has been saved");
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while saving change. Please try again later. If problem persists, use the contact form");
    });
}

// Set a row as selected (used when selecting multiple rows)
function addRowSelection(elem) {
    var gameID = elem.classList.item(1);
    selectedRowGameID.push(gameID);
    elem.classList.add('selectedRow');
}

// Show/hide row selection (used when selecting single row)
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

// Deleted the games that have been selected
function deleteSelectedGames() {
    if (confirm("Are you sure you want to delete the selected games? They will be gone forever if deleted")) {
        var post = $.post('http://ccrscoring.co.nz/scripts/php/deletegame.php', {
            gameIDArray: JSON.stringify(selectedRowGameID)
        },
        function (response) {
            if (response == 'success') {
                for (var h = 0; h < selectedRowGameID.length; h += 1) {
                    // Remove game from local game array
                    var games = allGames[parseInt(selectedRowGameID[h].slice(-2))];
                    for (var w = 0; w < games.length; w += 1) {
                        if (games[w].GameID == selectedRowGameID[h]) {
                            games.splice(w, 1);
                            w -= 1;
                            break;
                        }
                    }
                }
                
                // Clear variables and redisplay table with dates in filter inputs
                selectedRowGameID = [];
                numGamesDeleted = 0;
                filterDates();
                alertSuccess("#alertDiv", "The selected games have been deleted");
            } else {
                // Error
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

        post.fail(function (request, textStatus, errorThrown) {
            alertError("#alertDiv", "Error while deleting game. Please try again later. If problem persists, use the contact form");
        })
    }
}

// Lock the selected games
function lockSelectedGames() {
    for (var n = 0; n < selectedRowGameID.length; n += 1) {
        lockGame(selectedRowGameID[n]);
    }
}

// Unlock the selected games
function unlockSelectedGames() {
    for (var n = 0; n < selectedRowGameID.length; n += 1) {
        unlockGame(selectedRowGameID[n]);
    }
}

// Change the team names in the home and away drop downs menus
function changeTeamDropDowns() {
    selectedDivisionIndex = parseInt($("#addGameDivisionDropDown").val());
    generateToolbar();
    $("#addGameForm").show();
}

// Add a new game to the database
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
        alertError("#alertDiv", "Please change one of the teams as they can't play themselves");
    } else if (gameID.length == 16) {
        var post = $.post('http://ccrscoring.co.nz/scripts/php/addgame.php', {
                gameID: gameID,
                homeTeamName: homeText,
                awayTeamName: awayText
            },
            function (response) {
                if (response == 'success') {
                    // add game to local game array if it doesn't already exist
                    allGames[parseInt(gameID.slice(-2))].push({GameID: gameID, assRef1: '', assRef2: '', awayTeamName: awayText, awayTeamScore: '0', homeTeamName: homeText, homeTeamScore: '0', lastTimeScore: "2016-01-01 11:11:11", liveScored: 'n', location: '', minutesPlayed: '0', ref: '', scoringPlays: '[]', time: '', changed: '', locked: 'n', changes: '[]', userID: '', homeTeamTries: '', awayTeamTries: '', processed: 'n'});
                    addBackEvent(['addGame', gameID, homeText, awayText, dateString, allDivs[selectedDivisionIndex].divisionName]);
                    filterDates();
                    alertSuccess("#alertDiv", "Game has been successfully added");
                } else {
                    alertError("#alertDiv", 'Game already exists');
                }
            });

        post.fail(function (xhr, textStatus, errorThrown) {
            alertError("#alertDiv", "Error while adding game. Please try again later. If problem persists, use the contact form");
        })
    } else if (gameID.length == 8) {
        alertError("#alertDiv", "Please enter a date for the game");
    } else {
        alertError("#alertDiv", "Error while creating gameID. Please use the contact form informing me of this error")
    }
}

// Lock a single game
function lockGame(gameID) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/lockgame.php', {
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
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while deleting game. Please try again later. If problem persists, use the contact form");
    })
}

// Unlock a single game
function unlockGame(gameID) {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/unlockgame.php', {
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
                alertError("#alertDiv", "Error: " + response + ". Please try again later. If problem persists, use the contact form");
            }
        });

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while deleting game. Please try again later. If problem persists, use the contact form");
    })
}

// Place the caret at the end of the info in the cell
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

// Create a pdf with the games in the game table
function createResultsPDF() {
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

    // Get list of games between the filter dates
    var gameArray = [];
    for (var y = 0; y < allDivs.length; y += 1) {
        gameArray[parseInt(allDivs[y].divisionID)] = [];
        
        for (var u = 0; u < allGames[y].length; u += 1) {
            var gameID = allGames[y][u].GameID;
            var gameDate = new Date(parseInt(gameID.substr(0, 4)), parseInt(gameID.substr(4, 2)) - 1, parseInt(gameID.substr(6, 2)));
            if (gameDate >= startDate && gameDate <= endDate) {
                gameArray[parseInt(gameID.slice(-2))].push(allGames[y][u]);
            }
        }
    }
    
    // Create pdf string using format specified on the pdfmake website
    var body = [];
    
    for (var z = 0; z < allDivs.length; z += 1) {
        body.push([{text: allDivs[z].divisionName, colSpan: 6, style: 'divTitle'}, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]);
        
        for (var v = 0; v < gameArray[z].length; v += 1) {
            var game = gameArray[z][v];
            var gameID = game.GameID;
            var gameDateString = new Date(parseInt(gameID.substr(0, 4)), parseInt(gameID.substr(4, 2)) - 1, parseInt(gameID.substr(6, 2))).toPDFString();
            body.push([
                {text: gameDateString}, // Date
                {text: getTeamName(gameID.substr(8, 3), gameID.slice(-2))}, // Home Team Name
                {text: (game.homeTeamScore == 2 ? 'Win' : game.homeTeamScore == 1 ? 'Defaulted' : game.homeTeamScore)}, // Home Team Score
                {text: 'vs'}, 
                {text: getTeamName(gameID.substr(11, 3), gameID.slice(-2))}, // Away Team Name
                {text: (game.awayTeamScore == 2 ? 'Win' : game.awayTeamScore == 1 ? 'Defaulted' : game.awayTeamScore)}, // Away Team Score
            ]);
        }
        
        body.push([{ text: '------------------------------------------------------------------------------------------------------------------------------------', colSpan: 6 }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]);
    }
    
    var docDefinition = {
        content: [
            {
                image: imageBase64, // It's at the bottom of the file
                style: 'sponsorImage'
            },
            { 
                text: 'Results for ' + startDate.toPDFString() + " to " + endDate.toPDFString(),
                style: 'dateString'
            },
            {
                table: {
                    widths: [ 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
                    body: body
                }, 
                layout: 'noBorders', 
                margin: [0, 0, 0, 0],
                style: 'table'
            }
        ],
        styles: {
            divTitle: {
                fontSize: 16,
                bold: true		
            },
            table: {
                fontSize: 12
            },
            dateString: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            sponsorImage: {
                alignment: 'center'
            }
        }
    };
    
    pdfMake.createPdf(docDefinition).download('rugbyresultsfor' + startDate.toAddGameDateString() + '-' + endDate.toAddGameDateString() + '.pdf');
}

// Create a pdf with the games in the game table
function createDrawPDF() {
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
    
    // Get list of games between the filter dates
    var gameArray = [];
    for (var y = 0; y < allDivs.length; y += 1) {
        gameArray[parseInt(allDivs[y].divisionID)] = [];
        
        for (var u = 0; u < allGames[y].length; u += 1) {
            var gameID = allGames[y][u].GameID;
            var gameDate = new Date(parseInt(gameID.substr(0, 4)), parseInt(gameID.substr(4, 2)) - 1, parseInt(gameID.substr(6, 2)));
            if (gameDate >= startDate && gameDate <= endDate) {
                gameArray[parseInt(gameID.slice(-2))].push(allGames[y][u]);
            }
        }
    }
    
    // Create pdf string using format specified on the pdfmake website
    var body = [];
    
    for (var z = 0; z < allDivs.length; z += 1) {
        body.push([{text: allDivs[z].divisionName, colSpan: 9, style: 'divTitle'}, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]);
        
        for (var v = 0; v < gameArray[z].length; v += 1) {
            var game = gameArray[z][v];
            var gameID = game.GameID;
            var gameDateString = new Date(parseInt(gameID.substr(0, 4)), parseInt(gameID.substr(4, 2)) - 1, parseInt(gameID.substr(6, 2))).toPDFString();
            var gameChanges = JSON.parse(game.changes);
            body.push([
                {text: gameDateString, color: (isChanged('date', gameChanges) ? 'red' : 'black')}, // Date
                {text: getTeamName(gameID.substr(8, 3), gameID.slice(-2))}, // Home Team Name
                {text: 'vs'}, 
                {text: getTeamName(gameID.substr(11, 3), gameID.slice(-2))}, // Away Team Name
                {text: game.location, color: (isChanged('location', gameChanges) ? 'red' : 'black')}, // Location
                {text: game.time, color: (isChanged('time', gameChanges) ? 'red' : 'black')}, // Time
                {text: game.ref, color: (isChanged('ref', gameChanges) ? 'red' : 'black')}, // Ref
                {text: game.assRef1, color: (isChanged('assRef1', gameChanges) ? 'red' : 'black')}, // Ass Ref 1
                {text: game.assRef2, color: (isChanged('assRef2', gameChanges) ? 'red' : 'black')}  // Ass Ref 2
            ]);
        }
        
        body.push([{ text: '------------------------------------------------------------------------------------------------------------------------------------', colSpan: 9 }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]);
    }
    
    var docDefinition = {
        content: [
            {
                image: imageBase64, // It's at the bottom of the file
                style: 'sponsorImage'
            },
            { 
                text: 'Draw for ' + startDate.toPDFString() + " to " + endDate.toPDFString(),
                style: 'dateString'
            },
            {
                table: {
                    widths: [ 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
                    body: body
                }, 
                layout: 'noBorders', 
                margin: [0, 0, 0, 0],
                style: 'table'
            }
        ],
        styles: {
            divTitle: {
                fontSize: 16,
                bold: true		
            },
            table: {
                fontSize: 12
            },
            dateString: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            sponsorImage: {
                alignment: 'center'
            }
        }
    };
    
    pdfMake.createPdf(docDefinition).download('rugbydrawfor' + startDate.toAddGameDateString() + '-' + endDate.toAddGameDateString() + '.pdf');
}

// Checks whether there has been change to a specific column in game info
function isChanged(column, gameChanges) {
    for (var j = 0; j < gameChanges.length; j += 1) {
        if (gameChanges[j][1] == column) {
            return true;
        }
    }
    
    return false;
}

// Update the points tables
function updatePointsTable() {
    var post = $.post('http://ccrscoring.co.nz/scripts/php/updatepointstable.php', {},
    function (response) {
        if (response.length > 0) {
            var gameIDClassList = 'tr.' + response[0][0];
            for (var x = 1; x < response.length; x += 1) {
                gameIDClassList += ', tr.' + response[x][0];
            }

            // Hide all the game rows
            $("#gameEditorTable tbody tr").css('display', 'none');
            // Then only show the game rows that need to be updated
            $(gameIDClassList).css('display', 'table-row');
            
            // Highlight cells that need to be updated
            for (var w = 0; w < response.length; w += 1) {
                for (var a = 1; a < response[w].length; a += 1) {
                    $("." + response[w][0] + " ." + response[w][a]).css('background-color', 'LemonChiffon');
                }
            }
        }
        // return games that need to be updated before being processed and filter the list to show them
        alertSuccess("#alertDiv", "Points tables have been updated");
    }, 'json');

    post.fail(function (xhr, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while updating the points table. Please try again later. If problem persists, use the contact form");
    });
}

/* 
--------------------------------------------------------------------------
------------------------------- Contact ----------------------------------
--------------------------------------------------------------------------
*/

// Show the contact form container
function showContactContainer() {
    hideAllContainers();
    setInstructions('contact');
    sessionStorage.currentPage = 'contact';
    addBackEvent(['startContactForm']);
    setActivePage();
    addEventsContact();
    $("#contactContainer").show();
}

// Add events to elements on the contact page
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

// Submit the cotact form
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

var imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbQAAACcCAYAAAAXvF6pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUM0RDg5QjI1MEI4MTFFM0E0M0NFMTk2QzgzQzZEQ0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUM0RDg5QjM1MEI4MTFFM0E0M0NFMTk2QzgzQzZEQ0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQzREODlCMDUwQjgxMUUzQTQzQ0UxOTZDODNDNkRDQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQzREODlCMTUwQjgxMUUzQTQzQ0UxOTZDODNDNkRDQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoS2PXAAACS/SURBVHja7J0JlJzV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';