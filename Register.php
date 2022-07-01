<?php
    $inData = getRequestInfo();
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Login = $inData["Login"];
    $Password = $inData["Password"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if($conn->connect_error )
    {
        returnWithError($conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password)  VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
        $stmt->execute();
	$stmt->close();

	$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
	$stmt->bind_param("ss", $Login, $Password);
	$stmt->execute();
	$result = $stmt->get_result();

	if( $row = $result->fetch_assoc() )
	{
		returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
	}
	else
	{
		returnWithError("Failed to Create User");
	}

	$stmt->close();
	$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"ID":-1,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $FirstName, $LastName, $ID )
	{
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
