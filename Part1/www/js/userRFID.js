var accessToken = "d21f86f278c11b6a2e0cc79ff4e03823d803d319";
        var particle = new Particle();

        var allowedTableData;
        var allowedTable;

        var hasOutTableData;
        var hasOutTable;

        var rfid;

        google.charts.load('current', {'packages':['table']});
        google.charts.setOnLoadCallback(setup);

        window.onload = function(){
             particle.getEventStream({ name: 'ValidIDFound', auth: accessToken}).then(function(stream) {
              stream.on('event', callback);
            });
        };


        function setup() {
          
//            setupDatabase();
//            addDevice(0, "Computer1");
//            addDevice(1, "Computer2");
//            addDevice(2, "Computer3");
//            addDevice(3, "Computer4");
//            addUser("Jasmine", "00007B1F7E1A");
//            addAllowedUser(0, "00007B1F7E1A");
//            addAllowedUser(1, "00007B1F7E1A");
//            addAllowedUser(2, "00007B1F7E1A");
//            addAllowedUser(3, "00007B1F7E1A");
            
            
             
            
            allowedTableData = new google.visualization.DataTable();
            allowedTableData.addColumn('string', 'ID'); 
            allowedTableData.addColumn('string', 'Item');
            allowedTable = new google.visualization.Table(document.getElementById('allowedTable_div'));

            hasOutTableData = new google.visualization.DataTable();
            hasOutTableData.addColumn('string', 'ID'); 
            hasOutTableData.addColumn('string', 'Item');
            hasOutTable = new google.visualization.Table(document.getElementById('hasOutTable_div'));

            drawTable();
            //Get all events
            
        }

        function callback(data){
            console.log('in callback');
            rfid = data.data;
            document.getElementById("id_label").innerHTML = rfid;
            getUserData(rfid).then(function(value){
                console.log(value);
                document.getElementById("welcome_h1").innerHTML = "Welcome " + value.name + "!";
                
                allowedTableData.removeRows(0, allowedTableData.getNumberOfRows());
                hasOutTableData.removeRows(0, hasOutTableData.getNumberOfRows());
                if(value.devicesAllowed){
                    value.devicesAllowed.forEach(function(item,index){
                       getDeviceData(item).then(function(value2){
                           console.log(value2);
                           var hasThisDevice = false;
                           if(value2.usersHas){
                               value2.usersHas.forEach(function(item, index){
                                   if (item === rfid){
                                       hasThisDevice = true;
                                       return;
                                   }
                               });
                           }                           
                           if(!hasThisDevice){
                               allowedTableData.addRow([value2.deviceId.toString(), value2.name]);
                               drawTable(); 
                           }
                           
                       }); 
                    });
                }
                if(value.hasDevices){
                    console.log("value.hasDevices");
                    console.log(value["hasDevices"]);
                    value.hasDevices.forEach(function(item,index){
                        console.log("item in hasOut:"+item);
                        console.log("index in hasOut:"+index);
                       getDeviceData(item).then(function(value2){
                           hasOutTableData.addRow([value2.deviceId.toString(), value2.name]);
                           drawTable();
                       });                    
                    });
                }
                
            });
                      
            
        }

        function drawTable(){

            allowedTable.draw(allowedTableData, {showRowNumber: false, width: '200px', height: '100%'});
            hasOutTable.draw(hasOutTableData, {showRowNumber: false, width: '200px', height: '100%'});
        }


        function checkoutItem(){
            console.log("checkout item");
            if(rfid && allowedTable.getSelection().length>0){
                var index = allowedTable.getSelection();
                var deviceId = allowedTableData.getValue(index[0].row, 0);
                checkoutDevice(rfid, deviceId).then(function(){
                    callback({data:rfid});
                });
                
            }
        }

        function returnItem(){
            console.log("return item");
            if(rfid && hasOutTable.getSelection().length>0){
                var index = hasOutTable.getSelection();
                var deviceId = hasOutTableData.getValue(index[0].row, 0);
                checkinDevice(rfid, deviceId).then(function(){
                    callback({data:rfid});
                });
                
            }
        }
        
        function signout(){
            document.getElementById("id_label").innerHTML = "ID # HERE";
            document.getElementById("welcome_h1").innerHTML = "Welcome, please scan your RFID card.";
                
            allowedTableData.removeRows(0, allowedTableData.getNumberOfRows());
            hasOutTableData.removeRows(0, hasOutTableData.getNumberOfRows());
            drawTable();
        }