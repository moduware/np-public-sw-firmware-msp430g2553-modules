window.nexpaqAPI.setCurrentModule("DevMod");
var last_data = [];
var module_type = 'msp'; // msp & max

function contextmenuHandler(e) {
	e.preventDefault();
	return false;
}
function generatePages() {
	var $pages = document.getElementById('pages'),
			number = module_type == 'max' ? 4 : 2,
			html = '';

	for(var i = 1; i <= number; i++) {
		html += '<div class="page page-' + i + '"><ul></ul></div>';
	}
	$pages.style.width = 100 * number + '%';
	$pages.innerHTML = html;
}
function generatePins() {
	var $pin_containers = document.getElementById('pages').children;
	for(var i=0; i<$pin_containers.length; i++) {
		var $list = $pin_containers[i].children[0];
		for(var j=0; j<8; j++) {
			var list_el = document.createElement('li');
			var number = (j + 8 * i);
			if(module_type == 'max' && number >= 0 && number <= 3) {
				list_el.setAttribute('data-type', 2);
			} else if(module_type == 'max' && number >= 17 && number <= 19) {
				list_el.setAttribute('data-type', 3);
			} else {
				list_el.setAttribute('data-type', 0);
			}

			list_el.setAttribute('data-id', number);
			list_el.id = 'pin-' + number;
			list_el.innerHTML = ' \
			  <div class="number">' + number + '</div> \
				<div class="name"></div> \
				<div class="controller"> \
					<div class="value">LOW</div> \
					<button class="output-lowhigh-toggler" data-value="LOW">LOW</button> \
					<select class="output-lowhigh"> \
						<option>LOW</option> \
						<option>HIGH</option> \
					</select> \
					<input class="output-percent" type="number" name="precent" value="0" min="0" max="100" step="1"> \
				</div>';
				list_el.children[1].addEventListener('click', pinClickHandler);
				list_el.getElementsByClassName('output-lowhigh-toggler')[0].addEventListener('click', selectLowHighClickHandler);
				list_el.getElementsByClassName('output-percent')[0].addEventListener('change', percentChangeHandler);
				$list.insertBefore(list_el, null);
		}

	}
}
function pinClickHandler(e) {
	if(module_type == 'msp') {
		pinClickHandlerMSP.call(this, e);
	} else if(module_type == 'max') {
		pinClickHandlerMAX.call(this, e);
	}
}
function pinClickHandlerMAX(e) {
	var $pin = this.parentNode;

	if(['pin-0', 'pin-1', 'pin-2', 'pin-3'].contains($pin.id)) return;
	if(['pin-17', 'pin-18', 'pin-19'].contains($pin.id)) return;
	var id = parseInt($pin.dataset.id);

	var type = parseInt($pin.dataset.type);
	type++;

	if(type > 3) type = 0;
	$pin.dataset.type = type;

	sendConfiguration();
	if(type == 3) {
		sendPWM();
	}
}
function pinClickHandlerMSP(e) {
	var $pin = this.parentNode;

	if($pin.id == 'pin-3') return;
	var id = parseInt($pin.dataset.id);

	var type = parseInt($pin.dataset.type);
	type++;

	if(type == 2 && id > 2) {
		type++;
	}
	if(type == 3 && (id < 4 || id > 5)) {
		type++;
	}

	if(type > 3) type = 0;
	$pin.dataset.type = type;

	sendConfiguration();
	if(type == 3) {
		sendPWM();
	}
}

function nextButtonClickHandler(e) {
	var $pages = document.getElementById('pages'),
			currentPage = parseInt($pages.dataset.page);

	currentPage++;
	if(currentPage > $pages.children.length) currentPage = 1;

	$pages.dataset.page = currentPage;
	setPage(currentPage);
}
function prevButtonClickHandler(e) {
	var $pages = document.getElementById('pages'),
			currentPage = parseInt($pages.dataset.page);

	currentPage--;
	if(currentPage <= 0) currentPage = $pages.children.length;

	$pages.dataset.page = currentPage;
	setPage(currentPage);
}
function setPage(number) {
	var $pages = document.getElementById('pages'),
			percent = -1 * 100 * (number - 1) / $pages.children.length;

	$pages.style.transform = "translateX(" + percent + "%)";
	$pages.style.webkitTransform = "translateX(" + percent + "%)";
}
function selectLowHighClickHandler(e) {
	var $select = this.parentNode.getElementsByClassName('output-lowhigh')[0];
	if(this.textContent == "LOW") {
		this.textContent = "HIGH";
		this.dataset.value = "HIGH";
		$select.value = "HIGH";
	} else {
		this.textContent = "LOW";
		this.dataset.value = "LOW";
		$select.value = "LOW";
	}

	sendConfiguration();
}
function percentChangeHandler(e) {
	var value = parseInt(this.value);
	if(isNaN(value)) value = 0;
	if(value < 0) value = 0;
	if(value > 100) value = 100;
	this.value = value;

	sendPWM();
}

