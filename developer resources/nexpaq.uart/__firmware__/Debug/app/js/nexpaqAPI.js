if(window === undefined) {
	var window = {};
}
if(console === undefined) {
	var console = {
		log: function(data) {
			if(typeof print == "function") {
				print(data);
			} else {
				// any other ways to print to console?
			}
		}
	};
}
/* Object.assign polyfill */
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
/* End of Object.assign polyfill */

window.nexpaqAPI = {
	version: "0.8.4",
	availableModules: ["LED", "TFCard", "Backup", "USBStick", "Speaker", "Laser", "Alcohol", "AirQ", "Battery", "HaT", "Hotkey"],
	currentModule: null,
	emulateMode: false,
	xamarinApiIsReady: false,
	_functionsLine: [],

	isApiAvailable: function() {
		return (typeof nxpXamarin !== "undefined" || typeof nxpAPI !== "undefined");// || typeof webkit !== "undefined");
	},
	/**
	 * Adds new module type
	 * @param  {string} name module name
	 * @return {void}
	 */
	addModuleType: function(name) {
		if(typeof name !== "string") {
			throw "Module type must be a string";
		}
		this.availableModules.push(name);
	},
	/**
	 * Checks if module available to be set and controlled
	 * @param  {string} name type of module
	 * @return {bool}      check result
	 */
	hasModuleType: function(name) {
		if(typeof name !== "string") {
			throw "Module type must be a string";
		}
		return this.availableModules.contains("name");
	},
	/**
	 * Sets the current module API is working with, this is required to be done before using htee API
	 * @param {string} name module name
	 * @return {void}
	 */
	setCurrentModule: function (name) {
		if(!this.availableModules.contains(name)) {
			throw "Unknown module type";
		}
		this.currentModule = name;

		this._showLibraryInfo();
	},
	/**
	 * Outputing library info to console, private
	 * @return {void}
	 */
	_showLibraryInfo: function() {
		console.log("nexpaqAPI: version " + this.version);
		console.log("nexpaqAPI: module " + this.currentModule);
		if(this.emulateMode) {
			console.log("nexpaqAPI: emulating mode");
		}
	},
	/**
	 * Receives data from native application and delivers it to the current module
	 * @param  {array} data array of integers
	 * @return {void}
	 */
	_receiveData: function (data) {
		if(window.nexpaqAPI.currentModule === null) {
			throw "Current module is not set";
		}

		var decodedData = JSON.parse(data);
		window.nexpaqAPI[window.nexpaqAPI.currentModule].receive(decodedData);
	},
	/**
	 * Receives events defined in app, and functions defined in all apps
	 * @param  {json string} data [object with functions and events]
	 * @return {void}
	 */
	_receiveEvents: function (data) {
		var decodedData = JSON.parse(data),
				functions_list = [],
				i;

		window.nexpaqAPI.global.functions=[];

		for(i in decodedData.functions) {
			functions_list.push(decodedData.functions[i].name);
			// may be it will be better to make a tree by device property? :-\, not sure
			window.nexpaqAPI.global.functions.push({
				'title' : (typeof decodedData.functions[i].title === 'undefined') ? decodedData.functions[i].name : decodedData.functions[i].title,
				'name' : decodedData.functions[i].name,
				'device' : decodedData.functions[i].UUID
			});
		}

		if(decodedData.events === "") decodedData.events = [];

		for(i in decodedData.events) {
			// we need provide event title functionality somehow
			var event_object={
				'title' : decodedData.events[i].event,
				'name' : decodedData.events[i].event
			};
			if(functions_list.contains(decodedData.events[i].function)) {
				event_object.function = decodedData.events[i].function;
				event_object.devices = decodedData.events[i].UUID;
			}
			window.nexpaqAPI[window.nexpaqAPI.currentModule].events[event_object.name] = event_object;
		}

		for(i in window.nexpaqAPI.global.onEventsReceived) {
			window.nexpaqAPI.global.onEventsReceived[i](window.nexpaqAPI[window.nexpaqAPI.currentModule].events);
		}
	},
	/**
	 * Sends events to native
	 * @return {void}
	 */
	_updateEvents: function() {
		var events = [],
				module = window.nexpaqAPI.currentModule;

		for(var i in window.nexpaqAPI[module].events) {
			events.push({
				'event' : window.nexpaqAPI[module].events[i].name,
				'function' : window.nexpaqAPI[module].events[i].function,
				'UUID' : window.nexpaqAPI[module].events[i].devices
			});
		}
		window.nexpaqAPI.util.callNativeFunction('ConfigEvents', events);
	},
	_pageReady: function() {
		/* Xamarin */
		if(typeof Native !== 'undefined') {
			// not that function for Xamarin yet
		} else if(typeof nxpAPI !== "undefined") {
			nxpAPI.pageReady();
		}
	},
	_xamarinApiReady: function() {
		window.nexpaqAPI.xamarinApiIsReady = true;
		window.nexpaqAPI._executeFunctionsLine();

		window.nexpaqAPI.util.triggerEvent("global", "onApiReady");
	},
	_executeFunctionsLine: function() {
		var functions = window.nexpaqAPI._functionsLine.slice();
		window.nexpaqAPI._functionsLine = [];

		for(var i=0; i<functions.length; i++) {
			window.nexpaqAPI.util.callNativeFunction(functions[i][0], functions[i][1]);
		}
	},

	util: {
		callNativeFunction: function (func, content) {
			if(typeof func !== "string") throw "Function must be a string";
			if( content == null ) content = "";
			// For simple one string arguments
			if(typeof content !== "string") {
				var data = JSON.stringify(content);
			} else {
				var data = content;
			}

			// Xamarin JS API has delay before it start working
			if(!window.nexpaqAPI.isApiAvailable() || (typeof nxpXamarin !=="undefined" && !window.nexpaqAPI.xamarinApiIsReady)) {
				window.nexpaqAPI._functionsLine.push([func, content]);
				return;
			} else {
				window.nexpaqAPI._executeFunctionsLine();
			}

			try {
				// Xamarin
				if(typeof Native !== 'undefined') {
					Native(func, data);
				// iOS
				} else if(typeof window.webkit !== "undefined") {
					// iOS use other name for onControl
					if(func == "onControl") {
						window.webkit.messageHandlers.AppModel.postMessage({body: data});
					} else {
						window.webkit.messageHandlers[func].postMessage(data);
					}
				// Android
				} else if(typeof nxpAPI !== "undefined") {
					nxpAPI[func]( data );
				// Rhino JS Engine
				} else if(typeof java !== "undefined") {
					var rhinoAPI = java.lang.Class.forName("com.nexpack.nexpaq.HomeFragment", true, javaLoader),
							rhinoFunc = rhinoAPI.getMethod(func, [java.lang.String]);
					rhinoFunc.invoke(null , data);
				// WTF ?!
				} else {
					throw "Unknow JS API type";
				}
			} catch(e) {
				if( typeof onNxpAppError !== "undefined" ) onNxpAppError(e, "nexpaqAPI.js", "", "", "");
			}
		},
		/**
		 * Sends a command to native application
		 * @param  {string} command command name
		 * @param  {array} options array of integers
		 */
		sendCommand: function (command, options) {
			if(typeof command !== "string") {
				throw "Command must be a string";
			}
			if(!Array.isArray(options)) {
				throw "Options must be an array";
			}
			window.nexpaqAPI.util.callNativeFunction('onControl', {Name: command, Param: options});
		},

		/**
		 * Save data on device\cloud
		 * @param  {String} name     data name
		 * @param  {String} value    data value
		 * @param  {string} time     time value
		 * @param  {array of integers} location lot and lat
		 * @param  {array of strings} tags     data tags
		 * @return {void}
		 */
		saveData: function (name, value, time, location, tags) {
			if(typeof name === "undefined" || typeof value === "undefined") {
				throw "Name and value must be defined";
			}
			var data = {
				"datasetName": name,
				"value" : value
			};
			if(typeof time !== "undefined") data["time"] = time;
			if(typeof location !== "undefined") data["Location"] = location;
			if(typeof tags !== "undefined") data["tags"] = tags;

			window.nexpaqAPI.util.callNativeFunction('saveToCloud', data);
		},

		/**
		 * Send query for data from phone\cloud
		 * @param  {string} name    data name
		 * @param  {object} options data query options
		 * @return {void}
		 */
		sendDataQuery: function(name, options) {
			if(typeof name === "undefined") throw "name must be defined";
			if(typeof options === "undefined") options = {};
			options["datasetName"] = name;

			window.nexpaqAPI.util.callNativeFunction('sendQueryToCloud', options);
		},

		/**
		 * Send query for data from phone\cloud, user indepenent
		 * @param  {string} name    data name
		 * @param  {object} options data query options
		 * @return {void}
		 */
		sendGlobalDataQuery: function(name, options) {
			if(typeof name === "undefined") throw "name must be defined";
			if(typeof options === "undefined") options = {};
			options["datasetName"] = name;

			window.nexpaqAPI.util.callNativeFunction('sendGlobalQueryToCloud', options);
		},

		/**
		 * Request device location from user device
		 * @return {void}
		 */
		sendLocationRequest: function() {
			window.nexpaqAPI.util.callNativeFunction('requestCurrentLocation');
		},

		/**
		 * Adding event handler to module
		 * @param {string} module     module to set event on
		 * @param {string} event_name event name
		 * @param {string} func       function name to call on event
		 */
		addEventListener: function (module, event_name, func) {
			if(typeof window.nexpaqAPI[module] === "undefined") {
				throw "Module object does not exists";
			}
			if(typeof window.nexpaqAPI[module][event_name] === "undefined") {
				throw "Unknown event";
			}

			window.nexpaqAPI[module][event_name].push(func);
		},
		/**
		 * Triggers library event
		 * @param  {string} module     module to trigger event on
		 * @param  {string} event_name event name
		 * @param  {array} args       array of arguments to pass to the event handlers
		 * @return {void}
		 */
 		triggerEvent: function (module, event_name, args) {
			for(i in window.nexpaqAPI[module][event_name]) {
				window.nexpaqAPI[module][event_name][i].apply(window.nexpaqAPI[module], args);
			}
		},

		/**
		 * Defines new event inside module, can not be used to redefine event
		 * @param {string} module      module to add event
		 * @param {string} event_title title of event
		 * @param {string} event_name  name of event
		 */
		addNativeEvent: function (module, event_title, event_name) {
			if(typeof window.nexpaqAPI[module] === "undefined") {
				throw "Module object does not exists";
			}
			if(typeof window.nexpaqAPI[module].events[event_name] !== "undefined") {
				throw "Native event already defined";
			}
			window.nexpaqAPI[module].events[event_name] = {
				'title' : event_title,
				'name' : event_name
			};
		},

		/**
		 * Bind function of one or more devices to some event
		 * @param {string} module        module we are working with
		 * @param {string} event_name    name of event
		 * @param {string} function_name name of function
		 * @param {array of strings} devices       UUIDs if devices
		 */
		addNativeEventListener: function (module, event_name, function_name, devices) {
			if(typeof window.nexpaqAPI[module] === "undefined") {
				throw "Module object does not exists";
			}
			if(typeof window.nexpaqAPI[module].events[event_name] === "undefined") {
				throw "Native event does not exists";
			}

			window.nexpaqAPI[module].events[event_name].function = function_name;
			window.nexpaqAPI[module].events[event_name].devices = devices;

			window.nexpaqAPI._updateEvents();
		},


		/**
		 * Calling event from native app, if some function binded to it, this function will be executed
		 * @param  {string} event_name [name of event to call]
		 */
		triggerNativeEvent: function (event_name) {
			if(window.nexpaqAPI.emulateMode) return;
			window.nexpaqAPI.util.callNativeFunction('callNativeEvent', event_name);
		},

		shareData: function (text, image) {
			if(text == null) throw "text must be a string";

			var json = {text: text};
			if(image !== null) json['image'] = image;
			window.nexpaqAPI.util.callNativeFunction('requestDataSharing', json);
		},

		/**
		 * Closing current application
		 */
		closeApplication: function () {
			window.nexpaqAPI.util.sendCommand('close', []);
		}
	}
};

