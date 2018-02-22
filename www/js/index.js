/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var MarkerPoints = [];
var map;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        document.getElementById('action').addEventListener('click', action, false);
        document.getElementById('MyLocation').addEventListener('click', MyLocation, false);
        document.getElementById('distance').addEventListener('click', distance, false);
        document.getElementById('reset').addEventListener('click', reset, false);
        document.getElementById('markers').addEventListener('click', function markers(event){

                if(document.getElementById('markerOptions').style.display == 'block') {
                    document.getElementById('markerOptions').style.display = 'none';
                } else {
                    document.getElementById('markerOptions').style.display = 'block';
                }
        }, false);

        var div = document.getElementById("map_layout");
        map = plugin.google.maps.Map.getMap(div);
        map.one(plugin.google.maps.event.MAP_READY, function() {
            //to execute map

            
            console.log("--> map_layout : ready.");
        });
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


function GetHTTP(Url)
{
    var httpxml = new XMLHttpRequest();
    httpxml.open("GET", Url, false);
    httpxml.send(null);
    return httpxml.responseText;
}


function action(event) {

    var address = document.getElementById('address').value.split(' ').join('+');

    var response = JSON.parse(GetHTTP('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyAzyEtYc9VE1RWg6KMPknM_PhaWevsYUM8'));

    var longit = response.results[0].geometry.location.lng;
    var latit = response.results[0].geometry.location.lat;
 //add marker
    map.addMarker({
        'position':{lat:latit, lng:longit},
        'title': address.split('+').join(' '),
        'snippet': 'Lat: '+latit+' Lng:'+longit
    }, function(marker) {

        //adds long and lat to info
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            obj = {
                'Lat': latit,
                'Lng': longit
            }

          // alert(MarkerPoints.length);

            if(MarkerPoints.length < 2) {
                MarkerPoints.push(obj);
                alert('Marker added');
            } else {
                alert('Too many Markers, Reset it');
            }
        })
    });
}
function MyLocation(event){

    map.getMyLocation(function onSucces(location) {
         map.addMarker({
        'position':{lat:location.latLng.lat, lng:location.latLng.lng},
        'title': 'Current Location',
        'snippet': 'Lat: '+location.latLng.lat+' Lng:'+location.latLng.lng
    }, function(marker) {
        // add lat and long to info
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            obj = {
                'lat': location.latLng.lat,
                'lng': location.latLng.lng
            }

           // alert(MarkerPoints.length);

            if(MarkerPoints.length < 2) {
                MarkerPoints.push(obj);
                alert('Marker added ');
            } else {
                alert('Too many Markers in Calculation, Reset');
            }
        })
    });
    }, function Failure(){});

}

function distance(event) {

    if(MarkerPoints.length != 2) {
        alert("Incorrect Amount of Markers, Try Again")
    } else {
        var distance = plugin.google.maps.geometry.spherical.computeDistanceBetween(MarkerPoints[0], MarkerPoints[1]);

        alert('Distance: '+Math.round(distance/1000)+'km');
    }
}
function reset(event){
    MarkerPoints = [];
}
app.initialize();