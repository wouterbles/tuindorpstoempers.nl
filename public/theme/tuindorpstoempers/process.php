<?php
require '../../../vendor/autoload.php';
// Configure your Subject Prefix and Recipient here
$subjectPrefix = '[Contact Stoempers]';
$emailTos = ['fjjbles@outlook.com', ];
$emailCc = 'whbles@gmail.com';
$emailTo = 'fjjbles@outlook.com';
$errors = array(); // array to hold validation errors
$data = array(); // array to pass back data
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = stripslashes(trim($_POST['name']));
    $email_addr = stripslashes(trim($_POST['email']));
    $subject = "Nieuw bericht van $name";
    $message = stripslashes(trim($_POST['message']));
    if (empty($name)) {
        $errors['name'] = 'Naam is verplicht.';
    }
    if (!preg_match('/^[^0-9][A-z0-9._%+-]+([.][A-z0-9_]+)*[@][A-z0-9_]+([.][A-z0-9_]+)*[.][A-z]{2,4}$/', $email_addr)) {
        $errors['email'] = 'Email is onjuist.';
    }
    if (empty($message)) {
        $errors['message'] = 'Bericht is verplicht.';
    }
    // if there are any errors in our errors array, return a success boolean or false
    if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
        $subject = "$subjectPrefix $subject";
        $body    = '
	    <html>
            <strong>Naam: </strong>'.$name.'<br />
            <strong>Email: </strong>'.$email_addr.'<br />
            <strong>Bericht: </strong>'.nl2br($message).'<br />
	    </html>
        ';
        $email = new \SendGrid\Mail\Mail(); 
        $email->setFrom("info@tuindorpstoempers.nl", "Tuindorp Stoempers");
        $email->setReplyTo($email_addr, $name);
        $email->setSubject($subject);
        $email->addTo($emailTo);
        $email->addCc($emailCc);
        $email->addContent(
            "text/html", $body
        );

        $sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));
        try {
            $response = $sendgrid->send($email);
            $data['success'] = true;
            $data['message'] = '<svg class="icon icon-check"><use xlink:href="#icon-check"></use></svg> Uw bericht is verzonden';
        } catch (Exception $e) {
            echo 'Caught exception: '. $e->getMessage() ."\n";
        }
    }
    // return all our data to an AJAX call
    echo json_encode($data);
}
