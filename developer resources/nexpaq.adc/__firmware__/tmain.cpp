/*
 * tmain.cpp
 * ADC VALUE
 *
 */
//libraries
#include <np_module_mdk_v1.h>
#include "NCN_GPIO.h"

#define POT	0 //assign POT to pin 0

// RECEIVE command - use range from 0x2700 to 0x27ff
//**Suggested**
//odd number for command number
//even number for response command number
//define function's command code at t_my_app.c

void np_api_setup() {
	// Libraries, divers and PIN initialization
	//np_api_set_app_version(x, x, x); -- optional

	pinMode(POT, INPUT); //PIN initialization

	// If the command number is out of the range 0x2700 - 0x27ff, a FAIL message is displayed
	// Handle the fail event here!
}

void np_api_loop() {
	// This loop will run continuously while the MCU is not in sleep mode or has a stop condition

	/*SEND command -- use 0x2800
	*np_api_upload(0x2800, "I am sensor value!", 2) -- sensor value is unsigned char
	*
	*np_api_pm_automode_set(void) -- power save mode
	**In auto power save mode, the loop runs once
	*to run it one more time call "np_api_run_loop_once();"
	*To exit auto power save mode call "np_api_pm_automode_clear()"
	*delay(10);
	*/

	unsigned char send_pot_value[2]; //Define 2 element length array (8 Bit each element)
	unsigned int pot_value;

	pot_value = analogRead(POT);	 //Read input

	//Divide ADC (10 Bit input) value in 2 element array
	send_pot_value[0] = (pot_value>>8)&0xff;
	send_pot_value[1] = pot_value&0xff;

	np_api_upload(0x2800,send_pot_value,2); //send potentiometer's value to app

	delay(500);
}

void np_api_start() {
	//Start module's function
}

void np_api_stop() {
	// Stop module's function
}
