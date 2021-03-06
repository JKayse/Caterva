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
$app->post('/ViewFriends', 'viewFriends');

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
* Remove Friend
*/
$app->post('/DeleteFriend', 'deleteFriend');

/**
* Create Event
*/
$app->post('/CreateEvent', 'createEvent');

/**
* Share Event
*/
$app->post('/ShareEvent', 'shareEvent');

/**
* Edit Event
*/
$app->post('/EditEvent', 'editEvent');

/**
* Cancel Event
*/
$app->post('/CancelEvent', 'cancelEvent');

/**
* Remove Guest
*/
$app->post('/RemoveGuest', 'removeGuest');

/*
* Respond to Event Request
*/
$app->post('/RespondEventRequest', 'respondToEventRequest');

/*
* Delete Old Events
*/
$app->post('/DeleteOldEvents', 'deleteOldEvents');

/**
* Create Group
*/
$app->post('/CreateGroup', 'createGroup');

/**
* Change Group Name
*/
$app->post('/ChangeGroupName', 'changeGroupName');

/**
* View Groups
*/
$app->post('/Groups', 'viewGroups');

/**
* View Events
*/
$app->post('/Events', 'viewEvents');

/**
* View Event Requests
*/
$app->get('/EventRequests', 'viewEventRequests');

/**
* Add friends to group
*/
$app->post('/AddGroupMembers', 'addGroupMembers');

/**
* View Group Memebers
*/
$app->get('/GroupMembers/:groupId', 'viewGroupMembers');

/**
* Delete Friend From Groups
*/
$app->post('/DeleteGroupMembers', 'deleteGroupMembers');

/**
* Delete Group
*/
$app->post('/DeleteGroup', 'deleteGroup');


/**
* Add picture.
*/
$app->post('/AddPicture', 'addPicture');

/**
*
*/
$app->post('/EditProfile', 'editProfile');
/**
* Android Versions of some of the functions listed above
*/
$app->post('/AndroidViewFriends', 'androidViewFriends');
$app->post('/AndroidAddFriendRequest', 'androidAddFriendRequest');
$app->post('/AndroidAddFriend', 'androidAddFriend');
$app->post('/AndroidViewFriendRequest', 'androidGetFriendRequest');
$app->post('/AndroidCreateEvent', 'androidCreateEvent');
$app->post('/AndroidCreateGroup', 'androidCreateGroup');
$app->post('/AndroidGroups', 'androidViewGroups');
$app->post('/AndroidEvents', 'viewEvents_Android');

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

    try {
        $db = getConnection();

	$sql = "SELECT UserId FROM Users WHERE Username=:username";
	$stmt = $db->prepare($sql);
	$stmt->bindParam("username", $username);
	$stmt->execute();
	$username_test = $stmt->fetchObject();
	if(empty($username_test)) {
		echo "error_username_doesnt_exists";
		return;
	}

	$sql = "SELECT Password FROM Users WHERE Username=:username";
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
    $_SESSION = array(); 
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
}