window.nexpaqAPI.module = {};


/**
 * Basic control class
 *
 * * Functions:
 * addEventListener : setup software event listener
 * addNativeEvent : defines new native event
 * addNativeEventListener : binds native event with event listener
 */
window.nexpaqAPI.module.basic = function() {
	// constructor
};
window.nexpaqAPI.module.basic.prototype = {
	events: {},
	receive: function (data) {},
	addEventListener: function(event_name, func) {
		window.nexpaqAPI.util.addEventListener(window.nexpaqAPI.currentModule, event_name, func);
	},
	triggerEvent: function(event_name) {
		var args = Array.from(arguments);
		args.shift();
		window.nexpaqAPI.util.triggerEvent(window.nexpaqAPI.currentModule, event_name, args);
	},
	triggerNativeEvent: function(event_name) {
		window.nexpaqAPI.util.triggerNativeEvent(event_name);
	},
	addNativeEvent: function(event_title, event_name) {
		window.nexpaqAPI.util.addNativeEvent(window.nexpaqAPI.currentModule, event_title, event_name);
	},
	addNativeEventListener: function(event_name, function_name, devices) {
		window.nexpaqAPI.util.addNativeEventListener(window.nexpaqAPI.currentModule, event_name, function_name, devices);
	}
};


/**
 * LED control class
 *
 * * Events:
 *
 * * Functions:
 * turnOff : turn LED off
 * setColorRed : red color of LED
 * setColorGreen : green color of LED
 * setColorBlue : blue color of LED
 * setColorWhite : white color of LED
 * flashRedAndBlue : flash LED with red and blue colors
 * setColorRGB : set color of LED in RGB
 * setColorHSL : set color of LED in number betwee 0 and 359
 */
