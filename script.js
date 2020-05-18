var map;
var info;
var loc;

var markers = [];
var services;
var request;
var req;
var id;
var delTimes = 0;

function initMap() {

    // Create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.266666, lng: -97.733330},
        zoom: 15
    });
    
    // Reset the value of the search box
    document.getElementById('search').value = '';
    var input = document.getElementById('search');
    
    // Create new searchbox constructor
    var searchName = new google.maps.places.SearchBox(input);
    
    // Set search to stay within bounds first
    map.addListener('bounds_changed', function() {
        searchName.setBounds(map.getBounds());
    })

    info = new google.maps.InfoWindow();

    services = new google.maps.places.PlacesService(map);
    
    
    // When user selects prediction from list
    
    searchName.addListener('places_changed', function() {

        var delOldList = document.getElementById('toDel');

        if (delOldList !== null) {
            for (var i = 0; i < delTimes; i += 1){
                document.getElementById('toDel').remove();
            }
            delTimes = 0;
        }

        var bounds = new google.maps.LatLngBounds();

        // Var to get places
        var places = searchName.getPlaces();

        var v = places.place_id;

        var set = new google.maps.LatLng(places);

        // console.log(places.place_id);
 
        // If no places then just return (do nothing)
        if (places.length === 0) {
            return;
        }
 
        places.forEach(function (p) {
            // If no data then just return (do nothing)
            if (!p.geometry) {
                return;
            }

            if (p.geometry.viewport) {
                bounds.union(p.geometry.viewport);
            } else {
                bounds.extend(p.geometry.location);
            }
            clearResults(markers);

            request = {
                location: p.geometry.location,
                radius: 16093,
                types: ['bar']
            };

            // console.log(p.place_id);

            id = p.place_id;

            // services.getDetails(req, function(place, status) {
            //     // console.log("1");
            //     // console.log(place);

            //     createList(place);
                
            //     for (var i = 0; i < place.length; i++) {
            //         markers.push(createList(place[i]));
            //         //console.log("2");
            //     }
            // });

            //console.log(v);
              
        });


        map.fitBounds(bounds);
  

        services.nearbySearch(request, callback);
    });
}

function callback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            markers.push(createMarker(results[i]));
            //console.log(results[i].place_id);

            req = {
                placeId: results[i].place_id,
                fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'photos', 'icon', 'opening_hours', 'website']
            };

            services.getDetails(req, function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {

                    console.log(place.photos);

                    codeToInsert = '<div class="d-flex justify-content-center">' +
                                        '<div class="placeBox border rounded my-3 px-2 w-75 position-relative" id="toDel">' +
                                                    '<div class"pic position-absolute">' +
                                                        '<img src="' + place.photos[0].getUrl(place) + '" alt="Place photo" class="photo position-absolute rounded">' +
                                                    ' </div>' +
                                                    '<h2 class="position-absolute name">' + place.name + '</h2>' +
                                                    '<p class="position-absolute rating">Rating: ' + '<mark class="text-success">' + place.rating + '</mark>' + '</p>' +
                                                    '<p class="position-absolute adress">' + place.formatted_address + '</p>' +
                                                    '<p class="position-absolute num">' + place.formatted_phone_number + '</p>' +
                                                    '<p class="position-absolute site"><a href="' + place.website + '">Visit Website</a></p>' +
                                        '</div>' +
                                    '</div>';
                
                    document.getElementById("insert").insertAdjacentHTML("afterend", codeToInsert);
                    delTimes += 1;
                }
            });
      
        }
        //console.log("marker" + markers);
    }
}

function createMarker(val) {
    var location = val.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: val.geometry.location,
        icon: './assets/cocktail.png'
    });

    google.maps.event.addListener(marker, 'click', function () {
        info.setContent(val.name);
        info.open(map, this);
    })

    return marker;
}

function createList(val) {

    one = val.name;

    return one;
}

function clearResults(markers) {
    for (var m in markers) {
        markers[m].setMap(null);
    }
    markers = [];
    //console.log("clear");
}