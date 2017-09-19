/*
 * I2C.cpp
 *
 *  Created on: 2015-7-23
 *      Author: Administrator
 */
#include "I2C.h"
#include "msp430.h"
#include "NCN_GPIO.h"

static unsigned char TxByteCtr,RxByteCtr;
static unsigned char TxBuf[16];
static unsigned char RxBuf[16];
static unsigned char stop_flag = 1;

I2C_class I2C;
inline void I2C_class::I2C_WriteMode(void){
	UCB0CTL1 |= UCTR;       //USCI_BO control 1(offset 069h)   |=   (0x10)Transmit/Receive Select/Flag
	IFG2 &=~ UCB0TXIFG;		//SFR interrupt flag 2(SFR_8BIT)(003h)    &=~    (0x08)USCI_B0 transmit interrupt flag(rw-1)
	IE2 &=~ UCB0RXIE;		//Interrupt Enable 2(SFR_8BIT)(001h)   &=~    (0x04)USCI_B0 receive interrupt enable(rw-0)
	IE2 |= UCB0TXIE;		//Interrupt Enable 2(SFR_8BIT)(001h)   |=    (0x08)USCI_B0 transmit interrupt enable(rw-0)
}
inline void I2C_class::I2C_ReadMode(void){
	UCB0CTL1 &=~ UCTR;
	IFG2 &=~ UCB0RXIFG;
	IE2 &=~ UCB0TXIE;
	IE2 |= UCB0RXIE;                                // 关闭发送中断，开启接收中断
}
void I2C_class::begin(void){
	P1SEL |= BIT6 + BIT7;                     // Assign I2C pins to USCI_B0
	P1SEL2|= BIT6 + BIT7;                     // Assign I2C pins to USCI_B0
	UCB0CTL1 |= UCSWRST;                      // Enable SW reset  ---  USCI B0 Control Register 1  |=  (0x01)USCI Software Reset
	UCB0CTL0 = UCMST + UCMODE_3 + UCSYNC;     // I2C Master, synchronous mode
	UCB0CTL1 = UCSSEL_2 + UCSWRST;            // Use SMCLK, keep SW reset
	UCB0BR0 = 80;                             // fSCL = SMCLK/12 = ~100kHz (bit rate control 0 -- Baud Rate 0)(06Ah)
	UCB0BR1 = 0;							  // (bit rate control 1 -- Baud Rate 1)(06Bh)
	UCB0CTL1 &= ~UCSWRST;                     // Clear SW reset, resume operation
}
void I2C_class::begin(unsigned char slave_address){
	P1SEL |= BIT6 + BIT7;                 		 // Assign I2C pins to USCI_B0
	P1SEL2|= BIT6 + BIT7;                 		 // Assign I2C pins to USCI_B0
	UCB0CTL1 |= UCSWRST;                  		 // Enable SW reset
	UCB0CTL0 = UCMST + UCMODE_3 + UCSYNC;	     // I2C Master, synchronous mode
	UCB0CTL1 = UCSSEL_2 + UCSWRST;       	     // Use SMCLK, keep SW reset
	UCB0BR0 = 80;                        	     // fSCL = SMCLK/12 = ~100kHz
	UCB0BR1 = 0;
	UCB0I2CSA = slave_address;
	UCB0CTL1 &= ~UCSWRST;                	     // Clear SW reset, resume operation
}
void I2C_class::change_Slave(unsigned char add){
	UCB0I2CSA = add;							 //USCI B0 I2C Slave Address (SFR_16BIT)
}
void I2C_class::I2C_Tx(unsigned char Reg,unsigned char data[],unsigned char len){
	unsigned char i = 0;
	while(UCB0STAT & UCBBUSY);				 	 //USCI B0 Status Register(SFR_8BIT)  &  (0x10)Bus Busy Flag
	I2C_WriteMode();
	TxBuf[len]=Reg;
	for(i = 0;i < len;i ++){
		TxBuf[len-1-i] = data[i];
	}
	TxByteCtr=len+1;                       		 // Load TX byte counter
	UCB0CTL1 |= UCTR + UCTXSTT;                  // I2C TX, start condition - - -Transmit/Receive Select/Flag + Transmit START
	__bis_SR_register(CPUOFF + GIE);         	 // Enter LPM0 enable interrupts
	while (UCB0CTL1 & UCTXSTP);					 //USCI B0 Control Register 1  &  (I2C)Transmit STOP
}
void I2C_class::I2C_Rx(unsigned char Reg,unsigned char data[],unsigned char len){
	unsigned char i = 0;
	I2C_WriteMode();							 // Mode to write command
	TxBuf[0]=Reg;								 // Address will be read
	TxByteCtr=1;								 // Load TX byte counter
	while (UCB0CTL1 & UCTXSTP);					 //USCI B0 Control Register 1  &  (I2C)Transmit STOP
	UCB0CTL1 |= UCTR + UCTXSTT ;    			 // I2C TX, start condition
	__bis_SR_register(CPUOFF + GIE);     		 // Enter LPM0, enable interrupts

	while (UCB0CTL1 & UCTXSTP);					 // Wait for stop bit,generated after send finish
	I2C_ReadMode();								 // Mode to read data
	UCB0CTL1 |= UCTXSTT;						 // Start bit
	while(UCB0CTL1 & UCTXSTT);
	if(len == 1){								 // Set stop register before the last byte is sent
		UCB0CTL1 |= UCTXSTP;
	}
	RxByteCtr = len;							 // Load RX byte counter
	__bis_SR_register(CPUOFF + GIE);			 // Enter LPM0, enable interrupts
	while (IFG2 & UCB0RXIFG);					 // Receive finish  ----  Interrupt Flag 2    &  USCI_B0 receive interrupt flag
	while (UCB0CTL1 & UCTXSTP);					 // Receive the stop bit
	for(i = 0;i < len;i++){						 // Read the data from the buffer and transpose bytes
		data[len-1-i] = RxBuf[i];
	}
}

