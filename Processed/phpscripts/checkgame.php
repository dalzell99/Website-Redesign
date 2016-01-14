<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];

// Retrieve record from database in the form of an associative array
if ($result = mysqli_query($con, "SELECT * FROM Game WHERE GameID = '" . $gameID . "'")) {
    // Check whether any records were retrieved
    if (mysqli_num_rows($result) == 0) {
        // If the game doesn't exist, create it

        $time = date("Y-m-d H:i:s");
        $homeTeam = $_POST['homeTeam'];
        $awayTeam = $_POST['awayTeam'];

        // Create insert string using default values and variables given
        $sql = "INSERT INTO Game VALUES ('" . $gameID . "', '" . $homeTeam . "', '0', '" . $awayTeam . "', '0', '0', '', '', '', '" . $homeTeam . "', '12pm', '[]', 'n', 'y', '" . $time . "')";

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

        // Check if livescored attribute is equal to 'n'
        if ($row['liveScored'] == 'n') {
            // If equal to 'n' then game isn't being live scored and echo 'success'
            echo 'success';
        } else {
            // If not equal to 'n' then game is being live scored and echo 'beingscored'
            echo 'beingscored';
        }
    }
} else {
    echo "Select query failed";
}

mysqli_close($con);
?>