<?php

/**
* index.php.  This file contains all the backend functions that run the website
* Uses Slim framework.  
*/

session_cache_limiter(false);
session_start();

require 'Slim/Slim.php';

$app = new Slim();

//Sets up the links to the functions
$app->get(
	'/',
	function() use($app) {
		$response = $app->response();
		$response->status(200);
		$response->write('The API is working');
	});

/**
* Checks whether the user is logged in
*/
$app->get('/LoginStatus', 'getLoginStatus');

/**
* User Registration
*/
$app->post('/Users', 'addUser');

/**
* User Login
*/
$app->post('/Login', 'login');

/**
* User Logout
*/
$app->post('/Logout', 'logout');

$app->run();

/**
* A function to check whether or not the user is logged in
* @return JSON The email and id of the user logged in.
*/
function getLoginStatus() {
	if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {
		echo '{"Username": "' . $_SESSION['username'] . '", "ID": ' . $_SESSION['userId'] . '}';
	} else {
		echo "null";
	}
}

/**
* A funtion that takes the information inputed by a user and creates
* an account for them by inserting them into the database
*/

function addUser()
{
	$firstname = Slim::getInstance()->request()->post('firstname');
	$lastname = Slim::getInstance()->request()->post('lastname');
	$username = Slim::getInstance()->request()->post('username');
	$email = Slim::getInstance()->request()->post('email');
	$password = crypt(Slim::getInstance()->request()->post('password'));
	echo  crypt(Slim::getInstance()->request()->post('password'));
	
	$sql = "INSERT INTO Users (Firstname, Lastname, Username, Email, Password) VALUES (:firstname, :lastname, :username, :email, :password)";

	try
	{
		$db = getConnection();
				
		$stmt = $db->prepare($sql);
		$stmt->bindParam("firstname", $firstname);
		$stmt->bindParam("lastname", $lastname);
		$stmt->bindParam("username", $username);
		$stmt->bindParam("email", $email);
		$stmt->bindParam("password", $password);

		$stmt->execute();
		$db = null;

	}
	catch(PDOException $e) 
	{
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

/**
* A function to check if the user entered the correct email and password.
* If so, a cookie is created containing their username
* @return JSON The userid and email.
*/
function login() {
	$username = Slim::getInstance()->request()->post('username');
	$password = Slim::getInstance()->request()->post('password');

	$sql = "SELECT Password FROM Users WHERE Username=:username";

	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("username", $username);
		$stmt->execute();
		$hashedPassword = $stmt->fetchObject();
		echo $hashedPassword->Password ."blahblah";
		echo crypt($password);
		if(empty($hashedPassword->Password))
		{
		    echo "null";
		}
		
		else if(crypt($password) == $hashedPassword->Password)
		{
			$_SESSION['loggedin'] = true;
			$query = "SELECT UserID FROM Users WHERE Username=:username";
			$stmt2 = $db->prepare($query);
			$stmt2->bindParam("username", $username);
			$stmt2->execute();
			$_SESSION['userId'] = $stmt2->fetchObject()->UserId;
			$_SESSION['username'] = $username;
            echo '{"Username": "' . $_SESSION['username'] . '", "ID": ' . $_SESSION['userId'] . '}'; 
		}
		else
		{
            echo "null2";
        }
	} 
	catch(PDOException $e)
	{
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

/**
* A function to log the user out
*/
function logout() {
	session_destroy();
}

/**
* A function that sets up the connection to the database
*/
function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="";
	$dbname="Flock";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
