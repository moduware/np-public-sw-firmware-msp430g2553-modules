/*
 * t_my_app.c
 * Servo + Potentiometer
 * Author: Administrator
 */
#include <np_module_mdk_v1.h>
#include "t_my_app.h"
#include "NCN_GPIO.h"
//Perform module's function
//Receive command 2700
// **Suggested**
// odd number for command number
// even number for response command number
//Definition of function
void turnMotor (unsigned char*pData, unsigned char len) { // 0x2700 receive command to set positions
		//setting frequency to match what Servo is expecting
		analogFrequencySet(4,50);
		//Sending out a Wave with the position received from app, in pData[0].
		//Data originally from the Potentiometer.
		analogWrite(4, pData[0]);
	// Feedback for send Command 0x2701
	unsigned char response = 0x00;
	np_api_upload(0x2701, &response, 1);
}


