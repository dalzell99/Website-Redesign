<?php
$to = "cfd19@hotmail.co.nz";
$subject = "CCRScoring Contact Form";

$message = "
<html>
    <head>
        <title>CCRScoring Contact Form</title>
    </head>
    <body>
        <p>Name: " . $_POST['email'] . "</p>
        <p>Message: " . $_POST['message'] . "</p>
    </body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= "From: " . $_POST['email'] . "\r\n";

if (mail($to,$subject,$message,$headers)) {
    echo 'success';
} else {
    echo 'fail';
}
?>