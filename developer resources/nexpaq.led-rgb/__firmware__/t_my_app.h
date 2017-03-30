/*
 * t_my_app.h
 * LEDrGB
 */

#ifndef NP_MSP430_V1_T_MY_APP_H_
#define NP_MSP430_V1_T_MY_APP_H_
#ifdef __cplusplus
extern "C" {
#endif
void Primary_colors(unsigned char*pData, unsigned char len); //cmd 2700
void RGB_LED(unsigned char*pData, unsigned char len); // cmd 2702
#ifdef __cplusplus
}
#endif
#endif /* NP_MSP430_V1_T_MY_APP_H_ */
