/*
 * RGBLedByPwm.h
 *
 *  Created on: 2016-3-18
 *      Author: Administrator
 */

#ifndef RGBLEDBYPWM_H_
#define RGBLEDBYPWM_H_
#ifdef __cplusplus
	extern "C" {
#endif
struct LedValue {
	unsigned char RedBright;
	unsigned char GreenBright;
	unsigned char BlueBright;
};
void LedPinInitial(unsigned char redPin,unsigned char greenPin,unsigned char bluePin);
void DRIVER_Timera1_init(void);
void setLedBrightness(unsigned char redValue,unsigned char greenValue,unsigned char blueValue);
#ifdef __cplusplus
	}
#endif
#endif /* RGBLEDBYPWM_H_ */
