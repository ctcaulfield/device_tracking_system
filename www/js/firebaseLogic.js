/*  Add this to your html page

    <script src="https://www.gstatic.com/firebasejs/3.7.6/firebase.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase-database.js"></script>
    <script src="firebaseLogic.js"></script>
    
    get data like this:
    
    getUserData(rfid).then(function(value){
        // value is the user data
    });

*/

////(?parameterName=valueType) ? means it has a default and is not required

var setupDatabase,//()
    addUser,//(name=string, rfid=string) -> promise
    addDevice,//(deviceID=string, name=string, ?location=string) -> promise
    addAllowedUsers,//(deviceId=string, rfid=string) -> promise
    checkoutDevice,//(rfid=string, deviceId=string) -> promise
    checkinDevice,//(rfid=string, deviceId=string) -> promise
    getUserData,//(rfid=string) -> promise resolves to JSON object
    getDeviceData,//(deviceId=string) -> promise resolves to JSON object
    getAdminList;//() -> promise resolves to JSON object
    
 

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

addUser = function(name, rfid){
    //name=string, rfid=string, devicesAllowed=[deviceIds]
    
    var promise = database.ref('users/' + rfid).transaction(function(currData){
        if(currData){
            return currData;
        }else{
            return{ 
                name: name,
                rfid: rfid,
             };
        }
       
    });
    promise.then(function(){
        if(promise){
            console.log("Added user: " + name);
        }else{
            console.log("Error: Could not add user: " + name);
        }
    });
};

addDevice = function(deviceId, name, location=""){
    //deviceID=string, name=string, location=string    
    var promise = database.ref('devices/' + deviceId).transaction(function(currData){
         if(currData){
            return currData;
        }else{
            return{ 
                name: name,
                deviceId: deviceId,
                usersHas: [],
                usersAllowed: []
            };
        }
    });
    promise.then(function(){
        if(promise){
            console.log("Added device: " + name);
        }else{
            console.log("Error: Could not add device: " + name);
        }
    });

};

addAllowedUser = function(deviceId, rfid){
    //deviceId=string, rfid=string
    
    var promise = database.ref('devices/'+deviceId).transaction(function(currData){
        database.ref('users/'+rfid).transaction(function(currData2){
            var alreadyHasDevice = false;
            if(currData2.devicesAllowed){
                currData2.devicesAllowed.forEach(function(item, index){
                    if (item === deviceId){
                        alreadyHasDevice = true;
                        return;
                    }
                });
                if(!alreadyHasDevice){
                    currData2.devicesAllowed.push(deviceId);
                }
            }else{
                currData2.devicesAllowed = [deviceId]
            }
            return currData2;
        });

        var alreadyHasUser = false;
        if(currData.usersAllowed){
            currData.usersAllowed.forEach(function(item, index){
                if (item === rfid){
                    alreadyHasUser = true;
                    return;
                }
            });
            if(!alreadyHasUser){
                currData.usersAllowed.push(rfid);
                
            }
        }else{
            currData.usersAllowed = [rfid];
        }
        return currData;

    });
    promise.then(function(){
        if(promise){
            console.log("Successfully added user " + rfid + " to " + deviceId );
        }else{
            console.log("Error: Could not add user " + rfid + " to " + deviceId);
        }
    });
};

checkoutDevice = function(rfid, deviceId){
    //rfid=string, deviceId=string
    
    var promise = database.ref('users/'+rfid).once('value', function(snapshot) {
        
        if(snapshot.exists()){
            if(snapshot.val().hasDevices){
                var hasDevices = snapshot.val().hasDevices;
                var alreadyHasDevice =false;
                hasDevices.forEach(function(item, index){
                    if (item === deviceId){
                        alreadyHasDevice = true;
                        return;
                    }
                });
                if(!alreadyHasDevice){
                    
                    hasDevices.push(deviceId);
                    console.log(hasDevices);
                    database.ref('users/'+rfid).update({hasDevices: hasDevices});
                }
               
            }else{
                database.ref('users/'+rfid).update({hasDevices: [deviceId]});
            }
            database.ref('devices/' +deviceId).once('value', function(snapshot2){
                if(snapshot2.exists()){
                    if(snapshot2.val().usersHas){
                        var usersHas = snapshot2.val().usersHas;
                        var userAlreadyHas =false;
                        usersHas.forEach(function(item, index){
                            if (item === rfid){
                                userAlreadyHas = true;
                                return;
                            }
                        });
                        if(!userAlreadyHas){

                            usersHas.push(rfid);
                            console.log(usersHas);
                            database.ref('devices/' +deviceId).update({usersHas: usersHas});
                        }
         
                    }else{
                        database.ref('devices/' +deviceId).update({usersHas: [rfid]});
                    }
                }
            });
                
        }
    });
    promise.then(function(){
        if(promise){
            console.log("Successfully signed out device " + deviceId + " to " + rfid);
        }else{
            console.log("Error: Could not sign out device " + deviceId + " to " + rfid);
        }
    });
    return promise;
};

checkinDevice = function(rfid, deviceId){
    //rfid=string, deviceId=string
    var promise = database.ref('users/'+rfid).once('value', function(snapshot) {
       if(snapshot.exists()){
           if (snapshot.val().hasDevices.length<2){
               var array = [];
           }else{
                var index = snapshot.val().hasDevices.indexOf(deviceId.toString());
                console.log("index of device to checkin" + index);
                console.log(snapshot.val().hasDevices.splice(index, 1));
                var array = snapshot.val().hasDevices;//.hasDevices.splice(index, 1);
               delete array[index];
               console.log(array);
           }
           
            database.ref('users/'+rfid).update({hasDevices: array});

            database.ref('devices/' +deviceId).once('value', function(snapshot2){
                if(snapshot2.val().usersHas.length <2){
                    var array2 = [];
                }else{
                    var index2 = snapshot2.val().usersHas.indexOf(rfid);
                    var array2 = snapshot2.val().usersHas;//.usersHas.splice(index2, 1);
                    delete array2[index2];
                }
                
               database.ref('devices/' +deviceId).update({usersHas:array2});
            });
     
        }
    });
    promise.then(function(){
        if(promise){
            console.log("Successfully signed in device " + deviceId + " from " + rfid);
        }else{
            console.log("Error: Could not sign in device " + deviceId + " from " + rfid);
        }
    });
    return promise;
};

getUserData = function(rfid){
    //rfid=string
    //returns promise that resolves to JSON object
    
    var promise = database.ref('users/' + rfid).once('value').then(function(snapshot){
        if(snapshot.exists()){
            var userData = snapshot.val();
            return Promise.resolve(userData);
        }
        return Promise.resolve({});
    });
    promise.then(function(value){
        if(promise){
            console.log("Got info for user: " + value.name);
        }else{
            console.log("Error: Could not get info for user: " + rfid);
        }
    });
    return promise;
 };

getDeviceData = function(deviceId){
    //deviceId=string
    //returns JSON object
    var promise = database.ref('devices/' + deviceId).once('value').then(function(snapshot){
        var deviceData = snapshot.val();
        return Promise.resolve(deviceData);
    });
    promise.then(function(value){
        if(promise){
            console.log("Got info for device: " + value.name);
        }else{
            console.log("Error: Could not get info for device: " + deviceId);
        }
    });
    return promise;
};

getAdminList = function(){
    //returns array
    var promise = database.ref('admins').once('value').then(function(snapshot){
        var adminList = snapshot.val();
        return Promise.resolve(adminList);
    });
    promise.then(function(){
        if(promise){
            console.log("Got admin list");
        }else{
            console.log("Error: Could not get admin list");
        }
    });
    return promise;
 };