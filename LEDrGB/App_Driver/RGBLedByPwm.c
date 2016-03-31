/*
 * RGBLedByPwm.c
 *
 *  Created on: 2016-3-18
 *      Author: Administrator
 */
#include "NCN_GPIO.h"
#include "RGBLedByPwm.h"
#include "msp430.h"
struct LedValue ledNode = {0,0,0};
unsigned char redPIN = 0;
unsigned char greenPIN = 0;
unsigned char bluePIN = 0;
void LedPinInitial(unsigned char redPin,unsigned char greenPin,unsigned char bluePin) {
	redPIN = redPin;
	greenPIN = greenPin;
	bluePIN = bluePin;
	pinMode(redPin,OUTPUT);
	pinMode(greenPin,OUTPUT);
	pinMode(bluePin,OUTPUT);
	digitalWrite(redPin,HIGH);
	digitalWrite(greenPin,HIGH);
	digitalWrite(bluePin,HIGH);
}
void DRIVER_Timera1_init(void) {
	TA1CCR0 	= 1000;//625;
	TA1CTL 		= TASSEL_2 + MC_1 + TACLR;		// SMCLK, upMode, clearTAR
	TA1CCTL0 	= CCIE;
}
void setLedBrightness(unsigned char redValue,unsigned char greenValue,unsigned char blueValue) {
	ledNode.RedBright = redValue;
	ledNode.GreenBright = greenValue;
	ledNode.BlueBright = blueValue;
}
// Timer A0 interrupt service routine
unsigned char timercount = 0;
#pragma vector=TIMER1_A0_VECTOR
__interrupt void Timer1_A0 (void)
{
	timercount++;
	if (timercount == 0) {
		if (ledNode.RedBright != 0) {
			digitalWrite(redPIN, LOW);
		}
		if (ledNode.GreenBright != 0) {
			digitalWrite(greenPIN, LOW);
		}
		if (ledNode.BlueBright != 0) {
			digitalWrite(bluePIN, LOW);
		}
	}
	if (ledNode.RedBright == timercount) {
		digitalWrite(redPIN, HIGH);
	}
	if (ledNode.GreenBright == timercount) {
		digitalWrite(greenPIN, HIGH);
	}
	if (ledNode.BlueBright == timercount) {
		digitalWrite(bluePIN, HIGH);
	}
}
