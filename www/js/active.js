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

//cancel Edited User
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


/****** DEVICES ******/
var clickNewDevice = true;
var editDevice = "";

//Add Input for new user info
function addNewDevice() {
	if(clickNewDevice) {
		var table = document.getElementById("device-table");
		var rowNum = table.rows.length;
		var row = table.insertRow(rowNum);
		var idCell = row.insertCell(0);
		var nameCell = row.insertCell(1);
		var groupCell = row.insertCell(2);
		var activeCell = row.insertCell(3);
	
		idCell.id="id"+rowNum;
		nameCell.id="device"+rowNum;
		groupCell.id="group"+rowNum;
		activeCell.id="active"+rowNum;
		
		idCell.innerHTML = rowNum;
		nameCell.innerHTML = "<input type='text' id='input-device"+rowNum+"' />";
		groupCell.innerHTML = "<button type='button' onclick='alert(\"Group\")' >Group</button>";
		activeCell.innerHTML = "<button type='button' onclick='saveDeviceBtn("+rowNum+")'>Save</button> <button type='button' onclick='cancelDeviceBtn("+rowNum+")'>Cancel</button>";
		clickNewDevice = false;
	}
}

//save new device
function saveDeviceBtn(id) {
	var device = document.getElementById("input-device"+id).value;
	
	//Validation - New Device input
	if(device == "" || device == null) {
 		alert("Please enter device name");
 	} else {
 		//call the function from firebaseLogic.js
 		//addUser(name,rfid,false,[]);  //add new user in firebase database
 		var table = document.getElementById("device-table");
 		table.rows[id].cells[1].innerHTML = device;
 		table.rows[id].cells[3].innerHTML = "<button type='button' onclick='editDeviceBtn("+id+")'>Edit</button> <button type='button' onclick='deleteDeviceBtn("+id+")'>Delete</button>";
 		clickNewUser = true;
 	}
}

//cancel new user
function cancelDeviceBtn(id) {
	var table = document.getElementById("device-table").deleteRow(id);
	clickNewUser = true;
}

//delete an user
function deleteDeviceBtn(id) {
	var table = document.getElementById("device-table").deleteRow(id);
}

//edit an user
function editDeviceBtn(id) {
	var nameCell = document.getElementById("device"+id);
	var activeCell = document.getElementById("active"+id);
	
	editDevice = nameCell.innerHTML;
	
	nameCell.innerHTML = "<input type='text' id='input-device"+id+"' value='"+editDevice+"' />";
	activeCell.innerHTML = "<button type='button' onclick='saveDeviceBtn("+id+")'>Save</button> <button type='button' onclick='cancelEditedDevice("+id+")'>Cancel</button>";
}

//cancel Edited User
function cancelEditedDevice(id) {
	var nameCell = document.getElementById("device"+id);
	var activeCell = document.getElementById("active"+id);
	
	nameCell.innerHTML = editDevice;
	activeCell.innerHTML = "<button type='button' onclick='editDeviceBtn("+id+")'>Edit</button> <button type='button' onclick='cancelDeviceBtn("+id+")'>Delete</button>";

	editDevice = "";
}


/***** ADMINS *****/
var clickNewAdmin= true;
var editAdmin = "";

//Add Input for new Admin
function addNewAdmin() {
	if(clickNewAdmin) {
		var table = document.getElementById("admin-table");
		var rowNum = table.rows.length;
		var row = table.insertRow(rowNum);
		var idCell = row.insertCell(0);
		var adminCell = row.insertCell(1);
		var activeCell = row.insertCell(2);
	
		idCell.id="id"+rowNum;
		adminCell.id="admin"+rowNum;
		activeCell.id="active"+rowNum;
		
		idCell.innerHTML = rowNum;
		adminCell.innerHTML = "<input type='text' id='input-admin"+rowNum+"' />";
		activeCell.innerHTML = "<button type='button' onclick='saveAdminBtn("+rowNum+")'>Save</button> <button type='button' onclick='cancelAdminBtn("+rowNum+")'>Cancel</button>";
		clickNewAdmin = false;
	}
}

//save new admin
function saveAdminBtn(id) {
	var admin = document.getElementById("input-admin"+id).value;
	
	//Validation - New Device input
	if(admin == "" || admin == null) {
 		alert("Please enter device name");
 	} else {
 		//call the function from firebaseLogic.js
 		//addUser(name,rfid,false,[]);  //add new user in firebase database
 		var table = document.getElementById("admin-table");
 		table.rows[id].cells[1].innerHTML = admin;
 		table.rows[id].cells[2].innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='deleteAdminBtn("+id+")'>Delete</button>";
 		clickNewAdmin = true;
 	}
}

//cancel new user
function cancelAdminBtn(id) {
	var table = document.getElementById("admin-table").deleteRow(id);
	clickNewAdmin = true;
}

//delete an user
function deleteAdminBtn(id) {
	document.getElementById("admin-table").deleteRow(id);
}

//edit an user
function editAdminBtn(id) {
	var adminCell = document.getElementById("admin"+id);
	var activeCell = document.getElementById("active"+id);
	
	editAdmin = adminCell.innerHTML;
	
	adminCell.innerHTML = "<input type='text' id='input-admin"+id+"' value='"+editAdmin+"' />";
	activeCell.innerHTML = "<button type='button' onclick='saveAdminBtn("+id+")'>Save</button> <button type='button' onclick='cancelEditedAdmin("+id+")'>Cancel</button>";
}

//cancel Edited User
function cancelEditedAdmin(id) {
	var adminCell = document.getElementById("admin"+id);
	var activeCell = document.getElementById("active"+id);
	
	adminCell.innerHTML = editAdmin;
	activeCell.innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='cancelAdminBtn("+id+")'>Delete</button>";

	editAdmin = "";
}