/*
 * 2016-03
 * tmain.cpp
 */
#include <np_module_mdk_v2.h>
#include "t_my_app.h"
#include "NCN_GPIO.h"
#include "RGBLedByPwm.h"

#define RED		0 //assign red to pin 0
#define GREEN 	1 //assign red to pin 1
#define BLUE	2 //assign red to pin 2
#define length	2 // funtion's length, if 2 command are used, then length = 2

//unsigned char i ,j ,k ; //parameter for set brightness by firmware

// MSP_to_app commands - use range from 0x2700 to 0x27ff
// **Suggested**
// odd number for command number
// even number for response command number
// define the functions' structure in t_my_app.c
// app_to_MSP command - 0x2800

const MDK_REGISTER_CMD my_cmd_func_table[length] = {
		{0x2700, Primary_colors},		// Command -> function
		{0x2702, RGB_LED}
};

void np_api_setup() {
	// If the command number is out of the range 0x2700 - 0x27ff, a FAIL message is displayed
	// Handle the fail event here!
	if ( np_api_register((MDK_REGISTER_CMD*)my_cmd_func_table, length) == MDK_REGISTER_FAIL ) {
		delay(1);
	}
	//Initialization for LED pins and PWM software timer
	LedPinInitial(RED,GREEN,BLUE);
	DRIVER_Timera1_init();

	// The code runs once after setting this command
	//void np_api_loop() just run once when using automode power save (np_api_pm_automode_set)
	np_api_pm_automode_set();
}
void np_api_loop() {
	/* This loop will run continuously while the MCU is not in sleep mode or has a stop condition
	example: np_api_upload(0x2800, (unsigned char*)"I am sensor value!", 18);

	**In auto power save mode, the loop runs once
	 to run it one more time call "np_api_run_loop_once();"

	 To exit auto power save mode call "np_api_pm_automode_clear()"
	delay(10);
	*/
//	 Set LED RGB by firmware, not using the app
//	setLedBrightness(i,j,k);
/*
		if(i++ == 0xFF){
			if(j++ == 0xFF){
				k++;
				}
		}
		__delay_cycles(1600);
*/
// if LED want to be used just by firmware, comment code bellow
		np_api_run_loop_once(); //every time set automode mode we need loop_once to make the loop run again
}

void np_api_start() {
	//Start module's function

}
void np_api_stop() {
	// Stop module's function

}
