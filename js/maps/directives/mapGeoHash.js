
/*
template : 

<div >
	<div style="height:20px" />
	<div style="position:absolute;overflow:hidden;width:100%;height:100%">
		<div mapgeohash data="agg.buckets" 
			mapid="YOUR LEAFLET MAP PROVIDER HERE" 
			center="[46.853,3.823]"
			zoom="5"
			></div>
	</div>
</div>

*/

Curiosity.directive('mapgeohash', function($rootScope){
	// Runs during compile
	return {
		restrict :'A',
		
		scope: {
			'data' 	:"=",
			'zoom'  :"=",
			'center':"=",
			'mapid'	:"@",
			'mapattribution':"@",
			
			'dragging':"="
			
		},
		
		link: function($scope, elem, iAttrs) {
			if (typeof $scope.options === "undefined") {
				$scope.options = {};
			}


			if(!$scope.hasOwnProperty('data'))
			{
				console.log('mapGeoHash no data')
				return;
			}


			var mapDiv = elem[0]

			//remove scrollbars of module-block's parent
			removeParentScrollBars(mapDiv,'module-block')

			//find min and max
			//for color scale
			//default min = 0 ?
			var minmax = [0,0]

			$scope.data.forEach(function(d){
				if(d.doc_count>minmax[1])
					minmax[1] = d.doc_count
				if(d.doc_count<minmax[0])
					minmax[0] = d.doc_count
			})

			var mapID = $scope.mapid
			var mapattribution = $scope.mapattribution

			var allowDragging = ($scope.dragging !== undefined) ?
									$scope.dragging : 
									true//bug in chrome with dragging

			var zoom = ($scope.zoom !== undefined)? $scope.zoom : 5;
			var center = ($scope.center !== undefined)? 
								$scope.center :
								[46.853, 3.823] //France by default
								


			var map = null

			var datalayer = null
			var datalayerOption = null



			$scope.$watch('data',updateMap);
			$scope.$on("workspaceChange", updateMap);

			function selectHandler(){
			
			}
			
			function removeParentScrollBars(elem, parentClassName)
			{
				var parents = $(elem).parents()
				for(var i=0;i<parents.length;i++)
				{
					if(parents[i].className==parentClassName)
					{
						// next parent has unnecessary scrollbars 
						$(parents[i+1]).attr('style','overflow:hidden;')
						break;
					}
				}
			}

			function updateMap() {	
				if(map==null)
				{

					$(mapDiv).height("100%");

					map = L.map(mapDiv,{
						//disable zooming
						touchZoom:false,
						doubleClickZoom:true,
						scrollWheelZoom:true,
						boxZoom:true,
						inertia:false,
						zoomControl:true,
						attributionControl:true,
						dragging:allowDragging,
						keyboard:false


					}).setView(center, zoom);

					var legendControl = new L.Control.Legend();
					legendControl.addTo(map);


					// add an OpenStreetMap tile layer
					L.tileLayer(mapID, {
					    attribution: mapattribution
					}).addTo(map);

					var fillColorFunction = new L.HSLHueFunction(
							new L.Point(minmax[0],200), 
							new L.Point(minmax[1],0), 
							{outputSaturation: '100%', outputLuminosity: '50%'}
							);
	

					datalayerOption = {
						recordsField: 'geohash',
						geohashField: 'key',
						displayOptions: {
							//doc_count : value in agg data
							doc_count: {
								color: '#FF0000',
								fillColor: fillColorFunction,
								gradient: false,
								text: function (value) {
									return {
										text: value,
										style: {
											'font-size': '10px', 'font-weight': 'bold'
										}
									}
								}
							}

						},
						layerOptions: {
							fillOpacity: 0.7,							
							opacity: 0,
							weight: 1,
							gradient: false
						}
					};

					var layerData = {geohash:$scope.data}

					datalayer = new L.GeohashDataLayer(layerData,datalayerOption);


					map.addLayer(datalayer);
						

					L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);

					
				}else{
					
					//update existing map

					map.removeLayer(datalayer)

					var layerData = {geohash:$scope.data}

					datalayer = new L.GeohashDataLayer(layerData,datalayerOption);
					map.addLayer(datalayer);
					//L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
				}

			}
		}
	};
});