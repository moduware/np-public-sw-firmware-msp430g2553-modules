window.nexpaqAPI.emulateMode = false;
window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {

	document.getElementById('on').addEventListener('click', function(e) {
		turnOn();
	});
	document.getElementById('off').addEventListener('click', function(e) {
		turnOff();
	});
	// Actions when back button clicked. The back button will be added automatically by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		window.nexpaqAPI.util.closeApplication();
	});

	// Module actions
});
function turnOn() {
	window.nexpaqAPI.DevMod.send("00", [1]); //send 2700, arg 0
};
function turnOff() {
	window.nexpaqAPI.DevMod.send("00", [0]); //send 2700, arg 0
};
/**
 * * Functions:
 * * * Upstream
 * receive: last_data.x -- get array element. x name given at parse file
 * * * Downstream:
 *send: set the comand parameter (from 00 to FF) and pData argument (from 0 to 255)
 *
 */
