<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

$gameID = $_POST['gameID'];

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (mysqli_query($con, "DELETE FROM Game WHERE GameID = '" . $gameID . "'")) {
    echo 'success';
} else {
    echo 'Delete query failed';
}

mysqli_close($con);
?>