/*
 * tmain.cpp
 * LEDrGB
 */
//libraries
#include <np_module_mdk_v1.h>
#include "t_my_app.h"
#include "NCN_GPIO.h"
#include "RGBLedByPwm.h"

#define RED		0 //assign red to pin 0
#define GREEN 	1 //assign red to pin 1
#define BLUE	2 //assign red to pin 2
#define length	2 //funtion's length

// RECEIVE command - use range from 0x2700 to 0x27ff
//**Suggested**
//odd number for command number
//even number for response command number
//define function's command code at t_my_app.c

const MDK_REGISTER_CMD my_cmd_func_table[length] = { //Specify table's length according to number of commands used
		{0x2700, Primary_colors},		// Function's command
		{0x2702, RGB_LED}
};

void np_api_setup() {
	// Libraries, divers and PIN initialization
	//np_api_set_app_version(x, x, x); -- optional

	// If the command number is out of the range 0x2700 - 0x27ff, a FAIL message is displayed
	// Handle the fail event here!
	if ( np_api_register((MDK_REGISTER_CMD*)my_cmd_func_table, length) == MDK_REGISTER_FAIL ) { //communication check
		delay(1);
	}
	//Initialization for LED pins and PWM software timer
	LedPinInitial(RED,GREEN,BLUE);
	DRIVER_Timera1_init();

	// After setting this command, np_api_loop() will run just once for save energy.
	np_api_pm_automode_set();
}

void np_api_loop() {
	// This loop will run continuously while the MCU is not in sleep mode or has a stop condition

	/*SEND command -- use 0x2800
	*np_api_upload(0x2800, (unsigned char*)"I am sensor value!", 18)
	*
	*np_api_pm_automode_set(void) -- power save mode
	**In auto power save mode, the loop runs once
	*to run it one more time call "np_api_run_loop_once();"
	*To exit auto power save mode call "np_api_pm_automode_clear()"
	*delay(10);
	*/

	np_api_run_loop_once();
}

void np_api_start() {
	//Start module's function
}

void np_api_stop() {
	// Stop module's function
}
