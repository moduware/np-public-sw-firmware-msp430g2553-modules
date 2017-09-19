window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {
	//PotVal function is called when recieving new data
	window.nexpaqAPI.DevMod.addEventListener("onDataReceived", PotVal);
});

function PotVal() {
	// get potentiometer value
	var pot = window.nexpaqAPI.DevMod.last_data.potval;
	var AnalogVoltage0 = ((pot * 3.3) / 1023); //Voltage
	var AnalogVoltage = AnalogVoltage0.toFixed(2); //formatted to print only 2 decimals
	var ADCReading = pot; // ADC value
	//Servo only has 11 positions so we need to divide 1023 into 11 different sections.
	//When the voltage is from 0-93, we have position 1, 94-186, position2 and so on.
	//adc = 13 for position 1 because 13% duty cycle in PWM wave is all the way to the left,
	//3% being all the way to the right.
	var adc = pot;
	if(adc <= 93){
		adc = 13;
	}else if (adc <= 186) {
		adc = 12;
	}else if(adc <= 279) {
		adc = 11;
	}else if(adc <= 372) {
		adc = 10;
	}else if(adc <= 465) {
		adc = 9;
	}else if (adc <= 558) {
		adc = 8;
	}else if (adc <= 651) {
		adc = 7;
	}else if (adc <= 744) {
		adc = 6;
	}else if (adc <= 837) {
		adc = 5;
	}else if (adc <= 930) {
		adc = 4;
	}else {
		adc = 3;
	}
	//Sending position to developer module
	window.nexpaqAPI.DevMod.send("turnMotor",[adc]);
	//Reformatting to look neat and understandable to the user. 1 referring to left position on SERVO, 11 referring to the right.
	adc = adc * -1 + 14;
	//Update values in app
	document.getElementById("content").textContent = ADCReading;
	document.getElementById("content1").textContent = AnalogVoltage+"V";
	document.getElementById("content2").textContent = "Position: "+ adc;
}
