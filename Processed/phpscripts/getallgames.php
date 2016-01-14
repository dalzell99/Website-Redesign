<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($gameresult = mysqli_query($con, "SELECT * FROM Game ORDER BY `gameID` ASC")) {
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($gameresult)) {
        $game[] = $row;
    }
    
    /* free result set */
    mysqli_free_result($gameresult);
    
    if ($teamresult = mysqli_query($con, "SELECT * FROM Teams ORDER BY `division` ASC, `teamName` ASC")) {
    
        /* fetch associative array */
        while ($row = mysqli_fetch_assoc($teamresult)) {
            $team[] = $row;
        }

        /* free result set */
        mysqli_free_result($teamresult);
        
        echo json_encode(array($team, $game));
    } else {
        echo 'Team select query failed';
    }
} else {
    echo 'Game select query failed';
}

mysqli_close($con);
?>