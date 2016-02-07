<?php
ob_start("ob_gzhandler");

$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

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
        
        if ($divresult = mysqli_query($con, "SELECT * FROM Divisions")) {
            /* fetch associative array */
            while ($row = mysqli_fetch_assoc($divresult)) {
                $div[] = $row;
            }

            /* free result set */
            mysqli_free_result($divresult);
            
            echo json_encode(array($team, $game, $div));
        } else {
            echo 'Division select query failed';
        }
    } else {
        echo 'Team select query failed';
    }
} else {
    echo 'Game select query failed';
}

mysqli_close($con);
?>