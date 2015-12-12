var selectedScoringPlay = "";
var selectedTeam = "";

$(document).ready(function () {

});

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

function hidePassword() {
    $(".password").hide();
}

function showDivDropDown() {
    $("#divDropDown").show();
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
    location.href = "http://possumpam.com/rugby/livescore.php?div=" + divDropDown.options[divDropDown.selectedIndex].value;
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
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    var home = document.getElementById("homeTeam");
    var homeValue = home.options[home.selectedIndex].value;
    var homeText = home.options[home.selectedIndex].text;
    var away = document.getElementById("awayTeam");
    var awayValue = away.options[away.selectedIndex].value;
    var awayText = away.options[away.selectedIndex].text;
    var division = extractGETVariable('div');

    var gameID = yyyy + mm + dd + homeValue + awayValue + division;
    // function below will run livescore.php with gameID as POST
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&homeTeam=" + homeText + "&awayTeam=" + awayText, "_self");
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

function uploadScoringPlay(gameID) {
    team = this.selectedTeam;
    play = this.selectedScoringPlay;
    minutesPlayed = document.getElementsByClassName("minutesPlayedInput")[0].value;
    description = document.getElementsByClassName("descriptionInput")[0].value;
    window.open("http://possumpam.com/rugby/livescore.php?gameID=" + gameID + "&team=" + team + 
                "&play=" + play + "&minutesPlayed=" + minutesPlayed + "&description=" + description, "_self");
}