window.nexpaqAPI.module.LED = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.LED.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	/* BASIC */
	turnOff: function () {
		window.nexpaqAPI.util.sendCommand("basic", [0]);
	},

	setColorRed: function () {
		window.nexpaqAPI.util.sendCommand("basic", [2]);
	},
	setColorGreen: function () {
		window.nexpaqAPI.util.sendCommand("basic", [3]);
	},
	setColorBlue: function () {
		window.nexpaqAPI.util.sendCommand("basic", [4]);
	},
	setColorWhite: function () {
		window.nexpaqAPI.util.sendCommand("basic", [5]);
	},

	flashRedAndBlue: function () {
		window.nexpaqAPI.util.sendCommand("basic", [6]);
	},

	/* RGB */
	setColorRGB: function (R, G, B) {
		if(R < 0 || G < 0 || B < 0) return false;
		if(R > 255 || G > 255 || B > 255) return false;

		window.nexpaqAPI.util.sendCommand("rgb", [R, G, B]);
		return true;
	},

	/* HSL */
	setColorHSL: function (value) {
		if(value < 0 || value > 359) return false;
		var Z = value,
				t = Z % 256,
				max = 359,
				maxY = max - 256,
				result = [0, 0];

		if( Z <= maxY ) {
			result = [0, Z];
		} else if( Z <= 256 ) {
			result = [Z / 256, 0];
		} else {
			result = [(Z - t) / 256, t];
		}

		window.nexpaqAPI.util.sendCommand("hsl", result);
	}
});
window.nexpaqAPI.module.LED.prototype.constructor = window.nexpaqAPI.module.LED;


