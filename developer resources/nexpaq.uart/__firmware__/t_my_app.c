/*
 * t_my_app.c
 * UART
 */

#include <np_module_mdk_v1.h>
#include "t_my_app.h"
#include "NCN_GPIO.h"

//Perform module's function
//Receive command - use range from 0x2700 to 0x27ff
// **Suggested**
// odd number for command number
// even number for response command number

unsigned char On_Off_button = {0x00};


void ON_OFF_button (unsigned char*pData, unsigned char len) {

	On_Off_button = pData[0];

	// Feedback to Command 0x2700
		unsigned char response = 0x00;
		np_api_upload(0x2701, &response, 1);

}
