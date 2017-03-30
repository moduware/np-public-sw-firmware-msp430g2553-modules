/*
 * tmain.cpp
 */
//libraries
#include <np_module_mdk_v1.h>
#include "NCN_GPIO.h"
#include "t_my_app.h"
#include "soft_uart_cpp.h"

#define PIN0	0

extern unsigned char On_Off_button;
unsigned char buf[1] = {0};

// RECEIVE command - use range from 0x2700 to 0x27ff
//**Suggested**
//odd number for command number
//even number for response command number
//define function's command code at t_my_app.c

const MDK_REGISTER_CMD my_cmd_func_table[1] = { //Specify table's length according to number of commands used
		{0x2700, ON_OFF_button}		// Function's command
};

void np_api_setup() {
	// Libraries, divers and PIN initialization
	//np_api_set_app_version(x, x, x); -- optional
	if ( np_api_register((MDK_REGISTER_CMD*)my_cmd_func_table, 1) == MDK_REGISTER_FAIL ) { //communication check
			delay(1);
		}

	pinMode(PIN0,OUTPUT);

	// If the command number is out of the range 0x2700 - 0x27ff, a FAIL message is displayed
	// Handle the fail event here!

	serial.begin(115200,SERIAL_8N1);

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

	buf[0] = On_Off_button;

	serial.write(buf,1);

	int x = 0;

	x = serial.read();

	if (x == 5){
		digitalWrite(PIN0,HIGH);
		delay(500);
		digitalWrite(PIN0,LOW);
		delay(500);
	}
	delay(10);

}

void np_api_start() {
	//Start module's function
}

void np_api_stop() {
	// Stop module's function
}