/**
 * USB device control object
 *
 * * Events:
 * onPluggedIn() : when device is plugged in
 * onPluggedOut() : when device is plugged out
 *
 * * Functions:
 * connect : connect to USB HUB
 * disconnect : disconnect from USB HUB
 */
window.nexpaqAPI.module.USBDevice = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.USBDevice.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	pluggedIn: false,
	events: {
		'plugged_in':{
			'title' : 'Plugged in',
			'name' : 'plugged_in'
		},
		'plugged_out':{
			'title' : 'Plugged out',
			'name' : 'plugged_out'
		}
	},
	onPluggedIn: [],
	onPluggedOut: [],

	connect: function () {
		window.nexpaqAPI.util.sendCommand("conn", [1]);
	},
	disconnect: function () {
		window.nexpaqAPI.util.sendCommand("conn", [0]);
	},

	receive: function (data) {
		var i;
		if(data.state == 'connected' && !this.pluggedIn) {
			this.pluggedIn = true;

			this.triggerNativeEvent('plugged_in');
			this.triggerEvent("onPluggedIn");
		} else if(data.state == 'disconnected' && this.pluggedIn) {
			this.pluggedIn = false;

			this.triggerNativeEvent('plugged_out');
			this.triggerEvent("onPluggedOut");
		}
	}

});
window.nexpaqAPI.module.USBDevice.prototype.constructor = window.nexpaqAPI.module.USBDevice;



/**
 * Hotkey control object
 *
 * * Events:
 * onButton1Down() : when button 1 down
 * onButton2Down() : when button 2 down
 * onButton1Up() : when button 1 up
 * onButton2Up() : when button 2 up
 *
 * * Functions:
 *
 */
