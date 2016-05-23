/*
 * soft_spi.cpp
 *
 *  Created on: 2015-7-8
 *      Author: Jake
 * 		version:	v0_0_1
 * 					1.Add new function for soft SPI.
 * 					v0_0_2
 * 					1.Add new function for changing the SPI pins.
 */
#include "soft_spi.h"
#include "msp430.h"
#include "pin_map.h"
spi_class SPI;
#define _miso_output_()		do{*NCN_pin[Pmiso].dir |= NCN_pin[Pmiso].bit;}while(0)
#define _miso_high_()		do{*NCN_pin[Pmiso].out |= NCN_pin[Pmiso].bit;}while(0)
#define _miso_low_()		do{*NCN_pin[Pmiso].out &=~NCN_pin[Pmiso].bit;}while(0)
#define _miso_input_()		do{*NCN_pin[Pmiso].dir &=~NCN_pin[Pmiso].bit;}while(0)
#define _miso_value_()		(*NCN_pin[Pmiso].in & NCN_pin[Pmiso].bit)

#define _mosi_output_()		do{*NCN_pin[Pmosi].dir |= NCN_pin[Pmosi].bit;}while(0)
#define _mosi_high_()		do{*NCN_pin[Pmosi].out |= NCN_pin[Pmosi].bit;}while(0)
#define _mosi_low_()		do{*NCN_pin[Pmosi].out &=~NCN_pin[Pmosi].bit;}while(0)

#define _clk_output_()		do{*NCN_pin[Pclk].dir |= NCN_pin[Pclk].bit;}while(0)
#define _clk_high_()		do{*NCN_pin[Pclk].out |= NCN_pin[Pclk].bit;}while(0)
#define _clk_low_()			do{*NCN_pin[Pclk].out &=~NCN_pin[Pclk].bit;}while(0)

#define _cs_output_()		do{*NCN_pin[Pcs].dir |= NCN_pin[Pcs].bit;}while(0)
#define _cs_high_()			do{*NCN_pin[Pcs].out |= NCN_pin[Pcs].bit;}while(0)
#define _cs_low_()			do{*NCN_pin[Pcs].out &=~NCN_pin[Pcs].bit;}while(0)

unsigned char (spi_class::*Timer_A0_function)(void);
spi_class::spi_class(void) {
	speed = 80;
	cpol = 0;
	cpha = 0;
	sent = 0;
	receive = 0;
	Pmosi = 11;
	Pmiso = 10;
	Pclk = 12;
	Pcs = 13;
	firstBit = MSBFIRST;
}
void spi_class::SPIsettings(long speedMaximum, unsigned char dataOrder,
		unsigned char dataMode,unsigned char firstBit) {
	speed = SMCLOCK / (speedMaximum * 2);
	if (dataOrder == 0x00 || dataOrder == 0x01)
		cpol = dataOrder;
	if (dataMode == 0x00 || dataMode == 0x01)
		cpha = dataMode;
	this->firstBit = firstBit;

}

