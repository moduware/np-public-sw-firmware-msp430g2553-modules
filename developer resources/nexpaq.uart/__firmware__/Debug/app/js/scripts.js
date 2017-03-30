window.nexpaqAPI.emulateMode = false;
window.nexpaqAPI.setCurrentModule('MSP');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {

	// Module actions
	// Actions when turn OFF
	document.getElementById('get_pot_val').addEventListener('click', function(e) {
		potVal();
	});
	// Actions when back button clicked. The back button will be added automatically by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		window.nexpaqAPI.util.closeApplication();
	});
});


//Turn off LED RGB
function potVal() {

	window.nexpaqAPI.MSP.send("00", [1]); //send 2700, arg 0

	var pot0 = parseInt(window.nexpaqAPI.MSP.last_data.first); // potentiometer's value is send in 2 byte

	if (pot0 == 0){
		var pot1 = 0};
	if (pot0 == 1){
		var pot1 = 256};
	if (pot0 == 2){
		var pot1 = 512};
	if (pot0 == 3){
		var pot1 = 768};

	var pot2 = parseInt(window.nexpaqAPI.MSP.last_data.second);

	var potTotal = pot1+pot2;

	var ADCReading = ((potTotal * 3.3) / 1023); // ADC value
	var AnalogVoltage = potTotal; // volts value

	document.getElementById("content").textContent = AnalogVoltage;
	document.getElementById("content1").textContent = ADCReading+"V";
};
