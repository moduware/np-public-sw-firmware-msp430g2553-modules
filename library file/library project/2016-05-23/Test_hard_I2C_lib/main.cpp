/*
 * main.cpp
 *
 *  Created on: 2015-7-23
 *      Author: Administrator
 */
#include "I2C.h"
#include "msp430.h"
unsigned char data[13] = {0};
void main(void) {
	WDTCTL = WDTPW + WDTHOLD;                 	// Stop WDT
	if (CALBC1_16MHZ == 0xFF)					// If calibration constant erased
			{
		while (1)
			;                             		// do not load, trap CPU!!
	}
	DCOCTL = 0;                          		// Select lowest DCOx and MODx settings
	BCSCTL1 = CALBC1_16MHZ;                    	// Set range
	DCOCTL = CALDCO_16MHZ;                     	// Set DCO step + modulation
	I2C.begin(0x25);
	while(1) {
		//Hard IIC Pin of developer module is Pin1.6 and Pin1.7. Please reference the data sheet of MSP and SCH of developer module.
		//On the example ,we use the register"0x13".Developer can use other register, but the register must be readable and writeable.
		I2C.I2C_Rx(0x01,&data[0],1);
		I2C.I2C_Rx(0x13,&data[1],1);		//read the data of register"0x13"
		data[2] = 0x5C;
		I2C.I2C_Tx(0X13,&data[2],1);		//write a new data(0x5C) to the register"0x13"
		I2C.I2C_Rx(0x13,&data[3],1);		//Read the data of register"0x13".If the data == 0x5c , iic communication is ok.
		_no_operation();
	}
}