window.nexpaqAPI.module.Hotkey = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.Hotkey.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	button1_is_pressed: false,
	button2_is_pressed: false,
	//Default events
	events: {
		'button_1_pressed':{
			'title' : 'Button 1 pressed',
			'name' : 'button_1_pressed'
		},
		'button_1_released':{
			'title' : 'Button 1 released',
			'name' : 'button_1_released'
		},
		'button_2_pressed':{
			'title' : 'Button 2 pressed',
			'name' : 'button_2_pressed'
		},
		'button_2_released':{
			'title' : 'Button 2 released',
			'name' : 'button_2_released'
		}
	},

	onButton1Down: [],
	onButton2Down: [],
	onButton1Up: [],
	onButton2Up: [],

	receive: function (data) {
		var i;
		// Button 1
		if(data.state.indexOf("A") !== -1 && !this.button1_is_pressed) {
			this.button1_is_pressed = true;
			this.triggerNativeEvent('button_1_pressed');
			this.triggerEvent("onButton1Down");
		} else if(data.state.indexOf("A") == -1 && this.button1_is_pressed) {
			this.button1_is_pressed = false;
			this.triggerNativeEvent('button_1_released');
			this.triggerEvent("onButton1Up");
		}

		// Button 2
		if(data.state.indexOf("B") !== -1 && !this.button2_is_pressed) {
			this.button2_is_pressed = true;
			this.triggerNativeEvent('button_2_pressed');
			this.triggerEvent("onButton2Down");
		} else if(data.state.indexOf("B") == -1 && this.button2_is_pressed) {
			this.button2_is_pressed = false;
			this.triggerNativeEvent('button_2_released');
			this.triggerEvent("onButton2Up");
		}
	}
});
window.nexpaqAPI.module.Hotkey.prototype.constructor = window.nexpaqAPI.module.Hotkey;


/**
 * Laser control object
 *
 * * Events:
 * onCoverOpen() : when laser cover is pulled
 * onCoverClosed() : when laser cover is pushed
 *
 * * Functions:
 * on : turn laser on
 * off : turn laser off
 */
window.nexpaqAPI.module.Laser = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.Laser.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	coverOpen: false,
	events: {
		'cover_open':{
			'title' : 'Cover open',
			'name' : 'cover_open'
		},
		'cover_closed':{
			'title' : 'Cover closed',
			'name' : 'cover_closed'
		},
	},

	onCoverOpen: [],
	onCoverClosed: [],

	on: function () {
		window.nexpaqAPI.util.sendCommand("sw", [1]);
	},
	off: function () {
		window.nexpaqAPI.util.sendCommand("sw", [0]);
	},

	receive: function (data) {
		var i;
		if(data.state === "cover open" && !this.coverOpen) {
			this.coverOpen = true;
			this.triggerNativeEvent('cover_open');
			this.triggerEvent("onCoverOpen");
		} else if(data.state === "cover closed" && this.coverOpen) {
			this.coverOpen = false;
			this.triggerNativeEvent('cover_closed');
			this.triggerEvent("onCoverClosed");
		}
	}
});
window.nexpaqAPI.module.Laser.prototype.constructor = window.nexpaqAPI.module.Laser;

/**
 * Humidity & Temperature control object
 *
 * * Events:
 * onDataUpdated() : when data from HaT is updated
 *
 * * Functions:
 *
 */
window.nexpaqAPI.module.HaT = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.HaT.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	last_data: false,
	events: {
		'data_updated':{
			'title' : 'Data updated',
			'name' : 'data_updated'
		}
	},

	onDataUpdated: [],

	start: function () {
		window.nexpaqAPI.util.sendCommand("sw", [3]);
	},
	stop: function () {
		window.nexpaqAPI.util.sendCommand("sw", [4]);
	},

	receive: function (data) {
		this.last_data={
			"ambient_temperature"	: data.ambient_temperature,
			"ambient_humidity"		: data.ambient_humidity,
			"object_temperature"	: data.object_temperature
		};
		var i;
		this.triggerNativeEvent('data_updated');
		this.triggerEvent("onDataUpdated", this.last_data);
	}
});
window.nexpaqAPI.module.HaT.prototype.constructor = window.nexpaqAPI.module.HaT;

/**
 * Air sensor control object
 *
 * * Events:
 * onHeating() : when air sensor start heating
 * onReady() : when air sensor is ready for measurment
 * onLevelChanged() : when air sensor mesured value changed
 *
 * * Functions:
 * start : start air sensor (heating)
 * stop : stop air sensor (heating)
 */
