var allTeams = [];
var allDivs = [];
var allGames = [];
var selectedTeams = [];
var selectedDivisionIndex = 0;

// When page first loads get team and division info, initialise some web storage variables and go to last visited page
$(document).ready(function () {
    // Get all the teams and divisions from database
    var post = $.post('http://www.ccrscoring.co.nz/scripts/php/getallinfo.php', {},
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
        
            if (games != null) {
                for (var o = 0; o < games.length; o += 1) {
                    allGames[parseInt(games[o].GameID.slice(-2))].push(games[o]);
                }
            }
        }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alertError("#alertDiv", "Error while retrieving info from database. Please try again later. If problem persists, use the contact form");
    });

    post.always(function () {
        generateTeamList();
    });
});

// Show or hide instructions
function toggleInstructions() {
    $("#instructions").toggle();
    localStorage.instructions = localStorage.instructions == 'true' ? 'false' : 'true';
}

// Return string with number padding with leading zeros to certain length
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

// Generate game elements
function generateTeamList() {
    var html = '';
    
    html += "<h1>Add Teams</h1>";
    html += "<h4>Add the teams you would like to show up on your website</h4>";
    html += "<div id='teamSelectionContainer'>";
    html += "    Grade: <select id='divisionDropDown'>";
    for (var q = 0; q < allDivs.length; q += 1) {
        html += "    <option value='" + allDivs[q].divisionID + "'>" + allDivs[q].divisionName + "</option>";
    }
    html += "    </select>";
    html += "    Team: <select id='teamDropDown'>";
    for (var r = 0; r < allTeams[selectedDivisionIndex].length; r += 1) {
        if (allTeams[selectedDivisionIndex][r].enabled == 'y') {
            html += "<option value='" + allTeams[selectedDivisionIndex][r].teamID + "'>" + allTeams[selectedDivisionIndex][r].teamName + "</option>";
        }
    }
    html += "    </select>";
    html += "    <button id='addTeamButton'>Add Team</button>";
    html += "</div>";

    html += "<div id='teamList'>";
    for (var q = 0; q < selectedTeams.length; q += 1) {
        var divName = allDivs[selectedTeams[q][0]].divisionName;
        var teamName = getTeamName(selectedTeams[q][1], selectedTeams[q][0]);
        html += "<div class='team'>" + divName + " - " + teamName + "</div>";
    }
    html += "</div>";
    
    $("#teamListContainer").empty().append(html);
    $("#divisionDropDown").prop('selectedIndex', selectedDivisionIndex);
    initEvents();
}

function initEvents() {
    $("#divisionDropDown").on({
        change: function() {
            selectedDivisionIndex = parseInt($("#divisionDropDown").val());
            generateTeamList();
        }
    });
    
    $("#addTeamButton").on({
        click: function() {
            // Add team and div IDs to selected teams
            selectedTeams.push([parseInt($("#divisionDropDown").val()), parseInt($("#teamDropDown").val())]);
            generateTeamList();
            generatePreview();
        }
    });
}

var teamListInfo = [];
var cssArray = [];
var results = true;
var selectedTeamIndex = 0;

function generatePreview() {
    // Get all the teams and divisions from database
    var post = $.post('http://www.ccrscoring.co.nz/scripts/php/getteamlistinfo.php', {
        teamList: JSON.stringify(selectedTeams)
    },
    function (response) {
        teamListInfo = response;
        generateCSSEditor();
        generateTeamSelector();
    }, 'json');

    post.fail(function (request, textStatus, errorThrown) {
        alert("Error while retrieving info from database. Please contact the web admin for this site");
    });
}

