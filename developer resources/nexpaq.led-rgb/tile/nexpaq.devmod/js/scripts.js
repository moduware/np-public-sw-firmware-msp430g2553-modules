window.EmulateModule = false;
window.nexpaqAPI.setCurrentModule('DevMod');

// Page completely loaded
document.addEventListener("DOMContentLoaded", function (e) {

 	// Actions when turn OFF
	document.getElementById('offbutton').addEventListener('click', function(e) {
		turnOff();
	});
	// Actions when turn on red
	document.getElementById('redb').addEventListener('click', function(e) {
		Red();
	});
	// Actions when turn on green
	document.getElementById('greenb').addEventListener('click', function(e) {
		Green();
	});
	// Actions when turn on blue
	document.getElementById('blueb').addEventListener('click', function(e) {
		Blue();
	});
	// Actions when turn on white
	document.getElementById('whiteb').addEventListener('click', function(e) {
		White();
	});
	// Actions when changing to any RGB color
	document.getElementById('rgb_button').addEventListener('click', function(e) {
		getRGB();
	});

	// Actions when back button clicked. The back button is automatically added by the native
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		turnOff();
		window.nexpaqAPI.util.closeApplication();
	});

	navigator.device.overrideBackButton();
	window.nexpaqAPI.global.addEventListener('onBackButtonClicked', function() {
		turnOff();
		window.nexpaqAPI.util.closeApplication();
	});
});
	//Turn off LED RGB
	function turnOff() {
		window.nexpaqAPI.DevMod.send("Primary_colors", [0]); //send Primary_colors, arg 0
	};
	//Red color
	function Red() {
		window.nexpaqAPI.DevMod.send("Primary_colors", [1]); //send Primary_colors, arg 1
	};
	//Green color
	function Green() {
		window.nexpaqAPI.DevMod.send("Primary_colors", [2]); //send Primary_colors, arg 2
	};
	//Blue color
	function Blue() {
		window.nexpaqAPI.DevMod.send("Primary_colors", [3]); //send Primary_colors, arg 3
	};
	//White color
	function White() {
		window.nexpaqAPI.DevMod.send("Primary_colors", [4]); //send Primary_colors, arg 4
	};
	// Actions when select any RGB color
	var R = 0;
	var G = 0;
	var B = 0;
	function getRGB() {
		var R=parseInt(document.getElementById('R_value').value);
		var G=parseInt(document.getElementById('G_value').value);
		var B=parseInt(document.getElementById('B_value').value);

		if(R < 0 || G < 0 || B < 0) return false;
		if(R > 255 || G > 255 || B > 255) return false;
		window.nexpaqAPI.DevMod.send("RGB_LED", [R, G, B]); //send 2702, arg R,G,B to MSP()
	};
