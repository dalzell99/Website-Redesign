<!DOCTYPE html>
<html lang="en">
    <head>
        <title>CCR Scoring</title>
    </head>
    <body>
<div id='codePreviewContainer'></div>

<style>
    #teamInfoDropDown {
        background-color: #ffffff;
        padding: 10px;
        width: 200px;
        height: 50px;
    }

    #teamSelectorContainer {
        color: #000000;
        font-size: 20px;
    }

    .drawResultsButton {
        width: 150px;
        margin: 5px;
        font-size: 20px;
        color: #ffffff;
        background-color: #0088ff;
        border-width: 0px;
        border-radius: 10px;
        height: 40px;
    }

</style>

<script type='text/javascript' src='http://www.google.com/jsapi'></script>

<script type='text/javascript'>
    // Load jQuery
    google.load('jquery', '1');
    google.setOnLoadCallback(function() {
        init();
    });

    // Declare variables
    var selectedTeams = [[0, 1]];
    var allTeams = [];
    var allDivs = [];
    var teamListInfo = [];
    var results = true;
    var selectedTeamIndex = 0;

    // Return string with number padding with leading zeros to certain length
    function pad(value, length) {
        // Convert to string
        value = '' + value;
        // Add zeros to front until the desired length
        while (value.length < length) {
            value = '0' + value;
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

    // Toggle between results and draw
    function toggleResults() {
        results = (results == true ? false : true);
        generateTeamInfo();
    }

    // Change the team that is displayed
    function changeTeam() {
        selectedTeamIndex = parseInt(document.getElementById('teamInfoDropDown').value);
        generateTeamSelector();
    }

    // Retrieve team and division info from database
    function init() {
        // Get all the teams and divisions from database
        var post = $.post('http://www.ccrscoring.co.nz/scripts/php/getteamsdivs.php', {},
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
                if (teams[n].enabled == 'y') {
                    allTeams[parseInt(teams[n].division)].push(teams[n]);
                }
            }

            var post2 = $.post('http://www.ccrscoring.co.nz/scripts/php/getteamlistinfo.php', {
                teamList: JSON.stringify(selectedTeams)
            },
            function (response) {
                teamListInfo = response;
                generateTeamSelector();
            }, 'json');
            post2.fail(function (request, textStatus, errorThrown) {
                alert('Error while retrieving info from database. Please contact the web admin for this site');
            });
        }, 'json');
        post.fail(function (request, textStatus, errorThrown) {
            alert('Error while retrieving team list and divisions from database. Please contact the web admin for this site.');
        });

    }

    // Retrieve team and division info from database
    function generateTeamSelector() {
        var html = '';
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
        html += "<button class='drawResultsButton' onclick='toggleResults()'>Results</button>";
        html += "<button class='drawResultsButton' onclick='toggleResults()'>Draw</button>";
        html += "<div id='teamInfoContainer'></div>";
        $("#codePreviewContainer").empty().append(html);
        document.getElementById('teamInfoDropDown').selectedIndex = selectedTeamIndex;
        generateTeamInfo();
    }

    // Generate info for the selected team
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
    }
</script>
    </body>
</html>