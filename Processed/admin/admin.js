var divTitles = [];


$(document).ready(function() {
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getalldivisions.php', {}, 
        function(response) {
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
            if (sessionStorage.password == "correct") {
                if (sessionStorage.currentPage == "teamEditor" || sessionStorage.currentPage == null) {
                    teamEditor();
                } else {
                    gameEditor();
                }
            } else {
                showPassword();
            }
        } else {
            alert("Please update your browser to the latest version");
        }
    });
});

// Shows password div
function showPassword() {
    $("#passwordContainer").show();
}

// Hides all the web page containers
function hideAllContainers() {
    $("#passwordContainer").hide();
    $("#teamEditorContainer").hide();
    $("#gameEditorContainer").hide();
}

// Uses jquery ajax to call php script to check password entered is correct
function checkPassword() {
    var passwordInput = $("#passwordInput").val();
    $.post(
        'http://www.possumpam.com/rugby/phpscripts/checkpassword.php', 
        { page: 'admin', password: passwordInput }, 
        function(response) { 
            if (response == 'correct') {
                // Correct password. Hide password and generate team lists
                if(typeof(Storage) !== "undefined") {
                    sessionStorage.password = "correct";
                    if (sessionStorage.currentPage == "teamEditor" || sessionStorage.currentPage == null) {
                        teamEditor();
                    } else {
                        gameEditor();
                    }
                } else {
                    teamEditor();
                }
            } else if (response == 'incorrect') {
                // Incorrect password. Do nothing
                alert("Incorrect password. Please try again.")
                $("#passwordInput").val = "";
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        }).fail(function() {
            alert("Error while checking password. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
        })
}

/* 
--------------------------------------------------------------------------
----------------------------- Team Editor --------------------------------
--------------------------------------------------------------------------
*/

function teamEditor() {
    if(typeof(Storage) !== "undefined") {
        sessionStorage.currentPage = "teamEditor";
    }
    hideAllContainers();
    generateAddTeam();
    generateTeamList();
    showTeamEditorContainer()
}

// Show team editor container
function showTeamEditorContainer() {
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
    for (var j = 0; j < divTitles.length; j += 1) {
        html += "        <option value='" + divTitles[j][0] + "'>" + divTitles[j][1] + "</option>";
    }
    html += "    </select>";
    html += "    <button type='button' id='addTeamButton' onclick='addTeam()'>Add Team</button>";
    html += "</div>";
    $("#addTeamContainer").empty().append(html);
}

// Dynamically generates team lists
function generateTeamList() {
    var html = "";
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getallteams.php', {}, 
        function(response) {
            for (var i = 0; i < response.length; i += 1) {
                html += "<div class='teamRow' onclick='changeTeamName(" + response[i].teamID + ")'>";
                html += "   <div class='division'>" + divTitles[parseInt(response[i].division)][1] + "</div>";
                html += "   <div class='teamName ID" + response[i].teamID + "'>" + response[i].teamName + "</div>";
                html += "</div>";
            }
            $("#teamListContainer").empty().append(html);
        }, 
    'json');
    
    post.fail(function() {
        alert("Error while getting team list. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

// Changes team name in database
function changeTeamName(teamID) {
  var newName = prompt("Please enter the new name.");
  var post = $.post('http://www.possumpam.com/rugby/phpscripts/changeteamname.php', { teamID: teamID, newName: newName }, 
        function(response) { 
            if (response == 'success') {
                // Name has been changed. Regenerate team list.
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });
    
    post.fail(function() {
        alert("Error while changing the teams name. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
  
}

// Adds team to database
function addTeam() {
    var teamName = $("#addTeamName").val();
    var divisionID = $('#divisionDropDown option:selected').val()
    
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/addnewteam.php', { teamName: teamName, divisionID: divisionID }, 
        function(response) { 
            if (response == 'success') {
                // Name has been changed. Regenerate team list.
                generateTeamList();
            } else {
                // Error
                alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            }
        });
    
    post.fail(function() {
        alert("Error while adding new team. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

/* 
--------------------------------------------------------------------------
----------------------------- Game Editor --------------------------------
--------------------------------------------------------------------------
*/

var selectedRowGameID = [];
var teamList = []
var selectedDivisionIndex = 0;

function gameEditor() {
    if(typeof(Storage) !== "undefined") {
        sessionStorage.currentPage = "gameEditor";
    }
    hideAllContainers();
    getTeamList();
    generateGameTable(new Date("2000"), new Date("2050"));
    showGameEditorContainer();
}

// Show game editor container
function showGameEditorContainer() {
    $("#gameEditorContainer").show();
}

function toggleAddGameForm() {
    $("#addGameForm").toggle();
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
            generateToolbar();
        }, 
    'json');
    
    post.fail(function() {
        generateToolbar();
        alert("Error while getting team list. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function generateToolbar() {
    var html = '';
    
    html += "<div id='gameEditorToolbarButtons'>";
    html += "    <button id='addGameButton' onclick='toggleAddGameForm()'>Add Game</button>";
    html += "    <button id='deleteSelectedGameButton' onclick='deleteSelectedGames()'>Delete Selected Games</button>";
    html += "</div>";

    html += "<div id='addGameForm'>";
    html += "    Division: <select id='addGameDivisionDropDown' onchange='changeTeamDropDowns()'>";
    for (var q = 0; q < divTitles.length; q += 1) {
        html += "    <option>" + divTitles[q][1] + "</option>";
    }
    html += "    </select>";
    html += "    Home Team: <select id='addGameHomeTeamDropDown'>";
    for (var r = 0; r < teamList[selectedDivisionIndex].length; r += 1) {
        html += "    <option value='" + teamList[selectedDivisionIndex][r][0] + "'>" + teamList[selectedDivisionIndex][r][1] + "</option>";
    }
    html += "    </select>";
    html += "    Away Team: <select id='addGameAwayTeamDropDown'>";
    for (var s = 0; s < teamList[selectedDivisionIndex].length; s += 1) {
        html += "    <option value='" + teamList[selectedDivisionIndex][s][0] + "'>" + teamList[selectedDivisionIndex][s][1] + "</option>";
    }
    html += "    </select>";
    html += "    Date: <input type='date' id='addGameDatePicker'>";
    html += "    <button id='addGameButton' onclick='addGame()'>Add Game</button>";
    html += "</div>";

    html += "<div id='dateFilter'>";
    html += "    Start of Week: <input type='date' id='dateFilterStart'>";
    html += "    End of Week: <input type='date' id='dateFilterEnd'>";
    html += "    <button id='dateFilterButton'  onclick='filterDates()'>Filter</button>";
    html += "</div>";

    $("#gameEditorToolbar").empty().append(html);
    
    // if there was an error retrieving the team list then disable the add 
    // game button as user can't add game without the team lists.
    if (teamList[0].length == 0) {
        $("#addGameButton").prop('disabled', true);
    }
    
    $("#addGameDivisionDropDown").prop('selectedIndex', selectedDivisionIndex);
}

function generateGameTable(startDate, endDate) {
    var html = '';
    $("#gameEditorTable").empty().append("<div id='tablePlaceholderText'>Table is being created</div>");
    
    var post = $.post('http://www.possumpam.com/rugby/phpscripts/getallgames.php', {}, 
        function(response) {
            html += "<table id='gameEditorTable'>";
            html += "    <tr>";
            html += "        <th id='tableHeaderDate'>Date</th>";
            html += "        <th id='tableHeaderDivision'>Division</th>";
            html += "        <th id='tableHeaderHomeTeam'>Home Team</th>";
            html += "        <th id='tableHeaderHomeScore'>Home Score</th>";
            html += "        <th id='tableHeaderAwayTeam'>Away Team</th>";
            html += "        <th id='tableHeaderAwayScore'>Away Score</th>";
            html += "        <th id='tableHeaderTime'>Time</th>";
            html += "        <th id='tableHeaderLocation'>Location</th>";
            html += "        <th id='tableHeaderRef'>Ref</th>";
            html += "        <th id='tableHeaderAssRef1'>Assistant Ref 1</th>";
            html += "        <th id='tableHeaderAssRef2'>Assistant Ref 2</th>";
            html += "    </tr>";
        
            var teamArray = response[0];
            var gameArray = response[1];
        
            for (var l = 0; l < gameArray.length; l += 1) {
                var gameID = gameArray[l].GameID;
                var dateFromGameID = gameID.substr(0,8);
                var year = parseInt(dateFromGameID.substr(0,4));
                var month = parseInt(dateFromGameID.substr(4,2)) - 1;
                var day = parseInt(dateFromGameID.substr(6,2));
                var gameDate = new Date(year, month, day);
                var days = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                var dateToDisplay = days[gameDate.getDay()] + " " + day + " " + months[month] + " " + year;
                
                if (gameDate >= startDate && gameDate <= endDate) {
                    if (gameID.length == 16) {
                        for (var k = 0; k < teamArray.length; k += 1) {
                            if (parseInt(gameID.substr(8,3)) == parseInt(teamArray[k].teamID)) {
                                var homeTeamName = teamArray[k].teamName;
                            } else if (parseInt(gameID.substr(11,3)) == parseInt(teamArray[k].teamID)) {
                                var awayTeamName = teamArray[k].teamName;
                            }
                        }
                    } else {
                        var homeTeamName = gameArray[l].homeTeamName;
                        var awayTeamName = gameArray[l].awayTeamName;
                    }

                    var division = divTitles[parseInt(gameID.slice(-2))][1];
                    html += "    <tr class='gameRow " + gameID + "' ondblclick='toggleRowSelection(this)'>";
                    html += "        <td sorttable_customkey='" + dateFromGameID + "'>" + dateToDisplay + "</td>";
                    html += "        <td sorttable_customkey='" + parseInt(gameID.slice(-2)) + "'>" + division + "</td>";
                    html += "        <td>" + homeTeamName + "</td>";
                    html += "        <td class='homeTeamScore' contenteditable='true'>" + gameArray[l].homeTeamScore + "</td>";
                    html += "        <td>" + awayTeamName + "</td>";
                    html += "        <td class='awayTeamScore' contenteditable='true'>" + gameArray[l].awayTeamScore + "</td>";
                    html += "        <td class='time' contenteditable='true'>" + gameArray[l].time + "</td>";
                    html += "        <td class='location' contenteditable='true'>" + gameArray[l].location + "</td>";
                    html += "        <td class='ref' contenteditable='true'>" + gameArray[l].ref + "</td>";
                    html += "        <td class='assRef1' contenteditable='true'>" + gameArray[l].assRef1 + "</td>";
                    html += "        <td class='assRef2' contenteditable='true'>" + gameArray[l].assRef2 + "</td>";
                    html += "    </tr>";
                }
            }
            html += "</table>";
            $("#gameEditorTable").empty().append(html);
        
            // Make the table sortable
            newTableObject = $("table")[0];
            sorttable.makeSortable(newTableObject);
            // Sort by division
            var divisionTableHeader = $("#tableHeaderDivision");
            sorttable.innerSortFunction.apply(divisionTableHeader, []);
            // Then by date. This means games with same date will be sorted by division.
            var dateTableHeader = $("#tableHeaderDate");
            sorttable.innerSortFunction.apply(dateTableHeader, []);
        
            // Add event listeners for content editable cells after the table has been created
            addEvents();
        }, 'json');
    
    post.fail(function() {
        alert("Error while getting team list. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
    })
}

function filterDates() {
    var startDateString = $("#dateFilterStart").val();
    if (startDateString != "") {
        var yearStart = parseInt(startDateString.substr(0,4));
        var monthStart = parseInt(startDateString.substr(5,2)) - 1;
        var dayStart = parseInt(startDateString.substr(8,2));
        var startDate = new Date(yearStart, monthStart, dayStart);
    } else {
        var startDate = new Date("2000");
    }

    var endDateString = $("#dateFilterEnd").val();
    if (endDateString != "") {
        var yearEnd = parseInt(endDateString.substr(0,4));
        var monthEnd = parseInt(endDateString.substr(5,2)) - 1;
        var dayEnd = parseInt(endDateString.substr(8,2));
        var endDate = new Date(yearEnd, monthEnd, dayEnd);
    } else {
        var endDate = new Date("2050");
    }
    
    generateGameTable(startDate, endDate);
}

function addEvents() {
    $("[contenteditable=true]").on({
        keydown: function(event) {
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
            // check if content changed
            if (sessionStorage.contenteditable != this.innerHTML) {
                // add to unsaved changes list if content changed
                var post = $.post('http://www.possumpam.com/rugby/phpscripts/uploadchange.php', 
                    { gameID: this.parentElement.classList.item(1), column: this.classList.item(0), newValue: this.innerHTML }, 
                    function(response) { 
                        if (response != 'success') {
                            // Error
                            alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
                        }
                    });

                post.fail(function() {
                    alert("Error while saving change. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
                })
            }
        }, 
        
        focus: function () {
            sessionStorage.contenteditable = this.innerHTML;
        }
    });
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
        var numGamesDeleted = 0;
        for (var n = 0; n < selectedRowGameID.length; n += 1) {
            var post = $.post('http://www.possumpam.com/rugby/phpscripts/deletegame.php', 
                { gameID: selectedRowGameID[n] }, 
                function(response) { 
                    if (response == 'success') {
                        numGamesDeleted += 1;
                        if (numGamesDeleted == selectedRowGameID.length) {
                            filterDates();
                        }
                    } else {
                        // Error
                        alert("Error: " + response + ". Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
                    }
                });

            post.fail(function() {
                alert("Error while deleting game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
            })
        }
    }
}

function changeTeamDropDowns() {
    selectedDivisionIndex = $("#addGameDivisionDropDown").prop('selectedIndex');
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
    
    var dateVal = $("#addGameDatePicker").val();
    var date = dateVal.substr(0,4) + dateVal.substr(5,2) + dateVal.substr(8,2);
    
    var gameID = date + homeTeamID + awayTeamID + division;
    if (homeText == awayText) {
        alert("Please change one of the teams as they can't play themselves");
    } else if (gameID.length == 16) {
        var post = $.post('http://www.possumpam.com/rugby/phpscripts/addgame.php', 
            {gameID: gameID, homeTeamName: homeText, awayTeamName: awayText}, 
            function(response) {
                // game was added
                filterDates();
            });

        post.fail(function(xhr, textStatus, errorThrown) {
            alert("Error while adding game. Please try again later. If problem persists, send me an email (cfd19@hotmail.co.nz)");
        })
    } else if (gameID.length == 8) {
        alert("Please enter a date for the game");
    } else {
        alert ("Error while creating gameID. Please send me an email (cfd19@hotmail.co.nz) informing me of this error")
    }
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
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