Curiosity.directive('barchart', function(){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			datax :"=",
			datay :"=",
			pathx: "=",
			pathy: "=",
		},		
		
		link: function($scope, iElm, iAttrs) {
			if (typeof ($scope.datay) === "undefined") {
				$scope.datay = $scope.datax
			} 			

			console.log($scope.datay);

			var data = builtAllSeries($scope.datax, $scope.pathx, $scope.datay, $scope.pathy); 

			console.log(data);

			function getData(dataSet, path) {
				var i = 0;
				while (i < path.length) {		
					if (typeof dataSet[path[i]] === "undefined")
						return (null);
					dataSet = dataSet[path[i]];
					i++;
				}
				return (dataSet);
			}

			function builtSerie(name, datax, pathx, datay, pathy) {
				var res = {};
				res.key = name;
				var i = 0;
				res.values = [];
				while (i < datax.length) {
					var tmp = {};
					tmp.x = getData(datax[i], pathx);
					console.log(pathy);
					tmp.y = getData(datay[i], pathy);
					res.values.push(tmp);
					i++;
				}
				return (res);
			}

			function builtAllSeries(datax, pathx, datay, pathsy) {
				var res = [];
				var i = 0;
				var pathxArray = pathx.split('.'); 
				while (i < pathsy.length) {
					var tmp = builtSerie("test", datax, pathxArray, datay, pathsy[i].split('.'));
					res.push(tmp);
					i++;					
				}
				return (res);
			}
		}
	};
});

