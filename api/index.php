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

/**
* View Friends
*/
$app->get('/ViewFriends', 'viewFriends');

/**
* Get User info
*/
$app->get('/UserInfo/:userId', 'getUserInfo');

/**
* Add Friend Request
*/
$app->post('/AddFriendRequest', 'addFriendRequest');

/**
* Search Friend
*/
$app->post('/SearchFriend', 'searchFriend');

/**
* View Friend Request
*/
$app->get('/ViewFriendRequest', 'getFriendRequest');

/**
* Add Friend
*/
$app->post('/AddFriend', 'addFriend');

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
	$password = password_hash(Slim::getInstance()->request()->post('password'), PASSWORD_DEFAULT);

	$sql = "SELECT Username FROM Users WHERE Username=:username";

	try
	{
		$db = getConnection();

		$stmt = $db->prepare($sql);
		$stmt->bindParam("username", $username);
		$stmt->execute();
		$db = null;
		$username_test = $stmt->fetchObject();

		if(!empty($username_test)) {
			echo "error_username";
			return;
		}
	}
	catch(PDOException $e) 
	{
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

	$sql = "SELECT Email FROM Users WHERE Email=:email";

	try
	{
		$db = getConnection();

		$stmt = $db->prepare($sql);
		$stmt->bindParam("email", $email);
		$stmt->execute();
		$db = null;

		$email_test = $stmt->fetchObject();

		if(!empty($email_test)) {
			echo "error_email";
			return;
		}
	}
	catch(PDOException $e) 
	{
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

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
		$hashedPassword = $stmt->fetchObject()->Password;

		if(empty($hashedPassword)) {
		    	echo "null";
		} else if(password_verify($password, $hashedPassword)) {
			$_SESSION['loggedin'] = true;
			$query = "SELECT UserId FROM Users WHERE Username=:username";
			$stmt2 = $db->prepare($query);
			$stmt2->bindParam("username", $username);
			$stmt2->execute();
			$_SESSION['userId'] = $stmt2->fetchObject()->UserId;
			$_SESSION['username'] = $username;
	    		echo '{"Username": "' . $_SESSION['username'] . '", "ID": ' . $_SESSION['userId'] . '}'; 
		} else {
            		echo "null";
        	}

		$db = null;
	} catch(PDOException $e) {
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
* A function that shows all the user's friends
*/
function viewFriends(){
	$userId = $_SESSION['userId'];
	$sql = "SELECT UserFriendId FROM FriendsList WHERE UserId = '$userId'";
	try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->execute();
			$Friends = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			echo '{"FriendsList": ' . json_encode($Friends) . '}';
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
}

/*
* a function that shows all the info for the user
*/
function getUserInfo($userId)
{
	$sql = "SELECT UserId, Username, Firstname, Lastname, Description, PictureName FROM Users WHERE UserId =:userId";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("userId",$userId);
		$stmt->execute();
		$userInfo = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"User": ' . json_encode($userInfo) . '}';
	} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

/**
* A function that searches for the user
*/
function searchFriend()
{
	$username = Slim::getInstance()->request()->post('username');	
	$findFriendQuery = "SELECT userId FROM Users WHERE username =:username";
	$friendId;
	try {
		$db = getConnection();
		$stmt = $db->prepare($findFriendQuery);
		$stmt->bindParam("username",$username);
		$stmt->execute();
		$friendId = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"Friend": ' . json_encode($friendId) . '}';
	} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}	
}
/**
* A function that adds a friend request
*/
function addFriendRequest()
{
	$userId = 2;
	$friendId = Slim::getInstance()->request()->post('friendId');
	$insertFriendQuery2 = "INSERT INTO FriendRequest(userId, friendId) VALUE('$userId', '$friendId')";
		try {
			$db = getConnection();
			$stmt = $db->prepare($insertFriendQuery2);
			$stmt->execute();
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
}

/**
* A function that adds or denies friends.  The friend request is deleted
* after the user makes a response
*/
function addFriend()
{
	$userId = 1;
	$friendId = Slim::getInstance()->request()->post('FriendId');
	$response = Slim::getInstance()->request()->post('response');
	if($response == 1){
		$insertFriend1 = "INSERT INTO FriendsList(UserId, UserFriendId) VALUE('$friendId', '$userId')";
		$insertFriend2 = "INSERT INTO FriendsList(UserId, UserFriendId) VALUE('$userId', '$friendId')";
		$deleteFriendRequest = "DELETE FROM FriendRequest WHERE UserId = '$friendId' AND FriendId = '$userId'";		
		try {
			$db = getConnection();
			$stmt = $db->prepare($insertFriend1);
			$stmt->execute();
			$stmt = $db->prepare($insertFriend2);
			$stmt->execute();
			$stmt = $db->prepare($deleteFriendRequest);
			$stmt->execute();
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	else{
		$deleteFriendRequest = "DELETE FROM FriendRequest WHERE UserId = '$friendId' AND FriendId = '$userId'";		
		try {
			$db = getConnection();
			$stmt = $db->prepare($deleteFriendRequest);
			$stmt->execute();
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}	
}

/**
* A function that gets the friend request of the user
*/
function getFriendRequest()
{
	$userId = $_SESSION['userId'];	
	$sql = "SELECT UserId, FriendId FROM FriendRequest WHERE FriendId = '$userId'";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$friendRequest = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"FriendRequest": ' . json_encode($friendRequest) . '}';
	} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

/**
* A function that sets up the connection to the database
*/
function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="halomastercheif";
	$dbname="Flock";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
