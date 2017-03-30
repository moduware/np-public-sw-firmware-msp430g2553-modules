/**
 * Developer Module control object
 *
 * * Functions:
 * * * Upstream
 * receive ()
 *last_data.x : get array element. x name given at parse file
 * * * Downstream:
 *send: set the comand parameter (from 2700 to 27FF) and pData argument (from 0 to 255)
 *
 */
window.nexpaqAPI.addModuleType("DevMod");
window.nexpaqAPI.module.DevMod = function() { //define class
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.DevMod.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	last_data: {},
	onDataReceived: [],

	//receive (upstream) data string generator to send from the developer module to the app
	receive: function (data) {
		this.last_data = data;
		this.triggerEvent("onDataReceived", data);
	},
/**
* Send function (downstream)
* Address is a string 
* args is an array of integers
**/
    send: function (address, pData) {
		var pDl= pData.length;
		var add = parseInt("address", 16);

	   	if (add>0 && add<255 || pDl>0 && pDl<53) {
	 		window.nexpaqAPI.util.sendCommand(address, pData);
	 	} else {
	 		return false;
	 	}
	}
});
window.nexpaqAPI.module.DevMod.prototype.constructor = window.nexpaqAPI.module.DevMod;

window.nexpaqAPI.DevMod = new window.nexpaqAPI.module.DevMod(); //define object class
