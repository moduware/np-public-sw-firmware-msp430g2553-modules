window.nexpaqAPI.emulateMode = false;
window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {
	// Actions when turn OFF
	document.getElementById('cm').addEventListener('click', function(e) {
		cm();
	});
	document.getElementById('inch').addEventListener('click', function(e) {
		inch();
	});
	// Actions when back button clicked. The back button will be added automatically by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		window.nexpaqAPI.util.closeApplication();
	});
	//DistanceVal function is called when recieving new data
	window.nexpaqAPI.DevMod.addEventListener("onDataReceived", DistanceVal);
	// Module actions
});

var units = 58;
var units_n = "cm";

//Start measurements
function cm() {
	units = 58;
	units_n = "cm";
};
function inch() {
	units = 148;
	units_n = "inch";
};
function DistanceVal() {
	var DistanceReading0 = window.nexpaqAPI.DevMod.last_data.Distance;

	var DistanceConv = (DistanceReading0/units);
	var DistanceValue = DistanceConv.toFixed(2); //print only 2 decimals

	if (116 <= DistanceReading0 && DistanceReading0 <= 23200){
		document.getElementById("Distance").textContent = DistanceValue + " " + units_n;
	}	else {
		document.getElementById("Distance").textContent = "OUT OF RANGE";
	}
};
/**
 * * Functions:
 * * * Upstream
 * receive: last_data.x -- get array element. x name given at parse file
 * * * Downstream:
 *send: set the comand parameter (from 00 to FF) and pData argument (from 0 to 255)
 *
 */
