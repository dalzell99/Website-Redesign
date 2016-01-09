var selectedScoringPlay = "";
var selectedTeam = "";
var selectedPlays = [];

// Redirect webpage to display game info
function showGameInfo(gameID) {
    window.open("http://possumpam.com/rugby/gameinfo.php?gameID=" + gameID, "_self");
}

// Show/hide the games for the division that the user clicked on
function toggleGames(divID) {
    $(".".concat(divID)).toggle();
}

// Show/hide week list
function toggleWeeks() {
    $("nav.row").toggle();
    $(".weektoggledisplay:hover > .showweeks").toggleClass("weeksexpanded");
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

// Change appearance of the currently displayed week in week list
function setActiveWeekButton(weekNumber) {
    $(".week".concat(weekNumber + 1)).addClass("active");
}

// Show/hide password input and button
function togglePassword() {
    $(".password").toggle();
}

// Show the division dropdown on the live scoring or end game scoring page 
function showDivDropDown() {
    $(".divDropDownRow").show();
    $(".divDropDownRowEnd").show();
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
            url: 'http://www.possumpam.com/rugby/deletescoringplay.php',
            method: 'GET',
            complete: function() { 
                playsDeleted += 1; 
                //alert("plays deleted: " + playsDeleted);
                if (playsDeleted == selectedPlays.length) {
                    // Empty selected plays array
                    selectedPlays.length = 0;

                    //alert(string);
                    // Reload page
                    var url = window.location.href.split("?");
                    location.href = url[0] + "?gameID=" + gameID + "&liveScore=true";
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

// Reload page with different div GET variable to change the teams in drop downs on live score team selection page
function changeTeamDropdowns() {
    var url = window.location.href.split("?");
    location.href = url[0] + "?div=" + divDropDown.options[divDropDown.selectedIndex].value + "&gameSelection=true";
}

// Sets the selected index of the division drop down
function setSelectedDivIndex(value) {
    $("select#divDropDown").prop('selectedIndex', parseInt(value));
}

// Gets the value of a GET variable
function extractGETVariable(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
        return decodeURIComponent(name[1]);
    }
}

// Create gameID using selected values in team dropdowns, todays date and div GET variable then reload page with that gameID as a GET variable
function selectGame() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var home = document.getElementById("homeTeam");
    var homeValue = home.options[home.selectedIndex].value;
    var homeText = home.options[home.selectedIndex].text;
    var away = document.getElementById("awayTeam");
    var awayValue = away.options[away.selectedIndex].value;
    var awayText = away.options[away.selectedIndex].text;
    var division = extractGETVariable('div');
  
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    
    if (homeValue == awayValue) {
        alert("Teams can't play themselves");
    } else {
        var gameID = String(yyyy) + String(mm) + String(dd) + String(homeValue) + String(awayValue) + String(division);
        // function below will run livescore.php with gameID, home team name and away team name as GET
        window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeTeam=" + homeText + "&awayTeam=" + awayText + "&checkGame=true", "_self");
    }
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

// Reloads page with gameID, team, play, minutesPlayed, description, homeScore, awayScore and uploadPlay GET variables
function uploadScoringPlay(gameID, homeScore, awayScore) {
    team = this.selectedTeam;
    play = this.selectedScoringPlay;
    minutesPlayed = document.getElementsByClassName("minutesPlayedInput")[0].value;
    description = document.getElementsByClassName("descriptionInput")[0].value;
    var result = areInputsValidUpload(team, play, minutesPlayed);
    if (result[0]) {
        window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&team=" + team + 
                "&play=" + play + "&minutesPlayed=" + minutesPlayed + "&description=" + description +
                "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&uploadPlay=true", "_self");
    } else {
        alert(result[1]);
    }
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

// Reload page with GET variables to upload half time play
function sendHalfTime(gameID, homeScore, awayScore) {
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&team=&play=halfTime&minutesPlayed=40&description=" + "&uploadPlay=true", "_self");
}

// Reload page with GET variables to upload full time play
function sendFullTime(gameID, homeScore, awayScore) {
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&team=&play=fullTime&minutesPlayed=80&description=" + "&uploadPlay=true", "_self");
}

// Reload page with GET variables to upload score update play
function changeScore(gameID) {
    var homeScore = document.getElementById('newhomescore').value;
    var awayScore = document.getElementById('newawayscore').value;
    var minutesPlayed = document.getElementById('newminutesplayed').value;
    var result = areInputsValidChange(homeScore, awayScore, minutesPlayed);
    if (result[0]) {
        window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&minutesPlayed=" + minutesPlayed + "&changeScore=true", "_self");
    } else {
        alert(result[1]);
    }
}

// Show/hide change score form
function toggleChangeScoreForm() {
    $(".changeScoreForm").toggle();
}

// Reload page with GET variables related to end game score upload
function submitScore() {
    var today = document.getElementById("datePicker").value;
    var dd = today.substr(8, 2);
    var mm = today.substr(5, 2);
    var yyyy = today.substr(0, 4);
    
    var home = document.getElementById("homeTeam");
    var homeValue = home.options[home.selectedIndex].value;
    var homeText = home.options[home.selectedIndex].text;
    var away = document.getElementById("awayTeam");
    var awayValue = away.options[away.selectedIndex].value;
    var awayText = away.options[away.selectedIndex].text;
    var division = extractGETVariable('div');
    var homeCheckbox = document.getElementById("homeCheckbox").checked;
    var awayCheckbox = document.getElementById("awayCheckbox").checked;
    var homeScore = document.getElementById("homeScore").value;
    var awayScore = document.getElementById("awayScore").value;
    
    var result = areInputsValidEnd(homeValue, awayValue, homeCheckbox, awayCheckbox, homeScore, awayScore, today);
    if (result[0]) {
        var gameID = String(yyyy) + String(mm) + String(dd) + String(homeValue) + String(awayValue) + String(division);

        if (homeCheckbox) {
            homeScore = 1;
            awayScore = 2;
        } else if (awayCheckbox) {
            homeScore = 2;
            awayScore = 1;
        }

        window.open("http://possumpam.com/rugby/endgame.php?gameID=" + gameID + "&homeTeam=" + homeText + "&awayTeam=" + awayText + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&div=" + division + "&uploadScore=true", "_self");
    } else {
        alert(result[1]);
    }
}

// Reload page with gameID and stopScoring GET variables
function stopScoring(gameID) {
    var url = window.location.href.split("?");
    location.href = url[0] + "?gameID=" + gameID + "&stopScoring=true";
}
