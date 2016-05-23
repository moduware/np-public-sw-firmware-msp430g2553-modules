/*
 * main.cpp
 *
 *  Created on: 2015-7-4
 *      Author: Jake
 */
#include "msp430.h"
#include "soft_uart_cpp.h"
unsigned char len_float = 0;
int main(void) {
		unsigned char buf[5] = {0x00,0x01,0x02,0x03,0x04};
	   WDTCTL = WDTPW + WDTHOLD;               // Stop watchdog timer
	    if (CALBC1_16MHZ==0xFF)					// If calibration constant erased
	    {
	      while(1);                               // do not load, trap CPU!!
	    }
	    DCOCTL = 0;                             // Select lowest DCOx and MODx settings
	    BCSCTL1 = CALBC1_16MHZ;                  // Set DCOCLK to 1MHz
	    DCOCTL = CALDCO_16MHZ;
	    serial.begin(9600,SERIAL_8N1,11,10);
	    serial.write(buf,5);
	    serial.write("123456");
	    serial.println('N');
	    serial.println("this is string");
	    serial.println(-7894);
	    len_float = sizeof(float);
	    for (;;)
	    {
//		    serial.println(78,BIN);
//		    serial.println(78,OCT);
//		    serial.println(78,DEC);
//		    serial.println(78,HEX);
//	    	serial.write("123456");

//	        // Wait for incoming character
	        __bis_SR_register(LPM0_bits);
	        // Echo received character
	        while(serial.available()) {
	        	serial.write(serial.read());
	        }
	    }
}



