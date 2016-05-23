/*
 * soft_spi.h
 *
 *  Created on: 2015-7-8
 *      Author: Jake
 */

#ifndef SOFT_SPI_H_
#define SOFT_SPI_H_
#define SPI_MODE0	0
#define SPI_MODE1	1
#define SPI_MODE2	2
#define SPI_MODE3	3
#define LSBFIRST	0x01
#define MSBFIRST	0x80
#define CS			BIT0
#define CLK 		BIT1
#define MOSI 		BIT2
#define MISO		BIT3
#define SMCLOCK		16000000
class spi_class{
public:
	spi_class(void);
	void SPIsettings(long speedMaximum,unsigned char dataOrder,unsigned char dataMode,unsigned char firstBit);
	void begin(void);
	void begin(unsigned char Pmiso,unsigned char Pmosi,unsigned char Pclk,unsigned char Pcs);
	void end(void);
	void setBitOrder(unsigned char order);
	void setDataMode(unsigned char mode);
	void setFisrtBit(unsigned char fisrtBit);
	void setSpeed(long speedMaximum);
	unsigned char transfer(unsigned char val);
	inline unsigned char Timer_A0_func(void);
	inline unsigned char Timer_A0_func_00(void);
	inline unsigned char Timer_A0_func_01(void);
	inline unsigned char Timer_A0_func_10(void);
	inline unsigned char Timer_A0_func_11(void);
	void test_pins(void);
//	unsigned char Timer_A0_func_00(void);
//	unsigned char (spi_class::*Timer_A0_function)(void);
private:
	unsigned char sent;
	unsigned char receive;
	unsigned char cpol;
	unsigned char cpha;
	unsigned char Pmosi;
	unsigned char Pmiso;
	unsigned char Pcs;
	unsigned char Pclk;
	unsigned char firstBit;
	long speed;
};
extern spi_class SPI;


#endif /* SOFT_SPI_H_ */
