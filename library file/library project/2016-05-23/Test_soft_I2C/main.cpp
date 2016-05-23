/*
 * main.cpp
 *
 *  Created on: 2015-8-19
 *      Author: Administrator
 */
#include "soft_i2c.h"
#include "msp430.h"
unsigned char data[13] = {0};
int main(void) {
	WDTCTL = WDTPW + WDTHOLD;                 	// Stop WDT
	if (CALBC1_16MHZ == 0xFF)					// If calibration constant erased
	{
		while (1)
			;                             		// do not load, trap CPU!!
	}
	DCOCTL = 0;                          		// Select lowest DCOx and MODx settings
	BCSCTL1 = CALBC1_16MHZ;                    	// Set range
	DCOCTL = CALDCO_16MHZ;                     	// Set DCO step + modulation
	soft_I2C.begin(0x25,1,2);
	while(1) {
		//Soft IIC Pin of developer module is Pin2.6 and Pin2.7. Please reference SCH of developer module.
		//On the example ,we use the register"0x13".Developer can use other register, but the register must be readable and writeable.
		data[0] = soft_I2C.i2c_read(0x01);
		data[1] = soft_I2C.i2c_read(0x13);		//read the data of register"0x13"
		data[2] = 0x5C;
		soft_I2C.i2c_write(0x13,0x5C);			//write a new data(0x5C) to the register"0x13"
		data[3] = soft_I2C.i2c_read(0x13);		//Read the data of register"0x13".If the data[3] == 0x5c , IIC communication is success.

		_no_operation();
	}
}