function makeConfigurationArray() {
	var configuration = [],
			pins = module_type == 'max' ? 25 : 16;

	for(var i=0; i<pins; i++) {
		var $el = document.getElementById('pin-' + i),
		 		type = parseInt($el.dataset.type);

		if(type == 0) {
			value = 1;
		} else if(type == 1) {
			if($el.getElementsByClassName('output-lowhigh')[0].value == "LOW") {
				value = 2;
			} else {
				value = 3;
			}
		} else if(type == 2) {
			value = 4;
		} else if(type = 3) {
			value = 5;
		}
		if(module_type == 'msp' && $el.id == 'pin-3') {
			value = 0;
		}

		configuration.push(value);
	}

	console.log("Config:", configuration);
	return configuration;
}
function sendConfiguration() {
	var configuration = makeConfigurationArray();

	if(!nexpaqAPI.emulateMode) window.nexpaqAPI.DevMod.send("2700", configuration);
}
function sendPWM() {
	var pin_pwm_values = [],
			pins_with_pwm = [];
	if(module_type == 'msp') {
		pins_with_pwm = [4,5]
	} else if(module_type == 'max') {
		pins_with_pwm = [4,5,6,7,8,9,10,11,12,13,14,15,16,20,21,22,23,24,25];
	}
	for(var i=0; i<pins_with_pwm.length; i++) {
		var value = parseInt(document.getElementById('pin-' + pins_with_pwm[i]).getElementsByClassName('output-percent')[0].value);
		pin_pwm_values.push(value);
	}

	console.log("PWM:" , pin_pwm_values);
	if(!nexpaqAPI.emulateMode) window.nexpaqAPI.DevMod.send("2702", pin_pwm_values);
}
function dataReceived(received_data) {
	// Converting data to human format
	var data = [];
	var j = 0;
	var data_elements = module_type == 'max' ? 29 : 19;
	for(var i=0; i<data_elements; i++) {
		var $el = document.getElementById('pin-' + j),
				type = parseInt($el.dataset.type);
		if(i == 0 || i == 2 || i == 4 || (module_type == 'max' && i == 6)) {
			if(type == 0) {
				var value = received_data['element' + (i+1)];
			} else if(type == 2) {
				var v1 = received_data['element' + i];
				var v2 = received_data['element' + (i+1)];
				var value = ((v1 + v2) * 3.3) / 1023;
				//console.log(i, v1, v2, value);
				value = value.toFixed(2);
			} else if(type == 3) {
				var value = received_data['element' + (i + 1)];
			} else {
				var value = 0;
			}
			i++;
		} else {
			value = received_data['element' + i];
		}
		data[j] = value;
		j++;
	}
	if(!last_data.equals(data)) {
		var d = []; for(var i=0; i<data_elements; i++) d.push(received_data['element'+i]);
		console.log("Received original:", d);
		console.log("Received result:", data);

		last_data = data;
		renderData(data);
	}

}
function renderData(data) {
	var pins = module_type == 'max' ? 25 : 16;
	for(var i=0; i<pins; i++) {
		var $el = document.getElementById('pin-' + i),
		 		type = parseInt($el.dataset.type);

		if(type == 0) {
			$el.getElementsByClassName('value')[0].textContent = data[i]==0?'LOW':'HIGH';
		} else if(type == 2) {
			$el.getElementsByClassName('value')[0].textContent = data[i] + 'V';
		}
	}
}
function setMAXMode() {
	nexpaqAPI.header.cleanButtons();
	nexpaqAPI.header.addButton({title: 'MAX'}, setMSPMode);
	module_type = 'max';
	document.body.dataset.module = 'max';
	document.getElementById('pages').style.transform = 'translateX(0)';
	document.getElementById('pages').style.webkitTransform = 'translateX(0)';
	generatePages()
	generatePins();
}
function setMSPMode() {
	nexpaqAPI.header.cleanButtons();
	nexpaqAPI.header.addButton({title: 'MSP'}, setMAXMode);
	module_type = 'msp';
	document.body.dataset.module = 'msp';
	document.getElementById('pages').style.transform = 'translateX(0)';
	document.getElementById('pages').style.webkitTransform = 'translateX(0)';
	generatePages()
	generatePins();
}

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('prev-page').addEventListener('click', prevButtonClickHandler);
	document.getElementById('next-page').addEventListener('click', nextButtonClickHandler);
	nexpaqAPI.DevMod.addEventListener("onDataReceived", dataReceived);
	//By default we are in emulation mode
	nexpaqAPI.emulateMode = window.EmulateModule = !nexpaqAPI.isApiAvailable();

	generatePages()
	generatePins();

	if(!window.nexpaqAPI.emulateMode) {

	} else {
		console.log("nexpaqAPI: turning off emulation on real device");
	}
	document.body.removeEventListener('contextmenu', contextmenuHandler);
	//nexpaqAPI.header.addButton({title: 'MAX'}, setMSPMode);
	nexpaqAPI.header.addButton({title: 'MSP'}, setMAXMode);

});































if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
