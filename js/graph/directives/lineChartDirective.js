Curiosity.directive('linechart', function(){
	return {
		scope: { 
			'data' : "=",
			'cols' : "=",
			'options' : "="
		},
		restrict: 'A',
		link: function($scope, elem) {
			var options = {};
			if (typeof $scope.options !== "undefined") {
				options = $scope.options
			}

			var data = new google.visualization.DataTable({
				cols: $scope.cols,
				rows: builtDataFromCols($scope.data, $scope.cols)
   			});

			var chart = new google.visualization.LineChart(elem[0]);
			
			$(elem[0]).height("100%");
			chart.draw(data, options);

			$scope.$watch('data',updateChart);
			$scope.$on("workspaceChange", updateChart);
			function updateChart() {	
				if($(elem).is(":visible")) {					
					data = new google.visualization.DataTable({
					cols: $scope.cols,
					rows: builtDataFromCols($scope.data, $scope.cols)
					});
					chart.draw(data, options);		
				}
			}
		}
	};
});