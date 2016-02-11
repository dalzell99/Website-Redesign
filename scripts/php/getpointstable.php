<?php
$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

$response = '';
$divisionID = $_POST['divisionID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "SELECT * FROM PointsTable WHERE divisionID = '$divisionID'")) {
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = $row;
    }
    
    /* free result set */
    mysqli_free_result($result);
} else {
    $response = 'Select query failed';
}

echo json_encode($response);

mysqli_close($con);
?>