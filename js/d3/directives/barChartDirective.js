Curiosity.directive('barchart', function($rootScope){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			data  :"=",
			pathy : "=",
			pathx : "=",
		},		
		
		link: function($scope, elem, iAttrs) {
			
			var data = builtAllSeries($scope.data, $scope.pathx, $scope.data, $scope.pathy);

			var w = $(elem).width()
			var h = w*2/3
			var chart = nv.models.multiBarChart()
							.width(w)
							.height(h)
							.margin({top:20,right:30,bottom:50,left:30})

			nv.utils.windowResize(chart.update)
			
			var svg = d3.select(elem[0])
				.append('svg')
				.attr('width',w)
				.attr('height',h)
				.style('width',w)
				.style('height',h)
				.attr('class','barchart')
				.datum(data)
				.call(chart)

			$scope.$watch('data', function () {
				data = builtAllSeries($scope.data, $scope.pathx, $scope.data, $scope.pathy); 
				svg.datum(data);
				chart.update()	

			});

			$rootScope.$on("AggregationUpdated", function() {
			});

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
				return (res);
			}
		}
	};
});

