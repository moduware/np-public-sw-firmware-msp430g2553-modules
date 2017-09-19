window.nexpaqAPI.emulateMode = false;
window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {

	// Actions when back button clicked. The back button will be added automatically by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		window.nexpaqAPI.util.closeApplication();
	});
	//PotVal function is called when recieving new data
	window.nexpaqAPI.DevMod.addEventListener("onDataReceived", PotVal);
});

function PotVal() {
	// get potentiometer value
	var pot = window.nexpaqAPI.DevMod.last_data.potval;

	var AnalogVoltage0 = ((pot * 3.3) / 1023); //Voltage
	var AnalogVoltage = AnalogVoltage0.toFixed(2); //print only 2 decimals
	var ADCReading = pot; // ADC value

	document.getElementById("content").textContent = ADCReading;
	document.getElementById("content1").textContent = AnalogVoltage+"V";
}
