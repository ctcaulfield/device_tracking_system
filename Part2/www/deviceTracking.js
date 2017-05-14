var Bleacon = require('bleacon');
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hospitalrfid.firebaseio.com"
});

var database = admin.database();
database.ref().once('value').then(function(snap){
	console.log(snap.val());
});

//var auth = firebase.auth();
var uuid = "2B44B5A65B024AC987AE69E426A37F7B".toLowerCase();

var hereBeacons = ["none"];
var prevBeacons = [];
var thisInterval;


//////we're using this one
Bleacon.startScanning(uuid); //scans for a particular id

Bleacon.on('discover', function(bleacon){

	
	if (hereBeacons.indexOf(bleacon.major) == -1){
		//this is a beacon that just entered the room
		setDeviceLocation(bleacon.major, "Room 1");
		if(hereBeacons[0] == "none"){
			hereBeacons = [bleacon.major];
		}else{
			hereBeacons.push(bleacon.major);
		}
		setDeviceLocation(bleacon.major, "Room 1");
		if(hereBeacons.length == 1){
			thisInterval = setInterval(function(){
				addToPrevBeacons(-1);
				console.log(hereBeacons);
				console.log(prevBeacons);
			}, 2000);
		}else{
			clearInterval(thisInterval);
		}
		
    }
	
	addToPrevBeacons(bleacon.major);
	
	console.log(hereBeacons);
	console.log(prevBeacons);
	

});

function addToPrevBeacons(item){
	prevBeacons.push(item);

	if(prevBeacons.length >10){
		prevBeacons.splice(0,prevBeacons.length-10);
	}
	
	for(var i in hereBeacons){
		if(prevBeacons.indexOf(hereBeacons[i]) == -1){
			//this beacon has left the room
			console.log("Beacon "+hereBeacons[i]+" has left the room");
			setDeviceLocation(hereBeacons[i], "Unknown");
			if(hereBeacons.length == 2){
				thisInterval = setInterval(function(){
					addToPrevBeacons(-1);
					console.log(hereBeacons);
					console.log(prevBeacons);
				}, 2000);
			}
			if(hereBeacons.length > 1){
				hereBeacons.splice(i, 1);
			}else{
				clearInterval(thisInterval);
				hereBeacons = ["none"];
				console.log(hereBeacons);
			}
			
			
		}
	}
}

function setDeviceLocation(deviceId, location){
	database.ref('devices/'+deviceId).once('value', function(snap){
		console.log(snap.val());
	});
	database.ref('devices/'+deviceId).update({location:location});
}