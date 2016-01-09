<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_GET['gameID'];
$time = date("Y-m-d H:i:s");

// Update game element with new values
$update = " UPDATE Game SET lastTimeScored = '$time' WHERE GameID = '$gameID' ";

mysqli_query($con, $update);

mysqli_close($con);
?>