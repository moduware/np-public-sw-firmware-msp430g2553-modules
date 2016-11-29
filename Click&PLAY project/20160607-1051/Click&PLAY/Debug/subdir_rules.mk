################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Each subdirectory must supply rules for building sources it contributes
t_my_app.obj: ../t_my_app.c $(GEN_OPTS) $(GEN_SRCS)
	@echo 'Building file: $<'
	@echo 'Invoking: MSP430 Compiler'
	"D:/Program Files (x86)/msp430_4.2.1/bin/cl430" -vmsp --abi=eabi --include_path="D:/CCS5.3.0/ccsv5/ccs_base/msp430/include" --include_path="D:/GitHub/np-public-sw-firmware-msp430g2553-modules/Click&PLAY project/20160607-1051/Click&PLAY/mdk" --include_path="D:/GitHub/np-public-sw-firmware-msp430g2553-modules/Click&PLAY project/20160607-1051/Click&PLAY/libraries" --include_path="D:/GitHub/np-public-sw-firmware-msp430g2553-modules/Click&PLAY project/20160607-1051/Click&PLAY" --include_path="D:/Program Files (x86)/msp430_4.2.1/include" --advice:power="all" -g --define=__MSP430G2553__ --diag_warning=225 --display_error_number --diag_wrap=off --printf_support=minimal --preproc_with_compile --preproc_dependency="t_my_app.pp" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: $<'
	@echo ' '

tmain.obj: ../tmain.cpp $(GEN_OPTS) $(GEN_SRCS)
	@echo 'Building file: $<'
	@echo 'Invoking: MSP430 Compiler'
	"D:/Program Files (x86)/msp430_4.2.1/bin/cl430" -vmsp --abi=eabi --include_path="D:/CCS5.3.0/ccsv5/ccs_base/msp430/include" --include_path="D:/GitHub/np-public-sw-firmware-msp430g2553-modules/Click&PLAY project/20160607-1051/Click&PLAY/mdk" --include_path="D:/GitHub/np-public-sw-firmware-msp430g2553-modules/Click&PLAY project/20160607-1051/Click&PLAY/libraries" --include_path="D:/GitHub/np-public-sw-firmware-msp430g2553-modules/Click&PLAY project/20160607-1051/Click&PLAY" --include_path="D:/Program Files (x86)/msp430_4.2.1/include" --advice:power="all" -g --define=__MSP430G2553__ --diag_warning=225 --display_error_number --diag_wrap=off --printf_support=minimal --preproc_with_compile --preproc_dependency="tmain.pp" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: $<'
	@echo ' '


