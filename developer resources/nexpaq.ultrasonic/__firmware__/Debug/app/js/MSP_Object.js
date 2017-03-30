/**
 * MSP Module control object
 *
 * * Functions:
 * * * Upstream: MSP_to_app
 * receive ()
 *	last_data.el_x : gets the element of the array (from 0 to 53) send from Firmware
 * * * Downstream:
 * callFunction(): set the comand parameter (from 00 to FF) and pData argument (from 0 to 255)
 *
 */
window.nexpaqAPI.addModuleType("MSP");
window.nexpaqAPI.module.MSP = function() { //define class
	window.nexpaqAPI.module.basic.call(this); 
};
window.nexpaqAPI.module.MSP.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	last_data: {},

	//receive (upstream) data string generator to send from the MSP to the app
	receive: function (data) {
		//for(var i=0; i<10; i++) {
			//this.last_data["el_"+i] = data["receive_"+i];
			this.last_data = data;
		//}
	},
/**
* Send function (downstream)
* Address is an hexadecimal number between 00 and FF
* args is an array of integers
**/
    send: function (address, pData) {
		var pDl= pData.length;
		var add = parseInt("address", 16);

	   	if (add>0 && add<255 || pDl>0 && pDl<53) {
	 		window.nexpaqAPI.util.sendCommand("27"+address, pData);
	 	} else { 
	 		return false;
	 	}
	}
});
window.nexpaqAPI.module.MSP.prototype.constructor = window.nexpaqAPI.module.MSP; 

window.nexpaqAPI.MSP = new window.nexpaqAPI.module.MSP(); //define class' object 