function generateCSSEditor() {
    var html = '';
    var colourOption = colourOptions();
    
    html += "<h1>Style Editor</h1>";
    html += "<h4>You can change how the elements that are outputted look using the input boxes below.</h4>";
    html += "<div id='selectorButtonContainer'>";
    html += "    <button id='layoutButton' class='active' onclick='changeEditor(\"layoutCSSEditor\", this)'>General Layout</button>";
    html += "    <button id='teamDropDownButton' onclick='changeEditor(\"teamDropDownEditor\", this)'>Team Dropdown</button>";
    html += "    <button id='drawResultButtons' onclick='changeEditor(\"drawResultsButtonsEditor\", this)'>Draw and Results Buttons</button>";
    html += "    <button id='drawResultListButton' onclick='changeEditor(\"drawResultsListEditor\", this)'>Draw and Results Lists</button>";
    html += "</div>";
    
    // layout
        // width
        // height
    html += "<div id='layoutCSSEditor'>";
    html += "   Padding: <input class='inputs' type='number' min='0' id='layoutPaddingInput' value='10'>px<br>";
    html += "   Margin: <input class='inputs' type='number' min='0' id='layoutMarginInput' value='0'>px<br>";
    html += "</div>";
    
    // team dropdown
        // font size
        // font colour
        // margin
        // padding
    html += "<div id='teamDropDownEditor'>";
    html += "   Width: <input class='inputs' type='number' min='0' id='teamDropDownWidthInput' value='114'>px<br>";
    html += "   Height: <input class='inputs' type='number' min='0' id='teamDropDownHeightInput' value='20'>px<br>";
    html += "   Padding: <input class='inputs' type='number' min='0' id='teamDropDownPaddingInput' value='0'>px<br>";
    html += "   Margin: <input class='inputs' type='number' min='0' id='teamDropDownMarginInput' value='0'>px<br>";
    html += "   Font Size: <input class='inputs' type='number' min='0' id='teamDropDownFontSizeInput' value='14'>px<br>";
    html += "   Font Colour: <select class='inputs' id='teamDropDownFontColourInput'>" + colourOption + "</select><br>";
    html += "   Background Colour: <select class='inputs' id='teamDropDownBackgroundColourInput'>" + colourOption + "</select><br>";
    html += "</div>";
    
    // draw and results button
        // width
        // height
        // background colour
        // margin
        // padding
        // font size
        // font colour
    html += "<div id='drawResultsButtonsEditor'>";
    html += "   Width: <input class='inputs' type='number' min='0' id='drawResultsButtonsWidthInput' value='63'>px<br>";
    html += "   Height: <input class='inputs' type='number' min='0' id='drawResultsButtonsHeightInput' value='26'>px<br>";
    html += "   Padding: <input class='inputs' type='number' min='0' id='drawResultsButtonsPaddingInput value='3'>px<br>";
    html += "   Margin: <input class='inputs' type='number' min='0' id='drawResultsButtonsMarginInput' value='2'>px<br>";
    html += "   Font Size: <input class='inputs' type='number' min='0' id='drawResultsButtonsFontSizeInput' value='14'>px<br>";
    html += "   Font Colour: <select class='inputs' id='drawResultsButtonsFontColourInput'>" + colourOption + "</select><br>";
    html += "   Background Colour: <select class='inputs' id='drawResultsButtonsBackgroundColourInput'>" + colourOption + "</select><br>";
    html += "   Border Colour: <select class='inputs' id='drawResultsButtonsBorderColourInput'>" + colourOption + "</select><br>";
    html += "   Border Thickness: <input class='inputs' type='number' min='0' id='drawResultsButtonsBorderWidthInput' value='2'>px<br>";
    html += "   Border Radius: <input class='inputs' type='number' min='0' id='drawResultsButtonsBorderRadiusInput' value='0'>px<br>";
    html += "</div>";
    
    // draw and results list
        // font size
        // font colour
        // margin
        // padding
    html += "<div id='drawResultsListEditor'>";
    html += "   Padding: <input class='inputs' type='number' min='0' id='drawResultsListPaddingInput' value='0'>px<br>";
    html += "   Margin: <input class='inputs' type='number' min='0' id='drawResultsListMarginInput' value='0'>px<br>";
    html += "   Font Size: <input class='inputs' type='number' min='0' id='drawResultsListFontSizeInput' value='14'>px<br>";
    html += "   Font Colour: <select class='inputs' id='drawResultsListFontColourInput'>" + colourOption + "</select><br>";
    html += "</div>";
    
    
    $("#cssEditorContainer").empty().append(html);
    addEvents();
}