void spi_class::begin(void) {
	TA0CCR0 = speed;							//511=======32us
	TA0CTL = TASSEL_2 + MC_1 + TACLR;		// ACLK, up mode
	_cs_output_();
	_clk_output_();
	_mosi_output_();
	_cs_low_();
	if(cpol)
		_clk_high_();
	else
		_clk_low_();
	_mosi_low_();
	_miso_input_();
//	P2DIR &=~MISO;
	Timer_A0_function =  &spi_class::Timer_A0_func_00;
}
void spi_class::begin(unsigned char Pmiso,unsigned char Pmosi,unsigned char Pclk,unsigned char Pcs) {
	this->Pmiso = Pmiso;
	this->Pmosi = Pmosi;
	this->Pclk = Pclk;
	this->Pcs = Pcs;
	begin();
}
void spi_class::end(void) {

}
void spi_class::setSpeed(long speedMaximum) {
	speed = SMCLOCK / (speedMaximum * 2);
}
void spi_class::setBitOrder(unsigned char order) {
	if (order == 0x00 || order == 0x01)
		cpol = order;
}
void spi_class::setDataMode(unsigned char mode) {
	if (mode == 0x00 || mode == 0x01)
		cpha = mode;
}
void spi_class::setFisrtBit(unsigned char firstBit){
	if(firstBit == MSBFIRST || firstBit == LSBFIRST)
		this->firstBit = firstBit;
}
unsigned char spi_class::transfer(unsigned char val) {
	sent = val;
	receive = 0;
	_cs_high_();
	TA0CCTL0 = CCIE;
	__bis_SR_register(GIE + LPM0_bits);	//enter sleep, and waiting transfer finishing.
	return receive;
}
inline unsigned char spi_class::Timer_A0_func_00(void) {
	static unsigned char spi_time = 17;
	if ((spi_time & 0x01) != 0) {
		if (sent & 0x01)	//75K
			_mosi_high_();
		else
			_mosi_low_();
		sent >>= 1;
		_clk_low_();
	} else {
		if(_miso_value_())
			receive = (receive >> 1) | 0x80;
		else
			receive = receive >> 1;
		_clk_high_();
	}
	spi_time --;
	if(spi_time == 0) {
		TA0CCTL0 &= ~CCIE;
		spi_time = 17;
		return 1;
	}
	return 0;
}
inline unsigned char spi_class::Timer_A0_func_01(void) {
	static unsigned char spi_time = 17;
	if ((spi_time & 0x01) == 0x01) {
		_clk_low_();
		if (sent & 0x01)
			_mosi_high_();
		else
			_mosi_low_();
		sent >>= 1;
	} else {
		_clk_high_();
		if(_miso_value_())
			receive = (receive >> 1) | 0x80;
		else
			receive = receive >> 1;
	}
	spi_time --;
	if(spi_time == 0) {
		TA0CCTL0 &= ~CCIE;
		spi_time = 17;
		return 1;
	}
	return 0;
}
inline unsigned char spi_class::Timer_A0_func_10(void) {
	static unsigned char i = 1;
	static unsigned char spi_time = 17;
	if (i == 1) {
		if (sent & 0x01)	//75K
			_mosi_high_();
		else
			_mosi_low_();
		sent >>= 1;
		_clk_high_();
	} else {
		if(_miso_value_())
			receive = (receive >> 1) | 0x80;
		else
			receive = receive >> 1;
		_clk_low_();
	}
	i ^= 0x01;
	spi_time--;
	if(spi_time == 0) {
		TA0CCTL0 &= ~CCIE;
		spi_time = 17;
		i = 1;
		return 1;
	}
	return 0;
}
inline unsigned char spi_class::Timer_A0_func_11(void) {
	return 3;
}
inline unsigned char spi_class::Timer_A0_func(void) {
	static unsigned char i = cpol;
	static unsigned char spi_time = 17;
	if (cpha == 0) {
		if (i == cpol) {
			if (sent & firstBit)	//75K
				_mosi_high_();
			else
				_mosi_low_();
			if(firstBit == MSBFIRST)
				sent <<= 1;
			else
				sent >>= 1;
		} else {
			if(_miso_value_()) {
				if(firstBit == MSBFIRST)
					receive = (receive << 1) | 0x01;
				else
					receive = (receive >> 1) | 0x80;
			}
			else {
				if(firstBit == MSBFIRST)
					receive = (receive << 1);
				else
					receive = (receive >> 1);
			}
		}
	}
	if (i) {			//上升沿
		_clk_high_();
	} else {			//下降沿		 第一个i = 0,clk不翻转。
		_clk_low_();
	}
	if (cpha == 1) {
		if (i == cpol) {
			if (sent & firstBit)
				_mosi_high_();
			else
				_mosi_low_();
			if(firstBit == MSBFIRST)
				sent <<= 1;
			else
				sent >>= 1;
		}
		else {
			if(_miso_value_()) {
				if(firstBit == MSBFIRST)
					receive = (receive << 1) | 0x01;
				else
					receive = (receive >> 1) | 0x80;
			}
			else {
				if(firstBit == MSBFIRST)
					receive = (receive << 1);
				else
					receive = (receive >> 1);
			}
		}
	}
	i ^= 0x01;
	spi_time --;
	if(spi_time == 0) {
		TA0CCTL0 &= ~CCIE;
		spi_time = 17;
		i = cpol;
		return 1;
	}
	return 0;
}
void spi_class::test_pins(void) {
	_mosi_output_();
	_cs_output_();
	_miso_output_();
	_clk_output_();
	while(1) {
		_miso_low_();
		_miso_high_();
		_mosi_low_();
		_mosi_high_();
		_cs_low_();
		_cs_high_();
		_clk_low_();
		_clk_high_();
	}
}
extern "C" {

#pragma vector = TIMER0_A0_VECTOR
__interrupt void Timer_A0_ISR(void) {
//	if((SPI.*Timer_A0_function)())
	if(SPI.Timer_A0_func())
		__bic_SR_register_on_exit(LPM0_bits);
}
}


