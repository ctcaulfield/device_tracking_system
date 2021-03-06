// var options = [];

$( '.dropdown-menu a' ).on( 'click', function( event ) {
   var $target = $( event.currentTarget ),
       val = $target.attr( 'data-value' ),
       $inp = $target.find( 'input' ),
       idx;

   if ( ( idx = options.indexOf( val ) ) > -1 ) {
      options.splice( idx, 1 );
      setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
   } else {
      options.push( val );
      setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
   }

   $( event.target ).blur();
      
   console.log( options );
   return false;
});

function checkBoxEvent(event,data) {
	var args = data.split("-");
	var rfid = args[0];
	var deviceId = args[1];
	
	if(event.checked) {
		addAllowedUser(deviceId,rfid);
	} else {
		removeAllowedUser(deviceId,rfid);
	}
}