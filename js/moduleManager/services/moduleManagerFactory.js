Curiosity.factory('moduleManager', function(){
	var moduleManagerObj = {}; 
	moduleManagerObj.info = {};

	moduleManagerObj.info.moduleBlocks = {}; 	 

	moduleManagerObj.registerModuleBlock = function (name) {
		if (typeof(moduleManagerObj.info.moduleBlocks[name]) === "undefined") {
			moduleManagerObj.info.moduleBlocks[name] = {"name":name, "display":true, "modules":[]};
			return (moduleManagerObj.info.moduleBlocks[name]);
		}
	}

	moduleManagerObj.registerModule = function (moduleName, template, moduleBlockName) {
		if (typeof(moduleManagerObj.info.moduleBlocks[moduleBlockName]) !== "undefined") {
			moduleManagerObj.info.moduleBlocks[moduleBlockName].modules.push({"name":moduleName, "display":true, "template":template});
		}
	}

	moduleManagerObj.hideModuleBlock = function (moduleBlockName) {
		if (typeof(moduleManagerObj.info.moduleBlocks[moduleBlockName]) !== "undefined") {
			moduleManagerObj.info.moduleBlocks[moduleBlockName].modules.display = false;	
		}
	}

	moduleManagerObj.showModuleBlock = function (moduleBlockName) {
		if (typeof(moduleManagerObj.info.moduleBlocks[moduleBlockName]) !== "undefined") {
			moduleManagerObj.info.moduleBlocks[moduleBlockName].modules.display = true;	
		}
	}

	moduleManagerObj.hideModule = function (moduleBlockName, moduleName) {
		if (typeof(moduleManagerObj.info.moduleBlocks[moduleBlockName]) !== "undefined") {
			var module = findModule(moduleName,moduleManagerObj.info.moduleBlocks[moduleBlockName]);
			if (typeof(module) !== "undefined") {
				module.display = false;				
			}
		}
	}

	moduleManagerObj.showModule = function (moduleBlockName, moduleName) {
		if (typeof(moduleManagerObj.info.moduleBlocks[moduleBlockName]) !== "undefined"){
			var module = findModule(moduleName,moduleManagerObj.info.moduleBlocks[moduleBlockName]);
			if (typeof(module) !== "undefined") {
				module.display = true;				
			}
		}
	}

	moduleManagerObj.getModuleBlock = function (moduleBlockName) {
		if (typeof(moduleManagerObj.info.moduleBlocks[moduleBlockName]) !== "undefined"){
			return (moduleManagerObj.info.moduleBlocks[moduleBlockName]);
		}
		else {
			return (moduleManagerObj.registerModuleBlock(moduleBlockName));
		}
	}

	function findModule(name, block) {
		for (key in block.modules) {
			if (block.modules[key].name == name) {
				return (block.modules[key]);
			}
		}
	}

	return (moduleManagerObj);
})
