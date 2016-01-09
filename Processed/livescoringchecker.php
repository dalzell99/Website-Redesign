<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "SELECT GameID, liveScored, lastTimeScored FROM Game")) {
    $gamesToBeChanged = array();
    $currentTimeString = date("Y-m-d H:i:s");
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($result)) {
        $gameID = $row['GameID'];
        $liveScored = $row['liveScored'];
        $lastTimeScoredString = $row['lastTimeScored'];
        
        $timeDiffInMinutes = round((strtotime($currentTimeString) - strtotime($lastTimeScoredString)) / 60, 0);
        
        if ($timeDiffInMinutes >= 5 && $liveScored == 'y') {
            array_push($gamesToBeChanged, $gameID);
        }
    }
    
    $changedCount = 0;
    for ($k = 0; $k < count($gamesToBeChanged); $k++) {
        $update = " UPDATE Game SET liveScored = 'n' WHERE GameID = '" . $gamesToBeChanged[$k] . "' ";
        if (mysqli_query($con, $update)) {
            $changedCount++;
        } else {
            echo 'UPDATE Query failed';
        }
    }

    if ($changedCount == count($gamesToBeChanged)) {
        echo "success. " . $changedCount . " games changed.";
    }
    
    /* free result set */
    mysqli_free_result($result);
} else {
    echo 'SELECT Query failed';
}

mysqli_close($con);
?>