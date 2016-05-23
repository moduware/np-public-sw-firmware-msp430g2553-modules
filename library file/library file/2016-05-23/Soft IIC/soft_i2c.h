/*
 * soft_i2c.h
 *
 *  Created on: 2015-8-19
 *      Author: Administrator
 */

#ifndef SOFT_I2C_H_
#define SOFT_I2C_H_
class soft_i2c{
private:
	unsigned char address;
	unsigned char Pscl;
	unsigned char Psda;
	inline void i2c_start(void);
	inline void i2c_stop(void);
	inline unsigned char i2c_checkACK(void);
	inline void i2c_writeByte(unsigned char data);
	inline unsigned char i2c_readByte(unsigned char ack);
	inline void i2c_ACK(void);
	inline void i2c_NoACK(void);
public:
	void begin(void);
	void begin(unsigned char address);
	void begin(unsigned char address,unsigned char Pscl,unsigned char Psda);

	void i2c_write(unsigned char reg,unsigned char data);
	unsigned char i2c_read(unsigned char reg);
	void i2c_read(unsigned char reg,unsigned char *str,unsigned char length);
	void i2c_write(unsigned char reg,unsigned char *str,unsigned char length);

	void i2c_write(unsigned char address,unsigned char reg,unsigned char data);
	unsigned char i2c_read(unsigned char address,unsigned char reg);
	void i2c_read(unsigned char address,unsigned char reg,unsigned char *str,unsigned char length);
	void i2c_write(unsigned char address,unsigned char reg,unsigned char *str,unsigned char length);
};
extern soft_i2c soft_I2C;

#endif /* SOFT_I2C_H_ */
