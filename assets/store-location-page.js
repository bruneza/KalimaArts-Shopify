//https://api.mapbox.com/{endpoint}?access_token={your_access_token}

let StoreLocation = {
  loadStoreLocation() {  
    let { container } = this;
    this.mapConfig = JSON.parse(document.querySelector("#map-config").innerHTML);
    this.elms = {
      mapContainer: document.querySelector("#map"),
      storeListContainer: document.querySelector(".js-store-list"),
      storeItemElements: document.querySelectorAll(".js-store-item"),
      styleButtons: document.querySelectorAll(".js-map-style"),
      searchForm: document.querySelector(".js-search-form"),
      markerCustomTemplate: document.querySelector(".js-marker-custom"),
    };

    this.loadMarkers().then(response => response.json()).then((markers) => {
      this.markers = markers;

      this.mapBoxOptions = {
        accessToken: this.mapConfig.accessToken,
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: this.mapConfig.startPoint,
        zoom: markers.features.length ? this.mapConfig.zoom : 1,
        styles: {
          "satellite-streets-v10": "mapbox://styles/mapbox/satellite-streets-v10",
          "streets-v11": "mapbox://styles/mapbox/streets-v11",
        },
      };
      this.buildLocationList();
      this.initMap();
    });
  },

  loadMarkers() {
    return fetch(theme.locationsUrl, { dataType: "json" });
  },

  buildLocationList() {
    let storeListContainer = $('.js-store-list')[0];
    let template = storeListContainer.firstElementChild;
    let storeItemActive;

    storeListContainer.innerHTML = template.outerHTML;

    this.markers.features.forEach((marker, index) => {
      marker.id = index;
      let { properties, geometry } = marker;
      let node = document.createElement("div"); 
      let el = storeListContainer.appendChild(node);
      el.innerHTML = template.innerHTML
        .replace(
          "{{address}}",
          !!properties["Full Address"]
            ? [properties["Store Name"], properties["Full Address"]].join(", ")
            : [
                properties["Store Name"],
                properties["Address"],
                properties["City"],
                properties["State"],
                properties["Country"],
              ]
                .filter(Boolean)
                .join(", "),
        )
        .replace(/{{phone}}/g, "")
        .replace(/{{website}}/g, "");
      el.setAttribute("data-id", index);
      el.classList.add("store-item", "js-store-item", "d-flex");
      if (index === 0) {
        // el.addClass("active");
      }

      el.addEventListener("click", (e) => {
        this.activeMarkerCustom(index);

        if ((storeItemActive = storeListContainer.querySelector(".store-item.active"))) {
          storeItemActive.classList.remove("active");
        }

        el.classList.add("active");
        this.map.jumpTo({
          zoom: this.mapBoxOptions.zoom,
          center: geometry.coordinates,
        });
        this.createPopup(marker);
      });
    });
  },

  initMap() {
    let map = (window.map = this.map = new Map(this.mapBoxOptions));

    map.on("load", () => {
      this.addMarkersToMap();
      // this.createPopup(this.markers.features[0]);
      this.initLocationFilter();
      this.initStyleChangeEvent();
    });
  },

  addMarkersToMap() {
    let { markerCustomTemplate } = this.elms;

    this.markers.features.forEach((marker, index) => {
      let {
        id,
        geometry: { coordinates },
      } = marker;
      let el = markerCustomTemplate.cloneNode(true);
      el.classList.remove("d-none");
      el.setAttribute("data-id", id);
      el.addEventListener("click", () => {
        this.createPopup(marker);
        this.activeStoreItem(id);
        this.activeMarkerCustom(id);
      });
      if (index === 0) {
        el.classList.add("active");
      }
      new Marker(el).setLngLat(coordinates).addTo(this.map);
    });
  },

  initLocationFilter() {
    let { accessToken } = this.mapConfig;
    let { searchForm } = this.elms;
    let urlAPI;
    let turfOptions = { steps: 80, units: "kilometers" };

    this.circleData = turf.circle([0, 0], 0, turfOptions);

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let zoomObject = {
        5: 11.5,
        10: 10.7,
        15: 10.2,
        20: 9.6,
        25: 9.5,
        50: 8.4,
        100: 7.4,
      };
      let { zip, distance, country } = [...new FormData(searchForm).entries()].reduce((accu, value) => {
        accu[value[0]] = value[1];
        return accu;
      }, {});

      if (!zip.trim()) {
        alert('Please enter Postal\/Zipcode');
        return;
      }

      urlAPI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?country=${country}&types=postcode,place&access_token=${accessToken}&limit=5`;

      fetch(urlAPI, { dataType: "json" }).then(response => response.json()).then((results) => {
        if (!results.features.length) {
          alert('No matching location found');
          return;
        }
        let { center } = results.features[0];

        this.circleData = turf.circle(center, distance, turfOptions);
        this.map.jumpTo({ center, zoom: zoomObject[distance] });
        this.circleToMap();
        let from = turf.point(center);
        this.markers.features.map((marker) => {
          let to = turf.point(marker.geometry.coordinates);

          marker.properties.distance = turf.distance(from, to, turfOptions);
        });
        this.markers.features.sort(function (a, b) {
          if (a.properties.distance > b.properties.distance) {
            return 1;
          }
          if (a.properties.distance < b.properties.distance) {
            return -1;
          }
          return 0;
        });
        this.buildLocationList();
      });
    });
  },

  initStyleChangeEvent() {
    let { styleButtons } = this.elms;

    styleButtons.forEach((button) => {
      let { style } = button.dataset;
      button.addEventListener("click", () => {
        this.map.setStyle(this.mapBoxOptions.styles[style], { diff: false });
      });
    });

    this.map.on("styledata", () => {
      this.circleToMap();
    });
  },

  activeMarkerCustom(id) {
    let { mapContainer } = this.elms,
      el;
    if ((el = mapContainer.querySelector(".js-marker-custom.active"))) {
      el.classList.remove("active");
    }
    if ((el = mapContainer.querySelector(`.js-marker-custom[data-id='${id}']`))) {
      el.classList.add("active");
    }
  },

  activeStoreItem(id) {
    let { storeListContainer } = this.elms,
      el;
    if ((el = storeListContainer.querySelector(".js-store-item.active"))) {
      el.classList.remove("active");
    }

    if ((el = storeListContainer.querySelector(`.js-store-item[data-id='${id}']`))) {
      el.classList.add("active");
    }
  },

  circleToMap() {
    let sourceInfo, layerInfo;
    if ((sourceInfo = this.map.getSource("source_circle"))) {
      sourceInfo.setData(this.circleData);
    } else {
      this.map.addSource("source_circle", {
        type: "geojson",
        data: this.circleData,
      });
    }

    if (!(layerInfo = this.map.getLayer("circle"))) {
      this.map.addLayer({
        id: "circle",
        type: "fill",
        source: "source_circle",
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.4,
          "fill-outline-color": "yellow",
        },
      });
    }
  },

  createPopup(marker) {
    let { mapContainer } = this.elms;
    let { properties, geometry } = marker;
    let popup = mapContainer.querySelector(".mapboxgl-popup");
    !!popup && popup.remove();

    new Popup({ offset: 20, closeOnClick: false })
      .setLngLat(geometry.coordinates)
      .setHTML(
        `<div class="info">
          <div class="address js-address">${
            !!properties["Full Address"]
              ? [properties["Store Name"], properties["Full Address"]].join(", ")
              : [
                  properties["Store Name"],
                  properties["Address"],
                  properties["City"],
                  properties["State"],
                  properties["Country"],
                ]
                  .filter(Boolean)
                  .join(", ")
          }</div>
          </div>`,
        // <div class="phone"><a href="tel:${properties.phone}">${properties.phone}</a></div>
        // <div class="website"><a href="${properties.website}" target="_blank">${properties.website}</a></div>
      )
      .addTo(this.map);
  },

  init : function(){
    this.loadStoreLocation();
  }
};
  
jQuery(document).ready(function($) {
  StoreLocation.init();
})
