<?php
function pad($number) {
    while (strlen($number) < 3) {
        $number = '0' . $number;
    }
    return $number;
}

$config = parse_ini_file('/home/ccrsc638/config.ini'); 

// Try and connect to the database
$con = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);

// Check connection
if (mysqli_connect_errno()) {
    $response = "Failed to connect to MySQL: " . mysqli_connect_error();
}

$teamList = json_decode($_POST['teamList']);
$sql = "SELECT * FROM Game WHERE GameID LIKE '2016_______" . pad($teamList[0][1]) . "__' OR GameID LIKE '2016____" . pad($teamList[0][1]) . "_____'";

for ($i = 1; $i < count($teamList); $i += 1) {
    $sql .= " OR GameID LIKE '2016____" . pad($teamList[$i][1]) . "_____' OR GameID LIKE '2016_______" . pad($teamList[$i][1]) . "_____'";
}

if ($result = mysqli_query($con, $sql)) {
    
    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($result)) {
        $game[] = $row;
    }
    
    echo json_encode($game);
} else {
    echo json_encode($sql);
}

mysqli_close($con);
?>