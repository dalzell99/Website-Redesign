<?php
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
    
    echo json_encode($game);
} else {
    echo 'Game select query failed';
}

mysqli_close($con);
?>