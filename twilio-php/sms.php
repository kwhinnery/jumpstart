<?php
include 'Services/Twilio.php';
include 'config.php';

// Create an authenticated REST client
$client = new Services_Twilio($accountSid, $authToken);
$client->account->sms_messages->create($twilioNumber, $_POST["to"], "Hey there!  Your environment is configured.");

// Just send back an a-okay
header('content-type:application/json');
echo json_encode((object) array("error" => false));
?>