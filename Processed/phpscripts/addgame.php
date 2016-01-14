<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$gameID = $_POST['gameID'];
$homeTeamName = $_POST['homeTeamName'];
$awayTeamName = $_POST['awayTeamName'];

// Create insert string using default values and variables given
$sql = " INSERT INTO Game VALUES ('$gameID', '$homeTeamName', '0', '$awayTeamName', '0', '0', '', '', '', '', '12pm', '[]', 'n', 'y', '') ";

if (mysqli_query($con, $sql)) {
    echo "success";
} else {
    echo "Insert query failed";
}

mysqli_close($con);
?>