#pragma vector = USCIAB0TX_VECTOR
__interrupt void USCIAB0TX_ISR(void)
{
	if ( IFG2 & UCB0TXIFG )							// Interrupt Flag 2  &  USCI_B0 transmit interrupt flag
	{
		if (TxByteCtr)                            	// Check TX byte counter
		{
			TxByteCtr--; 							// Decrement TX byte counter
			UCB0TXBUF =TxBuf[TxByteCtr];     		// Load TX buffer  --- USCI B0 Transmit Buffer
		}
		else
		{
			if(stop_flag == 1){
				UCB0CTL1 |= UCTXSTP;       			// Generate I2C stop condition
			}
			IFG2 &= ~UCB0TXIFG;                     // Clear USCI_B0 TX int flag  -----   Interrupt Flag 2  &= ~USCI_B0 transmit interrupt flag
			IE2 &=~UCB0TXIE;						// Interrupt Enable 2  &=~  USCI_B0 transmit interrupt enable
			__bic_SR_register_on_exit(CPUOFF);      // Exit LPM0
		}
	}
	if ( IFG2 & UCB0RXIFG )							//  Interrupt Flag 2  &  USCI_B0 receive interrupt flag
    {

		  RxByteCtr--;                              // Decrement RX byte counter
		  if (RxByteCtr)							// Check RX byte counter
		  {
			  RxBuf[RxByteCtr] = UCB0RXBUF; 		// Move RX data (USCI B0 Receive Buffer) to address PRxData
			  if (RxByteCtr == 1){              	// Only one byte left?
				  UCB0CTL1 |= UCTXSTP;          	// Generate I2C stop condition
			  }
		  }
		  else
		  {
			  RxBuf[RxByteCtr] = UCB0RXBUF;    		// Move final RX data to PRxData
			  __bic_SR_register_on_exit(CPUOFF);  	// Exit LPM0
		  }
    }
}
