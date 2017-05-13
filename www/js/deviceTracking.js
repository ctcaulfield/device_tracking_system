var Bleacon = require('bleacon');

var uuid = "2B44B5A65B024AC987AE69E426A37F7B".toLowerCase();

var major = 1;
var minor = 1;

var beacons = [];

/////Other ways to scan for 'bleacons'
//Bleacon.startScanning();//scans for any "bleacons"
//Bleacon.startScanning(uuid, major);//uuid + major
//Bleacon.startScanning(uuid, major, minor);//uuid + major + minor

//////we're using this one
Bleacon.startScanning(); //scans for a particular id

Bleacon.on('discover', function(bleacon){
    //get index of this bleacon
    var index = beacons.map(function(e){return e.uuid}).indexOf(bleacon.uuid);
    //get the json for this bleacon
    var beaconJSON = JSON.parse(JSON.stringify(bleacon));
    
    if (index == -1){
        beacons.push(beaconJSON);
        console.log(bleacon);
    }
    //get it again because it was now pushed to the array
    index = beacons.map(function(e){return e.uuid}).indexOf(bleacon.uuid);
    if( beacons[index].accuracy != bleacon.accuracy){
        console.log(bleacon);
        beacons[index] = beaconJSON;
        console.log(bleacon.accuracy * 3.28084);
        console.log(bleacon.proximity);
    }
});