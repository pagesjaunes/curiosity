Curiosity.directive('barchart', function(){
	return {
		restrict : 'A',
		link: function($scope, element, attrs) {
			var dataset = [{key:"berry", doc_count:890}, {key:"toto", doc_count:155}, {key:"bibi", doc_count:6500},{key:"berry", doc_count:645},{key:"berry", doc_count:750}];
			// TODO :  set width and height dynamicly
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = attrs.width - margin.left - margin.right,
			height = attrs.height - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
			.domain(d3.range(dataset.length))
			.rangeRoundBands([0, width], .1)

			var y = d3.scale.linear()
			.domain([0, d3.max(dataset, function (d){return	d[attrs.abscissa]})])
			.range([height, 0 ])

			var xAxis = d3.svg.axis()
    		.scale(x)
    		.orient("bottom");

			var yAxis = d3.svg.axis()
    		.scale(y)
    		.orient("left")
    		.ticks(10);

			/* xScale initialisation
			var xAxis = d3.scale.ordinal()
			

			 yScale initialisation
			var yAxis = d3.scale.linear()
			*/

			//Create SVG element
			var svg = d3.select(element[0])
			.append("svg")
			.attr("width", width)
			.attr("height", height);

			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(attrs.abscissa);

			svg.selectAll(".bar")
			.data(dataset)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d, i) {
				return x(i); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { 
				return y(d.doc_count); })
			.attr("height", function(d) { return height - y(d[attrs.abscissa]); });
		}
	}
});