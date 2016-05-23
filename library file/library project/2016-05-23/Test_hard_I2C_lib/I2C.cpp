/*
 * I2C.cpp
 *
 *  Created on: 2015-7-23
 *      Author: Administrator
 */
#include "I2C.h"
#include "msp430.h"
static unsigned char TxByteCtr,RxByteCtr;
static unsigned char TxBuf[16];
static unsigned char RxBuf[16];
static unsigned char stop_flag = 1;
I2C_class I2C;
inline void I2C_class::I2C_WriteMode(void){
	UCB0CTL1 |= UCTR;		//Transmitter
	IFG2 &=~ UCB0TXIFG;		//Clear the interrupt flag
	IE2 &=~ UCB0RXIE;		//Clear the Rx interrupt enable
	IE2 |= UCB0TXIE;		//Set the Tx interrupt enable
}
inline void I2C_class::I2C_ReadMode(void){
	UCB0CTL1 &=~ UCTR;		//Receiver
	IFG2 &=~ UCB0RXIFG;		//Clear the interrupt flag
	IE2 &=~ UCB0TXIE;		//Clear the Tx interrupt enable
	IE2 |= UCB0RXIE;        //Set the Rx interrupt enable
}

//initial the hard IIC
void I2C_class::begin(void){
	P1SEL |= BIT6 + BIT7;                     // P1.6:SCL  P1.7:SDA
	P1SEL2|= BIT6 + BIT7;                     // Assign I2C pins to USCI_B0
	UCB0CTL1 |= UCSWRST;                      // Enable SW reset
	UCB0CTL0 = UCMST + UCMODE_3 + UCSYNC;     // I2C Master, synchronous mode
	UCB0CTL1 = UCSSEL_2 + UCSWRST;            // Use SMCLK, keep SW reset
	UCB0BR0 = 80;
	UCB0BR1 = 0;							  // fScl = SMCLK / ((UCB0BR1 << 8) + UCB0BR0) = 16M / 0x0080 = 125Khz
	UCB0CTL1 &= ~UCSWRST;                     // Clear SW reset, resume operation
}
void I2C_class::begin(unsigned char slave_address){
	begin();
	UCB0I2CSA = slave_address;
}
void I2C_class::change_Slave(unsigned char add){
	UCB0I2CSA = add;
}
void I2C_class::I2C_Tx(unsigned char Reg,unsigned char data[],unsigned char len){
	unsigned char i = 0;
	while(UCB0STAT & UCBBUSY);			// Wait for bus free
	I2C_WriteMode();					// Set to the sent mode
	TxBuf[len]=Reg;						// Load the register address
	for(i = 0;i < len;i ++){
		TxBuf[len-1-i] = data[i];
	}									// Load the data
	TxByteCtr=len+1;                    // Load TX byte counter
	UCB0CTL1 |= UCTR + UCTXSTT;         // I2C TX, start condition
	__bis_SR_register(CPUOFF + GIE);    // Enter LPM0 w/ interrupts
	while (UCB0CTL1 & UCTXSTP);			// Wait for the stop bit sent out
}
void I2C_class::I2C_Rx(unsigned char Reg,unsigned char data[],unsigned char len){
	unsigned char i = 0;
	while(UCB0STAT & UCBBUSY);			// Wait for bus free
	I2C_WriteMode();					// Mode to write command
	TxBuf[0]=Reg;						// Register address will be read
	TxByteCtr=1;						// Load TX byte counter
	stop_flag = 0;						// When sent the data in the Receive mode,do not need the STOP Bit
	UCB0CTL1 |= UCTR + UCTXSTT ;    	// I2C TX, start condition
	__bis_SR_register(CPUOFF + GIE);    // Enter LPM0, enable interrupts
	stop_flag = 1;						// Reset the stop_flag
	I2C_ReadMode();						// Mode to read data
	UCB0CTL1 |= UCTXSTT;				// Start bit
	while(UCB0CTL1 & UCTXSTT);			// Wait the start bit sent out
	if(len == 1){
		UCB0CTL1 |= UCTXSTP;			// Set stop register before the last byte is sent
	}
	RxByteCtr = len;					// Load RX byte counter
	__bis_SR_register(CPUOFF + GIE);	// Enter LPM0, enable interrupts
	while (UCB0CTL1 & UCTXSTP);			// Receive the stop bit
	for(i = 0;i < len;i++){
		data[len-1-i] = RxBuf[i];		// Read the data from the buffer and transpose bytes
	}
}

#pragma vector = USCIAB0TX_VECTOR
__interrupt void USCIAB0TX_ISR(void)
{
	if ( IFG2 & UCB0TXIFG ) {
		if (TxByteCtr) {                           	// Check TX byte counter
			TxByteCtr--;
			UCB0TXBUF =TxBuf[TxByteCtr];     		// Load TX buffer                               // Decrement TX byte counter
		}
		else {
			if(stop_flag == 1){
				UCB0CTL1 |= UCTXSTP;       			// I2C stop condition
			}
			IFG2 &= ~UCB0TXIFG;                     // Clear USCI_B0 TX int flag
			IE2 &=~UCB0TXIE;						// Sent finish,clear the TxIE
			__bic_SR_register_on_exit(CPUOFF);      // Exit LPM0
		}
	}
	if ( IFG2 & UCB0RXIFG ) {
		  RxByteCtr--;                              // Decrement RX byte counter
		  if (RxByteCtr) {
			  RxBuf[RxByteCtr] = UCB0RXBUF; 		// Move RX data to address PRxData
			  if (RxByteCtr == 1){
				  // The UCTXSTP need to be set before the last byte is receive.
				  // If there is only one byte to receive,the UCTXSTP will be set in the Rx function,after the UCTXSTT is sent out.
				  // If not,the UCTXSTP need to be set after the second last byte is received.
				  UCB0CTL1 |= UCTXSTP;
			  }
		  }
		  else {
			  RxBuf[RxByteCtr] = UCB0RXBUF;    		// Move final RX data to PRxData
			  __bic_SR_register_on_exit(CPUOFF);  	// Exit LPM0
		  }
    }
}
