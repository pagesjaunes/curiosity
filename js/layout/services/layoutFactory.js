Curiosity.factory('layout', function($rootScope, context, moduleManager){
	var layoutObj = {};
	layoutObj.info = {};
	layoutObj.info.workspaces = []; 
	layoutObj.info.currentWorkspace = {};
	layoutObj.info.idx = 0;

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
	}

	layoutObj.nextWorkspace = function () {
		layoutObj.info.idx++;
		if (layoutObj.info.idx == layoutObj.info.workspaces.length) {
			layoutObj.info.idx = 0;
		}
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[layoutObj.info.idx]; 
	}

	layoutObj.prevWorkspace = function () {
		layoutObj.info.idx--;
		if (layoutObj.info.idx < 0) {
			layoutObj.info.idx = layoutObj.info.workspaces.length - 1;
		}
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[layoutObj.info.idx]; 
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

	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("layout", layoutObj.info);
		layoutObj.info.currentWorkspace = layoutObj.info.workspaces[layoutObj.info.idx];
	});


	$rootScope.$on("UpdateContext", function () {
		context.setContextInformation("layout", layoutObj.info);
	});
	
	return (layoutObj);
});