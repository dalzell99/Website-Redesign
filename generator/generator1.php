<!DOCTYPE html>
<html lang="en">
    <head>
        <title>CCR Scoring</title>
    </head>
    <body>
<div id='codePreviewContainer'></div>

<style>
.drawResultsTable {
  border-collapse: collapse;
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
    var selectedTeams = [[0, 1]]; // Format: [[divID1, teamID1], [divID2, teamID2], ...]
    var allTeams = []; // Stores all the team names in database. There are n (n = num of divisions) arrays inside this one.  Each team is an object containing
                       // teamID, division and name. Format: [[All teams with divID of 0], [All teams with divID of 1], ...].
    var allDivs = []; // Stores all the divisions in database. Each division is an object containing divisionID and divisionName.
    var teamListInfo = []; // Stores all the game elements in which one or more of the above teams was involved
    var results = true; // true = display results for teams chosen, false = display upcoming games for chosen teams
    var selectedTeamIndex = 0; // index of selected option in #teamInfoDropDown

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
        // Parse id to ints to use as indexes
        teamID = String(parseInt(teamID));
        divID = parseInt(divID);
        // Iterate through allTeams[divID] array. Return team name when passed in teamID matches teamID from allTeams array.
        for (var e = 0; e < allTeams[divID].length; e += 1) {
            if (teamID == allTeams[divID][e].teamID) {
                return allTeams[divID][e].teamName;
            }
        }
        // Return empty string if team isn't in database
        return '';
    }

    // Toggle between results and draw and refresh team info to reflect change
    function toggleResults() {
        results = (results == true ? false : true);
        generateTeamInfo();
    }

    // Change the team that is displayed in team info
    function changeTeam() {
        selectedTeamIndex = parseInt(document.getElementById('teamInfoDropDown').value);
        generateTeamSelector();
    }

    // Return string with short day of week (if wanted), date, short month
    Date.prototype.toCustomDateString = function (dayOfWeek) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var dayOfGame = '';
        if (dayOfWeek) {
            dayOfGame = daysOfWeek[this.getDay()];
        }
        return dayOfGame + ' ' + this.getDate() + ' ' + months[this.getMonth()];
    };

    // Retrieve team and division info from database then retrieve game elements where one of the chosen teams is involved then start generating the team selector.
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
                // response format: [game1, game2, ...]. Each game is an object containing:
                // GameID: YYYYMMDDTTTHHHKK (YYYY = year, MM = month (not zero indexed), DD = date, TTT = home team ID, HHH = away team ID, KK = division ID)
                // homeTeamName: the home teams name when game created (DON'T USE. Use getTeamName(gameObject.GameID.substr(8, 3)) instead.)
                // homeTeamScore: home teams score
                // homeTeamTries: number of home teams tries. Used for points table.
                // awayTeamName: the away teams name when game created (DON'T USE. Use getTeamName(gameObject.GameID.substr(11, 3)) instead.)
                // awayTeamScore: away teams score
                // awayTeamTries: number of away teams tries. Used for points table.
                // minutesPlayed: number of minutes played in the game.
                // ref: the ref of the game.
                // assRef1: the first assistant ref.
                // assRef2: the second assistant ref.
                // location: location game is played at.
                // time: game start time
                // scoringPlays: json array containing all the play arrays for the game. Format of each play array: [minutesPlayed, play code, description].
                //     Non-scoring play codes:
                //         strtGame: start of game
                //         halfTime: start of game
                //         fullTime: start of game
                //         updtXXXYYY: start of game
                //     Scoring play codes:
                //         first 4 characters are: home or away.
                //         the rest of characters are one of: Try, Penalty, Conversion, DropGoal.
                // changes: array of changes made since game was added. Format of change: [time change was made, chnage code (same as above names)]
                // cancelled: 'y' = game cancelled, 'n' = game not cancelled
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

    // Generate html for team selector
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
                html += "<table class='drawResultsTable'>";
                for (var c = 0; c < teamListInfo.length; c += 1) {
                    var game = teamListInfo[c];
                    var gameID = game.GameID;
                    if ((gameID.substr(8, 3) == teamID || gameID.substr(11, 3) == teamID) && game.minutesPlayed != 0) {
                        var dateString = new Date(parseInt(gameID.substr(0, 4)), parseInt(gameID.substr(4, 2)), parseInt(gameID.substr(6, 2))).toCustomDateString();
                        html += 
                            '<tr>' +
                                '<td>' + dateString + '</td>' +
                                '<td>' + getTeamName(gameID.substr(8, 3), divID) + '</td>' +
                                '<td>' + game.homeTeamScore + '</td>' +
                                '<td>' + getTeamName(gameID.substr(11, 3), divID) + '</td>' +
                                '<td>' + game.awayTeamScore + '</td>' +
                            '</tr>';
                    }
                }
            } else {
                // display draw for team
                html += "<table class='drawResultsTable'>";
                html += '    <tr>';
                html += '        <th>Game Time</th>';
                html += '        <th>Teams</th>';
                html += '        <th>Location</th>';
                html += '        <th>Ref</th>';
                html += "        <th colspan='2'>Assistant Refs</th>";
                html += '    </tr>';
                for (var d = 0; d < teamListInfo.length; d += 1) {
                    var game = teamListInfo[d];
                    var gameID = game.GameID;
                    if ((gameID.substr(8, 3) == teamID || gameID.substr(11, 3) == teamID) && game.minutesPlayed == 0) {
                        var dateString = new Date(parseInt(gameID.substr(0, 4)), parseInt(gameID.substr(4, 2)), parseInt(gameID.substr(6, 2))).toCustomDateString();
                        html += 
                            '<tr>' + 
                                '<td>' + dateString + ' ' + game.time + '</td>' +
                                '<td>' + getTeamName(gameID.substr(8, 3), divID) + ' vs ' + 
                                getTeamName(gameID.substr(11, 3), divID) + '</td>' +
                                '<td>' + game.location + '</td>' +
                                '<td>' + game.ref + '</td>' +
                                '<td>' + game.assRef1 + '</td>' +
                                '<td>' + game.assRef2 + '</td>' +
                            '</tr>';
                    }
                }
                html += '</table>';
            }
        }
        $("#teamInfoContainer").empty().append(html);
    }
</script>
    </body>
</html>