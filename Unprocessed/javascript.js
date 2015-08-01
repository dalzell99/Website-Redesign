$(document).ready(function () {
  
});

function showGameInfo(gameID) {
  window.open("http://possumpam.com/rugby/gameinfo.php?gameID=" + gameID, "_self");
}

function toggleGames(divID) {
  $(".".concat(divID)).toggle();
}

function setActiveWeekButton(weekNumber) {
  $(".week".concat(weekNumber + 1)).addClass("active");
}