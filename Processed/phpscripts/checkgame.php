<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];

function checkIfLocked($con, $gameID) {
    if ($result = mysqli_query($con, "SELECT locked FROM Game WHERE GameID = '" . $gameID . "'")) {
        $row = mysqli_fetch_assoc($result);
        if ($row['locked'] == 'y') {
            return true;
        } else {
            return false;
        }
    } else {
        echo "Select query failed";
    }
}

// Retrieve record from database in the form of an associative array
if ($result = mysqli_query($con, "SELECT * FROM Game WHERE GameID = '" . $gameID . "'")) {
    // Check whether any records were retrieved
    if (mysqli_num_rows($result) == 0) {
        // If the game doesn't exist, create it

        $time = date("Y-m-d H:i:s");
        $homeTeam = $_POST['homeTeam'];
        $awayTeam = $_POST['awayTeam'];

        // Create insert string using default values and variables given
        $sql = "INSERT INTO Game VALUES ('" . $gameID . "', '" . $homeTeam . "', '0', '" . $awayTeam . "', '0', '1', '', '', '', '" . $homeTeam . "', '12pm', '[[\"1\", \"strtGame\", \"\"]]', 'n', '[]', 'y', '" . $time . "', 'n')";

        // Execute insert query
        if (mysqli_query($con, $sql)) {
            // If successfully created, reload page with gameID and liveScore GET variables
            echo "success";
        } else {
            // If unsuccessfully created, then there was a problem with the insert string or database and user is prompted to email me
            echo "Insert query failed" . $sql;
        }
    } else {
        $row = mysqli_fetch_assoc($result);

        // Check if game is locked then check if livescored attribute is equal to 'y'
        if (checkIfLocked($con, $gameID)) {
            echo 'locked';
        } else if ($row['liveScored'] == 'y') {
            // If not equal to 'n' then game is being live scored and echo 'beingscored'
            echo 'beingscored';
        } else {
            // If equal to 'n' then game isn't being live scored and echo 'success'
            if (mysqli_query($con, " UPDATE Game SET liveScored = 'y' WHERE GameID = '" . $gameID . "' ")) {
                echo 'success';
            } else {
                echo "Update query failed";
            }
        }
    }
} else {
    echo "Select query failed";
}

mysqli_close($con);
?>