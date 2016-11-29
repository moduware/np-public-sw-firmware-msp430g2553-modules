################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Each subdirectory must supply rules for building sources it contributes
tmain.obj: ../tmain.cpp $(GEN_OPTS) $(GEN_SRCS)
	@echo 'Building file: $<'
	@echo 'Invoking: MSP430 Compiler'
	"D:/Program Files (x86)/msp430_4.2.1/bin/cl430" -vmsp --abi=eabi --include_path="D:/CCS5.3.0/ccsv5/ccs_base/msp430/include" --include_path="D:/GitHub/np-private-sw-firmware-msp430g2553-modules/NCN_module/np_module_v1_example/mdk" --include_path="D:/GitHub/np-private-sw-firmware-msp430g2553-modules/NCN_module/np_module_v1_example" --include_path="D:/Program Files (x86)/msp430_4.2.1/include" --advice:power="all" -g --define=__MSP430G2553__ --diag_warning=225 --display_error_number --diag_wrap=off --printf_support=minimal --preproc_with_compile --preproc_dependency="tmain.pp" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: $<'
	@echo ' '


