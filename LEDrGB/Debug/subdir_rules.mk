################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Each subdirectory must supply rules for building sources it contributes
t_my_app.obj: ../t_my_app.c $(GEN_OPTS) $(GEN_HDRS)
	@echo 'Building file: $<'
	@echo 'Invoking: MSP430 Compiler'
	"C:/ti/ccsv5/tools/compiler/msp430_4.2.1/bin/cl430" -vmsp --abi=eabi --include_path="C:/ti/ccsv5/ccs_base/msp430/include" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB/App_Driver" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB/libraries" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB/mdk" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB" --include_path="C:/ti/ccsv5/tools/compiler/msp430_4.2.1/include" --advice:power="all" -g --define=__MSP430G2553__ --diag_warning=225 --display_error_number --diag_wrap=off --printf_support=minimal --preproc_with_compile --preproc_dependency="t_my_app.pp" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: $<'
	@echo ' '

tmain.obj: ../tmain.cpp $(GEN_OPTS) $(GEN_HDRS)
	@echo 'Building file: $<'
	@echo 'Invoking: MSP430 Compiler'
	"C:/ti/ccsv5/tools/compiler/msp430_4.2.1/bin/cl430" -vmsp --abi=eabi --include_path="C:/ti/ccsv5/ccs_base/msp430/include" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB/App_Driver" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB/libraries" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB/mdk" --include_path="D:/Carlota/3. Firmware/2.FW_V2/simple examples/LEDrGB/LEDrGB" --include_path="C:/ti/ccsv5/tools/compiler/msp430_4.2.1/include" --advice:power="all" -g --define=__MSP430G2553__ --diag_warning=225 --display_error_number --diag_wrap=off --printf_support=minimal --preproc_with_compile --preproc_dependency="tmain.pp" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: $<'
	@echo ' '


