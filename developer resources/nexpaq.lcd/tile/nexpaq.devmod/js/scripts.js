window.nexpaqAPI.emulateMode = false;
window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {

	// Actions when back button clicked. The back button will be added automatically by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		window.nexpaqAPI.util.closeApplication();
	});

	// Module actions
});

function LCD(){
	var text_1 = document.getElementById('content_1').value;		//read text into content_1 from index.html
	var text_2 = document.getElementById('content_2').value;
	var String_length_1 = text_1.length;												//save text_1 length
	var String_length_2 = text_2.length;
	var send_1 = [];																					//define send_1 as array
	var send_2 = [];

//convert characters to ASCII integers and put into send_x array
	for (var i=0; i<String_length_1 ;i++){
		send_1.push(text_1.charCodeAt(i));
 	}
	for (var j=0; j<String_length_2 ;j++){
		send_2.push(text_2.charCodeAt(j));
	}
	if(String_length_1 == 0){
		send_1[0] = 32;
	}
	if(String_length_2 == 0){
		send_2[0] = 32;
	}
//send data to firmware
window.nexpaqAPI.DevMod.send("text_1", send_1);
window.nexpaqAPI.DevMod.send("text_2", send_2);

//show in console
// console.log("Text_1:", text_1);
// console.log("Length_1:", String_length_1);
// console.log("ASCII_1:", send_1);
// console.log("Text_2:", text_2);
// console.log("Length_2:", String_length_2);
// console.log("ASCII_2:", send_2);
}
/**
 * * Functions:
 * * * Upstream
 * receive: last_data.x -- get array element. x name given at parse file
 * * * Downstream:
 *send: set the comand parameter (from 00 to FF) and pData argument (from 0 to 255)
 *
 */
