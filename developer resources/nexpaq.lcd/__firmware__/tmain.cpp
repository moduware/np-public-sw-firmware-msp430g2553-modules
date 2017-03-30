/*
 * tmain.cpp
 * LCD
 */
//libraries
#include <np_module_mdk_v1.h>
#include "t_my_app.h"
#include "NCN_GPIO.h"
#include "LiquidCrystal.h"

// RECEIVE command - use range from 0x2700 to 0x27ff
//**Suggested**
//odd number for command number
//even number for response command number
//define function's command code at t_my_app.c

#define length 2

const MDK_REGISTER_CMD my_cmd_func_table[length] = { //Specify table's length according to number of commands used
		{0x2700, text_1},
		{0x2702, text_2} 	// Command's name can be changed
};

void np_api_setup() {
	// Libraries, divers and PIN initialization
	//np_api_set_app_version(x, x, x); -- optional

	// If the command number is out of the range 0x2700 - 0x27ff, a FAIL message is displayed
	// Handle the fail event here!
	if ( np_api_register((MDK_REGISTER_CMD*)my_cmd_func_table, length) == MDK_REGISTER_FAIL ) { //communication check
	}

	//Initialization the LCD functions
	LCD_Init();
	// Set the first line, fifth column
	LCD_SetCursor(5, 0);
	// Print string value
	LCD_Write_String("NEXPAQ");
	delay(150);
	LCD_SetCursor(4, 0);
	LCD_Write_String("<NEXPAQ>");
	delay(150);
	LCD_SetCursor(3, 0);
	LCD_Write_String("<<NEXPAQ>>");
	delay(150);
	LCD_SetCursor(2, 0);
	LCD_Write_String("<<<NEXPAQ>>>");
	delay(150);
	LCD_SetCursor(1, 0);
	LCD_Write_String("<<<<NEXPAQ>>>>");
	delay(150);
	LCD_SetCursor(0, 0);
	// Set the second line, first column
	LCD_Write_String("<<<<<NEXPAQ>>>>>");
	LCD_SetCursor(3, 1);
	// Print string value
	LCD_Write_String("#GoModular");
	// Set the second line, first column
	delay(1000);

	// After setting this command, np_api_loop() will run just once
	np_api_pm_automode_set();

}

void np_api_loop() {
	// This loop will run continuously while the MCU is not in sleep mode or has a stop condition

	/*SEND command -- use 0x2800
	*np_api_upload(0x2800, "I am sensor value!", 2) -- sensor value is unsigned char
	*
	*np_api_pm_automode_set(void) -- power save mode
	**In auto power save mode, the loop runs once
	*to run it one more time call "np_api_run_loop_once();"
	*To exit auto power save mode call "np_api_pm_automode_clear()"
	*delay(10);
	*/
	LCD_Clear();									//Clear LCD and return cursor in column and row 0
}

void np_api_start() {
	//Start module's function
}

void np_api_stop() {
	// Stop module's function
}
