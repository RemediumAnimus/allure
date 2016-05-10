$(document).ready(function() {

    function initialize() {

        var roadAtlasStyles = [
              {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    { "saturation": -100 },
                    { "lightness": 100 },
                    { "gamma": 1 }
                  ]
              }, {
                  "featureType": "road.arterial",
                  "elementType": "geometry",
                  "stylers": [
                    { "saturation": -100 },
                    { "gamma": 1 },
                    { "lightness": 0 }
                  ]
              }, {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                    { "saturation": -100 }
                  ]
              }, {
                  "featureType": "administrative",
                  "stylers": [
                    { "saturation": -100 },
                      { "lightness": 0 }
                  ]
              }, {
                  "featureType": "transit",
                  "stylers": [
                    { "saturation": -100 }
                  ]
              }, {
                  "featureType": "water",
                  "elementType": "geometry.fill",
                  "stylers": [
                    { "saturation": -100 }
                  ]
              }, {
                  "featureType": "road",
                  "stylers": [
                    { "saturation": -100 }
                  ]
              }, {
                  "featureType": "administrative",
                  "stylers": [
                    { "saturation": -100 }
                  ]
              }, {
                  "featureType": "landscape",
                  "stylers": [
                    { "saturation": -100 },
                      { "lightness": 70 }
                  ]
              }, {
                  "featureType": "poi",
                  "stylers": [
                    { "saturation": 0 },
                      { "gamma": 1 },
                      { "lightness": 80 }
                  ]
              }, {
                "elementType": 'labels.icon',
                "stylers": [{"visibility": 'off'}]
              },
              {
                "elementType": 'all',
                "stylers": [{ "lightness": 20 }]
              }
        ]

        var mapOptions = {zoom: 15,
            center: new google.maps.LatLng(55.7279713, 37.5791254),
            mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas']
            },
            disableDefaultUI: true
        };

        var Coordinates = [
           {lat: 55.7279713, lng: 37.5791254}
        ];

        var map = new google.maps.Map(document.getElementById('map'),mapOptions);
        var image = {
            url: 'img/mark.png',
            anchor: new google.maps.Point(10, 42)
        };
        var coords = {
            lat: Coordinates[0].lat,
            lng: Coordinates[0].lng,
        }
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: image,
        });

        var styledMapOptions = {

        };

        var usRoadMapType = new google.maps.StyledMapType(
            roadAtlasStyles, styledMapOptions);

        map.mapTypes.set('usroadatlas', usRoadMapType);
        map.setMapTypeId('usroadatlas');

    }

    initialize();
});
