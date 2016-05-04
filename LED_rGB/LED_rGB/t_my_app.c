/*
 * t_my_app.c
 *
 * Author: Administrator
 */
#include <np_module_mdk_v2.h>
#include "RGBLedByPwm.h"
#include "t_my_app.h"
//Perform module's function
//command - use range from 0x2700 to 0x27ff
// **Suggested**
// odd number for command number
// even number for response command number

void Primary_colors (unsigned char*pData, unsigned char len) { // 0x2700 receive command to set primary colors + white
	if (len == 1){
		if (pData[0]==1) //assign red
			setLedBrightness(255,0,0);

		else if (pData[0]==2){ //assign green
			setLedBrightness(0,255,0);}

		else if (pData[0]==3){ //assign blue
			setLedBrightness(0,0,255);}

		else if (pData[0]==4){ //assign white
			setLedBrightness(255,255,255);}

		else { //turn off
			setLedBrightness(0,0,0);}
	// Feedback for send Command 0x2701
	unsigned char response = 0x00;
	np_api_upload(0x2701, &response, 1);
	}
}

void RGB_LED (unsigned char*pData, unsigned char len) { //0x2702 receive command for any RGB  color
//set RGB colors
	if (len == 3){
		if(pData[0] == pData[1] && pData[1] == pData[2] && pData[2]== pData[3] && pData[3] == 0) //turn off LED
			setLedBrightness(0,0,0);
		else
			setLedBrightness(pData[0],pData[1],pData[2]);
	}
	//Feedback for send Command 0x2703
	unsigned char response = 0x00;
	np_api_upload(0x2703, &response, 1); //
}
