<?php

function checkIfLocked($gameID) {
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

?>