Curiosity.directive('geopoint', function (query) {
	return  {
		restrict : 'A',
		scope : {
			dataset: '=dataset' 
		},
		link : function ($scope, element, attrs) {
			var dataset = $scope.dataset;
			if (typeof(dataset) === "undefined") {
				dataset = query.info.result;
			}

			var width = 200;
			var height = 300;
			var	color = "#000000";
			var latWay = attrs.latway.split('.');
			var longWay = attrs.longway.split('.');

			if (typeof(attrs.width) !== "undefined")
				width = attrs.width;
			if (typeof(attrs.height) !== "undefined")
				height = attrs.height;
			if (typeof(attrs.color) !== "undefined") 
				color = attrs.color;

			function getValue(obj, path){
				var i = 0;
				while (i < path.length) {
					obj = obj[path[i]];
					i++;
				}
				return (obj);
			}

			var path = d3.geo.path();
			var projection = d3.geo.conicConformal() // Lambert-93
			.center([2.454071, 47.279229]) // On centre la carte sur la France
			.scale(1500)
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
				var tmp = query.info.result.hits;
				if (typeof(tmp) === "undefined") {
					return 
				}
				
				tmp	= tmp.hits;
				if (typeof(tmp) !== "undefined") {
					while (i < tmp.length) {
						var coor = projection([getValue(tmp[i], longWay), getValue(tmp[i], latWay)]);
						deps.append('svg:circle')
	        			.attr('cx', coor[0])
	        			.attr('cy', coor[1])
	        			.attr('fill', color)
	        			.attr('r', 2)
	        			.attr("ng-click","select("+i+")")
	        			.append("svg:title")
	        			.text(tmp[i]._source.denomination);
						i++;
					}
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