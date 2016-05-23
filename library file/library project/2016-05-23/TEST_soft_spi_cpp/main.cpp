#include <msp430.h>
#include "soft_spi.h"
/*
 * main.c
 * version:	v0_0_1
 * 			1.Add new function for soft SPI.
 * 			v0_0_2
 * 			1.Add new function for changing the SPI pins.
 */
void delay (void) {
	unsigned char i = 250;
	unsigned char j = 100;
	while(j--)
		while(i--);
}
unsigned char spi_test[7] = {0x00};
unsigned char transfer(unsigned char dat);
int main(void) {
    WDTCTL = WDTPW | WDTHOLD;	// Stop watchdog timer
                               // PWM Period...S B N O.1

    if (CALBC1_16MHZ==0xFF)					// If calibration constant erased
    {
      while(1);                               // do not load, trap CPU!!
    }
    DCOCTL = 0;                             // Select lowest DCOx and MODx settings
    BCSCTL1 = CALBC1_16MHZ;                 // Set DCOCLK to 1MHz
    DCOCTL = CALDCO_16MHZ;
//    P2DIR |= 0xFF;
    SPI.setSpeed(1000000);
//    SPI.test_pins();
    SPI.setBitOrder(0x00);
    SPI.setDataMode(0x01);
    SPI.setFisrtBit(LSBFIRST);
    SPI.begin();
    _no_operation();
    while(1){
    	//We name our code is SPI_Me, and other one SPI code is SPI_Other.
    	//You can select the CCS example project about SPI as the SPI_Other.
    	//follow is that SPI_Me transfer data(0x00 0x11 0x22¡£¡£¡£ 0x 99) to SPI_Other.So SPI_Me will get the data from SPI_Other.

    	__delay_cycles(1); 		spi_test[0] = SPI.transfer(0x00);
    	__delay_cycles(1);    	spi_test[1] = SPI.transfer(0x11);
    	__delay_cycles(1);    	spi_test[2] = SPI.transfer(0x22);
    	__delay_cycles(1);    	spi_test[3] = SPI.transfer(0x33);
    	__delay_cycles(1);    	spi_test[4] = SPI.transfer(0x77);
    	__delay_cycles(1);    	spi_test[5] = SPI.transfer(0x88);
    	__delay_cycles(1);    	spi_test[6] = SPI.transfer(0x99);
    	//Here, you can check the data of spi_test[], make sure that the SPI communication is success or not.
    	__delay_cycles(1);    	_no_operation();
    	spi_test[6] = spi_test[5] = spi_test[4] = spi_test[3] = spi_test[2] = spi_test[1] = spi_test[0] = 0x00;
    }
}


