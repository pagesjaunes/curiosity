Curiosity.factory('layout', function($rootScope, context, moduleManager){
	var layoutObj = {};
	layoutObj.info = {};
	layoutObj.info.workspaces = []; 
	layoutObj.info.currentWorkspace = {};
	layoutObj.info.idx = 0;
	layoutObj.info.turn = false;
		
	layoutObj.init = function () {
		context.registerModule("layout", layoutObj);		
	}

	layoutObj.load = function (obj) {
		for (key in obj) {
			layoutObj.info[key] = obj[key];
		}
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[layoutObj.info.idx];
	}

	layoutObj.store = function () {
		return (layoutObj.info);	
	}

	layoutObj.switchWorkspaceEvent = function(){
		setTimeout(function () {
			$rootScope.$broadcast("workspaceChange");
		}, 100);
	}

	layoutObj.updateIntervale = function (turn, time) {
		if (turn) {
			layoutObj.info.turn = true;	
			layoutObj.info.interval = setInterval(function(){layoutObj.nextWorkspace();$rootScope.$apply()}, time);
		}
		
		else {	
			layoutObj.info.turn = false;
			if (typeof(layoutObj.info.interval) !== "undefined") {
				clearInterval(layoutObj.info.interval);
			}		
		}
	}

	layoutObj.newWorkspace = function () {
		var newWS = {};
		newWS.name = "ws" +  Math.floor((Math.random() * 1000000) + 1);
		newWS.displayName = "New Workspace";
		newWS.col = 0;
		newWS.row = 0; 
		newWS.new = true;
		newWS.cards = [];
		newWS.idx = layoutObj.info.workspaces.length;
		layoutObj.info.workspaces.push(newWS);
		layoutObj.info.currentWorkspace = newWS;
		layoutObj.info.idx = layoutObj.info.workspaces.length - 1;
		layoutObj.switchWorkspaceEvent();
	}

	layoutObj.nextWorkspace = function () {
		layoutObj.info.idx++;
		if (layoutObj.info.idx == layoutObj.info.workspaces.length) {
			layoutObj.info.idx = 0;
		}
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[layoutObj.info.idx]; 
		layoutObj.switchWorkspaceEvent();
	}

	layoutObj.prevWorkspace = function () {
		layoutObj.info.idx--;
		if (layoutObj.info.idx < 0) {
			layoutObj.info.idx = layoutObj.info.workspaces.length - 1;
		}
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[layoutObj.info.idx]; 
		layoutObj.switchWorkspaceEvent()
	}

	layoutObj.goTo = function (idx) {
		if (idx >= layoutObj.info.workspaces.length) {
			idx = layoutObj.info.workspaces.length - 1;
		}
		else if (idx < 0) {
			idx = 0;
		}
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[idx];
		layoutObj.info.idx = idx;
		layoutObj.switchWorkspaceEvent();
	}

	layoutObj.removeWorkspace = function (idx) {
		moduleManager.cleanModuleStartingBy(layoutObj.info.workspaces[idx].name);
		layoutObj.info.workspaces.splice(idx, 1);
		if (idx == layoutObj.info.idx) {
			if (idx == 0 && !layoutObj.info.workspaces.length) {
				layoutObj.newWorkspace();
			}
			else if (idx == 0) {
				layoutObj.info.currentWorkspace = layoutObj.info.workspaces[0];
			}
			else {
				layoutObj.prevWorkspace();
			}
		}
		layoutObj.switchWorkspaceEvent()
	}

	layoutObj.modifyWorkspace = function () {
		layoutObj.info.currentWorkspace.new = true;
	}

	layoutObj.setData = function (name, col, row) {
		layoutObj.info.currentWorkspace.displayName = name;
		layoutObj.info.currentWorkspace.col = col;
		layoutObj.info.currentWorkspace.row = row;
		layoutObj.info.currentWorkspace.new = false;
		layoutObj.info.currentWorkspace.cards = [];
		var i = 0;
		while (i < row) {
			layoutObj.info.currentWorkspace.cards.push([]);
			var j = 0;
			while (j < col) {
				var card = {};
				card.row = i;
				card.col = j;
				card.colType = "col-xs-" + 12 / col;
				card.rowType = "row-" + 12 / row;
				card.name = layoutObj.info.currentWorkspace.name + '-r' + card.row + '-c' + card.col;
				layoutObj.info.currentWorkspace.cards[i].push(card);
				j++;		
			}
			i++;
		}
	}

	return (layoutObj);
});