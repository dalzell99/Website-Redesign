var divTitles = ["Div 1", "Womens", "Div 2", "Div 3", "Colts", "U18", "U16", "U14.5", "U13", "U11.5", "U10", "U8.5", "U7"];

// Check if the user has entered the correct password this session and skip the password input if they have.
$(document).ready(function() {
    if (sessionStorage.password == "correct") {
        generateAddTeam();
        generateTeamList();
        showTeamList();
    } else {
        showPassword();
    }
});

// Uses jquery ajax to call php script to check password entered is correct
function checkPassword() {
    var passwordInput = $("#passwordInput").val();
    $.post(
        'http://www.possumpam.com/rugby/teameditor/checkpassword.php', 
        { password: passwordInput }, 
        function(response) { 
            if (response == 'correct') {
                // Correct password. Hide password and generate team lists
                if(typeof(Storage) !== "undefined") {
                    sessionStorage.setItem("password", "correct");
                }
                hideAll();
                generateAddTeam();
                generateTeamList();
                showTeamList();
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
        }).always(function() {
        });
}

// Hides all the elements on the webpage
function hideAll() {
    $("#password").hide();    
    $("#teamList").hide();    
}

// Shows teamList div
function showTeamList() {
    $("#teamList").show();
}

// Shows password div
function showPassword() {
    $("#password").show();
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
        var divisionID = (String(j).length == 1 ? "0" + String(j) : String(j));
        html += "        <option value='" + divisionID + "'>" + divTitles[j] + "</option>";
    }
    html += "    </select>";
    html += "    <button type='button' id='addTeamButton' onclick='addTeam()'>Add Team</button>";
    html += "</div>";
    $("#addTeamContainer").empty().append(html);
}

// Dynamically generates team lists
function generateTeamList() {
    var html = "";
    var post = $.post('http://www.possumpam.com/rugby/teameditor/getallteams.php', {}, 
        function(response) {
            for (var i = 0; i < response.length; i += 1) {
                html += "<div class='teamRow' onclick='changeTeamName(" + response[i].teamID + ")'>";
                html += "   <div class='division'>" + divTitles[parseInt(response[i].division)] + "</div>";
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
  var post = $.post('http://www.possumpam.com/rugby/teameditor/changeteamname.php', { teamID: teamID, newName: newName }, 
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
    
    var post = $.post('http://www.possumpam.com/rugby/teameditor/addnewteam.php', { teamName: teamName, divisionID: divisionID }, 
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