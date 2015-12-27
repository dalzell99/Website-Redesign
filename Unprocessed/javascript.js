var selectedScoringPlay = "";
var selectedTeam = "";

function showGameInfo(gameID) {
    window.open("http://possumpam.com/rugby/gameinfo.php?gameID=" + gameID, "_self");
}

function toggleGames(divID) {
    $(".".concat(divID)).toggle();
}

function toggleWeeks() {
    $("nav.row").toggle();
    $(".weektoggledisplay:hover > .showweeks").toggleClass("weeksexpanded");
}

function setActiveWeekButton(weekNumber) {
    $(".week".concat(weekNumber + 1)).addClass("active");
}

function togglePassword() {
    $(".password").toggle();
}

function showDivDropDown() {
    $(".divDropDownRow").show();
}

function deleteScoringPlay(gameID, index, team, play, homeScore, awayScore) {
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

    var choice = confirm("Do you want to delete this scoring play?");
    if (choice == true) {
        location.href = "http://www.possumpam.com/rugby/delete_scoring_play.php?gameID=" + gameID + "&index=" + index + "&homeScore=" + homeScore + "&awayScore=" + awayScore;
    } else {
        return;
    }
}

function changeTeamDropdowns() {
    var url = window.location.href.split("?");
    location.href = url[0] + "?div=" + divDropDown.options[divDropDown.selectedIndex].value;
}

function setSelectedDivIndex(value) {
    $("select#divDropDown").prop('selectedIndex', parseInt(value));
}

function extractGETVariable(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
        return decodeURIComponent(name[1]);
    }
}

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
    
    var gameID = String(yyyy) + String(mm) + String(dd) + String(homeValue) + String(awayValue) + String(division);
    // function below will run livescore.php with gameID as GET
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeTeam=" + homeText + "&awayTeam=" + awayText + "&checkGame=true", "_self");
}

function toggleSelectedScoringPlay(elem, play) {
    document.getElementsByClassName("try")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("penalty")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("conversion")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("dropGoal")[0].style.backgroundColor = "transparent";
    elem.style.backgroundColor = '#bcbcbc';
    this.selectedScoringPlay = play;
}

function toggleSelectedTeam(elem, team) {
    document.getElementsByClassName("homeTeamName")[0].style.backgroundColor = "transparent";
    document.getElementsByClassName("awayTeamName")[0].style.backgroundColor = "transparent";
    elem.style.backgroundColor = '#bcbcbc';
    this.selectedTeam = team;
}

function uploadScoringPlay(gameID, homeScore, awayScore) {
    team = this.selectedTeam;
    play = this.selectedScoringPlay;
    minutesPlayed = document.getElementsByClassName("minutesPlayedInput")[0].value;
    description = document.getElementsByClassName("descriptionInput")[0].value;
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&team=" + team + 
                "&play=" + play + "&minutesPlayed=" + minutesPlayed + "&description=" + description +
                "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&uploadPlay=true", "_self");
}

function sendHalfTime(gameID, homeScore, awayScore) {
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&team=&play=halfTime&minutesPlayed=40&description=" + "&uploadPlay=true", "_self");
}

function sendFullTime(gameID) {
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&team=&play=fullTime&minutesPlayed=80&description=" + "&uploadPlay=true", "_self");
}

function changeScore(gameID) {
    var homeScore = document.getElementById('newhomescore').value;
    var awayScore = document.getElementById('newawayscore').value;
    var minutesPlayed = document.getElementById('newminutesplayed').value;
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&minutesPlayed=" + minutesPlayed + "&changeScore=true", "_self");
}

function toggleChangeScoreForm() {
    $(".changeScoreForm").toggle();
}

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
    
    var gameID = String(yyyy) + String(mm) + String(dd) + String(homeValue) + String(awayValue) + String(division);

    var homeCheckbox = document.getElementById("homeCheckbox").checked;
    var awayCheckbox = document.getElementById("awayCheckbox").checked;
    var homeScore = 0;
    var awayScore = 0;
    if (homeCheckbox && awayCheckbox) {
        alert("Only 1 checkbox can be checked");
        return;
    } else if (homeCheckbox) {
        homeScore = 1;
        awayScore = 2;
    } else if (awayCheckbox) {
        homeScore = 2;
        awayScore = 1;
    } else {
        homeScore = document.getElementById("homeScore").value;
        awayScore = document.getElementById("awayScore").value;
    }
    
    window.open("http://possumpam.com/rugby/endgame.php?gameID=" + gameID + "&homeTeam=" + homeText + "&awayTeam=" + awayText + "&homeScore=" + homeScore + "&awayScore=" + awayScore + "&div=" + division + "&uploadScore=true", "_self");
}

function stopScoring(gameID) {
    var url = window.location.href.split("?");
    location.href = url[0] + "?gameID=" + gameID + "&stopScoring=true";
}