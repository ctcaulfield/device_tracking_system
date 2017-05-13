/*** USER ***/
var clickNewUser = true;
var editUser = "";
var editRFID = "";
var deviceArray = [];

//get user list
function getUsers() {
	setAllowCheckOut();
 	getUserList().then(function(value) {
		var table = document.getElementById("user-table");
		var id = 0;
		for(var i in value) {
			var name = value[i].name;
			var rfid = value[i].rfid;
			
			var rowNum = table.rows.length;
			var row = table.insertRow(rowNum);
			var nameCell = row.insertCell(0);
			var RFIDCell = row.insertCell(1);
			var allowCell = row.insertCell(2);
			var activeCell = row.insertCell(3);
			
			nameCell.id="name"+id;
			RFIDCell.id="rfid"+id;
			allowCell.id="allow"+id;
			activeCell.id="active"+id;
			
			nameCell.innerHTML = name
			RFIDCell.innerHTML = rfid;
			allowCell.innerHTML = createAllowListBtn(deviceArray);
			activeCell.innerHTML = "<button type='button' onclick='editUserBtn("+id+")'>Edit</button> <button type='button' onclick='deleteUserBtn("+id+")'>Delete</button>";
			id++;
		}
	});	
}

//Add Input for new user info
function addNewUserInfo() {
	if(clickNewUser) {
		var table = document.getElementById("user-table");
		var rowNum = table.rows.length;
		var row = table.insertRow(rowNum);
		var nameCell = row.insertCell(0);
		var RFIDCell = row.insertCell(1);
		var allowCell = row.insertCell(2);
		var activeCell = row.insertCell(3);
		
		var id = rowNum - 1;
		
		nameCell.id="name"+id;
		RFIDCell.id="rfid"+id;
		allowCell.id="allow"+id;
		activeCell.id="active"+id;
		
		nameCell.innerHTML = "<input type='text' id='input-name"+id+"' />";
		RFIDCell.innerHTML = "<input type='text' id='input-rfid"+id+"' />";
		allowCell.innerHTML = createAllowListBtn(deviceArray);
		activeCell.innerHTML = "<button type='button' onclick='saveNewUserBtn("+id+")'>Save</button> <button type='button' onclick='cancelUserBtn("+id+")'>Cancel</button>";
		clickNewUser = false;
	}
}

//Allow User to Check Out
function setAllowCheckOut() {
	getDeviceList().then(function(value) {
		for(var i=0; i < value.length; i++) {
			deviceArray.push(value[i].name);
		}
	});
	
}

function createAllowListBtn(deviceArray) {
	var btn = "<div class='col-lg-12'>"+
    	"<div class='button-group'>"+
    	"<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>Device List</button>" +
		"<ul class='dropdown-menu'>";
		
		for(var i=0; i < deviceArray.length; i++) {
			var device = deviceArray[i];
 			btn += "<li><a href='#' class='small' data-value='"+device+"' tabIndex='-1'><input type='checkbox'/>&nbsp;&nbsp;"+device+"</a></li>";
 		}
 		
		btn += "</ul>"+
		"</div></div>";
 		
	return btn;
}

//save new user info
function saveNewUserBtn(id) {
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
		var table = document.getElementById("user-table");
		var rowNum = table.rows.length - 2;
		table.rows[id+1].cells[0].innerHTML = name;
		table.rows[id+1].cells[1].innerHTML = rfid;
		table.riws[id+1].cells[2].innerHTML = "<button type='button' onclick='setAllowCheckOut("+id+")' >Device List</button>";
		table.rows[id+1].cells[3].innerHTML = "<button type='button' onclick='editUserBtn("+id+")'>Edit</button> <button type='button' onclick='deleteUserBtn("+id+")'>Delete</button>";
		addUser(name,rfid);  //add new user in firebase database
		clickNewUser = true;
	}
}

//cancel new user
function cancelUserBtn(id) {
	var newId = id+1;
	document.getElementById("user-table").deleteRow(newId);
	clickNewUser = true;
}

//delete an user
function deleteUserBtn(id) {
	var newId = id + 1;
	var table = document.getElementById("user-table");
	var rfid = table.rows[newId].cells[1].innerHTML;
	
	deleteUser(rfid);
	var rows = table.rows.length;
	
	for(var i=1; i < rows; i++) {
		document.getElementById("user-table").deleteRow(1);
	}
	
	getUsers();
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
	activeCell.innerHTML = "<button type='button' onclick='updateUserBtn("+id+")'>Save</button> <button type='button' onclick='cancelEditedUser("+id+")'>Cancel</button>";
}
 
