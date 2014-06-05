Curiosity.directive('geopoint', function () {
	return  {
		restrict : 'A',
		link : function ($scope, element, attrs) {
			var dataset = JSON.parse(attrs.dataset);
			var width = 1000;
			var height = 600;

			var path = d3.geo.path();
			var projection = d3.geo.conicConformal() // Lambert-93
			.center([2.454071, 47.279229]) // On centre la carte sur la France
			.scale(2000)
			.translate([width / 2, height / 2]);

			path.projection(projection); // On assigne la projection au path

			var svg = d3.select(element[0])
			.append("svg")
			.attr("width", width)
			.attr("height", height);

			var deps = svg
			.append("g")
			.attr("id", "departements");

			function updateMap() {
				var i = 0;
				/*var circles = svg.selectAll("circle");
				circle.remove();*/
				dataset = JSON.parse(attrs.dataset);
				while (i < dataset.length) {
					var coor = projection([dataset[i]._source.geo.long, dataset[i]._source.geo.lat]);
					deps.append('svg:circle')
        			.attr('cx', coor[0])
        			.attr('cy', coor[1])
        			.attr('r', 2)
        			.append("svg:title")
        			.text(dataset[i]._source.denomination)
        			;
					i++;
				}
			}

			$scope.$on("QueryLaunched" , updateMap);

			d3.json('data/departements.json', function(req, geojson) {

				var features = deps
				.selectAll("path")
				.data(geojson.features);

				var colorScale = d3.scale.category20c();
				features.enter()
				.append("path")
				.attr('class', 'departement')
				.attr('fill', "#ffffff")
				.attr("d", path)
				.on('click', countyClickHandler);
			
				updateMap();
								
			});


			var centered;
			function countyClickHandler(d) {
				var x, y, k;

				if (d && centered !== d) {
					var centroid = path.centroid(d);
					x = centroid[0];
					y = centroid[1];
					k = 5;
					centered = d;
				} else {
					x = width / 2;
					y = height / 2;
					k = 1;
					centered = null;
				}

				deps.selectAll("path")
				.classed("active", centered && function(d) { return d === centered; });

				var trStr = "translate(" + width / 2 + "," + height / 2 + ")" +
				"scale(" + k + ")translate(" + -x + "," + -y + ")";

				deps.transition()
				.duration(1000)
				.attr("transform", trStr);
			};
		}
	}
});