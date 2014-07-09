Curiosity.directive('barchart', function(){


	return {
		scope:{
			data:"="
		},
		restrict : 'A',
		link: function($scope, elem, attrs) {
			console.log('barchart',$scope.data)


			var seriesData = $scope.data.map(function(d)
			{
				return {
					x:d._source.quiQuoi_normalized,
					y:d._source.nb_requetes
				}
			})

			var data = [{key:'nb_requetes',values:seriesData}]



			console.log(data)

			var w = $(elem).width()
			var h = w*2/3
			console.log('elem.load',w,h)
			var chart = nv.models.multiBarChart()
							.width(w)
							.height(h)
							.margin({top:20,right:30,bottom:50,left:30})

			nv.utils.windowResize(chart.update)

			d3.select(elem[0])
				.append('svg')
				.attr('width',w)
				.attr('height',h)
				.style('width',w)
				.style('height',h)
				.attr('class','barchart')
				.datum(data)
				.call(chart)			


			

		}
	}
});