window.nexpaqAPI.module.AirSensor = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.AirSensor.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	isReady: true,
	level: null,
	events: {
		'sensor_heating':{
			'title' : 'Sensor heating',
			'name' : 'sensor_heating'
		},
		'sensor_ready':{
			'title' : 'Sensor ready',
			'name' : 'sensor_ready'
		},
		'level_changed':{
			'title' : 'Level changed',
			'name' : 'level_changed'
		}
	},

	onHeating: [],
	onReady: [],
	onLevelChanged: [],

	start: function () {
		window.nexpaqAPI.util.sendCommand("sw", [3]);
	},
	stop: function () {
		window.nexpaqAPI.util.sendCommand("sw", [4]);
	},

	receive: function (data) {
		var i,
				is_preparing = (data.state == "heating" || data.state == "updating the reference");

		if(is_preparing && this.isReady) {
			this.isReady = false;

			this.triggerNativeEvent('sensor_heating');
			this.triggerEvent("onHeating");
		}
		if(!is_preparing && !this.isReady) {
			this.isReady = true;

			this.triggerNativeEvent('sensor_ready');
			this.triggerEvent("onReady");
		}
		if(this.isReady && this.level != data.state) {
			this.level = data.state;

			this.triggerNativeEvent('level_changed');
			this.triggerEvent("onLevelChanged", this.level);
		}
	}
});
window.nexpaqAPI.module.AirSensor.prototype.constructor = window.nexpaqAPI.module.AirSensor;


/**
 * Battery control object
 *
 * * Events:
 * onCharging() : when battery starts charging
 * onDischarging() : when battery starts discharging
 * onStandby() : when battery starts standby
 * onFull() : when battery is full
 * onVoltageChanged() : when voltage value is changed
 * onListUpdate() : when list of batteries updated
 *
 * * Functions:
 * enableList: start receiving list of batteries
 * setDischarging : set battery to discharging mode
 * setCharging : set battery to charging mode
 * setStandby : set battery to standby mode
 */
window.nexpaqAPI.module.Battery = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.Battery.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	state: 0, //1 - charging, 2 - discharging, 3 - standby, 4 - full
	voltage: 0,
	list: [],
	events: {
		'is_charging':{
			'title' : 'Battery charging',
			'name' : 'is_charging'
		},
		'is_discharging':{
			'title' : 'Battery discharging',
			'name' : 'is_discharging'
		},
		'is_standby':{
			'title' : 'Battery is standby',
			'name' : 'is_standby'
		},
		'is_full':{
			'title' : 'Battery is full',
			'name' : 'is_full'
		},
		'voltage_changed':{
			'title' : 'Battery voltage changed',
			'name' : 'voltage_changed'
		},
		'list_update':{
			'title' : 'List of batteries updated',
			'name' : 'list_update'
		}
	},

	onCharging: [],
	onDischarging: [],
	onStandby: [],
	onFull: [],
	onVoltageChanged: [],
	onListUpdate: [],

	enableList: function () {
		window.nexpaqAPI.util.sendCommand("GetBatteryList", []);
	},
	setDischarging: function () {
		window.nexpaqAPI.util.sendCommand("charge", [0]);
	},
	setCharging: function () {
		window.nexpaqAPI.util.sendCommand("charge", [1]);
	},
	setStandby: function () {
		window.nexpaqAPI.util.sendCommand("charge", [2]);
	},

	receive: function (data) {
		var i;
		if(Array.isArray(data)) {
			this.list = data;

			this.triggerNativeEvent('list_update');
			this.triggerEvent("onListUpdate", this.list);
			return;
		}

		if(data.state == "charging" && this.state !== 1) {
			this.state = 1;

			this.triggerNativeEvent('is_charging');
			this.triggerEvent("onCharging");
		}
		if(data.state == "discharging" && this.state !== 2) {
			this.state = 2;

			this.triggerNativeEvent('is_discharging');
			this.triggerEvent("onDischarging");
		}
		if(data.state == "standby" && this.state !== 3) {
			this.state = 3;

			this.triggerNativeEvent('is_standby');
			this.triggerEvent("onStandby");
		}
		if(data.state == "full" && this.state !== 4) {
			this.state = 4;

			this.triggerNativeEvent('is_full');
			this.triggerEvent("onFull");
		}
		var new_voltage = data.value;
		if(new_voltage != this.voltage) {
			this.voltage = new_voltage;

			this.triggerNativeEvent('voltage_changed');
			this.triggerEvent("onVoltageChanged", this.voltage);
		}

	}
});
window.nexpaqAPI.module.Battery.prototype.constructor = window.nexpaqAPI.module.Battery;

