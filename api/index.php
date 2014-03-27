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

/**
* Create Event
*/
$app->post('/CreateEvent', 'createEvent');

/**
* Create Group
*/
$app->post('/CreateGroup', 'createGroup');

/**
* View Groups
*/
$app->get('/Groups', 'viewGroups');
/**
* View Group Memebers
*/
$app->get('/GroupMembers/:groupId', 'viewGroupMembers');

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

        if($username_test) {
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

        if($email_test) {
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
    //$userId = 1;
    $userId = $_SESSION['userId'];
    $sql = "SELECT FriendId FROM FriendsList WHERE UserId = :userId";
    try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("userId", $userId);
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
    //$userId = 1;
    $userId = $_SESSION['userId'];
    $friendId = Slim::getInstance()->request()->post('friendId');
    $insertFriendQuery2 = "INSERT INTO FriendRequest(userId, friendId) VALUE(:userId, :friendId)";
        try {
            $db = getConnection();
            $stmt = $db->prepare($insertFriendQuery2);
            $stmt->bindParam("userId",$userId);
            $stmt->bindParam("friendId",$friendId);
            $stmt->execute();
            $db = null;
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
    //$userId = 1;
    $userId = $_SESSION['userId'];
    $friendId = Slim::getInstance()->request()->post('friendId');
    $response = Slim::getInstance()->request()->post('response');
    if($response == 1){
        $insertFriend1 = "INSERT INTO FriendsList(UserId, UserFriendId) VALUE(:friendId, :userId)";
        $insertFriend2 = "INSERT INTO FriendsList(UserId, UserFriendId) VALUE(:userId, :friendId)";
        $deleteFriendRequest = "DELETE FROM FriendRequest WHERE UserId = :friendId AND FriendId = :userId";     
        try {
            $db = getConnection();
            $stmt = $db->prepare($insertFriend1);
            $stmt->bindParam("friendId", $friendId);
            $stmt->bindParam("userId", $userId);
            $stmt->execute();

            $stmt2 = $db->prepare($insertFriend2);
            $stmt2->bindParam("userId", $userId);
            $stmt2->bindParam("friendId", $friendId);
            $stmt2->execute();

            $stmt3 = $db->prepare($deleteFriendRequest);
            $stmt3->bindParam("friendId", $friendId);
            $stmt3->bindParam("userId", $userId);
            $stmt3->execute();
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
    }
    else{
        $deleteFriendRequest = "DELETE FROM FriendRequest WHERE UserId = :friendId AND FriendId = :userId";     
        try {
            $db = getConnection();
            $stmt = $db->prepare($deleteFriendRequest);
            $stmt->bindParam("friendId", $friendId);
            $stmt->bindParam("userId", $userId);
            $stmt->execute();
            $db = null;
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
    //$userId = 1;  
    $userId = $_SESSION['userId'];
    $sql = "SELECT UserId, FriendId FROM FriendRequest WHERE FriendId = :userId";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("userId", $userId);
        $stmt->execute();
        $friendRequest = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"FriendRequest": ' . json_encode($friendRequest) . '}';
    } catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

/**
* A funtion to create an event
*/
function createEvent() {
    $event = json_decode(Slim::getInstance()->request()->post('event'), true);

    try {
        $db = getConnection();
        $startTime = $event['startDate'] . ' ' . $event['startTime'];
        $endTime = $event['endDate'] . ' ' . $event['endTime'];


        $sql = "SELECT EventId FROM Events WHERE EventName=:eventName AND UserId=:userId AND StartTime=:startTime AND EndTime=:endTime AND Share=:share";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $_SESSION['userId']);
        $stmt->bindParam("startTime", $startTime);
        $stmt->bindParam("endTime", $endTime);
        $stmt->bindParam("share", $event['share']);
        $stmt->execute();
        if($stmt->fetchObject()) {
            echo "error_event_already_exists";
        }

        $sql = "INSERT INTO Events (EventName, UserId, StartTime, EndTime, EventDescription, Share) VALUES (:eventName, :userId, :startTime, :endTime, :description, :share)";

        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $_SESSION['userId']);
        $stmt->bindParam("startTime", $startTime);
        $stmt->bindParam("endTime", $endTime);
        $stmt->bindParam("description", $event['description']);
        $stmt->bindParam("share", $event['share']);
        $stmt->execute();

        $sql = "SELECT EventId FROM Events WHERE EventName=:eventName AND UserId=:userId AND StartTime=:startTime AND EndTime=:endTime AND Share=:share";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $_SESSION['userId']);
        $stmt->bindParam("startTime", $startTime);
        $stmt->bindParam("endTime", $endTime);
        $stmt->bindParam("share", $event['share']);
        $stmt->execute();
        $eventId = $stmt->fetchObject()->EventId;

        $sql = "INSERT INTO EventRequest (EventId, UserId) VALUES (:eventId, :userId)";
        $stmt = $db->prepare($sql);
        foreach($event['invited'] as $friend) {
            $stmt->bindParam("eventId", $eventId);
            $stmt->bindParam("userId", $friend['friendId']);
            $stmt->execute();
        }

        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

/**
* A function to create a group
*/
function createGroup() {
    $group = json_decode(Slim::getInstance()->request()->post('group'), true);

    try {
        $db = getConnection();

        $sql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $_SESSION['userId']);
        $stmt->execute();
        if($stmt->fetchObject()) {
            echo "error_groupName";
            return;
        }

        $sql = "INSERT INTO Groups (GroupName, UserId) VALUES (:groupName, :userId)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $_SESSION['userId']);
        $stmt->execute();

        $sql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $_SESSION['userId']);
        $stmt->execute();
        $groupId = $stmt->fetchObject()->GroupId;

        $sql = "INSERT INTO GroupList (GroupId, UserId) VALUES (:groupId, :userId)";
        $stmt = $db->prepare($sql);
        foreach($group['friends'] as $friend) {
            $stmt->bindParam("groupId", $groupId);
            $stmt->bindParam("userId", $friend['friendId']);
            $stmt->execute();
        }

        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

/**
* A function to view all of the user's groups
*/
function viewGroups() {
    $userId = $_SESSION['userId'];

    try {
        $db = getConnection();

        $sql = "SELECT GroupId, GroupName FROM Groups WHERE UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam('userId', $userId);
        $stmt->execute();
        $groups = $stmt->fetchAll(PDO::FETCH_OBJ);

        echo '{"Groups": [ ';
	$i = 0;
	foreach($groups as $group) {
		if($i != 0) {
			echo ',';
		} else {
			$i++;
		}
		echo '{"Group": ' . json_encode($group) . ',';
		viewGroupMembers($group->GroupId);
	}
	echo ']}';

        $db = null;

    } catch(PDOExection $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/**
* A function to view the group members within a user's specific group
*/
function viewGroupMembers($groupId) {
    $userId = $_SESSION['userId'];
    try {
        $db = getConnection();      

        $sql = "SELECT UserId FROM GroupList WHERE GroupId=:groupId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam('groupId', $groupId);
        $stmt->execute();

        $users = $stmt->fetchAll(PDO::FETCH_OBJ);
        echo '"Users": ' . json_encode($users) . '}';

        $db = null;
    } catch(PDOExection $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/**
* A function that sets up the connection to the database
*/
function getConnection() {
    $dbhost="localhost";
    $dbuser="root";
    $dbpass="halomasterchief";
    $dbname="Flock";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

?>
