<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

$teamName = mysqli_real_escape_string($con, $_POST['teamName']);
$divisionID = $_POST['divisionID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "INSERT INTO `Teams` (`teamID`, `division`, `teamName`) VALUES (NULL,'" . $divisionID . "','" . $teamName . "')")) {
    echo 'success';
} else {
    echo 'Update query failed';
}

mysqli_close($con);
?>