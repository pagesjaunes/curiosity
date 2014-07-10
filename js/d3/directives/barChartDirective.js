Curiosity.directive('barchart', function($rootScope){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			datax :"=",
			datay :"=",
			pathy: "=",
			pathx: "=",
		},		
		
		link: function($scope, elem, iAttrs) {
			if (typeof ($scope.datay) === "undefined") {
				$scope.datay = $scope.datax
			} 			

			var path = iAttrs.datapath;
			var data = [];
			if (typeof(path) !== "undefined") {
				data = builtAllSeries(getData($scope.datax, path.split('.')), $scope.pathx, getData($scope.datay, path.split('.')), $scope.pathy);
			}
			else {
				data = builtAllSeries($scope.datax, $scope.pathx, $scope.datay, $scope.pathy); 
			}

			var w = $(elem).width()
			var h = w*2/3
			var chart = nv.models.multiBarChart()
							.width(w)
							.height(h)
							.margin({top:20,right:30,bottom:50,left:30})

			nv.utils.windowResize(chart.update)
			
			$rootScope.$on("QueryLaunched", function() {
				console.log($scope.datax);				
				if (typeof(path) !== "undefined") {
					data = builtAllSeries(getData($scope.datax, path.split('.')), $scope.pathx, getData($scope.datay, path.split('.')), $scope.pathy);
				}
				else {
					data = builtAllSeries($scope.datax, $scope.pathx, $scope.datay, $scope.pathy); 
				}
			});

			d3.select(elem[0])
				.append('svg')
				.attr('width',w)
				.attr('height',h)
				.style('width',w)
				.style('height',h)
				.attr('class','barchart')
				.datum(data)
				.call(chart)			

			function getData(dataSet, path, num) {
				var i = 0;
				while (i < path.length) {		
					if (typeof dataSet[path[i]] === "undefined")
						return (null);
					dataSet = dataSet[path[i]];
					i++;
				}
				if (num) {
					return (parseFloat(dataSet)); 
				}
				return (dataSet);
			}

			function builtSerie(datax, pathx, datay, pathy) {
				var res = {};
				res.key = pathy[pathy.length -1];
				var i = 0;
				res.values = [];
				while (i < datax.length) {
					var tmp = {};
					tmp.x = getData(datax[i], pathx);
					tmp.y = getData(datay[i], pathy, true);
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
					var tmp = builtSerie(datax, pathxArray, datay, pathsy[i].split('.'));
					res.push(tmp);
					i++;					
				}
				console.log(res);
				return (res);
			}
		}
	};
});

