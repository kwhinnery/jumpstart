<?php
include 'Services/Twilio.php';
include 'config.php';

// Create an authenticated REST client
$client = new Services_Twilio($accountSid, $authToken);
$client->account->calls->create($twilioNumber, $_POST["to"], "$baseUrl/hello.php");

// Just send back an a-okay
header('content-type:application/json');
echo json_encode((object) array("error" => false));
?>