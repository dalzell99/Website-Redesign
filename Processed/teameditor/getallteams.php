<?php
$con=mysqli_connect("possumpamcom.ipagemysql.com","dalzell99","dazzle99","drc_database");

$response = '';

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

if ($result = mysqli_query($con, "SELECT * FROM Teams ORDER BY `division` ASC, `teamName` ASC")) {
    
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