################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Each subdirectory must supply rules for building sources it contributes
tmain.obj: ../tmain.cpp $(GEN_OPTS) $(GEN_HDRS)
	@echo 'Building file: $<'
	@echo 'Invoking: MSP430 Compiler'
	"D:/ti/ccsv6/tools/compiler/msp430_4.2.1/bin/cl430" -vmsp --abi=eabi --include_path="D:/ti/ccsv6/ccs_base/msp430/include" --include_path="C:/Users/pc/Documents/GitHub/np-private-sw-module-application-apps/developer-tiles/nexpaq.ultrasonic/__firmware__/mdk" --include_path="C:/Users/pc/Documents/GitHub/np-private-sw-module-application-apps/developer-tiles/nexpaq.ultrasonic/__firmware__/libraries" --include_path="C:/Users/pc/Documents/GitHub/np-private-sw-module-application-apps/developer-tiles/nexpaq.ultrasonic/__firmware__" --include_path="D:/ti/ccsv6/tools/compiler/msp430_4.2.1/include" --advice:power="all" -g --define=__MSP430G2553__ --diag_warning=225 --display_error_number --diag_wrap=off --printf_support=minimal --preproc_with_compile --preproc_dependency="tmain.pp" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: $<'
	@echo ' '