/**
* A function that shows all the user's friends
*/
function viewFriends(){
    if(empty($_SESSION['userId'])) {
	$userId = Slim::getInstance()->request()->post('id');
	$sql = "SELECT fl.FriendId, u.Firstname, u.Lastname FROM FriendsList fl INNER JOIN Users u ON fl.FriendId=u.UserId WHERE fl.UserId=:userId ORDER BY u.Lastname";
	if(empty($userId)) {
		echo "error_nobody_is_signed_in";
		return;
	}
    } else { 
	$userId = $_SESSION['userId'];
	$sql = "SELECT fl.FriendId FROM FriendsList fl INNER JOIN Users u ON fl.FriendId=u.UserId WHERE fl.UserId=:userId ORDER BY u.Lastname";
    }
    
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
    $sql = "SELECT UserId, Username, Firstname, Lastname, Email, Description, PictureName FROM Users WHERE UserId =:userId";
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
* A function that edits a person's profile
*/
function editProfile()
{
	$userId = $_SESSION['userId'];	
	$email = Slim::getInstance()->request()->post('email');
	$description = Slim::getInstance()->request()->post('description');
	$sql = "UPDATE Users SET Email = :email, Description = :description WHERE UserId = :userId"; 
	try{
		$db = getConnection();
		$stmt = $db->prepare($sql);
        	$stmt->bindParam("email",$email);
		$stmt->bindParam("description", $description);
		$stmt->bindParam("userId", $userId);
        	$stmt->execute();

	} catch(PDOException $e) {
    echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }   
}

/**
* A function that adds a friend request
*/
function addFriendRequest()
{
    if(empty($_SESSION['userId'])) {
	$userId = Slim::getInstance()->request()->post('id');
	if(empty($userId)) {
		echo "error_nobody_is_signed_in";
		return;
	}
    } else { 
	$userId = $_SESSION['userId'];
    }

    $friendId = Slim::getInstance()->request()->post('friendId');
    
        try {
            $db = getConnection();

	    $sql = "SELECT FriendRequestId FROM FriendRequest WHERE UserId=:friendId AND FriendId=:userId";
	    $stmt = $db->prepare($sql);
            $stmt->bindParam("userId",$userId);
            $stmt->bindParam("friendId",$friendId);
            $stmt->execute();
	    $requestId = $stmt->fetchObject();
	    if($requestId) {
		$insertFriend1 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:friendId, :userId)";
		$insertFriend2 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:userId, :friendId)";
		$deleteRequest = "DELETE FROM FriendRequest WHERE FriendRequestId=:requestId";

		$stmt = $db->prepare($insertFriend1);
		$stmt->bindParam("friendId", $friendId);
		$stmt->bindParam("userId", $userId);
		$stmt->execute();

		$stmt = $db->prepare($insertFriend2);
		$stmt->bindParam("userId", $userId);
		$stmt->bindParam("friendId", $friendId);
		$stmt->execute();

		$stmt = $db->prepare($deleteRequest);
		$stmt->bindParam('requestId', $requestId);
		$stmt->execute();
	    } else {
		$sql = "INSERT INTO FriendRequest(userId, friendId) VALUE(:userId, :friendId)";
		$stmt = $db->prepare($sql);
		$stmt->bindParam("userId",$userId);
		$stmt->bindParam("friendId",$friendId);
		$stmt->execute();
	    }
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
    $userId = $_SESSION['userId'];

    $friendId = Slim::getInstance()->request()->post('friendId');
    $response = Slim::getInstance()->request()->post('response');
    if($response == 1){
        $insertFriend1 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:friendId, :userId)";
        $insertFriend2 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:userId, :friendId)";
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
* A function that deletes friends from a user's friend's list
*/
function deleteFriend()
{
	$userId = $_SESSION['userId'];
	$friendId = Slim::getInstance()->request()->post('friendId');
	$deleteFriendQ1 = "DELETE FROM FriendsList WHERE UserId = :userId AND FriendId = :friendId";
	$deleteFriendQ2 = "DELETE FROM FriendsList WHERE UserId = :friendId AND FriendId = :userId";
	$DeleteFromGroup = "DELETE gl FROM GroupList gl INNER JOIN Groups g ON gl.GroupId = g.GroupId WHERE gl.UserId = :friendId";
	try {
            $db = getConnection();
            $stmt = $db->prepare($deleteFriendQ1);
            $stmt->bindParam("userId",$userId);
            $stmt->bindParam("friendId",$friendId);
            $stmt->execute();

	    $stmt2 = $db->prepare($deleteFriendQ2);
	    $stmt2->bindParam("friendId", $friendId);
	    $stmt2->bindParam("userId", $userId);
	    $stmt2->execute();
	    
	    $stmt3 = $db->prepare($DeleteFromGroup);
	    $stmt3->bindParam("friendId", $friendId);
	    $stmt3->execute();	
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
	
}

/**
* A function that gets the friend request of the user
*/
function getFriendRequest()
{  
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
    
    $userId = $_SESSION['userId'];

    try {
        $db = getConnection();
        $startTime = $event['startDate'] . ' ' . $event['startTime'];
        $endTime = $event['endDate'] . ' ' . $event['endTime'];


        $sql = "SELECT EventId FROM Events WHERE EventName=:eventName AND UserId=:userId AND StartTime=:startTime AND EndTime=:endTime AND Share=:share";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $userId);
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
        $stmt->bindParam("userId", $userId);
        $stmt->bindParam("startTime", $startTime);
        $stmt->bindParam("endTime", $endTime);
        $stmt->bindParam("description", $event['description']);
        $stmt->bindParam("share", $event['share']);
        $stmt->execute();

        $sql = "SELECT EventId FROM Events WHERE EventName=:eventName AND UserId=:userId AND StartTime=:startTime AND EndTime=:endTime AND Share=:share";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $userId);
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

/*
* This function shares an event with friends by sending an eventRequest to each friend.
*/
function shareEvent() {
	$event = json_decode(Slim::getInstance()->request()->post('event'), true);
	
	try {
		$db = getConnection();

		$sql = "INSERT INTO EventRequest (EventId, UserId) VALUES (:eventId, :userId)";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('eventId', $event['eventId']);

		foreach($event['invited'] as $eventRequest) {
			$sql2 = "SELECT EventRequestId FROM EventRequest WHERE EventId=:eventId AND UserId=:userId";
			$stmt2 = $db->prepare($sql2);
			$stmt2->bindParam('eventId', $event['eventId']);
			$stmt2->bindParam('userId', $eventRequest['friendId']);
			$stmt2->execute();

			if($stmt2->fetchObject()) {
				echo "error_request_already_exists_" . $eventRequest['friendId'] . "\n";
			} else {
				$stmt->bindParam('userId', $eventRequest['friendId']);
				$stmt->execute();
			}
		}

		$db = null;
	} catch(PDOException $e) {
        	echo '{"error":{"text":' . $e->getMessage() . '}}'; 
    	}
	
}

/*
* A function to edit an event
*/
function editEvent() {
	$event = json_decode(Slim::getInstance()->request()->post('event'), true);

	try {
		$db = getConnection();

		$sql = "SELECT eventId FROM Events WHERE EventId=:eventId";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('eventId', $event['eventId']);
		$stmt->execute();
		if(empty($stmt->fetchObject())) {
			echo "error_event_does_not_exist";
			return;
		}
		
		$sql = "UPDATE Events SET :columnName=:value WHERE EventId=:eventId";
		$stmt = $db->prepare($sql);

		if(isset($event['eventName'])) {
			$sql = "UPDATE Events SET EventName=:eventName WHERE EventId=:eventId";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('eventName', $event['eventName']);
			$stmt->bindParam('eventId', $event['eventId']);
			$stmt->execute();
		}

		if(isset($event['description'])) {
			$sql = "UPDATE Events SET EventDescription=:eventDescription WHERE EventId=:eventId";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('eventDescription', $event['description']);
			$stmt->bindParam('eventId', $event['eventId']);
			$stmt->execute();
		}

		if(isset($event['startTime'])) {
			$sql = "UPDATE Events SET StartTime=:startTime WHERE EventId=:eventId";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('startTime', $event['startTime']);
			$stmt->bindParam('eventId', $event['eventId']);
			$stmt->execute();
		}

		if(isset($event['endTime'])) {
			$sql = "UPDATE Events SET EndTime=:endTime WHERE EventId=:eventId";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('endTime', $event['endTime']);
			$stmt->bindParam('eventId', $event['eventId']);
			$stmt->execute();
		}

		if(isset($event['share'])) {
			$sql = "UPDATE Events SET Share=:share WHERE EventId=:eventId";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('share', $event['share']);
			$stmt->bindParam('eventId', $event['eventId']);
			$stmt->execute();
		}

		if(isset($event['invited'])) {
			$sql = "INSERT INTO EventRequest (EventId, UserId) VALUES (:eventId, :userId)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('eventId', $event['eventId']);

			foreach($event['invited'] as $eventRequest) {
				$sql2 = "SELECT EventRequestId FROM EventRequest WHERE EventId=:eventId AND UserId=:userId";
				$stmt2 = $db->prepare($sql2);
				$stmt2->bindParam('eventId', $event['eventId']);
				$stmt2->bindParam('userId', $eventRequest['friendId']);
				$stmt2->execute();

				if($stmt2->fetchObject()) {
					echo "error_request_already_exists_" . $eventRequest['friendId'] . "\n";
				} else {
					$stmt->bindParam('userId', $eventRequest['friendId']);
					$stmt->execute();
				}
			}
		}
	
		$db = null;
	} catch(PDOException $e) {
        	echo '{"error":{"text":' . $e->getMessage() . '}}'; 
    	}
}

/*
* A function to cancel an event
*/
function cancelEvent() {
	$eventId = Slim::getInstance()->request()->post('eventId');

	try {
		$db = getConnection();
		
		$sql = "UPDATE Events SET Cancel=1 WHERE EventId=:eventId";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('eventId', $eventId);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
        	echo '{"error":{"text":' . $e->getMessage() . '}}'; 
    	}
}

/*
* A function that removes the current user from the guest list of the requested event
*/
function removeGuest() {
	$userId = $_SESSION['userId'];
	$eventId = Slim::getInstance()->request()->post('eventId');

	try {
		$db = getConnection();
		
		$sql = "DELETE FROM GuestList WHERE EventId=:eventId AND UserId=:userId";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('eventId', $eventId);
		$stmt->bindParam('userId', $userId);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
        	echo '{"error":{"text":' . $e->getMessage() . '}}'; 
    	}
}

/*
* A function to respond to an event request
*/
function respondToEventRequest() {
	$requestId = Slim::getInstance()->request()->post('eventRequestId');
	$response = Slim::getInstance()->request()->post('going');

	try {
		$db = getConnection();

		if($response = 1) {
			$sql = "SELECT EventId, UserId FROM EventRequest WHERE EventRequestId=:requestId";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('requestId', $requestId);
			$stmt->execute();
			$request = $stmt->fetchObject();
			$eventId = $request->EventId;
			$userId = $request->UserId;

			$sql = "INSERT INTO GuestList (EventId, UserId) VALUES (:eventId, :userId)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam('eventId', $eventId);
			$stmt->bindParam('userId', $userId);
			$stmt->execute();
		}
		
		$sql = "DELETE FROM EventRequest WHERE EventRequestId=:requestId";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('requestId', $requestId);
		$stmt->execute();
		$db = null;
	}  catch(PDOException $e) {
        	echo '{"error":{"text":' . $e->getMessage() . '}}'; 
    	}
}

/*
* A function to delete events that have already ended
*/
function deleteOldEvents() {
	try {
		$db = getConnection();
		$sql = "SELECT EventId FROM Events WHERE EndTime<NOW()";
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$oldEvents = $stmt->fetchAll(PDO::FETCH_OBJ);
		
		foreach($oldEvents as $event) {
			$deleteGuestList = "DELETE FROM GuestList WHERE EventId=:eventId";
			$deleteEventRequests = "DELETE FROM EventRequest WHERE EventId=:eventId";
			$deleteEvent = "DELETE FROM Events WHERE EventId=:eventId";
			
			$stmt = $db->prepare($deleteGuestList);
			$stmt->bindParam('eventId', $event->EventId);
			$stmt->execute();

			$stmt = $db->prepare($deleteEventRequests);
			$stmt->bindParam('eventId', $event->EventId);
			$stmt->execute();

			$stmt = $db->prepare($deleteEvent);
			$stmt->bindParam('eventId', $event->EventId);
			$stmt->execute();
		}

		$db = null;
	}  catch(PDOException $e) {
        	echo '{"error":{"text":' . $e->getMessage() . '}}'; 
    	}
}

/**
* A function to create a group
*/
function createGroup() {
    $group = json_decode(Slim::getInstance()->request()->post('group'), true);
    
    $userId = $_SESSION['userId'];

    try {
        $db = getConnection();

        $sql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $userId);
        $stmt->execute();
        if($stmt->fetchObject()) {
            echo "error_groupName";
            return;
        }

        $sql = "INSERT INTO Groups (GroupName, UserId) VALUES (:groupName, :userId)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $userId);
        $stmt->execute();

        $sql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $userId);
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
    if(empty($_SESSION['userId'])) {
	$userId = Slim::getInstance()->request()->post('id');
	if(empty($userId)) {
		echo "error_nobody_is_signed_in";
		return;
	}
    } else { 
	$userId = $_SESSION['userId'];
    }

    try {
        $db = getConnection();

        $sql = "SELECT GroupId, GroupName FROM Groups WHERE UserId=:userId ORDER BY GroupName";
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

/*
* A function to view events
*/
function viewEvents() {
	if(empty($_SESSION['userId'])) {
		$userId = Slim::getInstance()->request()->post('id');
		if(empty($userId)) {
			echo "error_nobody_is_signed_in";
			return;
		}
	} else { 
		$userId = $_SESSION['userId'];
	}

	try {	
		$db = getConnection();
	
		$sql = "SELECT EventId, EventName, UserId as OwnerId, StartTime, EndTime, EventDescription, Share, Cancel FROM Events WHERE UserId=:userId UNION (SELECT e.EventId, e.EventName, e.UserId as OwnerId, e.StartTime, e.EndTime, e.EventDescription, e.Share, e.Cancel FROM Events e INNER JOIN GuestList g ON e.EventId=g.EventId WHERE g.UserId=:userId) ORDER BY StartTime";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('userId', $userId);
		$stmt->execute();
		$events = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

		echo '{"Events": ' . json_encode($events) . '}';
	} catch(PDOExection $e) {
       		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}	
}



/*
* A function to get all event invitations
*/
function viewEventRequests() {
	$userId = $_SESSION['userId'];
	try {	
		$db = getConnection();
	
		$sql = "SELECT er.EventRequestId, er.EventId, e.EventName, e.UserId AS OwnerId, e.StartTime, e.EndTime, e.EventDescription FROM EventRequest er INNER JOIN Events e ON er.EventId=e.EventId WHERE er.UserId=:userId ORDER BY e.StartTime";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('userId', $userId);
		$stmt->execute();
		$eventRequests = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

		echo '{"EventRequests": ' . json_encode($eventRequests) . '}';
	} catch(PDOExection $e) {
       		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
}

/**
* A function to view the group members within a user's specific group
*/
function viewGroupMembers($groupId) {
    try {
        $db = getConnection();      

        $sql = "SELECT gl.UserId FROM GroupList gl INNER JOIN Users u ON gl.UserId=u.UserId WHERE gl.GroupId=:groupId ORDER BY u.Lastname";
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

/*
* A function to add group members to an existing group
*/
function addGroupMembers()
{
	$groupId = Slim::getInstance()->request()->post('groupId');
	$userId = Slim::getInstance()->request()->post('userId');
	$sql = "INSERT INTO GroupList (GroupId, UserId) VALUES (:groupId, :userId)";
	try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
	    $stmt->bindParam('groupId', $groupId);
	    $stmt->bindParam('userId', $userId);
            $stmt->execute();
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
}

/*
* A function to delete friends from groups
*/
function deleteGroupMembers()
{
	$groupId = Slim::getInstance()->request()->post('groupId');
	$userId = Slim::getInstance()->request()->post('userId');
	$DeleteQuery = "DELETE FROM GroupList WHERE GroupId = :groupId AND UserId = :userId";
	try {
            $db = getConnection();
            $stmt = $db->prepare($DeleteQuery);
	    $stmt->bindParam("groupId", $groupId);
            $stmt->bindParam("userId", $userId);
            $stmt->execute();
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
}

/*
* A function to change the name of the group
*/
function changeGroupName()
{
	$groupId = Slim::getInstance()->request()->post('groupId');	
	$groupName = Slim::getInstance()->request()->post('groupname');
	try {
            $db = getConnection();
	    $Checksql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
            $chkstmt = $db->prepare($Checksql);
            $chkstmt->bindParam("groupName", $groupName);
            $chkstmt->bindParam("userId", $_SESSION['userId']);
            $chkstmt->execute();
            if($chkstmt->fetchObject()) {
            	echo "error_groupName";
            	return;
       	    }
	
	    $sql = "UPDATE Groups SET GroupName = :groupName WHERE GroupId = :groupId";	
            $stmt = $db->prepare($sql);
	    $stmt->bindParam("groupName", $groupName);
            $stmt->bindParam("groupId", $groupId);
            $stmt->execute();
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
}
/*
* A function to delete a user's groups
*/
function deleteGroup()
{
	$groupId = Slim::getInstance()->request()->post('groupId');
	$sql = "DELETE FROM Groups WHERE GroupId =:groupId";
	$sql2 = "DELETE FROM GroupList WHERE GroupId =:groupId";
	try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("groupId", $groupId);
            $stmt->execute();
	    $stmt2 = $db->prepare($sql2);
	    $stmt2->bindParam("groupId", $groupId);
	    $stmt2->execute();	
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
}


/*
* A function to add a user's picture
*/
function addPicture()
{
    date_default_timezone_set(date_default_timezone_get());
    $date = date('mdYhisa', time());
    $allowedExts = array("gif", "jpeg", "jpg", "png", "PNG");
    $temp = explode(".", $_FILES["image"]["name"]);
    $extension = end($temp);
    $userId = $_SESSION['userId'];

    if ((($_FILES["image"]["type"] == "image/gif")
    || ($_FILES["image"]["type"] == "image/jpeg")
    || ($_FILES["image"]["type"] == "image/jpg")
    || ($_FILES["image"]["type"] == "image/pjpeg")
    || ($_FILES["image"]["type"] == "image/x-png")
    || ($_FILES["image"]["type"] == "image/png"))
    && in_array($extension, $allowedExts))
    {
        if ($_FILES["image"]["error"] > 0)
        {
            echo "Return Code: " . $_FILES["image"]["error"] . "<br>";
        }
        else
        {

            if (file_exists("img/" . $_FILES["image"]["name"]))
            {
                echo $_FILES["image"]["name"] . " already exists. ";
            }
            else
            {
                $store = $date . $_FILES["image"]["name"];
                move_uploaded_file($_FILES["image"]["tmp_name"],
                "../img/" . $store);
                echo "Stored in: " . "img/" . $store ;

                $query = "UPDATE Users SET PictureName=:store WHERE UserId=:userId";
                $db = getConnection();
                $stmt = $db->prepare($query);
                $stmt->bindParam("store", $store);
                $stmt->bindParam("userId", $userId);
                $stmt->execute();
            }
        }
    }
    else
    {
        echo "Invalid file";
    }
}
    

/****************************ANDROID SPECIFIC FUNCTIONS*************************************/
/**
* The android version of the function that shows all the user's friends
*/
function androidViewFriends(){
    $userId = Slim::getInstance()->request()->post('id');   
    $sql = "SELECT fl.FriendId, u.Firstname, u.Lastname FROM FriendsList fl INNER JOIN Users u ON fl.FriendId=u.UserId WHERE fl.UserId=:userId ORDER BY u.Lastname";
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

/**
* the android version of the function that adds a friend request
*/
function androidAddFriendRequest()
{
    $userId = Slim::getInstance()->request()->post('id');
    $friendId = Slim::getInstance()->request()->post('friendId');
    
        try {
            $db = getConnection();

	    $sql = "SELECT FriendRequestId FROM FriendRequest WHERE UserId=:friendId AND FriendId=:userId";
	    $stmt = $db->prepare($sql);
            $stmt->bindParam("userId",$userId);
            $stmt->bindParam("friendId",$friendId);
            $stmt->execute();
	    $requestId = $stmt->fetchObject();
	    if($requestId) {
		$insertFriend1 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:friendId, :userId)";
		$insertFriend2 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:userId, :friendId)";
		$deleteRequest = "DELETE FROM FriendRequest WHERE FriendRequestId=:requestId";

		$stmt = $db->prepare($insertFriend1);
		$stmt->bindParam("friendId", $friendId);
		$stmt->bindParam("userId", $userId);
		$stmt->execute();

		$stmt = $db->prepare($insertFriend2);
		$stmt->bindParam("userId", $userId);
		$stmt->bindParam("friendId", $friendId);
		$stmt->execute();

		$stmt = $db->prepare($deleteRequest);
		$stmt->bindParam('requestId', $requestId);
		$stmt->execute();
	    } else {
		$sql = "INSERT INTO FriendRequest(userId, friendId) VALUE(:userId, :friendId)";
		$stmt = $db->prepare($sql);
		$stmt->bindParam("userId",$userId);
		$stmt->bindParam("friendId",$friendId);
		$stmt->execute();
	    }
            $db = null;
        } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }
}

/**
* The android version of thefunction that adds or denies friends.  
*The friend request is deleted after the user makes a response
*/
function androidAddFriend()
{
    $userId = Slim::getInstance()->request()->post('id');
    $friendId = Slim::getInstance()->request()->post('friendId');
    $response = Slim::getInstance()->request()->post('response');
    if($response == 1){
        $insertFriend1 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:friendId, :userId)";
        $insertFriend2 = "INSERT INTO FriendsList(UserId, FriendId) VALUE(:userId, :friendId)";
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
* The android version of function that gets the friend request of the user
*/
function androidGetFriendRequest()
{  
    $userId = Slim::getInstance()->request()->post('id');
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
* The android version of the function to create an event
*/
function androidCreateEvent() {
    $event = json_decode(Slim::getInstance()->request()->post('event'), true);
    $userId = Slim::getInstance()->request()->post('id');

    try {
        $db = getConnection();
        $startTime = $event['startDate'] . ' ' . $event['startTime'];
        $endTime = $event['endDate'] . ' ' . $event['endTime'];


        $sql = "SELECT EventId FROM Events WHERE EventName=:eventName AND UserId=:userId AND StartTime=:startTime AND EndTime=:endTime AND Share=:share";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $userId);
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
        $stmt->bindParam("userId", $userId);
        $stmt->bindParam("startTime", $startTime);
        $stmt->bindParam("endTime", $endTime);
        $stmt->bindParam("description", $event['description']);
        $stmt->bindParam("share", $event['share']);
        $stmt->execute();

        $sql = "SELECT EventId FROM Events WHERE EventName=:eventName AND UserId=:userId AND StartTime=:startTime AND EndTime=:endTime AND Share=:share";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eventName", $event['title']);
        $stmt->bindParam("userId", $userId);
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
* the android version of the function to create a group
*/
function androidCreateGroup() {
    $group = json_decode(Slim::getInstance()->request()->post('group'), true);
    $userId = Slim::getInstance()->request()->post('id'); 

    try {
        $db = getConnection();

        $sql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $userId);
        $stmt->execute();
        if($stmt->fetchObject()) {
            echo "error_groupName";
            return;
        }

        $sql = "INSERT INTO Groups (GroupName, UserId) VALUES (:groupName, :userId)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $userId);
        $stmt->execute();

        $sql = "SELECT GroupId FROM Groups WHERE GroupName=:groupName AND UserId=:userId";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("groupName", $group['name']);
        $stmt->bindParam("userId", $userId);
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
* Android version of function to view all of the user's groups
*/
function androidViewGroups() {
    $userId = Slim::getInstance()->request()->post('id');

    try {
        $db = getConnection();

        $sql = "SELECT GroupId, GroupName FROM Groups WHERE UserId=:userId ORDER BY GroupName";
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

/*
* A function to view events for android
*/
function viewEvents_Android() {
	$userId = Slim::getInstance()->request()->post('userId');

	try {	
		$db = getConnection();
	
		$sql = "SELECT EventId, EventName, UserId as OwnerId, StartTime, EndTime, EventDescription, Share, Cancel FROM Events WHERE UserId=:userId UNION (SELECT e.EventId, e.EventName, e.UserId as OwnerId, e.StartTime, e.EndTime, e.EventDescription, e.Share, e.Cancel FROM Events e INNER JOIN GuestList g ON e.EventId=g.EventId WHERE g.UserId=:userId) ORDER BY StartTime";
		$stmt = $db->prepare($sql);
		$stmt->bindParam('userId', $userId);
		$stmt->execute();
		$events = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

		echo '{"Events": ' . json_encode($events) . '}';
	} catch(PDOExection $e) {
       		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}	
}
/********************************************************************************/

/**
* a function to send emails notifying users on the upcoming events
*/
function sendEmails()
{	
		try {
		$db = getConnection();
        	$EventsQuery = "SELECT EventId, EventName, UserId, StartTime, EndTime 
		FROM Events WHERE StartTime < (NOW()+INTERVAL 1 DAY) AND StartTime > NOW()";
       		$stmt = $db->prepare($EventsQuery);
        	$stmt->execute();
		$events = '{"Events": ' . json_encode($stmt->fetchAll(PDO::FETCH_OBJ)) . '}';
		echo $events;		
		$events = json_decode($events, true);
		
		foreach($events['Events'] as $e){
			$eventId = $e['EventId'];
			$startTime = strtotime($e['StartTime']);
			$endTime = strtotime($e['EndTime']);
			$GuestQuery = "SELECT u.Firstname, u.Lastname, u.Email FROM Users u INNER JOIN
			GuestList gl ON u.UserId = gl.UserId AND gl.EventId = :eventId UNION SELECT
			u2.Firstname, u2.Lastname, u2.Email FROM Users u2 INNER JOIN Events e2 ON
			u2.UserId = e2.UserId WHERE e2.EventId = :eventId";
			$stmt2 = $db->prepare($GuestQuery);
			$stmt2->bindParam('eventId', $eventId);
			$stmt2->execute();
			$Guests = '{"Guests": ' . json_encode($stmt2->fetchAll(PDO::FETCH_OBJ)) . '}';
			echo "</br></br>" . $Guests; 		
			$Guests = json_decode($Guests, true);
			foreach($Guests['Guests'] as $g){
				$to = $g['Email'];
 				$subject = "Event Reminder";
 				$body = "Hi " .  $g['Firstname'] .  " " . $g['Lastname'] .  
					",\nYou have an event to go to: \n" .
					$e['EventName'] . "\n" . 
					date("F j, Y, g:i a", $startTime) . "\n" .
					date("F j, Y, g:i a", $endTime) . "\n" .
					"Thank you for using Flock";
				echo "</br>" . $to . "</br>" . $subject;
				echo "</br>" . $body . "</br>";
				if (mail($to, $subject, $body)) {
   					echo("</br>Email successfully sent!");
  				} else {
   					echo("</br>Email delivery failed…");
  				}
			}
		}
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
