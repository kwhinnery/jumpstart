<?php
include 'Services/Twilio/Capability.php';
include 'config.php';

$capability = new Services_Twilio_Capability( $accountSid , $authToken );
$capability->allowClientOutgoing('AP784bd34e34fab9759b8e91d3ef3680b9');
$token = $capability->generateToken();

header('content-type:application/json');
echo json_encode((object) array("token" => $token));
?>