/**
 * Global controls object
 *
 * * Events:
 * onChargeValueUpdated() : when charge value in percentages updates
 * onBackButtonClicked() : when back button clicked
 * onSocialButtonClicked() : when social button clicked
 */
window.nexpaqAPI.module.global = function() {
	window.nexpaqAPI.module.basic.call(this);
};
window.nexpaqAPI.module.global.prototype = Object.assign({}, window.nexpaqAPI.module.basic.prototype, {
	chargeValue: null,
	functions: [],

	onChargeValueUpdated: [],
	onBackButtonClicked: [],
	onSocialButtonClicked: [],
	onEventsReceived: [],
	onDataLoaded: [],
	onLocationReceived: [],
	onApiReady: [],

	/* override */
	addEventListener: function(event_name, func) {
		window.nexpaqAPI.util.addEventListener('global', event_name, func);
	},
	triggerEvent: function(event_name) {
		var args = Array.from(arguments);
		args.shift();
		window.nexpaqAPI.util.triggerEvent('global', event_name, args);
	},

	_updateCharge: function (value) {
		if(value !== this.chargeValue) {
			this.chargeValue = value;
		}
		this.triggerEvent("onChargeValueUpdated", this.chargeValue);
	},
	_clickBackButton: function() {
		this.triggerEvent("onBackButtonClicked");
	},
	_clickSocialButton: function() {
		this.triggerEvent("onSocialButtonClicked");
	},
	_dataLoaded: function(json) {
		var data = JSON.parse(json);

		this.triggerEvent("onDataLoaded", data);
	},
	_locationReceived: function(json) {
		var data = JSON.parse(json);

		this.triggerEvent("onLocationReceived", data);
	}
});
window.nexpaqAPI.module.global.prototype.constructor = window.nexpaqAPI.module.global;


window.nexpaqAPI.LED = new window.nexpaqAPI.module.LED();
window.nexpaqAPI.TFCard = window.nexpaqAPI.Backup = window.nexpaqAPI.USBStick = window.nexpaqAPI.Speaker = new window.nexpaqAPI.module.USBDevice();
window.nexpaqAPI.Hotkey = new window.nexpaqAPI.module.Hotkey();
window.nexpaqAPI.Laser = new window.nexpaqAPI.module.Laser();
window.nexpaqAPI.HaT = new window.nexpaqAPI.module.HaT();
window.nexpaqAPI.Alcohol = window.nexpaqAPI.AirQ = new window.nexpaqAPI.module.AirSensor();
window.nexpaqAPI.Battery = new window.nexpaqAPI.module.Battery();

window.nexpaqAPI.global = new window.nexpaqAPI.module.global();


/* =========== LOW LEVEL FUNCTIONS */
function receiveFromNative(content) {
	window.nexpaqAPI._receiveData(content);
}
function receiveDataFromCloud(json) {
	window.nexpaqAPI.global._dataLoaded(json);
}
function receiveLocationData(json) {
	window.nexpaqAPI.global._locationReceived(json);
}
function nxp_receiveEventsTableFromNative(table) {
	window.nexpaqAPI._receiveEvents(table);
}
function nxp_APIisReady() {
	// We cannot rely on it, must be removed from specification
	//window.nexpaqAPI._apiReady();
}
function nxp_XamarinApiReady() {
	window.nexpaqAPI._xamarinApiReady();
}
function clickBack() {
	window.nexpaqAPI.global._clickBackButton();
	if(window.nexpaqAPI.emulateMode) onNxpAppError("back button clicked", "", "", "", "");
}
function clickSocial() {
	window.nexpaqAPI.global._clickSocialButton();
	if(window.nexpaqAPI.emulateMode) onNxpAppError("social button clicked", "", "", "", "");
}
function chargeValue(num) {
	window.nexpaqAPI.global._updateCharge(num);
	if(window.nexpaqAPI.emulateMode) onNxpAppError("phone charge "+num, "", "", "", "");
}

/* =========== LOW LEVEL INITIAL COMMANDS */
if(typeof window.addEventListener !== "undefined") {
	window.addEventListener("load", function(event) {
		window.nexpaqAPI._pageReady();
	});
}




































/* JS functions Extensions & Polyfills*/
/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] === needle) return true;
   }
   return false;
}
/* isArray polyfill */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}
