/*
 * t_my_app.c
 *
 * Author: Administrator
 */

#include <np_module_mdk_v2.h>
#include "RGBLedByPwm.h"
#include "t_my_app.h"
//Perform module's function
//Send/ receive command - use range from 0x2700 to 0x28ff
// **Suggested**
// odd number for command number
// even number for response command number

void RGB_LED (unsigned char*pData, unsigned char len) { //receive command for any RGB  color

	if (len == 3)
		setLedBrightness(pData[0],pData[1],pData[2]); //assign rgb values
	else {
		setLedBrightness(0x00,0x00,0x00);
		}

	// Feedback to Command 0x2701
	unsigned char response = 0x00;
	np_api_upload(0x2701, &response, 1);
}