function addEvents() {
    $("#layoutWidthInput").on({
        change: function() {
            $("#codePreviewContainer").css('width', $("#layoutWidthInput").val() + 'px');
            addToCSSArray("#codePreviewContainer", 'width', $("#layoutWidthInput").val() + 'px');
        }
    });
    
    $("#layoutHeightInput").on({
        change: function() {
            $("#codePreviewContainer").css('height', $("#layoutHeightInput").val() + 'px');
            addToCSSArray("#codePreviewContainer", 'height', $("#layoutHeightInput").val() + 'px');
        }
    });

    $("#layoutPaddingInput").on({
        change: function() {
            $("#codePreviewContainer").css('padding', $("#layoutPaddingInput").val() + 'px');
            addToCSSArray("#codePreviewContainer", 'padding', $("#layoutPaddingInput").val() + 'px');
        }
    });

    $("#layoutMarginInput").on({
        change: function() {
            $("#codePreviewContainer").css('margin', $("#layoutMarginInput").val() + 'px');
            addToCSSArray("#codePreviewContainer", 'margin', $("#layoutMarginInput").val() + 'px');
        }
    });

    $("#teamDropDownWidthInput").on({
        change: function() {
            $("#teamInfoDropDown").css('width', $("#teamDropDownWidthInput").val() + 'px');
            addToCSSArray("#teamInfoDropDown", 'width', $("#teamDropDownWidthInput").val() + 'px');
        }
    });

    $("#teamDropDownHeightInput").on({
        change: function() {
            $("#teamInfoDropDown").css('height', $("#teamDropDownHeightInput").val() + 'px');
            addToCSSArray("#teamInfoDropDown", 'height', $("#teamDropDownHeightInput").val() + 'px');
        }
    });

    $("#teamDropDownPaddingInput").on({
        change: function() {
            $("#teamInfoDropDown").css('padding', $("#teamDropDownPaddingInput").val() + 'px');
            addToCSSArray("#teamInfoDropDown", 'padding', $("#teamDropDownPaddingInput").val() + 'px');
        }
    });

    $("#teamDropDownMarginInput").on({
        change: function() {
            $("#teamInfoDropDown").css('margin', $("#teamDropDownMarginInput").val() + 'px');
            addToCSSArray("#teamInfoDropDown", 'margin', $("#teamDropDownMarginInput").val() + 'px');
        }
    });

    $("#teamDropDownFontSizeInput").on({
        change: function() {
            $("#teamSelectorContainer").css('fontSize', $("#teamDropDownFontSizeInput").val() + 'px');
            addToCSSArray("#teamSelectorContainer", 'fontSize', $("#teamDropDownFontSizeInput").val() + 'px');
        }
    });

    $("#teamDropDownFontColourInput").on({
        change: function() {
            $("#teamDropDownFontColourInput").css('backgroundColor', $("#teamDropDownFontColourInput").val());
            $("#teamSelectorContainer").css('color', $("#teamDropDownFontColourInput").val());
            addToCSSArray("#teamSelectorContainer", 'color', $("#teamDropDownFontColourInput").val());
        }
    });
    
    $("#teamDropDownBackgroundColourInput").on({
        change: function() {
            $("#teamDropDownBackgroundColourInput").css('backgroundColor', $("#teamDropDownBackgroundColourInput").val());
            $("#teamInfoDropDown").css('backgroundColor', $("#teamDropDownBackgroundColourInput").val());
            addToCSSArray("#teamInfoDropDown", 'backgroundColor', $("#teamDropDownBackgroundColourInput").val());
        }
    });

    $("#drawResultsButtonsWidthInput").on({
        change: function() {
            $(".drawResultsButton").css('width', $("#drawResultsButtonsWidthInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'width', $("#drawResultsButtonsWidthInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsHeightInput").on({
        change: function() {
            $(".drawResultsButton").css('height', $("#drawResultsButtonsHeightInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'height', $("#drawResultsButtonsHeightInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsPaddingInput").on({
        change: function() {
            $(".drawResultsButton").css('padding', $("#drawResultsButtonsPaddingInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'padding', $("#drawResultsButtonsPaddingInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsMarginInput").on({
        change: function() {
            $(".drawResultsButton").css('margin', $("#drawResultsButtonsMarginInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'margin', $("#drawResultsButtonsMarginInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsFontSizeInput").on({
        change: function() {
            $(".drawResultsButton").css('fontSize', $("#drawResultsButtonsFontSizeInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'fontSize', $("#drawResultsButtonsFontSizeInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsFontColourInput").on({
        change: function() {
            $("#drawResultsButtonsFontColourInput").css('backgroundColor', $("#drawResultsButtonsFontColourInput").val());
            $(".drawResultsButton").css('color', $("#drawResultsButtonsFontColourInput").val());
            addToCSSArray(".drawResultsButton", 'color', $("#drawResultsButtonsFontColourInput").val());
        }
    });

    $("#drawResultsButtonsBackgroundColourInput").on({
        change: function() {
            $("#drawResultsButtonsBackgroundColourInput").css('backgroundColor', $("#drawResultsButtonsBackgroundColourInput").val());
            $(".drawResultsButton").css('backgroundColor', $("#drawResultsButtonsBackgroundColourInput").val());
            addToCSSArray(".drawResultsButton", 'backgroundColor', $("#drawResultsButtonsBackgroundColourInput").val());
        }
    });
    
    $("#drawResultsButtonsBorderWidthInput").on({
        change: function() {
            $(".drawResultsButton").css('borderWidth', $("#drawResultsButtonsBorderWidthInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'borderWidth', $("#drawResultsButtonsBorderWidthInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsBorderRadiusInput").on({
        change: function() {
            $(".drawResultsButton").css('borderRadius', $("#drawResultsButtonsBorderRadiusInput").val() + 'px');
            addToCSSArray(".drawResultsButton", 'borderRadius', $("#drawResultsButtonsBorderRadiusInput").val() + 'px');
        }
    });

    $("#drawResultsButtonsBorderColourInput").on({
        change: function() {
            $("#drawResultsButtonsBorderColourInput").css('backgroundColor', $("#drawResultsButtonsBorderColourInput").val());
            $(".drawResultsButton").css('borderColor', $("#drawResultsButtonsBorderColourInput").val());
            addToCSSArray(".drawResultsButton", 'borderColor', $("#drawResultsButtonsBorderColourInput").val());
        }
    });

    $("#drawResultsListPaddingInput").on({
        change: function() {
            $("#teamInfoContainer").css('padding', $("#drawResultsListPaddingInput").val() + 'px');
            addToCSSArray("#teamInfoContainer", 'padding', $("#drawResultsListPaddingInput").val() + 'px');
        }
    });

    $("#drawResultsListMarginInput").on({
        change: function() {
            $("#teamInfoContainer").css('margin', $("#drawResultsListMarginInput").val() + 'px');
            addToCSSArray("#teamInfoContainer", 'margin', $("#drawResultsListMarginInput").val() + 'px');
        }
    });

    $("#drawResultsListFontSizeInput").on({
        change: function() {
            $("#teamInfoContainer").css('fontSize', $("#drawResultsListFontSizeInput").val() + 'px');
            addToCSSArray("#teamInfoContainer", 'fontSize', $("#drawResultsListFontSizeInput").val() + 'px');
        }
    });

    $("#drawResultsListFontColourInput").on({
        change: function() {
            $("#drawResultsListFontColourInput").css('backgroundColor', $("#drawResultsListFontColourInput").val());
            $("#teamInfoContainer").css('color', $("#drawResultsListFontColourInput").val());
            addToCSSArray("#teamInfoContainer", 'color', $("#drawResultsListFontColourInput").val());
        }
    });   
}

function addToCSSArray(selector, css, value) {
    // Format of cssArray - [[selector1, [css1, value1], [css2, value2]], [selector2, [css3, value3]]]
    var cssExists = false;
    var selectorExists = false;
    for (var z = 0; z < cssArray.length; z += 1) {
        // Check to see if selector already exists in cssArray
        if (cssArray[z][0] == selector) {
            // If selector exists in cssArray, check if css already exists in selector array
            for (var x = 1; x < cssArray[z].length; x += 1) {
                if (cssArray[z][x][0] == css) {
                    // If css does exist in selector array, change the value to the new one
                    if (value.indexOf('px') != -1 && value.length < 3) {
                        cssArray[z].splice(x, 1);
                    } else {
                        cssArray[z][x][1] = value;
                        cssExists = true;
                    }
                }
            }
            
            // If css doesn't exist in selector array, add it to the selectors array
            if (!cssExists) {
                cssArray[z].push([css, value]);
            }
            selectorExists = true;
        }
    }  
    
    // If selector doesn't exist in cssArray, add the selector and css to the cssArray
    if (!selectorExists) {
        cssArray.push([selector, [css, value]]);
    }
    
    // update code 
    generateCode();
}

function colourOptions() {
    var hexValues = ['0','8','f'];
    var colours = [];
    var options = '';
    
    for (var a = 0; a < hexValues.length; a += 1) {
        for (var b = 0; b < hexValues.length; b += 1) {
            for (var c = 0; c < hexValues.length; c += 1) {
                colours.push('#' + hexValues[a] + hexValues[a] + hexValues[b] + hexValues[b] + hexValues[c] + hexValues[c]);
            }
        }
    }
    
    for (var i = 0; i < colours.length; i += 1) {
        options += "<option value='" + colours[i] + "' style='background-color: " + colours[i] + "'></option>";
    }
    
    return options;
}

function changeEditor(selector, elem) {
    $("#layoutCSSEditor").hide();
    $("#teamDropDownEditor").hide();
    $("#drawResultsButtonsEditor").hide();
    $("#drawResultsListEditor").hide();
    $("#" + selector).show();
    $(".active").removeClass('active');
    $(elem).addClass('active');
}

function generateTeamSelector() {
    var html = '';
    
    html += "<h1>Preview</h1>";
    html += "<h4>Preview how the outputted information will look.</h4>";
    html += "<div id='teamSelectorContainer'>";
    html += "    Team:";
    html += "    <select id='teamInfoDropDown' onchange='changeTeam()'>";
    for (var e = 0; e < selectedTeams.length; e += 1) {
        var divName = allDivs[selectedTeams[e][0]].divisionName;
        var teamName = getTeamName(selectedTeams[e][1], selectedTeams[e][0]);
        html += "    <option value='" + e + "'>" + divName + " - " + teamName + "</option>";
    }
    html += "    </select>"
    html += "</div>";
    
    html += "<button id='resultsButton' class='drawResultsButton' onclick='toggleResults()'>Results</button>";
    html += "<button id='drawButton' class='drawResultsButton' onclick='toggleResults()'>Draw</button>";
    
    html += "<div id='teamInfoContainer'></div>";
    
    $("#codePreviewContainer").empty().append(html);
    document.getElementById('teamInfoDropDown').selectedIndex = selectedTeamIndex;
    generateTeamInfo();
}

function generateTeamInfo() {
    var html = '';
    var selectedTeam = selectedTeams[selectedTeamIndex];
    var teamID = pad(selectedTeam[1], 3);
    var divID = pad(selectedTeam[0], 2);
    
    if (teamListInfo != null) {
        if (results) {
            // display results for team
            for (var c = 0; c < teamListInfo.length; c += 1) {
                var game = teamListInfo[c];
                var gameID = game.GameID;
                if ((gameID.substr(8, 3) == teamID || gameID.substr(11, 3) == teamID) && game.minutesPlayed != 0) {
                    html += 
                        "<div>" + 
                        getTeamName(gameID.substr(8, 3), divID) + " " + game.homeTeamScore + 
                        " - " + 
                        getTeamName(gameID.substr(11, 3), divID) + " " + game.awayTeamScore + 
                        "</div>";
                }
            }
        } else {
            // display draw for team
            for (var d = 0; d < teamListInfo.length; d += 1) {
                var game = teamListInfo[d];
                var gameID = game.GameID;
                if ((gameID.substr(8, 3) == teamID || gameID.substr(11, 3) == teamID) && game.minutesPlayed == 0) {
                    html += 
                        "<div>" + 
                        getTeamName(gameID.substr(8, 3), divID) + 
                        " vs " + 
                        getTeamName(gameID.substr(11, 3), divID) + 
                        "</div>";
                }
            }
        }
    }
    
    $("#teamInfoContainer").empty().append(html);
    generateCode();
}

function toggleResults() {
    results = (results == true ? false : true);
    generateTeamInfo();
}

function changeTeam() {
    selectedTeamIndex = parseInt(document.getElementById("teamInfoDropDown").value);
    generateTeamSelector();
}

function getCSSAttribute(css) {
    switch (css) {
        case 'fontSize':
            return 'font-size';
        case 'backgroundColor':
            return 'background-color';
        case 'borderColor':
            return 'border-color';
        case 'borderWidth':
            return 'border-width';
        case 'borderRadius':
            return 'border-radius';
        default:
            return css;
    }
}

function generateCode() {
    generatedhtml = '';
    
    generatedhtml += "<div id='codePreviewContainer'></div>\n\n";
    
    generatedhtml += "<style>\n";
    for (var h = 0; h < cssArray.length; h += 1) {
        generatedhtml += "    " + cssArray[h][0] + " {\n";
        for (var g = 1; g < cssArray[h].length; g += 1) {
            generatedhtml += "        " + getCSSAttribute(cssArray[h][g][0]) + ": " + cssArray[h][g][1] + ";\n";
        }
        generatedhtml += "    }\n\n";
    }
    generatedhtml += "</style>\n\n";
    
    generatedhtml += "<script type='text/javascript' src='http://www.google.com/jsapi'></script>\n\n";
    generatedhtml += "<script type='text/javascript'>\n";
    generatedhtml += "    // Load jQuery\n";
    generatedhtml += "    google.load('jquery', '1');\n";
    generatedhtml += "    google.setOnLoadCallback(function() {\n";
    generatedhtml += "        init();\n";
    generatedhtml += "    });\n\n";
    
    generatedhtml += "    // Declare variables\n";
    generatedhtml += "    var selectedTeams = [[" + selectedTeams[0][0] + ", " + selectedTeams[0][1] + "]";
    for (var v = 1; v < selectedTeams.length; v += 1) {
        generatedhtml += ", [" + selectedTeams[v][0] + ", " + selectedTeams[v][1] + "]";
    }
    generatedhtml += "]; // Format: [[divID1, teamID1], [divID2, teamID2], ...]\n";
    generatedhtml += "    var allTeams = []; // Stores all the team names in database. There are n (n = num of divisions) arrays inside this one.  Each team is an object containing teamID, division and name. Format: [[All teams with divID of 0], [All teams with divID of 1], ...].\n";
    generatedhtml += "    var allDivs = []; // Stores all the divisions in database. Each division is an object containing divisionID and divisionName.\n";
    generatedhtml += "    var teamListInfo = []; // Stores all the game elements in which one or more of the above teams was involved\n";
    generatedhtml += "    var results = true; // true = display results for teams chosen, false = display upcoming games for chosen teams\n";
    generatedhtml += "    var selectedTeamIndex = 0; // index of selected option in #teamInfoDropDown\n\n";
    
    generatedhtml += "    // Return string with number padding with leading zeros to certain length\n";
    generatedhtml += "    function pad(value, length) {\n";
    generatedhtml += "        // Convert to string\n";
    generatedhtml += "        value = '' + value;\n";
    generatedhtml += "        // Add zeros to front until the desired length\n";
    generatedhtml += "        while (value.length < length) {\n";
    generatedhtml += "            value = '0' + value;\n";
    generatedhtml += "        }\n";
    generatedhtml += "        // return padded value as string\n";
    generatedhtml += "        return value;\n";
    generatedhtml += "    }\n\n";

    generatedhtml += "    // Get the name of a team based on teamID and divisionID\n";
    generatedhtml += "    function getTeamName(teamID, divID) {\n";
    generatedhtml += "        // Parse id to ints to use as indexes\n";
    generatedhtml += "        teamID = String(parseInt(teamID));\n";
    generatedhtml += "        divID = parseInt(divID);\n";
    generatedhtml += "        // Iterate through allTeams[divID] array. Return team name when passed in teamID matches teamID from allTeams array.\n";
    generatedhtml += "        for (var e = 0; e < allTeams[divID].length; e += 1) {\n";
    generatedhtml += "            if (teamID == allTeams[divID][e].teamID) {\n";
    generatedhtml += "                return allTeams[divID][e].teamName;\n";
    generatedhtml += "            }\n";
    generatedhtml += "        }\n";
    generatedhtml += "        // Return empty string if team isn't in database\n";
    generatedhtml += "        return '';\n";
    generatedhtml += "    }\n\n";

    generatedhtml += "    // Toggle between results and draw and refresh team info to reflect change\n";
    generatedhtml += "    function toggleResults() {\n";
    generatedhtml += "        results = (results == true ? false : true);\n";
    generatedhtml += "        generateTeamInfo();\n";
    generatedhtml += "    }\n\n";

    generatedhtml += "    // Change the team that is displayed in team info\n";
    generatedhtml += "    function changeTeam() {\n";
    generatedhtml += "        selectedTeamIndex = parseInt(document.getElementById('teamInfoDropDown').value);\n";
    generatedhtml += "        generateTeamSelector();\n";
    generatedhtml += "    }\n\n";
    
    generatedhtml += "    // Retrieve team and division info from database then retrieve game elements where one of the chosen teams is involved then start generating the team selector.\n";
    generatedhtml += "    function init() {\n";
    generatedhtml += "        // Get all the teams and divisions from database\n";
    generatedhtml += "        var post = $.post('http://www.ccrscoring.co.nz/scripts/php/getteamsdivs.php', {},\n";
    generatedhtml += "        function (response) {\n";
    generatedhtml += "            var teams = response[0];\n";
    generatedhtml += "            var divs = response[1];\n";
    generatedhtml += "            for (var t = 0; t < divs.length; t += 1) {\n";
    generatedhtml += "                var divID = parseInt(divs[t].divisionID);\n";
    generatedhtml += "                allTeams[divID] = [];\n";
    generatedhtml += "                allDivs[divID] = divs[t];\n";
    generatedhtml += "                allDivs[divID].divisionID = pad(allDivs[divID].divisionID, 2);\n";
    generatedhtml += "            }\n";
    generatedhtml += "            for (var n = 0; n < teams.length; n += 1) {\n";
    generatedhtml += "                if (teams[n].enabled == 'y') {\n";
    generatedhtml += "                    allTeams[parseInt(teams[n].division)].push(teams[n]);\n";
    generatedhtml += "                }\n";
    generatedhtml += "            }\n\n";
    generatedhtml += "            var post2 = $.post('http://www.ccrscoring.co.nz/scripts/php/getteamlistinfo.php', {\n";
    generatedhtml += "                teamList: JSON.stringify(selectedTeams)\n";
    generatedhtml += "            },\n";
    generatedhtml += "            function (response) {\n";
    generatedhtml += "                // response format: [game1, game2, ...]. Each game is an object containing:\n";
    generatedhtml += "                // GameID: 16 numbers long. YYYYMMDDTTTHHHKK (YYYY = year, MM = month (not zero indexed), DD = date, TTT = home team ID, HHH = away team ID, KK = division ID)\n";
    generatedhtml += "                // homeTeamName: the home teams name when game created (DON'T USE. Use getTeamName(gameObject.GameID.substr(8, 3)) instead.)\n";
    generatedhtml += "                // homeTeamScore: home teams score\n";
    generatedhtml += "                // homeTeamTries: number of home teams tries. Used for points table.\n";
    generatedhtml += "                // awayTeamName: the away teams name when game created (DON'T USE. Use getTeamName(gameObject.GameID.substr(11, 3)) instead.)\n";
    generatedhtml += "                // awayTeamScore: away teams score\n";
    generatedhtml += "                // awayTeamTries: number of away teams tries. Used for points table.\n";
    generatedhtml += "                // minutesPlayed: number of minutes played in the game.\n";
    generatedhtml += "                // ref: the ref of the game.\n";
    generatedhtml += "                // assRef1: the first assistant ref.\n";
    generatedhtml += "                // assRef2: the second assistant ref.\n";
    generatedhtml += "                // location: location game is played at.\n";
    generatedhtml += "                // time: game start time\n";
    generatedhtml += "                // scoringPlays: json array containing all the play arrays for the game. Format of each play array: [minutesPlayed, play code, description].\n";
    generatedhtml += "                //     Non-scoring play codes:\n";
    generatedhtml += "                //         strtGame: start of game\n";
    generatedhtml += "                //         halfTime: start of game\n";
    generatedhtml += "                //         fullTime: start of game\n";
    generatedhtml += "                //         updtXXXYYY: start of game\n";
    generatedhtml += "                //     Scoring play codes:\n";
    generatedhtml += "                //         first 4 characters are: home or away.\n";
    generatedhtml += "                //         the rest of characters are one of: Try, Penalty, Conversion, DropGoal.\n";
    generatedhtml += "                // changed: \n";
    generatedhtml += "                // changes: \n";
    generatedhtml += "                // liveScored: \n";
    generatedhtml += "                // userID: \n";
    generatedhtml += "                // lastTimeScored: \n";
    generatedhtml += "                // locked: \n";
    generatedhtml += "                // processed: \n";
    generatedhtml += "                // cancelled: \n";
    generatedhtml += "                teamListInfo = response;\n";
    generatedhtml += "                generateTeamSelector();\n";
    generatedhtml += "            }, 'json');\n";
    generatedhtml += "            post2.fail(function (request, textStatus, errorThrown) {\n";
    generatedhtml += "                alert('Error while retrieving info from database. Please contact the web admin for this site');\n";
    generatedhtml += "            });\n";
    generatedhtml += "        }, 'json');\n";
    generatedhtml += "        post.fail(function (request, textStatus, errorThrown) {\n";
    generatedhtml += "            alert('Error while retrieving team list and divisions from database. Please contact the web admin for this site.');\n";
    generatedhtml += "        });\n\n";
    generatedhtml += "    }\n\n";
    
    generatedhtml += "    // Retrieve team and division info from database\n";
    generatedhtml += "    function generateTeamSelector() {\n";
    generatedhtml += "        var html = '';\n";
    generatedhtml += "        html += \"<div id='teamSelectorContainer'>\";\n";
    generatedhtml += "        html += \"    Team:\";\n";
    generatedhtml += "        html += \"    <select id='teamInfoDropDown' onchange='changeTeam()'>\";\n";
    generatedhtml += "        for (var e = 0; e < selectedTeams.length; e += 1) {\n";
    generatedhtml += "            var divName = allDivs[selectedTeams[e][0]].divisionName;\n";
    generatedhtml += "            var teamName = getTeamName(selectedTeams[e][1], selectedTeams[e][0]);\n";
    generatedhtml += "            html += \"    <option value='\" + e + \"'>\" + divName + \" - \" + teamName + \"</option>\";\n";
    generatedhtml += "        }\n";
    generatedhtml += "        html += \"    </select>\"\n";
    generatedhtml += "        html += \"</div>\";\n";
    generatedhtml += "        html += \"<button class='drawResultsButton' onclick='toggleResults()'>Results</button>\";\n";
    generatedhtml += "        html += \"<button class='drawResultsButton' onclick='toggleResults()'>Draw</button>\";\n";
    generatedhtml += "        html += \"<div id='teamInfoContainer'></div>\";\n";
    generatedhtml += "        $(\"#codePreviewContainer\").empty().append(html);\n";
    generatedhtml += "        document.getElementById('teamInfoDropDown').selectedIndex = selectedTeamIndex;\n";
    generatedhtml += "        generateTeamInfo();\n";
    generatedhtml += "    }\n\n";

    generatedhtml += "    // Generate info for the selected team\n";
    generatedhtml += "    function generateTeamInfo() {\n";
    generatedhtml += "        var html = '';\n";
    generatedhtml += "        var selectedTeam = selectedTeams[selectedTeamIndex];\n";
    generatedhtml += "        var teamID = pad(selectedTeam[1], 3);\n";
    generatedhtml += "        var divID = pad(selectedTeam[0], 2);\n";
    generatedhtml += "        if (teamListInfo != null) {\n";
    generatedhtml += "            if (results) {\n";
    generatedhtml += "                // display results for team\n";
    generatedhtml += "                for (var c = 0; c < teamListInfo.length; c += 1) {\n";
    generatedhtml += "                    var game = teamListInfo[c];\n";
    generatedhtml += "                    var gameID = game.GameID;\n";
    generatedhtml += "                    if ((gameID.substr(8, 3) == teamID || gameID.substr(11, 3) == teamID) && game.minutesPlayed != 0) {\n";
    generatedhtml += "                        html += \n";
    generatedhtml += "                            \"<div>\" + \n";
    generatedhtml += "                            getTeamName(gameID.substr(8, 3), divID) + \" \" + game.homeTeamScore + \n";
    generatedhtml += "                            \" - \" + \n";
    generatedhtml += "                            getTeamName(gameID.substr(11, 3), divID) + \" \" + game.awayTeamScore + \n";
    generatedhtml += "                            \"</div>\";\n";
    generatedhtml += "                    }\n";
    generatedhtml += "                }\n";
    generatedhtml += "            } else {\n";
    generatedhtml += "                // display draw for team\n";
    generatedhtml += "                for (var d = 0; d < teamListInfo.length; d += 1) {\n";
    generatedhtml += "                    var game = teamListInfo[d];\n";
    generatedhtml += "                    var gameID = game.GameID;\n";
    generatedhtml += "                    if ((gameID.substr(8, 3) == teamID || gameID.substr(11, 3) == teamID) && game.minutesPlayed == 0) {\n";
    generatedhtml += "                        html += \n";
    generatedhtml += "                            \"<div>\" + \n";
    generatedhtml += "                            getTeamName(gameID.substr(8, 3), divID) + \n";
    generatedhtml += "                            \" vs \" + \n";
    generatedhtml += "                            getTeamName(gameID.substr(11, 3), divID) + \n";
    generatedhtml += "                            \"</div>\";\n";
    generatedhtml += "                    }\n";
    generatedhtml += "                }\n";
    generatedhtml += "            }\n";
    generatedhtml += "        }\n";
    generatedhtml += "        $(\"#teamInfoContainer\").empty().append(html);\n";
    generatedhtml += "    }\n";
    generatedhtml += "</script>";
    
    generatedhtml = generatedhtml.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    $("#codeDisplayContainer").empty().append('<h1>Code</h1><h4>Copy and paste this code into your website or send it to the person responsible for updating your website.</h4><pre><code>' + generatedhtml + '</code></pre>');
    
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}