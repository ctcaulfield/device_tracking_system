/*** USER ***/
var clickNewUser = true;
var editUser = "";
var editRFID = "";

//Add Input for new user info
function addNewUserInfo() {
	if(clickNewUser) {
		var table = document.getElementById("user-table");
		var rowNum = table.rows.length;
		var row = table.insertRow(rowNum);
		var idCell = row.insertCell(0);
		var nameCell = row.insertCell(1);
		var RFIDCell = row.insertCell(2);
		var activeCell = row.insertCell(3);
	
		idCell.id="id"+rowNum;
		nameCell.id="name"+rowNum;
		RFIDCell.id="rfid"+rowNum;
		activeCell.id="active"+rowNum;
		
		idCell.innerHTML = rowNum;
		nameCell.innerHTML = "<input type='text' id='input-name"+rowNum+"' />";
		RFIDCell.innerHTML = "<input type='text' id='input-rfid"+rowNum+"' />";
		activeCell.innerHTML = "<button type='button' onclick='saveUserBtn("+rowNum+")'>Save</button> <button type='button' onclick='cancelUserBtn("+rowNum+")'>Cancel</button>";
		clickNewUser = false;
	}
}

//save new user info
function saveUserBtn(id) {
	var name = document.getElementById("input-name"+id).value;
	var rfid = document.getElementById("input-rfid"+id).value;
	
	//Validation - New User input
	if((name == "" || name == null) && (rfid == "" || rfid == null)) {
		alert("Please enter user name and RFID #");
	} else if(name == "" || name == null) {
		alert("Please enter user name");
	} else if(rfid == "" || rfid == null) {
		alert("Please enter RFID #");
	} else {
		//call the function from firebaseLogic.js
		//addUser(name,rfid,false,[]);  //add new user in firebase database
		var table = document.getElementById("user-table");
		table.rows[id].cells[1].innerHTML = name;
		table.rows[id].cells[2].innerHTML = rfid;
		table.rows[id].cells[3].innerHTML = "<button type='button' onclick='editUserBtn("+id+")'>Edit</button> <button type='button' onclick='deleteUserBtn("+id+")'>Delete</button>";
		clickNewUser = true;
	}
}

//cancel new user
function cancelUserBtn(id) {
	var table = document.getElementById("user-table").deleteRow(id);
	clickNewUser = true;
}

//delete an user
function deleteUserBtn(id) {
	var table = document.getElementById("user-table").deleteRow(id);
}

//edit an user
function editUserBtn(id) {
	var nameCell = document.getElementById("name"+id);
	var rfidCell = document.getElementById("rfid"+id);
	var activeCell = document.getElementById("active"+id);
	
	editUser = nameCell.innerHTML;
	editRFID = rfidCell.innerHTML;
	
	nameCell.innerHTML = "<input type='text' id='input-name"+id+"' value='"+editUser+"' />";
	rfidCell.innerHTML = "<input type='text' id='input-rfid"+id+"' value='"+editRFID+"' />";
	activeCell.innerHTML = "<button type='button' onclick='saveUserBtn("+id+")'>Save</button> <button type='button' onclick='cancelEditedUser("+id+")'>Cancel</button>";
}

function cancelEditedUser(id) {
	var nameCell = document.getElementById("name"+id);
	var rfidCell = document.getElementById("rfid"+id);
	var activeCell = document.getElementById("active"+id);
	
	nameCell.innerHTML = editUser;
	rfidCell.innerHTML = editRFID;
	activeCell.innerHTML = "<button type='button' onclick='editUserBtn("+id+")'>Edit</button> <button type='button' onclick='deleteUserBtn("+id+")'>Delete</button>";

	editUser = "";
	editRFID = "";
}

/*** DEVICES ***/


/*** ADMINS ***/