//update user
function updateUserBtn(id) {
	console.log("id: "+ id);
	var user = document.getElementById("input-name"+id).value;
	var rfid = document.getElementById("input-rfid"+id).value;
	
	//Validation - Edit User input
	if((user == "" || user == null) && (rfid == "" || rfid == null)) {
		alert("Please enter user name and RFID #");
	} else if(user == "" || user == null) {
		alert("Please enter user name");
	} else if(rfid == "" || rfid == null) {
		alert("Please enter RFID #");
	} else {
		updateUser(editRFID,user,rfid);
		editRFID = rfid;
		var table = document.getElementById("user-table");
		var num = id+1;
 		table.rows[num].cells[0].innerHTML = user;
 		table.rows[num].cells[1].innerHTML = rfid;
 		table.rows[num].cells[2].innerHTML = "<button type='button' onclick='editUserBtn("+id+")'>Edit</button> <button type='button' onclick='deleteUserBtn("+id+")'>Delete</button>";
	}
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

function getDevices() {
    getDeviceList().then(function(value) {
    	var table = document.getElementById('device-table');
		for(var i=0; i < value.length; i++) {
			var rowNum = table.rows.length;
			var row = table.insertRow(rowNum);
			var deviceCell = row.insertCell(0);
			//var groupCell = row.insertCell(1);
			var activeCell = row.insertCell(1);
			
			deviceCell.id="device"+i;
			//groupCell.id="group"+i;
			activeCell.id="active"+i;
		
			deviceCell.innerHTML = value[i].name;
			//groupCell.innerHTML = "<button type='button' onclick='setAllowCheckOut()' >User List</button>";
			activeCell.innerHTML = "<button type='button' onclick='editDeviceBtn("+i+")'>Edit</button> <button type='button' onclick='deleteDeviceBtn("+i+")'>Delete</button>";

     	}
    }); 
}

//Add Input for new device info
function addNewDevice() {
	if(clickNewDevice) {
		var table = document.getElementById("device-table");
		var rowNum = table.rows.length;
		var row = table.insertRow(rowNum);
		var nameCell = row.insertCell(0);
		//var groupCell = row.insertCell(1);
		var activeCell = row.insertCell(1);
		
		var id = rowNum - 1;
		
		nameCell.id="device"+id;
		//groupCell.id="group"+id;
		activeCell.id="active"+id;
		
		nameCell.innerHTML = "<input type='text' id='input-device"+id+"' />";
		//groupCell.innerHTML = "<button type='button' onclick='setAllowCheckOut()' >User List</button>";
		activeCell.innerHTML = "<button type='button' onclick='saveNewDeviceBtn("+id+")'>Save</button><button type='button' onclick='cancelDeviceBtn("+id+")'>Cancel</button>";
		clickNewDevice = false;
	}
}



//save new device
function saveNewDeviceBtn(id) {
	var device = document.getElementById("input-device"+id).value;
	
	//Validation - New Device input
	if(device == "" || device == null) {
 		alert("Please enter device name");
 	} else {
 
 		var table = document.getElementById("device-table");
 		table.rows[id+1].cells[0].innerHTML = device;
 		table.rows[id+1].cells[1].innerHTML = "<button type='button' onclick='editDeviceBtn("+id+")'>Edit</button> <button type='button' onclick='deleteDeviceBtn("+id+")'>Delete</button>";
 		
 		//set new id and device then add them in the firebase
 		getDeviceList().then(function(value) {
 			var id = value.length;
 			addDevice(id, device);
 			clickNewDevice = true;
 		});
 	}
}

//cancel new device
function cancelDeviceBtn(id) {
	var newId = id+1;
	document.getElementById("device-table").deleteRow(newId);
	clickNewDevice = true;
}

//delete device
function deleteDeviceBtn(id) {
	//console.log(id);
	deleteDevice(id);
	var newId = id+1;
	document.getElementById("device-table").deleteRow(newId);
}

//edit device
function editDeviceBtn(id) {
	//console.log(id);
	var deviceCell = document.getElementById("device"+id);
	var activeCell = document.getElementById("active"+id);
	
	editDevice = deviceCell.innerHTML;
	
	deviceCell.innerHTML = "<input type='text' id='input-"+id+"' value='"+editDevice+"' />";
	activeCell.innerHTML = "<button type='button' onclick='updateDeviceBtn("+id+")'>Save</button> <button type='button' onclick='cancelEditedDevice("+id+")'>Cancel</button>";
}

//update device
function updateDeviceBtn(id) {
	console.log("update: "+id);
	var device = document.getElementById("input-"+id).value;
	
	//Validation - Edit Device input
	if(device == "" || device == null) {
 		alert("Please enter device name");
 	} else {
		updateDevice(id,device);
		
		var table = document.getElementById("device-table");
		var num = id+1;
 		table.rows[num].cells[0].innerHTML = device;
 		table.rows[num].cells[2].innerHTML = "<button type='button' onclick='editDeviceBtn("+id+")'>Edit</button> <button type='button' onclick='deleteDeviceBtn("+id+")'>Delete</button>";
	}
}

//cancel Edited device
function cancelEditedDevice(id) {
	var deviceCell = document.getElementById("device"+id);
	var activeCell = document.getElementById("active"+id);
	
	deviceCell.innerHTML = editDevice;
	activeCell.innerHTML = "<button type='button' onclick='editDeviceBtn("+id+")'>Edit</button> <button type='button' onclick='cancelDeviceBtn("+id+")'>Delete</button>";

	editDevice = "";
}


/***** ADMINS *****/
var clickNewAdmin= true;
var editAdmin = "";

//get user list
function getAdmins() {
 	getAdminList().then(function(value) {
		var table = document.getElementById("admin-table");
		var id = 0;
		for(var i in value) {
			var name = value[i].name;
			
			var rowNum = table.rows.length;
			var row = table.insertRow(rowNum);
			var adminCell = row.insertCell(0);
			var activeCell = row.insertCell(1);
			
			adminCell.id="admin"+id;
			activeCell.id="active"+id;
		
			adminCell.innerHTML = name;
			activeCell.innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='deleteAdminBtn("+id+")'>Delete</button>";
			id++;
		}
	});	
}

//Add Input for new Admin
function addNewAdmin() {
	if(clickNewAdmin) {
		var table = document.getElementById("admin-table");
		var rowNum = table.rows.length;
		var row = table.insertRow(rowNum);
		var adminCell = row.insertCell(0);
		var activeCell = row.insertCell(1);
		
		var id = rowNum - 1;
		
		adminCell.id="admin"+id;
		activeCell.id="active"+id;
		
		adminCell.innerHTML = "<input type='text' id='input-admin"+id+"' />";
		activeCell.innerHTML = "<button type='button' onclick='saveAdminBtn("+id+")'>Save</button> <button type='button' onclick='cancelAdminBtn("+id+")'>Cancel</button>";
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
 		var table = document.getElementById("admin-table");
 		table.rows[id+1].cells[0].innerHTML = admin;
 		table.rows[id+1].cells[1].innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='deleteAdminBtn("+id+")'>Delete</button>";
 		addAdmin(admin, "password", "admin"); //add new admin in fireabase database
 		clickNewAdmin = true;
 	}
}

//cancel new admin
function cancelAdminBtn(id) {
	var newId = id+1;
	var table = document.getElementById("admin-table").deleteRow(newId);
	clickNewAdmin = true;
}

//delete an admin
function deleteAdminBtn(id) {
	//document.getElementById("admin-table").deleteRow(id);
	
	var newId = id + 1;
	var table = document.getElementById("admin-table");
	var admin = table.rows[newId].cells[0].innerHTML;
	
	deleteAdmin(admin);
	
	var rows = table.rows.length;
	for(var i=1; i < rows; i++) {
		document.getElementById("admin-table").deleteRow(1);
	}
	
	getAdmins();
}

//edit an admin
function editAdminBtn(id) {
	var adminCell = document.getElementById("admin"+id);
	var activeCell = document.getElementById("active"+id);
	
	editAdmin = adminCell.innerHTML;
	
	adminCell.innerHTML = "<input type='text' id='input-admin"+id+"' value='"+editAdmin+"' />";
	activeCell.innerHTML = "<button type='button' onclick='saveAdminBtn("+id+")'>Save</button> <button type='button' onclick='cancelEditedAdmin("+id+")'>Cancel</button>";
}

//cancel Edited admin
function cancelEditedAdmin(id) {
	var adminCell = document.getElementById("admin"+id);
	var activeCell = document.getElementById("active"+id);
	
	adminCell.innerHTML = editAdmin;
	activeCell.innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='cancelAdminBtn("+id+")'>Delete</button>";

	editAdmin = "";
}

//update admin
function updateAdminBtn(id) {
	var admin = document.getElementById("input-admin"+id).value;
	
	//Validation - Edit User input
	if(admin == "" || admin == null) {
		alert("Please enter admin name");
	} else {
		updateAdmin(admin);
		var table = document.getElementById("admin-table");
		var num = id+1;
 		table.rows[num].cells[0].innerHTML = admin;
 		table.rows[num].cells[1].innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='deleteAdminBtn("+id+")'>Delete</button>";
	}
}

//cancel Edited Admin
function cancelEditedAdmin(id) {
	var adminCell = document.getElementById("admin"+id);
	var activeCell = document.getElementById("active"+id);
	
	adminCell.innerHTML = editAdmin;
	activeCell.innerHTML = "<button type='button' onclick='editAdminBtn("+id+")'>Edit</button> <button type='button' onclick='deleteAdminBtn("+id+")'>Delete</button>";

	editAdmin = "";
}