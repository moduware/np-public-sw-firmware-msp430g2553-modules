/*
 * tmain.cpp
 *
 *
 *  Created on: 2015-12-15
 *      Author: coody
 */
#include "np_module_mdk_v1.h"
#include "t_my_app.h"

// Developer using command range from 0x2700 to 0x27ff
// **This is a suggestion from us**
// odd number for command number
// even number for response command number
const MDK_REGISTER_CMD my_cmd_func_table[4] = {
		{0x2700, my_function_CMD_2700},		// Command -> function
		{0x2702, my_function_CMD_2702},		//
		{0x2704, my_function_CMD_2704},
		{0x2706, my_function_CMD_2706},
};


void np_api_setup() {
	// Developer's Codes
	np_api_set_app_version(0, 4, 2);
//	np_api_set_post_address(0x41);
	// Once your Command number out of the range 0x2700 - 0x27ff, then you got FAILD
	if ( np_api_register((MDK_REGISTER_CMD*)my_cmd_func_table, 4) == MDK_REGISTER_FAILD ) {
		// Register failed handle code
		delay(1);
	}
	// After you run this, the np_api_loop() will just run once
//	np_api_pm_automode_set();

//	si2c.begin(0x12);
}
void np_api_loop() {
	// Developer's Codes
	// If got delay here. Do NOT kill the while loop inside the MDK.
	// 0x2800 is the common CMD code for
	//
	// ** If you going into the auto power save mode, the loop will just run once and if you want to
	// run one more time just call "np_api_run_loop_once();"
	// Or you want to keep running, then using "np_api_pm_automode_clear()" to exit the auto power save
	// mode **
//	np_api_upload(0x2800, (unsigned char*)"I am sensor value!", 18);

	delay(10);
}

void np_api_start() {
	// Developer's Codes
	// Get your module function start to work
}
void np_api_stop() {
	// Developer's Codes
	// Stop your module function
}

void my_function_CMD_2700(unsigned char*pData, unsigned char len) {
	// Feedback to Command 0x2700
	unsigned char response = 0x00;
	np_api_upload(0x2701, &response, 1);
}
void my_function_CMD_2702(unsigned char*pData, unsigned char len) {
	// Feedback to Command 0x2702
	unsigned char response = 0x00;
	np_api_upload(0x2703, &response, 1);
}
void my_function_CMD_2704(unsigned char*pData, unsigned char len) {
	// Feedback to Command 0x2704
	unsigned char response = 0x00;
	np_api_upload(0x2705, &response, 1);
}
void my_function_CMD_2706(unsigned char*pData, unsigned char len) {
	// Feedback to Command 0x2706
	unsigned char response = 0x00;
	np_api_upload(0x2707, &response, 1);
}
