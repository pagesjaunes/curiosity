Curiosity.directive('piechart', function($rootScope){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			data :"=",
			pathx: "=",
			pathy: "=",
		},		
		
		link: function($scope, elem, iAttrs) {
			
			var data = builtAllSeries($scope.data, $scope.pathx, $scope.data, $scope.pathy);
			data = data.pop().values
			var w = $(elem).width()
			var h = w
			var chart = nv.models.pieChart()
							.x(function(d) { return d.x })
							.y(function(d) { return d.y })
							.width(w)
							.height(h)
							.margin({top:20,right:20,bottom:20,left:20})
							//.showLabels(true)
			if(w<150)
			{
				chart.showLegend(false)
					 .showLabels(true)
			}

			nv.utils.windowResize(chart.update)

			$scope.$watch('data', function () {
				data = builtAllSeries($scope.data, $scope.pathx, $scope.data, $scope.pathy); 
				data = data.pop().values
				svg.datum(data);
				chart.update();
			});

			var svg = d3.select(elem[0])
				.append('svg')
				.attr('width',w)
				.attr('height',h)
				.style('width',w)
				.style('height',h)
				.attr('class','piechart')
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
				return (res);
			}
		}
	};
});

