<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,Name,Email,Phone FROM Contacts
					WHERE Name LIKE ? AND EMAIL LIKE ? AND Phone LIKE ? AND UserID=?");
		$nameSearch = "%" . $inData["Name"] . "%";
		$emailSearch = "%" . $inData["Email"] . "%";
		$phoneSearch = "%" . $inData["Phone"] . "%";
		$stmt->bind_param("sssi", $nameSearch, $emailSearch, $phoneSearch, $inData["UserID"]);
		$stmt->execute();

		$result = $stmt->get_result();
		returnWithInfo($result->fetch_all(MYSQLI_ASSOC));
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($rows)
	{
		$searchCount = 0;
		$retValue = '{"results":[';
		foreach ($rows as $row)
		{
			if ($searchCount > 0)
			{
				$retValue .= ',';
			}
			$retValue .= '{"ID":' . $row["ID"] .
				',"Name":"' . $row["Name"] .
				'","Email":"' . $row["Email"] .
				'","Phone":"' . $row["Phone"] . '"}';
			$searchCount++;
		}
		$retValue .= '],"error":""}';
		if ($searchCount == 0)
		{
			returnWithError("No Records Found");
		}
		else
		{
			sendResultInfoAsJson($retValue);
		}
	}

?>
