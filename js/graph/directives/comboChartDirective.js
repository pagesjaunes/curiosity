Curiosity.directive('combochart', function($rootScope){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			'data' :"=",
			'cols' :"=",	
			'agg' 	:"=",
			'options' : "="
		},
		
		link: function($scope, elem, iAttrs) {
			var options = {};
			if (typeof $scope.options !== "undefined") {
				options = $scope.options
			}

			var data = new google.visualization.DataTable({
				cols: $scope.cols,
				rows: builtDataFromCols($scope.data, $scope.cols)
   			});

			var chart = new google.visualization.ComboChart(elem[0]);
			
			$(elem[0]).height("100%");
			chart.draw(data, options);

			function selectHandler(){
				var select = chart.getSelection();
				var  i = 0;
				while (i < select.length) {
					item = select[i];
					if (item.row != null) {
						filters.addFilter({type:'Terms', data:{field:$scope.agg.__ref__.field, term:data.getFormattedValue(item.row, 0)}});
					}
					i++;
				}			
			}
			// agg filters
			if (typeof $scope.agg !== "undefined")  {
				google.visualization.events.addListener(chart, 'select', selectHandler);	
			}

			$scope.$watch('data', updateChart);
			$scope.$on("workspaceChange", updateChart);			
			function updateChart() {	
				if($(elem).is(":visible")) {					
					var toto = new google.visualization.DataTable({
					cols: $scope.cols,
					rows: builtDataFromCols($scope.data, $scope.cols)
					});
					chart.draw(toto, options);		
				}
			}
		}
	};
});
