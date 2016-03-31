/*
 * t_my_app.h
 */

#ifndef NP_MSP430_V2_T_MY_APP_H_
#define NP_MSP430_V2_T_MY_APP_H_
#ifdef __cplusplus
extern "C" {
#endif
void RGB_LED(unsigned char*pData, unsigned char len); //cmd 2700
void my_function_CMD_2702(unsigned char*pData, unsigned char len);
void my_function_CMD_2704(unsigned char*pData, unsigned char len);
void my_function_CMD_2706(unsigned char*pData, unsigned char len);
#ifdef __cplusplus
}
#endif
#endif /* NP_MSP430_V2_T_MY_APP_H_ */
