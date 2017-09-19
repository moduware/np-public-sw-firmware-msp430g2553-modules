window.nexpaqAPI.emulateMode = false;
window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {

	document.getElementById('celsius').addEventListener('click', function(e) {
		celsius();
	});
	document.getElementById('fahrenheit').addEventListener('click', function(e) {
		fahrenheit();
	});
	// Actions when back button clicked. The back button will be added automatically by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		window.nexpaqAPI.util.closeApplication();
	});
	//SHT20val function is called when recieving new data
	window.nexpaqAPI.DevMod.addEventListener("onDataReceived", SHT20val);
	// Module actions
});

var number1 = 1;
var number2 = 1;
var units = "ºC";

//Start measurements
function celsius() {
	number1 = 1;
	number2 = 1;
	units = "ºC";
};
function fahrenheit() {
	number1 = 9/5;
	number2 = 32;
	units = "ºF";
};
function SHT20val() {
	// get SHT20 value
	var temperature_receive = window.nexpaqAPI.DevMod.last_data.Temperature;
	var humidity_receive = window.nexpaqAPI.DevMod.last_data.Humidity;

	var temperature0 = (((((175.75*temperature_receive)/65536)-46.85)*number1)+number2);
	var temperature = temperature0.toFixed(2);
	var humidity0 = (((125*humidity_receive)/65536)-6);
	var humidity = humidity0.toFixed(2);

	document.getElementById("temperature").textContent = temperature+units;
	document.getElementById("humidity").textContent = humidity+"%";

}
/**
 * * Functions:
 * * * Upstream
 * receive: last_data.x -- get array element. x name given at parse file
 * * * Downstream:
 *send: set the comand parameter (from 00 to FF) and pData argument (from 0 to 255)
 *
 */
