Curiosity.directive('diffchart', function($rootScope){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			'data' 	:"=",
			'cols1' :"=",
			'cols2' :"=",
			'options' : "="
		},
		
		link: function($scope, elem, iAttrs) {
			if (typeof $scope.options === "undefined") {
				$scope.options = {};
			}

			var chart = new google.visualization.BarChart(elem[0]);

			var data1 = new google.visualization.DataTable({
				cols: $scope.cols1,
				rows: builtDataFromCols($scope.data, $scope.cols1)
   			});

   			var data2 = new google.visualization.DataTable({
				cols: $scope.cols2,
				rows: builtDataFromCols($scope.data, $scope.cols2)
   			});

   			var data = chart.computeDiff(data1, data2);

			
			$(elem[0]).height("100%");

			chart.draw(data, $scope.options);

			$scope.$watch('data',updateChart);
			$scope.$on("workspaceChange", updateChart);

			function updateChart() {	
				if($(elem).is(":visible")) {					
					data1 = new google.visualization.DataTable({
					cols: $scope.cols1,
					rows: builtDataFromCols($scope.data, $scope.cols1)
					});
					data2 = new google.visualization.DataTable({
					cols: $scope.cols2,
					rows: builtDataFromCols($scope.data, $scope.cols2)
   					});
		   			data = chart.computeDiff(data1, data2); 
					chart.draw(data, $scope.options);		
				}
			}
		}
	};
});
