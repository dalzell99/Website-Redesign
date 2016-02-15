<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$response = '';
$missingGames = [];
$divisionID = $_POST['divisionID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Get all the games that haven't been processed (added to points table) that were played between the start of the season and today
$startOfSeason = date("Ymd", mktime(0, 0, 0, 1, 1, 2016));
$today = date("Ymd");

$sql = "SELECT GameID FROM Game WHERE processed = 'n' AND (GameID BETWEEN " . $startOfSeason . "0000" . $divisionID . " AND " . $today . "0000" . $divisionID . " OR GameID BETWEEN " . $startOfSeason . "000000" . $divisionID . " AND " . $today . "000000" . $divisionID . ")";

if ($result = mysqli_query($con, $sql)) {
    while ($row = mysqli_fetch_assoc($result)) {
        $missingGames[] = $row;
    }
    
    /* free result set */
    mysqli_free_result($result);
}

if ($result1 = mysqli_query($con, "SELECT * FROM PointsTable WHERE divisionID = '$divisionID'")) {
    
    /* fetch associative array */
    while ($row1 = mysqli_fetch_assoc($result1)) {
        $response[] = $row1;
    }
    
    /* free result set */
    mysqli_free_result($result1);
} else {
    $response = 'Select query failed';
}

echo json_encode([$response, $missingGames]);

mysqli_close($con);
?>