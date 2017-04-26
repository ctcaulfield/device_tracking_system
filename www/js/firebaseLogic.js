/*  Add this to your html page

    <script src="https://www.gstatic.com/firebasejs/3.7.6/firebase.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase-database.js"></script>
    <script src="firebaseLogic.js"></script>

*/

////(?parameterName=valueType) ? means it has a default and is not required

var setupDatabase,//()
    addUser,//(name=string, rfid=string, ?adminStatus=bool, ?devicesAllowed=[deviceIds])
    addDevice,//(deviceID=string, name=string, ?location=string)
    makeAdmin,//(rfid=string)
    addAllowedUsers,//(deviceId=string, users=[rfid=string])
    checkoutDevice,//(rfid=string, deviceId=string)
    checkinDevice,//(rfid=string, deviceId=string)
    getUserData,//(rfid=string) -> JSON object
    getDeviceData,//(deviceId=string) -> JSON object
    getAdminList;//() -> array
    
 

// Initialize Firebase
 var config = {
    apiKey: "AIzaSyDexPsXFL9SHqp08QJVrPwxVOMfp9X0EGE",
    authDomain: "hospitalrfid.firebaseapp.com",
    databaseURL: "https://hospitalrfid.firebaseio.com",
    projectId: "hospitalrfid",
    storageBucket: "hospitalrfid.appspot.com",
    messagingSenderId: "865633170027"
};
firebase.initializeApp(config);

var database = firebase.database();
//var auth = firebase.auth();

setupDatabase = function(){ 
    // Test for the existence of certain keys within a DataSnapshot
    var ref = database.ref();
    
    ref.once('value').then(function(snapshot) {
        if(!snapshot.exists()){
           database.ref().set({
                users: {},
                devices: {},
                admins: []
            }); 
        }
      });
};

addUser = function(name, rfid, adminStatus=false, devicesAllowed=[]){
    //name=string, rfid=string, adminStatus=bool, devicesAllowed=[deviceIds]    
    var success = database.ref('users/' + rfid).set({
        name: name,
        rfid: rfid,
        admin: adminStatus,
        hasDevices: [],
        devicesAllowed: devicesAllowed
    });
    if(success){
            console.log("Added user: " + name);
    }else{
            console.log("Error: Could not add user: " + name);
    }
};

addDevice = function(deviceId, name, location=""){
    //deviceID=string, name=string, location=string    
    var success = database.ref('devices/' + deviceId).set({
        name: name,
        deviceId: deviceId,
        usersHas: [],
        usersAllowed: []
    });
    if(success){
            console.log("Added device: " + name);
    }else{
            console.log("Error: Could not add device: " + name);
    }

};

makeAdmin = function(rfid){
    //rfid=string
    var success = database.ref('users/' + rfid).transaction(function(currData){
       currData.admin = true; 
    });
};

addAllowedUsers = function(deviceId, users){
    //deviceId=string, users=[rfid=string]
    
    var success = database.ref('devices/'+deviceId).transaction(function(currData){
        currData.usersAllowed.forEach(function(index, userRfid){
            if(!currData.usersAllowed[userRfid]){
                currData.usersAllowed.push(userRfid);
                database.ref('users/'+userRfid).transaction(function(currData2){
                    currData2.devicesAllowed.push(deviceId);
                });
            }                       
        });
    });
    if(success){
            console.log("Successfully added user " + rfid + " to " + deviceId );
    }else{
            console.log("Error: Could not add user " + rfid + " to " + deviceId);
    }
};

checkoutDevice = function(rfid, deviceId){
    //rfid=string, deviceId=string
    
    var success = database.ref('users/'+rfid).transaction(function(currData) {
        if(currData.devicesAllowed[deviceId] && !currData.hasDevices[deviceId]){
            currData.hasDevices.push(deviceId);
            
            database.ref('devices/' +deviceId).transaction(function(currData2){
                currData2.usersHas.push(rfid);
            });
        }
    });

    if(success){
            console.log("Successfully signed out device " + deviceId + " to " + rfid);
    }else{
            console.log("Error: Could not sign out device " + deviceId + " to " + rfid);
    }
};

checkinDevice = function(rfid, deviceId){
    //rfid=string, deviceId=string
    
    var success = database.ref('users/'+rfid).transaction(function(currData) {
        if(currData.hasDevices[deviceId]){
            var index = currData.hasDevices.indexOf(deviceId);
            currData.hasDevices.splice(index, 1);
            
            database.ref('devices/' +deviceId).transaction(function(currData2){
                var index2 = currData2.usersHas.indexOf(rfid);
                currData2.usersHas.splice(index2, 1);
            });
        }
    });

    if(success){
            console.log("Successfully signed in device " + deviceId + " from " + rfid);
    }else{
            console.log("Error: Could not sign in device " + deviceId + " from " + rfid);
    }
};

getUserData = function(rfid){
    //rfid=string
    //returns JSON object
    var userData;
    var success = database.ref('users/' + rfid).once('value').then(function(snapshot){
        userData = snapshot.val();
    });
    if(success){
        console.log("Got info for user: " + userData.name);
        return userData;
    }else{
        console.log("Error: Could not get info for user: " + rfid);
        return {};
    }
 };

getDeviceData = function(deviceId){
    //deviceId=string
    //returns JSON object
    var deviceData;
    var success = database.ref('devices/' + deviceId).once('value').then(function(snapshot){
        deviceData = snapshot.val();
    });
    if(success){
        console.log("Got info for device: " + deviceData.name);
        return deviceData;
    }else{
        console.log("Error: Could not get info for device: " + deviceId);
        return {};
    }
};

getAdminList = function(){
    //returns array
    var adminList;
    var success = database.ref('admins').once('value').then(function(snapshot){
        adminList = snapshot.val();
    });
    if(success){
        console.log("Got admin list");
        return deviceData;
    }else{
        console.log("Error: Could not get admin list");
        return [];
    }
 };