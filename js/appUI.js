(function(){
   // Global vars
   var $mapCanvas = $('#mapCanvas')
    , $vlt = $('#pfx_volette')
    , $adrsInput = $('#pfx_inputBtn')
    , $adrsGo = $('#pfx_inputField');

  // TEXTFIELD BLURRING
  $(".textField").focus(function(){
    if ($(this).val() == $(this)[0].title){
        $(this).removeClass("textFieldActive");
        $(this).val("");
    }
  });

  $(".textField").blur(function(){
    if ($(this).val() == ""){
        $(this).addClass("textFieldActive");
        $(this).val($(this)[0].etitle);
    }
  });

  $(".textField").blur();

  // BEGIN GEOCODING
  var geocoder
    , firstRun = true
    , markerGroup;
  geocoder = new google.maps.Geocoder();
  var geoCode = function(address){
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat()
          , lng = results[0].geometry.location.lng()
          , latLng = new L.LatLng(lat, lng);
          map.panTo(latLng);
          // Set the zoom to whatever you want.
          // the higher the number the greater the zoom.
          map.setZoom(8);
          
          // Optional, place a marker
          if (firstRun == false){
            map.removeLayer(markerGroup)
          }

          var marker = L.marker([lat, lng]);
          markerGroup = L.layerGroup([marker]);
          map.addLayer(markerGroup);
          firstRun = false;
      
        } else {
          //console.log('Geocder fail: ' + status)
        }
      });
  }
  // Geocoding buttons
  $adrsInput.click(function(){
    var addrs = $adrsGo.val();
    geoCode(addrs);
  });
  // also enable the button when you hit return
  $(document).keydown(function(e) {
    if (e.keyCode==13) { // return key
        $adrsInput.trigger('click');
      }
  }); // End geocoding

  
  // Define hover box behavior
  $mapCanvas.mousemove(function(e){
    var xOffset = e.pageX
      , yOffset = e.pageY
      , xBuffer = 10

      , vlt_height = $vlt.height()
      , vlt_width = $vlt.width()

      , mapCanvas_height = $mapCanvas.height()
      , mapCanvas_width = $mapCanvas.width()
    
      , mapCanvas_offsetLeft = $mapCanvas.offset().left
      , mapCanvas_offsetTop = $mapCanvas.offset().top;
    
    // If it goes against the left wall
    if (xOffset < (vlt_width/2) + xBuffer){
      $vlt.css({
        'top': yOffset + 50,
        'left': xBuffer
      });
    // If it goes against the right wall
    }else if(xOffset > mapCanvas_width - vlt_width/2 - xBuffer*4){
      $vlt.css({
        'top': yOffset + 50,
        'left': mapCanvas_width - vlt_width/2 - xBuffer*4 - vlt_width/2
      });
    }else{
      $vlt.css({
        'top': yOffset + 50,
        'left': xOffset - vlt_width/2
      });
    }
    

  }); // End hover box behavior
})();