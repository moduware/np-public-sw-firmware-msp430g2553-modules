/*
 * tmain.cpp
 * SHT20
 */
//libraries
#include <np_module_mdk_v1.h>
#include "NCN_GPIO.h"
#include "I2C.h"

unsigned char SHT20_address = {0x40};	//Set address for sensor
unsigned char Trigger_T_HM = {0xE3};	//Set address for temperature measurement
unsigned char Trigger_RH_HM = {0xE5};	//Set address for humidity measurement
//unsigned char soft_reset = {0xFE};	//Set address for reset

unsigned char SHT20_T[3] = {0};			// array to receive temperature data from SHT20
unsigned char SHT20_H[3] = {0};			// array to receive humidity data from SHT20
unsigned char data_send[4] = {0};		// array to send data to app

// RECEIVE command - use range from 0x2700 to 0x27ff
//**Suggested**
//odd number for command number
//even number for response command number
//define function's command code at t_my_app.c

void np_api_setup() {
	// Libraries, divers and PIN initialization
	//np_api_set_app_version(x, x, x); -- optional

	// If the command number is out of the range 0x2700 - 0x27ff, a FAIL message is displayed
	// Handle the fail event here!

	I2C.begin(SHT20_address);	// Specify the slave's address
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


	//Temperature measurement
	I2C.I2C_Rx(Trigger_T_HM,SHT20_T, 3);		// I2C command to receive data from slave

	//Humidity measurement
	I2C.I2C_Rx(Trigger_RH_HM,SHT20_H, 3);		// I2C command to receive data from slave

	//Build the array to send to app
	data_send[0] = SHT20_T[0];
	data_send[1] = SHT20_T[1]&0xFC;				// Take 6 first bits on the second element
	data_send[2] = SHT20_H[0];
	data_send[3] = SHT20_H[1]&0xFC;				// Take 6 first bits on the second element

	//send temperature and humidity values to app
	np_api_upload(0x2800, data_send , 4);
	delay(3000);
	
}

void np_api_start() {
	//Start module's function
}

void np_api_stop() {
	// Stop module's function
}
