<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (mysqli_query($con, "UPDATE Game SET liveScored = 'n' WHERE GameID = '" . $_POST['gameID'] . "'")) {
    echo 'success';
} else {
    echo 'Update query failed'
}

mysqli_close($con);
?>