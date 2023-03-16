(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"), require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe", "three"], factory);
	else if(typeof exports === 'object')
		exports["ARjs"] = factory(require("aframe"), require("three"));
	else
		root["ARjs"] = factory(root["AFRAME"], root["THREE"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_aframe__, __WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-webcam-texture", {
  init: function () {
    this.scene = this.el.sceneEl;
    this.texCamera = new three__WEBPACK_IMPORTED_MODULE_1__.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
    this.texScene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();

    this.scene.renderer.autoClear = false;
    this.video = document.createElement("video");
    this.video.setAttribute("autoplay", true);
    this.video.setAttribute("playsinline", true);
    this.video.setAttribute("display", "none");
    document.body.appendChild(this.video);
    this.geom = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(); //0.5, 0.5);
    this.texture = new three__WEBPACK_IMPORTED_MODULE_1__.VideoTexture(this.video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
    this.texScene.add(mesh);
  },

  play: function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch((e) => {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            `Webcam error: ${e}`
          );
        });
    } else {
      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "sorry - media devices API not supported"
      );
    }
  },

  tick: function () {
    this.scene.renderer.clear();
    this.scene.renderer.render(this.texScene, this.texCamera);
    this.scene.renderer.clearDepth();
  },

  pause: function () {
    this.video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  },

  remove: function () {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/arjs-device-orientation-controls.js":
/*!***************************************************************************!*\
  !*** ./aframe/src/new-location-based/arjs-device-orientation-controls.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/**
 * arjs-device-orientation-controls
 *
 * Replaces the standard look-controls component to provide mobile device
 * orientation controls.
 *
 * A lightweight A-Frame wrapper round the modified three.js
 * DeviceOrientationControls used in the three.js location-based API.
 *
 * Creates the THREE object using using the three.js camera, and allows update
 * of the smoothing factor.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-device-orientation-controls", {
  schema: {
    smoothingFactor: {
      type: "number",
      default: 1,
    },
  },

  init: function () {
    this._orientationControls = new THREEx.DeviceOrientationControls(
      this.el.object3D
    );
  },

  update: function () {
    this._orientationControls.smoothingFactor = this.data.smoothingFactor;
  },

  tick: function () {
    this._orientationControls.update();
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-camera.js":
/*!*********************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-camera.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../three.js/build/ar-threex-location-only.js */ "./three.js/build/ar-threex-location-only.js");
/* harmony import */ var _three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-new-camera", {
  schema: {
    simulateLatitude: {
      type: "number",
      default: 0,
    },
    simulateLongitude: {
      type: "number",
      default: 0,
    },
    simulateAltitude: {
      type: "number",
      default: -Number.MAX_VALUE,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    positionMinAccuracy: {
      type: "number",
      default: 100,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
    initialPositionAsOrigin: {
      type: "boolean",
      default: false,
    },
  },

  init: function () {
    this._testForOrientationControls();

    this.threeLoc = new _three_js_build_ar_threex_location_only_js__WEBPACK_IMPORTED_MODULE_1__.LocationBased(
      this.el.sceneEl.object3D,
      this.el.object3D,
      {
        initialPositionAsOrigin: this.data.initialPositionAsOrigin,
      }
    );

    this.threeLoc.on("gpsupdate", (gpspos) => {
      this._currentPosition = {
        longitude: gpspos.coords.longitude,
        latitude: gpspos.coords.latitude,
      };
      this._sendGpsUpdateEvent(gpspos.coords.longitude, gpspos.coords.latitude);
    });

    this.threeLoc.on("gpserror", (code) => {
      const msg = [
        "User denied access to GPS.",
        "GPS satellites not available.",
        "Timeout communicating with GPS satellites - try moving to a more open area.",
      ];
      if (code >= 1 && code <= 3) {
        this._displayError(msg[code - 1]);
      } else {
        this._displayError(`Unknown geolocation error code ${code}.`);
      }
    });

    // Use arjs-device-orientation-controls on mobile only, with standard
    // look-controls disabled (this interferes with the readings from the
    // sensors). On desktop, use standard look-controls instead.

    const mobile = this._isMobile();
    this.el.setAttribute("look-controls-enabled", !mobile);
    if (mobile) {
      this.el.setAttribute("arjs-device-orientation-controls", true);
    }

    // from original gps-camera component
    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      this._setupSafariOrientationPermissions();
    }

    this.el.sceneEl.addEventListener("gps-entity-place-added", (e) => {
      const entityPlace = e.detail.component.components["gps-new-entity-place"];
      if (this._currentPosition) {
        entityPlace.setDistanceFrom(this._currentPosition);
      }
    });
  },

  update: function (oldData) {
    this.threeLoc.setGpsOptions({
      gpsMinAccuracy: this.data.positionMinAccuracy,
      gpsMinDistance: this.data.gpsMinDistance,
      maximumAge: this.data.gpsTimeInterval,
    });
    if (
      (this.data.simulateLatitude !== 0 || this.data.simulateLongitude !== 0) &&
      (this.data.simulateLatitude != oldData.simulateLatitude ||
        this.data.simulateLongitude != oldData.simulateLongitude)
    ) {
      this.threeLoc.stopGps();
      this.threeLoc.fakeGps(
        this.data.simulateLongitude,
        this.data.simulateLatitude
      );
      this.data.simulateLatitude = 0;
      this.data.simulateLongitude = 0;
    }
    if (this.data.simulateAltitude > -Number.MAX_VALUE) {
      this.threeLoc.setElevation(this.data.simulateAltitude + 1.6);
    }
  },

  play: function () {
    if (this.data.simulateLatitude === 0 && this.data.simulateLongitude === 0) {
      this.threeLoc.startGps();
    }
  },

  pause: function () {
    this.threeLoc.stopGps();
  },

  latLonToWorld: function (lat, lon) {
    return this.threeLoc.lonLatToWorldCoords(lon, lat);
  },

  getInitialPosition: function () {
    return this.threeLoc.initialPosition;
  },

  _sendGpsUpdateEvent: function (lon, lat) {
    this.el.emit("gps-camera-update-position", {
      position: {
        longitude: lon,
        latitude: lat,
      },
    });
  },

  _testForOrientationControls: function () {
    const msg =
      "WARNING - No orientation controls component, app will not respond to device rotation.";
    if (
      !this.el.components["arjs-device-orientation-controls"] &&
      !this.el.components["look-controls"]
    ) {
      this._displayError(msg);
    }
  },

  _displayError: function (error) {
    const arjs = this.el.sceneEl.systems["arjs"];
    if (arjs) {
      arjs._displayErrorPopup(error);
    } else {
      alert(error);
    }
  },

  // from original gps-camera component
  _setupSafariOrientationPermissions: function () {
    // iOS 13+
    if (
      typeof window.DeviceOrientationEvent?.requestPermission === "function"
    ) {
      var handler = function () {
        console.log("Requesting device orientation permissions...");
        DeviceOrientationEvent.requestPermission();
        document.removeEventListener("touchend", handler);
      };

      document.addEventListener(
        "touchend",
        function () {
          handler();
        },
        false
      );

      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "After camera permission prompt, please tap the screen to activate geolocation."
      );
    } else {
      var timeout = setTimeout(() => {
        this.el.sceneEl.systems["arjs"]._displayErrorPopup(
          "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
        );
      }, 750);
      window.addEventListener(
        "deviceorientation",
        function () {
          clearTimeout(timeout);
        },
        { once: true }
      );
    }
  },

  _isMobile: function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      return true;
    }
    return false;
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-entity-place.js":
/*!***************************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-entity-place.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_1__.registerComponent("gps-new-entity-place", {
  schema: {
    longitude: {
      type: "number",
      default: 0,
    },
    latitude: {
      type: "number",
      default: 0,
    },
  },

  init: function () {
    const camera = document.querySelector("[gps-new-camera]");
    if (!camera.components["gps-new-camera"]) {
      console.error("gps-new-camera not initialised");
      return;
    }
    this._cameraGps = camera.components["gps-new-camera"];

    camera.addEventListener("gps-camera-update-position", (e) => {
      this.distance = this._haversineDist(e.detail.position, this.data);
    });

    this.el.sceneEl.emit("gps-entity-place-added", {
      component: this.el,
    });
  },

  update: function () {
    const projCoords = this._cameraGps.threeLoc.lonLatToWorldCoords(
      this.data.longitude,
      this.data.latitude
    );
    this.el.object3D.position.set(
      projCoords[0],
      this.el.object3D.position.y,
      projCoords[1]
    );
  },

  setDistanceFrom: function (position) {
    this.distance = this._haversineDist(position, this.data);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    const dlongitude = three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },
});


/***/ }),

/***/ "./three.js/build/ar-threex-location-only.js":
/*!***************************************************!*\
  !*** ./three.js/build/ar-threex-location-only.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! three */ "three"));
	else {}
})(this, (__WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./three.js/src/location-based/js/device-orientation-controls.js":
/*!***********************************************************************!*\
  !*** ./three.js/src/location-based/js/device-orientation-controls.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_904__) => {

__nested_webpack_require_904__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_904__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* binding */ DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_904__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_904__.n(three__WEBPACK_IMPORTED_MODULE_0__);
// Modified version of THREE.DeviceOrientationControls from three.js
// will use the deviceorientationabsolute event if available



const _zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);
const _euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();
const _q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();
const _q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const _changeEvent = { type: "change" };

class DeviceOrientationControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {
  constructor(object) {
    super();

    if (window.isSecureContext === false) {
      console.error(
        "THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)"
      );
    }

    const scope = this;

    const EPS = 0.000001;
    const lastQuaternion = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians

    this.TWO_PI = 2 * Math.PI;
    this.HALF_PI = 0.5 * Math.PI;
    this.orientationChangeEventName =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";

    this.smoothingFactor = 1;

    const onDeviceOrientationChangeEvent = function (event) {
      scope.deviceOrientation = event;
    };

    const onScreenOrientationChangeEvent = function () {
      scope.screenOrientation = window.orientation || 0;
    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    const setObjectQuaternion = function (
      quaternion,
      alpha,
      beta,
      gamma,
      orient
    ) {
      _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(_euler); // orient the device

      quaternion.multiply(_q1); // camera looks out the back of the device, not the top

      quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
    };

    this.connect = function () {
      onScreenOrientationChangeEvent(); // run once on load

      // iOS 13+

      if (
        window.DeviceOrientationEvent !== undefined &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener(
                "orientationchange",
                onScreenOrientationChangeEvent
              );
              window.addEventListener(
                scope.orientationChangeEventName,
                onDeviceOrientationChangeEvent
              );
            }
          })
          .catch(function (error) {
            console.error(
              "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
              error
            );
          });
      } else {
        window.addEventListener(
          "orientationchange",
          onScreenOrientationChangeEvent
        );
        window.addEventListener(
          scope.orientationChangeEventName,
          onDeviceOrientationChangeEvent
        );
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent
      );
      window.removeEventListener(
        scope.orientationChangeEventName,
        onDeviceOrientationChangeEvent
      );

      scope.enabled = false;
    };

    this.update = function () {
      if (scope.enabled === false) return;

      const device = scope.deviceOrientation;

      if (device) {
        let alpha = device.alpha
          ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.alpha) + scope.alphaOffset
          : 0; // Z

        let beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.beta) : 0; // X'

        let gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.gamma) : 0; // Y''

        const orient = scope.screenOrientation
          ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(scope.screenOrientation)
          : 0; // O

        if (this.smoothingFactor < 1) {
          if (this.lastOrientation) {
            const k = this.smoothingFactor;
            alpha = this._getSmoothedAngle(
              alpha,
              this.lastOrientation.alpha,
              k
            );
            beta = this._getSmoothedAngle(
              beta + Math.PI,
              this.lastOrientation.beta,
              k
            );
            gamma = this._getSmoothedAngle(
              gamma + this.HALF_PI,
              this.lastOrientation.gamma,
              k,
              Math.PI
            );
          } else {
            beta += Math.PI;
            gamma += this.HALF_PI;
          }

          this.lastOrientation = {
            alpha: alpha,
            beta: beta,
            gamma: gamma,
          };
        }

        setObjectQuaternion(
          scope.object.quaternion,
          alpha,
          this.smoothingFactor < 1 ? beta - Math.PI : beta,
          this.smoothingFactor < 1 ? gamma - this.HALF_PI : gamma,
          orient
        );

        if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          lastQuaternion.copy(scope.object.quaternion);
          scope.dispatchEvent(_changeEvent);
        }
      }
    };

    // NW Added
    this._orderAngle = function (a, b, range = this.TWO_PI) {
      if (
        (b > a && Math.abs(b - a) < range / 2) ||
        (a > b && Math.abs(b - a) > range / 2)
      ) {
        return { left: a, right: b };
      } else {
        return { left: b, right: a };
      }
    };

    // NW Added
    this._getSmoothedAngle = function (a, b, k, range = this.TWO_PI) {
      const angles = this._orderAngle(a, b, range);
      const angleshift = angles.left;
      const origAnglesRight = angles.right;
      angles.left = 0;
      angles.right -= angleshift;
      if (angles.right < 0) angles.right += range;
      let newangle =
        origAnglesRight == b
          ? (1 - k) * angles.right + k * angles.left
          : k * angles.right + (1 - k) * angles.left;
      newangle += angleshift;
      if (newangle >= range) newangle -= range;
      return newangle;
    };

    this.dispose = function () {
      scope.disconnect();
    };

    this.connect();
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/location-based.js":
/*!**********************************************************!*\
  !*** ./three.js/src/location-based/js/location-based.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_8392__) => {

__nested_webpack_require_8392__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_8392__.d(__webpack_exports__, {
/* harmony export */   "LocationBased": () => (/* binding */ LocationBased)
/* harmony export */ });
/* harmony import */ var _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_8392__(/*! ./sphmerc-projection.js */ "./three.js/src/location-based/js/sphmerc-projection.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_8392__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_8392__.n(three__WEBPACK_IMPORTED_MODULE_1__);



class LocationBased {
  constructor(scene, camera, options = {}) {
    this._scene = scene;
    this._camera = camera;
    this._proj = new _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__.SphMercProjection();
    this._eventHandlers = {};
    this._lastCoords = null;
    this._gpsMinDistance = 0;
    this._gpsMinAccuracy = 100;
    this._maximumAge = 0;
    this._watchPositionId = null;
    this.setGpsOptions(options);
    this.initialPosition = null;
    this.initialPositionAsOrigin = options.initialPositionAsOrigin || false;
  }

  setProjection(proj) {
    this._proj = proj;
  }

  setGpsOptions(options = {}) {
    if (options.gpsMinDistance !== undefined) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.gpsMinAccuracy !== undefined) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
    if (options.maximumAge !== undefined) {
      this._maximumAge = options.maximumAge;
    }
  }

  startGps(maximumAge = 0) {
    if (this._watchPositionId === null) {
      this._watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this._gpsReceived(position);
        },
        (error) => {
          if (this._eventHandlers["gpserror"]) {
            this._eventHandlers["gpserror"](error.code);
          } else {
            alert(`GPS error: code ${error.code}`);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: maximumAge != 0 ? maximumAge : this._maximumAge,
        }
      );
      return true;
    }
    return false;
  }

  stopGps() {
    if (this._watchPositionId !== null) {
      navigator.geolocation.clearWatch(this._watchPositionId);
      this._watchPositionId = null;
      return true;
    }
    return false;
  }

  fakeGps(lon, lat, elev = null, acc = 0) {
    if (elev !== null) {
      this.setElevation(elev);
    }

    this._gpsReceived({
      coords: {
        longitude: lon,
        latitude: lat,
        accuracy: acc,
      },
    });
  }

  lonLatToWorldCoords(lon, lat) {
    const projectedPos = this._proj.project(lon, lat);
    if (this.initialPositionAsOrigin) {
      if (this.initialPosition) {
        projectedPos[0] -= this.initialPosition[0];
        projectedPos[1] -= this.initialPosition[1];
      } else {
        throw "Trying to use 'initial position as origin' mode with no initial position determined";
      }
    }
    return [projectedPos[0], -projectedPos[1]];
  }

  add(object, lon, lat, elev) {
    this.setWorldPosition(object, lon, lat, elev);
    this._scene.add(object);
  }

  setWorldPosition(object, lon, lat, elev) {
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    if (elev !== undefined) {
      object.position.y = elev;
    }
    [object.position.x, object.position.z] = worldCoords;
  }

  setElevation(elev) {
    this._camera.position.y = elev;
  }

  on(eventName, eventHandler) {
    this._eventHandlers[eventName] = eventHandler;
  }

  setWorldOrigin(lon, lat) {
    this.initialPosition = this._proj.project(lon, lat);
  }

  _gpsReceived(position) {
    let distMoved = Number.MAX_VALUE;
    if (position.coords.accuracy <= this._gpsMinAccuracy) {
      if (this._lastCoords === null) {
        this._lastCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        distMoved = this._haversineDist(this._lastCoords, position.coords);
      }
      if (distMoved >= this._gpsMinDistance) {
        this._lastCoords.longitude = position.coords.longitude;
        this._lastCoords.latitude = position.coords.latitude;

        if (this.initialPositionAsOrigin && !this.initialPosition) {
          this.setWorldOrigin(
            position.coords.longitude,
            position.coords.latitude
          );
        }

        this.setWorldPosition(
          this._camera,
          position.coords.longitude,
          position.coords.latitude
        );

        if (this._eventHandlers["gpsupdate"]) {
          this._eventHandlers["gpsupdate"](position, distMoved);
        }
      }
    }
  }

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from original A-Frame components
   */
  _haversineDist(src, dest) {
    const dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/sphmerc-projection.js":
/*!**************************************************************!*\
  !*** ./three.js/src/location-based/js/sphmerc-projection.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_14282__) => {

__nested_webpack_require_14282__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_14282__.d(__webpack_exports__, {
/* harmony export */   "SphMercProjection": () => (/* binding */ SphMercProjection)
/* harmony export */ });
class SphMercProjection {
  constructor() {
    this.EARTH = 40075016.68;
    this.HALF_EARTH = 20037508.34;
  }

  project(lon, lat) {
    return [this.lonToSphMerc(lon), this.latToSphMerc(lat)];
  }

  unproject(projected) {
    return [this.sphMercToLon(projected[0]), this.sphMercToLat(projected[1])];
  }

  lonToSphMerc(lon) {
    return (lon / 180) * this.HALF_EARTH;
  }

  latToSphMerc(lat) {
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    return (y * this.HALF_EARTH) / 180.0;
  }

  sphMercToLon(x) {
    return (x / this.HALF_EARTH) * 180.0;
  }

  sphMercToLat(y) {
    var lat = (y / this.HALF_EARTH) * 180.0;
    lat =
      (180 / Math.PI) *
      (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return lat;
  }

  getID() {
    return "epsg:3857";
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/webcam-renderer.js":
/*!***********************************************************!*\
  !*** ./three.js/src/location-based/js/webcam-renderer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_15680__) => {

__nested_webpack_require_15680__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_15680__.d(__webpack_exports__, {
/* harmony export */   "WebcamRenderer": () => (/* binding */ WebcamRenderer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_15680__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_15680__.n(three__WEBPACK_IMPORTED_MODULE_0__);


class WebcamRenderer {
  constructor(renderer, videoElement) {
    this.renderer = renderer;
    this.renderer.autoClear = false;
    this.sceneWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
    let video;
    if (videoElement === undefined) {
      video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
    } else {
      video = document.querySelector(videoElement);
    }
    this.geom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry();
    this.texture = new three__WEBPACK_IMPORTED_MODULE_0__.VideoTexture(video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.geom, this.material);
    this.sceneWebcam.add(mesh);
    this.cameraWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0,
      10
    );
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          width: 1280,
          height: 720,
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(`using the webcam successfully...`);
          video.srcObject = stream;
          video.play();
        })
        .catch((e) => {
          setTimeout(() => {
            this.createErrorPopup(
              "Webcam Error\nName: " + e.name + "\nMessage: " + e.message
            );
          }, 1000);
        });
    } else {
      setTimeout(() => {
        this.createErrorPopup("sorry - media devices API not supported");
      }, 1000);
    }
  }

  update() {
    this.renderer.clear();
    this.renderer.render(this.sceneWebcam, this.cameraWebcam);
    this.renderer.clearDepth();
  }

  dispose() {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  }

  createErrorPopup(msg) {
    if (!document.getElementById("error-popup")) {
      var errorPopup = document.createElement("div");
      errorPopup.innerHTML = msg;
      errorPopup.setAttribute("id", "error-popup");
      document.body.appendChild(errorPopup);
    }
  }
}




/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_19155__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_19155__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_19155__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nested_webpack_require_19155__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_19155__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_19155__.o(definition, key) && !__nested_webpack_require_19155__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_19155__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_19155__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************************!*\
  !*** ./three.js/src/location-based/index.js ***!
  \**********************************************/
__nested_webpack_require_19155__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_19155__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* reexport safe */ _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__.DeviceOrientationControls),
/* harmony export */   "LocationBased": () => (/* reexport safe */ _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__.LocationBased),
/* harmony export */   "WebcamRenderer": () => (/* reexport safe */ _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__.WebcamRenderer)
/* harmony export */ });
/* harmony import */ var _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_19155__(/*! ./js/location-based.js */ "./three.js/src/location-based/js/location-based.js");
/* harmony import */ var _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_19155__(/*! ./js/webcam-renderer.js */ "./three.js/src/location-based/js/webcam-renderer.js");
/* harmony import */ var _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_19155__(/*! ./js/device-orientation-controls.js */ "./three.js/src/location-based/js/device-orientation-controls.js");






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXVCLEdBQUcsbUJBQW1CO0FBQ3JFLHFCQUFxQix1Q0FBVTtBQUMvQjtBQUNBLDRCQUE0QixxREFBd0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7QUNqRjFCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ051RDtBQUNFO0FBQ3VCOztBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4L2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1widGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVEhSRUV4XCJdID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRIUkVFeFwiXSA9IGZhY3Rvcnkocm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pID0+IHtcbnJldHVybiAiLCIvLyBNb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSB0aHJlZS5qc1xuLy8gd2lsbCB1c2UgdGhlIGRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUgZXZlbnQgaWYgYXZhaWxhYmxlXG5cbmltcG9ydCB7XG4gIEV1bGVyLFxuICBFdmVudERpc3BhdGNoZXIsXG4gIE1hdGhVdGlscyxcbiAgUXVhdGVybmlvbixcbiAgVmVjdG9yMyxcbn0gZnJvbSBcInRocmVlXCI7XG5cbmNvbnN0IF96ZWUgPSBuZXcgVmVjdG9yMygwLCAwLCAxKTtcbmNvbnN0IF9ldWxlciA9IG5ldyBFdWxlcigpO1xuY29uc3QgX3EwID0gbmV3IFF1YXRlcm5pb24oKTtcbmNvbnN0IF9xMSA9IG5ldyBRdWF0ZXJuaW9uKC1NYXRoLnNxcnQoMC41KSwgMCwgMCwgTWF0aC5zcXJ0KDAuNSkpOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcblxuY29uc3QgX2NoYW5nZUV2ZW50ID0geyB0eXBlOiBcImNoYW5nZVwiIH07XG5cbmNsYXNzIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcihvYmplY3QpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIlRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IERldmljZU9yaWVudGF0aW9uRXZlbnQgaXMgb25seSBhdmFpbGFibGUgaW4gc2VjdXJlIGNvbnRleHRzIChodHRwcylcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZSA9IHRoaXM7XG5cbiAgICBjb25zdCBFUFMgPSAwLjAwMDAwMTtcbiAgICBjb25zdCBsYXN0UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLm9iamVjdC5yb3RhdGlvbi5yZW9yZGVyKFwiWVhaXCIpO1xuXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcbiAgICB0aGlzLnNjcmVlbk9yaWVudGF0aW9uID0gMDtcblxuICAgIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgICB0aGlzLlRXT19QSSA9IDIgKiBNYXRoLlBJO1xuICAgIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG4gICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9XG4gICAgICBcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvd1xuICAgICAgICA/IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiXG4gICAgICAgIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuXG4gICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gICAgY29uc3Qgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuICAgIH07XG5cbiAgICBjb25zdCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cbiAgICBjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKFxuICAgICAgcXVhdGVybmlvbixcbiAgICAgIGFscGhhLFxuICAgICAgYmV0YSxcbiAgICAgIGdhbW1hLFxuICAgICAgb3JpZW50XG4gICAgKSB7XG4gICAgICBfZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihfZXVsZXIpOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMSk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTAuc2V0RnJvbUF4aXNBbmdsZShfemVlLCAtb3JpZW50KSk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpOyAvLyBydW4gb25jZSBvbiBsb2FkXG5cbiAgICAgIC8vIGlPUyAxMytcblxuICAgICAgaWYgKFxuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICApIHtcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBVbmFibGUgdG8gdXNlIERldmljZU9yaWVudGF0aW9uIEFQSTpcIixcbiAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzY29wZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICApO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICk7XG5cbiAgICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgbGV0IGFscGhhID0gZGV2aWNlLmFscGhhXG4gICAgICAgICAgPyBNYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmFscGhhKSArIHNjb3BlLmFscGhhT2Zmc2V0XG4gICAgICAgICAgOiAwOyAvLyBaXG5cbiAgICAgICAgbGV0IGJldGEgPSBkZXZpY2UuYmV0YSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYmV0YSkgOiAwOyAvLyBYJ1xuXG4gICAgICAgIGxldCBnYW1tYSA9IGRldmljZS5nYW1tYSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXG5cbiAgICAgICAgY29uc3Qgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgICA/IE1hdGhVdGlscy5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcbiAgICAgICAgICA6IDA7IC8vIE9cblxuICAgICAgICBpZiAodGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGFzdE9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gdGhpcy5zbW9vdGhpbmdGYWN0b3I7XG4gICAgICAgICAgICBhbHBoYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGFscGhhLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5hbHBoYSxcbiAgICAgICAgICAgICAga1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJldGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBiZXRhICsgTWF0aC5QSSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYmV0YSxcbiAgICAgICAgICAgICAga1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGdhbW1hID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgZ2FtbWEgKyB0aGlzLkhBTEZfUEksXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmdhbW1hLFxuICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICBNYXRoLlBJXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXRhICs9IE1hdGguUEk7XG4gICAgICAgICAgICBnYW1tYSArPSB0aGlzLkhBTEZfUEk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24gPSB7XG4gICAgICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgICAgICBiZXRhOiBiZXRhLFxuICAgICAgICAgICAgZ2FtbWE6IGdhbW1hLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxuICAgICAgICAgIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLFxuICAgICAgICAgIGFscGhhLFxuICAgICAgICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSA/IGJldGEgLSBNYXRoLlBJIDogYmV0YSxcbiAgICAgICAgICB0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEgPyBnYW1tYSAtIHRoaXMuSEFMRl9QSSA6IGdhbW1hLFxuICAgICAgICAgIG9yaWVudFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICg4ICogKDEgLSBsYXN0UXVhdGVybmlvbi5kb3Qoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pKSA+IEVQUykge1xuICAgICAgICAgIGxhc3RRdWF0ZXJuaW9uLmNvcHkoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pO1xuICAgICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoX2NoYW5nZUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBOVyBBZGRlZFxuICAgIHRoaXMuX29yZGVyQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgICAgaWYgKFxuICAgICAgICAoYiA+IGEgJiYgTWF0aC5hYnMoYiAtIGEpIDwgcmFuZ2UgLyAyKSB8fFxuICAgICAgICAoYSA+IGIgJiYgTWF0aC5hYnMoYiAtIGEpID4gcmFuZ2UgLyAyKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB7IGxlZnQ6IGEsIHJpZ2h0OiBiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyBsZWZ0OiBiLCByaWdodDogYSB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBOVyBBZGRlZFxuICAgIHRoaXMuX2dldFNtb290aGVkQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgaywgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgICAgY29uc3QgYW5nbGVzID0gdGhpcy5fb3JkZXJBbmdsZShhLCBiLCByYW5nZSk7XG4gICAgICBjb25zdCBhbmdsZXNoaWZ0ID0gYW5nbGVzLmxlZnQ7XG4gICAgICBjb25zdCBvcmlnQW5nbGVzUmlnaHQgPSBhbmdsZXMucmlnaHQ7XG4gICAgICBhbmdsZXMubGVmdCA9IDA7XG4gICAgICBhbmdsZXMucmlnaHQgLT0gYW5nbGVzaGlmdDtcbiAgICAgIGlmIChhbmdsZXMucmlnaHQgPCAwKSBhbmdsZXMucmlnaHQgKz0gcmFuZ2U7XG4gICAgICBsZXQgbmV3YW5nbGUgPVxuICAgICAgICBvcmlnQW5nbGVzUmlnaHQgPT0gYlxuICAgICAgICAgID8gKDEgLSBrKSAqIGFuZ2xlcy5yaWdodCArIGsgKiBhbmdsZXMubGVmdFxuICAgICAgICAgIDogayAqIGFuZ2xlcy5yaWdodCArICgxIC0gaykgKiBhbmdsZXMubGVmdDtcbiAgICAgIG5ld2FuZ2xlICs9IGFuZ2xlc2hpZnQ7XG4gICAgICBpZiAobmV3YW5nbGUgPj0gcmFuZ2UpIG5ld2FuZ2xlIC09IHJhbmdlO1xuICAgICAgcmV0dXJuIG5ld2FuZ2xlO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5kaXNjb25uZWN0KCk7XG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCgpO1xuICB9XG59XG5cbmV4cG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcbiIsImltcG9ydCB7IFNwaE1lcmNQcm9qZWN0aW9uIH0gZnJvbSBcIi4vc3BobWVyYy1wcm9qZWN0aW9uLmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY2xhc3MgTG9jYXRpb25CYXNlZCB7XG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBjYW1lcmEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xuICAgIHRoaXMuX3Byb2ogPSBuZXcgU3BoTWVyY1Byb2plY3Rpb24oKTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzID0ge307XG4gICAgdGhpcy5fbGFzdENvb3JkcyA9IG51bGw7XG4gICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSAwO1xuICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gMTAwO1xuICAgIHRoaXMuX21heGltdW1BZ2UgPSAwO1xuICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgdGhpcy5zZXRHcHNPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luID0gb3B0aW9ucy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiB8fCBmYWxzZTtcbiAgfVxuXG4gIHNldFByb2plY3Rpb24ocHJvaikge1xuICAgIHRoaXMuX3Byb2ogPSBwcm9qO1xuICB9XG5cbiAgc2V0R3BzT3B0aW9ucyhvcHRpb25zID0ge30pIHtcbiAgICBpZiAob3B0aW9ucy5ncHNNaW5EaXN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IG9wdGlvbnMuZ3BzTWluRGlzdGFuY2U7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmdwc01pbkFjY3VyYWN5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gb3B0aW9ucy5ncHNNaW5BY2N1cmFjeTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubWF4aW11bUFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9tYXhpbXVtQWdlID0gb3B0aW9ucy5tYXhpbXVtQWdlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0R3BzKG1heGltdW1BZ2UgPSAwKSB7XG4gICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24oXG4gICAgICAgIChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgIHRoaXMuX2dwc1JlY2VpdmVkKHBvc2l0aW9uKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXSkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc2Vycm9yXCJdKGVycm9yLmNvZGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChgR1BTIGVycm9yOiBjb2RlICR7ZXJyb3IuY29kZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAgICAgbWF4aW11bUFnZTogbWF4aW11bUFnZSAhPSAwID8gbWF4aW11bUFnZSA6IHRoaXMuX21heGltdW1BZ2UsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RvcEdwcygpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmYWtlR3BzKGxvbiwgbGF0LCBlbGV2ID0gbnVsbCwgYWNjID0gMCkge1xuICAgIGlmIChlbGV2ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldEVsZXZhdGlvbihlbGV2KTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncHNSZWNlaXZlZCh7XG4gICAgICBjb29yZHM6IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXG4gICAgICAgIGxhdGl0dWRlOiBsYXQsXG4gICAgICAgIGFjY3VyYWN5OiBhY2MsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgbG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCkge1xuICAgIGNvbnN0IHByb2plY3RlZFBvcyA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4pIHtcbiAgICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICBwcm9qZWN0ZWRQb3NbMF0gLT0gdGhpcy5pbml0aWFsUG9zaXRpb25bMF07XG4gICAgICAgIHByb2plY3RlZFBvc1sxXSAtPSB0aGlzLmluaXRpYWxQb3NpdGlvblsxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiVHJ5aW5nIHRvIHVzZSAnaW5pdGlhbCBwb3NpdGlvbiBhcyBvcmlnaW4nIG1vZGUgd2l0aCBubyBpbml0aWFsIHBvc2l0aW9uIGRldGVybWluZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtwcm9qZWN0ZWRQb3NbMF0sIC1wcm9qZWN0ZWRQb3NbMV1dO1xuICB9XG5cbiAgYWRkKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldik7XG4gICAgdGhpcy5fc2NlbmUuYWRkKG9iamVjdCk7XG4gIH1cblxuICBzZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICBjb25zdCB3b3JsZENvb3JkcyA9IHRoaXMubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gICAgaWYgKGVsZXYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb2JqZWN0LnBvc2l0aW9uLnkgPSBlbGV2O1xuICAgIH1cbiAgICBbb2JqZWN0LnBvc2l0aW9uLngsIG9iamVjdC5wb3NpdGlvbi56XSA9IHdvcmxkQ29vcmRzO1xuICB9XG5cbiAgc2V0RWxldmF0aW9uKGVsZXYpIHtcbiAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24ueSA9IGVsZXY7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSA9IGV2ZW50SGFuZGxlcjtcbiAgfVxuXG4gIHNldFdvcmxkT3JpZ2luKGxvbiwgbGF0KSB7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSB0aGlzLl9wcm9qLnByb2plY3QobG9uLCBsYXQpO1xuICB9XG5cbiAgX2dwc1JlY2VpdmVkKHBvc2l0aW9uKSB7XG4gICAgbGV0IGRpc3RNb3ZlZCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgaWYgKHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLl9ncHNNaW5BY2N1cmFjeSkge1xuICAgICAgaWYgKHRoaXMuX2xhc3RDb29yZHMgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbGFzdENvb3JkcyA9IHtcbiAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QodGhpcy5fbGFzdENvb3JkcywgcG9zaXRpb24uY29vcmRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXN0TW92ZWQgPj0gdGhpcy5fZ3BzTWluRGlzdGFuY2UpIHtcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzLmxhdGl0dWRlID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luICYmICF0aGlzLmluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICAgIHRoaXMuc2V0V29ybGRPcmlnaW4oXG4gICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbihcbiAgICAgICAgICB0aGlzLl9jYW1lcmEsXG4gICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc3VwZGF0ZVwiXSkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHN1cGRhdGVcIl0ocG9zaXRpb24sIGRpc3RNb3ZlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGhhdmVyc2luZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsYXQvbG9uIHBhaXJzLlxuICAgKlxuICAgKiBUYWtlbiBmcm9tIG9yaWdpbmFsIEEtRnJhbWUgY29tcG9uZW50c1xuICAgKi9cbiAgX2hhdmVyc2luZURpc3Qoc3JjLCBkZXN0KSB7XG4gICAgY29uc3QgZGxvbmdpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIGNvbnN0IGRsYXRpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIGNvbnN0IGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKlxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICpcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH1cbn1cblxuZXhwb3J0IHsgTG9jYXRpb25CYXNlZCB9O1xuIiwiY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7XG4gICAgdGhpcy5IQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG4gIH1cblxuICBwcm9qZWN0KGxvbiwgbGF0KSB7XG4gICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgfVxuXG4gIHVucHJvamVjdChwcm9qZWN0ZWQpIHtcbiAgICByZXR1cm4gW3RoaXMuc3BoTWVyY1RvTG9uKHByb2plY3RlZFswXSksIHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICB9XG5cbiAgbG9uVG9TcGhNZXJjKGxvbikge1xuICAgIHJldHVybiAobG9uIC8gMTgwKSAqIHRoaXMuSEFMRl9FQVJUSDtcbiAgfVxuXG4gIGxhdFRvU3BoTWVyYyhsYXQpIHtcbiAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCgoOTAgKyBsYXQpICogTWF0aC5QSSkgLyAzNjApKSAvIChNYXRoLlBJIC8gMTgwKTtcbiAgICByZXR1cm4gKHkgKiB0aGlzLkhBTEZfRUFSVEgpIC8gMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9Mb24oeCkge1xuICAgIHJldHVybiAoeCAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgfVxuXG4gIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgdmFyIGxhdCA9ICh5IC8gdGhpcy5IQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgIGxhdCA9XG4gICAgICAoMTgwIC8gTWF0aC5QSSkgKlxuICAgICAgKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoKGxhdCAqIE1hdGguUEkpIC8gMTgwKSkgLSBNYXRoLlBJIC8gMik7XG4gICAgcmV0dXJuIGxhdDtcbiAgfVxuXG4gIGdldElEKCkge1xuICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICB9XG59XG5cbmV4cG9ydCB7IFNwaE1lcmNQcm9qZWN0aW9uIH07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgdmlkZW9FbGVtZW50KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZVdlYmNhbSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIGxldCB2aWRlbztcbiAgICBpZiAodmlkZW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICAgIHZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlkZW8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodmlkZW9FbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTtcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZVdlYmNhbS5hZGQobWVzaCk7XG4gICAgdGhpcy5jYW1lcmFXZWJjYW0gPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKFxuICAgICAgLTAuNSxcbiAgICAgIDAuNSxcbiAgICAgIDAuNSxcbiAgICAgIC0wLjUsXG4gICAgICAwLFxuICAgICAgMTBcbiAgICApO1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICB3aWR0aDogMTI4MCxcbiAgICAgICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHVzaW5nIHRoZSB3ZWJjYW0gc3VjY2Vzc2Z1bGx5Li4uYCk7XG4gICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVycm9yUG9wdXAoXG4gICAgICAgICAgICAgIFwiV2ViY2FtIEVycm9yXFxuTmFtZTogXCIgKyBlLm5hbWUgKyBcIlxcbk1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlRXJyb3JQb3B1cChcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZVdlYmNhbSwgdGhpcy5jYW1lcmFXZWJjYW0pO1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gIH1cblxuICBjcmVhdGVFcnJvclBvcHVwKG1zZykge1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvci1wb3B1cFwiKSkge1xuICAgICAgdmFyIGVycm9yUG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZXJyb3JQb3B1cC5pbm5lckhUTUwgPSBtc2c7XG4gICAgICBlcnJvclBvcHVwLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZXJyb3ItcG9wdXBcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVycm9yUG9wdXApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBXZWJjYW1SZW5kZXJlciB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2F0aW9uQmFzZWQgfSBmcm9tIFwiLi9qcy9sb2NhdGlvbi1iYXNlZC5qc1wiO1xuaW1wb3J0IHsgV2ViY2FtUmVuZGVyZXIgfSBmcm9tIFwiLi9qcy93ZWJjYW0tcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfSBmcm9tIFwiLi9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIjtcblxuZXhwb3J0IHsgTG9jYXRpb25CYXNlZCwgV2ViY2FtUmVuZGVyZXIsIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==

/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************!*\
  !*** ./aframe/src/new-location-based/index.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _location_based_arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../location-based/arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _gps_new_camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gps-new-camera */ "./aframe/src/new-location-based/gps-new-camera.js");
/* harmony import */ var _gps_new_entity_place__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gps-new-entity-place */ "./aframe/src/new-location-based/gps-new-entity-place.js");
/* harmony import */ var _arjs_device_orientation_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./arjs-device-orientation-controls */ "./aframe/src/new-location-based/arjs-device-orientation-controls.js");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZyYW1lLWFyLW5ldy1sb2NhdGlvbi1vbmx5LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7QUNWaUM7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNEQUF5QixJQUFJO0FBQ2pELHVCQUF1QiwrQ0FBa0I7QUFDekMsd0JBQXdCLG9EQUF1QixHQUFHLG1CQUFtQjtBQUNyRSxxQkFBcUIsdUNBQVU7QUFDL0I7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSw2QkFBNkIsRUFBRTtBQUMvQjtBQUNBLFNBQVM7QUFDVCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNoRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVpQztBQUNqQyxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25DZ0M7QUFDNEM7O0FBRTdFLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsd0JBQXdCLHFGQUFvQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLDZEQUE2RCxLQUFLO0FBQ2xFO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBbUI7QUFDbkIscUJBQXFCLGdDQUFtQjtBQUN4QztBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsOEVBQThFLGdDQUFtQjtBQUNqRywrRUFBK0UsZ0NBQW1CO0FBQ2xHLDJGQUEyRixnQ0FBbUI7Ozs7Ozs7QUFPOUcsQ0FBQzs7QUFFRDtBQUNBLFVBQVU7QUFDVjtBQUNBLENBQUM7QUFDRCwyQ0FBMkMsY0FBYzs7Ozs7Ozs7Ozs7QUNwc0J6RDs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOK0M7QUFDckI7QUFDTTtBQUNZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2dwcy1uZXctY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9ncHMtbmV3LWVudGl0eS1wbGFjZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vdGhyZWUuanMvYnVpbGQvYXItdGhyZWV4LWxvY2F0aW9uLW9ubHkuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcImFmcmFtZVwiLFwiY29tbW9uanMyXCI6XCJhZnJhbWVcIixcImFtZFwiOlwiYWZyYW1lXCIsXCJyb290XCI6XCJBRlJBTUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYWZyYW1lXCIsIFwidGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQVJqc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBUmpzXCJdID0gZmFjdG9yeShyb290W1wiQUZSQU1FXCJdLCByb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy13ZWJjYW0tdGV4dHVyZVwiLCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjZW5lID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHRoaXMudGV4Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMC41LCAwLjUsIDAuNSwgLTAuNSwgMCwgMTApO1xuICAgIHRoaXMudGV4U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7IC8vMC41LCAwLjUpO1xuICAgIHRoaXMudGV4dHVyZSA9IG5ldyBUSFJFRS5WaWRlb1RleHR1cmUodGhpcy52aWRlbyk7XG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMudGV4U2NlbmUuYWRkKG1lc2gpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgYFdlYmNhbSBlcnJvcjogJHtlfWBcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXIoKTtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLnJlbmRlcih0aGlzLnRleFNjZW5lLCB0aGlzLnRleENhbWVyYSk7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpZGVvLnNyY09iamVjdC5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcbiAgfSxcbn0pO1xuIiwiLyoqXG4gKiBhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1xuICpcbiAqIFJlcGxhY2VzIHRoZSBzdGFuZGFyZCBsb29rLWNvbnRyb2xzIGNvbXBvbmVudCB0byBwcm92aWRlIG1vYmlsZSBkZXZpY2VcbiAqIG9yaWVudGF0aW9uIGNvbnRyb2xzLlxuICpcbiAqIEEgbGlnaHR3ZWlnaHQgQS1GcmFtZSB3cmFwcGVyIHJvdW5kIHRoZSBtb2RpZmllZCB0aHJlZS5qc1xuICogRGV2aWNlT3JpZW50YXRpb25Db250cm9scyB1c2VkIGluIHRoZSB0aHJlZS5qcyBsb2NhdGlvbi1iYXNlZCBBUEkuXG4gKlxuICogQ3JlYXRlcyB0aGUgVEhSRUUgb2JqZWN0IHVzaW5nIHVzaW5nIHRoZSB0aHJlZS5qcyBjYW1lcmEsIGFuZCBhbGxvd3MgdXBkYXRlXG4gKiBvZiB0aGUgc21vb3RoaW5nIGZhY3Rvci5cbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIiwge1xuICBzY2hlbWE6IHtcbiAgICBzbW9vdGhpbmdGYWN0b3I6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAxLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29yaWVudGF0aW9uQ29udHJvbHMgPSBuZXcgVEhSRUV4LkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMoXG4gICAgICB0aGlzLmVsLm9iamVjdDNEXG4gICAgKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzLnNtb290aGluZ0ZhY3RvciA9IHRoaXMuZGF0YS5zbW9vdGhpbmdGYWN0b3I7XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29yaWVudGF0aW9uQ29udHJvbHMudXBkYXRlKCk7XG4gIH0sXG59KTtcbiIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgKiBhcyBUSFJFRXggZnJvbSBcIi4uLy4uLy4uL3RocmVlLmpzL2J1aWxkL2FyLXRocmVleC1sb2NhdGlvbi1vbmx5LmpzXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1uZXctY2FtZXJhXCIsIHtcbiAgc2NoZW1hOiB7XG4gICAgc2ltdWxhdGVMYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUFsdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogLU51bWJlci5NQVhfVkFMVUUsXG4gICAgfSxcbiAgICBncHNNaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMTAwLFxuICAgIH0sXG4gICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGluaXRpYWxQb3NpdGlvbkFzT3JpZ2luOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3Rlc3RGb3JPcmllbnRhdGlvbkNvbnRyb2xzKCk7XG5cbiAgICB0aGlzLnRocmVlTG9jID0gbmV3IFRIUkVFeC5Mb2NhdGlvbkJhc2VkKFxuICAgICAgdGhpcy5lbC5zY2VuZUVsLm9iamVjdDNELFxuICAgICAgdGhpcy5lbC5vYmplY3QzRCxcbiAgICAgIHtcbiAgICAgICAgaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW46IHRoaXMuZGF0YS5pbml0aWFsUG9zaXRpb25Bc09yaWdpbixcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy50aHJlZUxvYy5vbihcImdwc3VwZGF0ZVwiLCAoZ3BzcG9zKSA9PiB7XG4gICAgICB0aGlzLl9jdXJyZW50UG9zaXRpb24gPSB7XG4gICAgICAgIGxvbmdpdHVkZTogZ3BzcG9zLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIGxhdGl0dWRlOiBncHNwb3MuY29vcmRzLmxhdGl0dWRlLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX3NlbmRHcHNVcGRhdGVFdmVudChncHNwb3MuY29vcmRzLmxvbmdpdHVkZSwgZ3BzcG9zLmNvb3Jkcy5sYXRpdHVkZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRocmVlTG9jLm9uKFwiZ3BzZXJyb3JcIiwgKGNvZGUpID0+IHtcbiAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgXCJVc2VyIGRlbmllZCBhY2Nlc3MgdG8gR1BTLlwiLFxuICAgICAgICBcIkdQUyBzYXRlbGxpdGVzIG5vdCBhdmFpbGFibGUuXCIsXG4gICAgICAgIFwiVGltZW91dCBjb21tdW5pY2F0aW5nIHdpdGggR1BTIHNhdGVsbGl0ZXMgLSB0cnkgbW92aW5nIHRvIGEgbW9yZSBvcGVuIGFyZWEuXCIsXG4gICAgICBdO1xuICAgICAgaWYgKGNvZGUgPj0gMSAmJiBjb2RlIDw9IDMpIHtcbiAgICAgICAgdGhpcy5fZGlzcGxheUVycm9yKG1zZ1tjb2RlIC0gMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGlzcGxheUVycm9yKGBVbmtub3duIGdlb2xvY2F0aW9uIGVycm9yIGNvZGUgJHtjb2RlfS5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFVzZSBhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9scyBvbiBtb2JpbGUgb25seSwgd2l0aCBzdGFuZGFyZFxuICAgIC8vIGxvb2stY29udHJvbHMgZGlzYWJsZWQgKHRoaXMgaW50ZXJmZXJlcyB3aXRoIHRoZSByZWFkaW5ncyBmcm9tIHRoZVxuICAgIC8vIHNlbnNvcnMpLiBPbiBkZXNrdG9wLCB1c2Ugc3RhbmRhcmQgbG9vay1jb250cm9scyBpbnN0ZWFkLlxuXG4gICAgY29uc3QgbW9iaWxlID0gdGhpcy5faXNNb2JpbGUoKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImxvb2stY29udHJvbHMtZW5hYmxlZFwiLCAhbW9iaWxlKTtcbiAgICBpZiAobW9iaWxlKSB7XG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCIsIHRydWUpO1xuICAgIH1cblxuICAgIC8vIGZyb20gb3JpZ2luYWwgZ3BzLWNhbWVyYSBjb21wb25lbnRcbiAgICAvLyBpZiBTYWZhcmlcbiAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcbiAgICAgIHRoaXMuX3NldHVwU2FmYXJpT3JpZW50YXRpb25QZXJtaXNzaW9ucygpO1xuICAgIH1cblxuICAgIHRoaXMuZWwuc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgZW50aXR5UGxhY2UgPSBlLmRldGFpbC5jb21wb25lbnQuY29tcG9uZW50c1tcImdwcy1uZXctZW50aXR5LXBsYWNlXCJdO1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRQb3NpdGlvbikge1xuICAgICAgICBlbnRpdHlQbGFjZS5zZXREaXN0YW5jZUZyb20odGhpcy5fY3VycmVudFBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XG4gICAgdGhpcy50aHJlZUxvYy5zZXRHcHNPcHRpb25zKHtcbiAgICAgIGdwc01pbkFjY3VyYWN5OiB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSxcbiAgICAgIGdwc01pbkRpc3RhbmNlOiB0aGlzLmRhdGEuZ3BzTWluRGlzdGFuY2UsXG4gICAgICBtYXhpbXVtQWdlOiB0aGlzLmRhdGEuZ3BzVGltZUludGVydmFsLFxuICAgIH0pO1xuICAgIGlmIChcbiAgICAgICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCB8fCB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApICYmXG4gICAgICAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT0gb2xkRGF0YS5zaW11bGF0ZUxhdGl0dWRlIHx8XG4gICAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPSBvbGREYXRhLnNpbXVsYXRlTG9uZ2l0dWRlKVxuICAgICkge1xuICAgICAgdGhpcy50aHJlZUxvYy5zdG9wR3BzKCk7XG4gICAgICB0aGlzLnRocmVlTG9jLmZha2VHcHMoXG4gICAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSxcbiAgICAgICAgdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGVcbiAgICAgICk7XG4gICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSA9IDA7XG4gICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgPSAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgPiAtTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgdGhpcy50aHJlZUxvYy5zZXRFbGV2YXRpb24odGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgKyAxLjYpO1xuICAgIH1cbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlID09PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSA9PT0gMCkge1xuICAgICAgdGhpcy50aHJlZUxvYy5zdGFydEdwcygpO1xuICAgIH1cbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGhyZWVMb2Muc3RvcEdwcygpO1xuICB9LFxuXG4gIGxhdExvblRvV29ybGQ6IGZ1bmN0aW9uIChsYXQsIGxvbikge1xuICAgIHJldHVybiB0aGlzLnRocmVlTG9jLmxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpO1xuICB9LFxuXG4gIGdldEluaXRpYWxQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRocmVlTG9jLmluaXRpYWxQb3NpdGlvbjtcbiAgfSxcblxuICBfc2VuZEdwc1VwZGF0ZUV2ZW50OiBmdW5jdGlvbiAobG9uLCBsYXQpIHtcbiAgICB0aGlzLmVsLmVtaXQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICBsb25naXR1ZGU6IGxvbixcbiAgICAgICAgbGF0aXR1ZGU6IGxhdCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0sXG5cbiAgX3Rlc3RGb3JPcmllbnRhdGlvbkNvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbXNnID1cbiAgICAgIFwiV0FSTklORyAtIE5vIG9yaWVudGF0aW9uIGNvbnRyb2xzIGNvbXBvbmVudCwgYXBwIHdpbGwgbm90IHJlc3BvbmQgdG8gZGV2aWNlIHJvdGF0aW9uLlwiO1xuICAgIGlmIChcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1wiXSAmJlxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl1cbiAgICApIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXlFcnJvcihtc2cpO1xuICAgIH1cbiAgfSxcblxuICBfZGlzcGxheUVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBjb25zdCBhcmpzID0gdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdO1xuICAgIGlmIChhcmpzKSB7XG4gICAgICBhcmpzLl9kaXNwbGF5RXJyb3JQb3B1cChlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnJvbSBvcmlnaW5hbCBncHMtY2FtZXJhIGNvbXBvbmVudFxuICBfc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaU9TIDEzK1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudD8ucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyBkZXZpY2Ugb3JpZW50YXRpb24gcGVybWlzc2lvbnMuLi5cIik7XG4gICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgfTtcblxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJ0b3VjaGVuZFwiLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcblxuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgXCJBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi5cIlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICBcIlBsZWFzZSBlbmFibGUgZGV2aWNlIG9yaWVudGF0aW9uIGluIFNldHRpbmdzID4gU2FmYXJpID4gTW90aW9uICYgT3JpZW50YXRpb24gQWNjZXNzLlwiXG4gICAgICAgICk7XG4gICAgICB9LCA3NTApO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiZGV2aWNlb3JpZW50YXRpb25cIixcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIF9pc01vYmlsZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICAgKVxuICAgICkge1xuICAgICAgLy8gdHJ1ZSBmb3IgbW9iaWxlIGRldmljZVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtbmV3LWVudGl0eS1wbGFjZVwiLCB7XG4gIHNjaGVtYToge1xuICAgIGxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBsYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2FtZXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltncHMtbmV3LWNhbWVyYV1cIik7XG4gICAgaWYgKCFjYW1lcmEuY29tcG9uZW50c1tcImdwcy1uZXctY2FtZXJhXCJdKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiZ3BzLW5ldy1jYW1lcmEgbm90IGluaXRpYWxpc2VkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9jYW1lcmFHcHMgPSBjYW1lcmEuY29tcG9uZW50c1tcImdwcy1uZXctY2FtZXJhXCJdO1xuXG4gICAgY2FtZXJhLmFkZEV2ZW50TGlzdGVuZXIoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy5kaXN0YW5jZSA9IHRoaXMuX2hhdmVyc2luZURpc3QoZS5kZXRhaWwucG9zaXRpb24sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsLnNjZW5lRWwuZW1pdChcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIiwge1xuICAgICAgY29tcG9uZW50OiB0aGlzLmVsLFxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHByb2pDb29yZHMgPSB0aGlzLl9jYW1lcmFHcHMudGhyZWVMb2MubG9uTGF0VG9Xb3JsZENvb3JkcyhcbiAgICAgIHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICB0aGlzLmRhdGEubGF0aXR1ZGVcbiAgICApO1xuICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24uc2V0KFxuICAgICAgcHJvakNvb3Jkc1swXSxcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24ueSxcbiAgICAgIHByb2pDb29yZHNbMV1cbiAgICApO1xuICB9LFxuXG4gIHNldERpc3RhbmNlRnJvbTogZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5kaXN0YW5jZSA9IHRoaXMuX2hhdmVyc2luZURpc3QocG9zaXRpb24sIHRoaXMuZGF0YSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICpcbiAgICogVGFrZW4gZnJvbSBncHMtY2FtZXJhXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xuICAgIGNvbnN0IGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICBjb25zdCBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICBjb25zdCBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICB9LFxufSk7XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiVEhSRUV4XCJdID0gZmFjdG9yeShyb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlc19fID0gKHtcblxuLyoqKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSA9PiB7XG5cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiRGV2aWNlT3JpZW50YXRpb25Db250cm9sc1wiOiAoKSA9PiAoLyogYmluZGluZyAqLyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIHRocmVlICovIFwidGhyZWVcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX19kZWZhdWx0ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18ubih0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fKTtcbi8vIE1vZGlmaWVkIHZlcnNpb24gb2YgVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBmcm9tIHRocmVlLmpzXG4vLyB3aWxsIHVzZSB0aGUgZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZSBldmVudCBpZiBhdmFpbGFibGVcblxuXG5cbmNvbnN0IF96ZWUgPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5WZWN0b3IzKDAsIDAsIDEpO1xuY29uc3QgX2V1bGVyID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uRXVsZXIoKTtcbmNvbnN0IF9xMCA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlF1YXRlcm5pb24oKTtcbmNvbnN0IF9xMSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlF1YXRlcm5pb24oLU1hdGguc3FydCgwLjUpLCAwLCAwLCBNYXRoLnNxcnQoMC41KSk7IC8vIC0gUEkvMiBhcm91bmQgdGhlIHgtYXhpc1xuXG5jb25zdCBfY2hhbmdlRXZlbnQgPSB7IHR5cGU6IFwiY2hhbmdlXCIgfTtcblxuY2xhc3MgRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBleHRlbmRzIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iob2JqZWN0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIHNlY3VyZSBjb250ZXh0cyAoaHR0cHMpXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuXG4gICAgY29uc3QgRVBTID0gMC4wMDAwMDE7XG4gICAgY29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5RdWF0ZXJuaW9uKCk7XG5cbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLm9iamVjdC5yb3RhdGlvbi5yZW9yZGVyKFwiWVhaXCIpO1xuXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcbiAgICB0aGlzLnNjcmVlbk9yaWVudGF0aW9uID0gMDtcblxuICAgIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgICB0aGlzLlRXT19QSSA9IDIgKiBNYXRoLlBJO1xuICAgIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG4gICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9XG4gICAgICBcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvd1xuICAgICAgICA/IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiXG4gICAgICAgIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuXG4gICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gICAgY29uc3Qgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuICAgIH07XG5cbiAgICBjb25zdCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cbiAgICBjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKFxuICAgICAgcXVhdGVybmlvbixcbiAgICAgIGFscGhhLFxuICAgICAgYmV0YSxcbiAgICAgIGdhbW1hLFxuICAgICAgb3JpZW50XG4gICAgKSB7XG4gICAgICBfZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihfZXVsZXIpOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMSk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTAuc2V0RnJvbUF4aXNBbmdsZShfemVlLCAtb3JpZW50KSk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpOyAvLyBydW4gb25jZSBvbiBsb2FkXG5cbiAgICAgIC8vIGlPUyAxMytcblxuICAgICAgaWYgKFxuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICApIHtcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBVbmFibGUgdG8gdXNlIERldmljZU9yaWVudGF0aW9uIEFQSTpcIixcbiAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzY29wZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICApO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICk7XG5cbiAgICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgbGV0IGFscGhhID0gZGV2aWNlLmFscGhhXG4gICAgICAgICAgPyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYWxwaGEpICsgc2NvcGUuYWxwaGFPZmZzZXRcbiAgICAgICAgICA6IDA7IC8vIFpcblxuICAgICAgICBsZXQgYmV0YSA9IGRldmljZS5iZXRhID8gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmJldGEpIDogMDsgLy8gWCdcblxuICAgICAgICBsZXQgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXG5cbiAgICAgICAgY29uc3Qgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgICA/IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWF0aFV0aWxzLmRlZ1RvUmFkKHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uKVxuICAgICAgICAgIDogMDsgLy8gT1xuXG4gICAgICAgIGlmICh0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEpIHtcbiAgICAgICAgICBpZiAodGhpcy5sYXN0T3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSB0aGlzLnNtb290aGluZ0ZhY3RvcjtcbiAgICAgICAgICAgIGFscGhhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgYWxwaGEsXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmFscGhhLFxuICAgICAgICAgICAgICBrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYmV0YSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGJldGEgKyBNYXRoLlBJLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5iZXRhLFxuICAgICAgICAgICAgICBrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZ2FtbWEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBnYW1tYSArIHRoaXMuSEFMRl9QSSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uZ2FtbWEsXG4gICAgICAgICAgICAgIGssXG4gICAgICAgICAgICAgIE1hdGguUElcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJldGEgKz0gTWF0aC5QSTtcbiAgICAgICAgICAgIGdhbW1hICs9IHRoaXMuSEFMRl9QSTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbiA9IHtcbiAgICAgICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgICAgIGJldGE6IGJldGEsXG4gICAgICAgICAgICBnYW1tYTogZ2FtbWEsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldE9iamVjdFF1YXRlcm5pb24oXG4gICAgICAgICAgc2NvcGUub2JqZWN0LnF1YXRlcm5pb24sXG4gICAgICAgICAgYWxwaGEsXG4gICAgICAgICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxID8gYmV0YSAtIE1hdGguUEkgOiBiZXRhLFxuICAgICAgICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSA/IGdhbW1hIC0gdGhpcy5IQUxGX1BJIDogZ2FtbWEsXG4gICAgICAgICAgb3JpZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKDggKiAoMSAtIGxhc3RRdWF0ZXJuaW9uLmRvdChzY29wZS5vYmplY3QucXVhdGVybmlvbikpID4gRVBTKSB7XG4gICAgICAgICAgbGFzdFF1YXRlcm5pb24uY29weShzY29wZS5vYmplY3QucXVhdGVybmlvbik7XG4gICAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChfY2hhbmdlRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIE5XIEFkZGVkXG4gICAgdGhpcy5fb3JkZXJBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgICBpZiAoXG4gICAgICAgIChiID4gYSAmJiBNYXRoLmFicyhiIC0gYSkgPCByYW5nZSAvIDIpIHx8XG4gICAgICAgIChhID4gYiAmJiBNYXRoLmFicyhiIC0gYSkgPiByYW5nZSAvIDIpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHsgbGVmdDogYSwgcmlnaHQ6IGIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGxlZnQ6IGIsIHJpZ2h0OiBhIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIE5XIEFkZGVkXG4gICAgdGhpcy5fZ2V0U21vb3RoZWRBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCBrLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgICBjb25zdCBhbmdsZXMgPSB0aGlzLl9vcmRlckFuZ2xlKGEsIGIsIHJhbmdlKTtcbiAgICAgIGNvbnN0IGFuZ2xlc2hpZnQgPSBhbmdsZXMubGVmdDtcbiAgICAgIGNvbnN0IG9yaWdBbmdsZXNSaWdodCA9IGFuZ2xlcy5yaWdodDtcbiAgICAgIGFuZ2xlcy5sZWZ0ID0gMDtcbiAgICAgIGFuZ2xlcy5yaWdodCAtPSBhbmdsZXNoaWZ0O1xuICAgICAgaWYgKGFuZ2xlcy5yaWdodCA8IDApIGFuZ2xlcy5yaWdodCArPSByYW5nZTtcbiAgICAgIGxldCBuZXdhbmdsZSA9XG4gICAgICAgIG9yaWdBbmdsZXNSaWdodCA9PSBiXG4gICAgICAgICAgPyAoMSAtIGspICogYW5nbGVzLnJpZ2h0ICsgayAqIGFuZ2xlcy5sZWZ0XG4gICAgICAgICAgOiBrICogYW5nbGVzLnJpZ2h0ICsgKDEgLSBrKSAqIGFuZ2xlcy5sZWZ0O1xuICAgICAgbmV3YW5nbGUgKz0gYW5nbGVzaGlmdDtcbiAgICAgIGlmIChuZXdhbmdsZSA+PSByYW5nZSkgbmV3YW5nbGUgLT0gcmFuZ2U7XG4gICAgICByZXR1cm4gbmV3YW5nbGU7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNjb3BlLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH1cbn1cblxuXG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKF9fdW51c2VkX3dlYnBhY2tfbW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSA9PiB7XG5cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTG9jYXRpb25CYXNlZFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMb2NhdGlvbkJhc2VkKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX3NwaG1lcmNfcHJvamVjdGlvbl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9zcGhtZXJjLXByb2plY3Rpb24uanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9zcGhtZXJjLXByb2plY3Rpb24uanNcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIHRocmVlICovIFwidGhyZWVcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX19kZWZhdWx0ID0gLyojX19QVVJFX18qL19fd2VicGFja19yZXF1aXJlX18ubih0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fKTtcblxuXG5cbmNsYXNzIExvY2F0aW9uQmFzZWQge1xuICBjb25zdHJ1Y3RvcihzY2VuZSwgY2FtZXJhLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcbiAgICB0aGlzLl9wcm9qID0gbmV3IF9zcGhtZXJjX3Byb2plY3Rpb25fanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5TcGhNZXJjUHJvamVjdGlvbigpO1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLl9sYXN0Q29vcmRzID0gbnVsbDtcbiAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IDA7XG4gICAgdGhpcy5fZ3BzTWluQWNjdXJhY3kgPSAxMDA7XG4gICAgdGhpcy5fbWF4aW11bUFnZSA9IDA7XG4gICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICB0aGlzLnNldEdwc09wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSBudWxsO1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4gPSBvcHRpb25zLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luIHx8IGZhbHNlO1xuICB9XG5cbiAgc2V0UHJvamVjdGlvbihwcm9qKSB7XG4gICAgdGhpcy5fcHJvaiA9IHByb2o7XG4gIH1cblxuICBzZXRHcHNPcHRpb25zKG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChvcHRpb25zLmdwc01pbkRpc3RhbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2dwc01pbkRpc3RhbmNlID0gb3B0aW9ucy5ncHNNaW5EaXN0YW5jZTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuZ3BzTWluQWNjdXJhY3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fZ3BzTWluQWNjdXJhY3kgPSBvcHRpb25zLmdwc01pbkFjY3VyYWN5O1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5tYXhpbXVtQWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX21heGltdW1BZ2UgPSBvcHRpb25zLm1heGltdW1BZ2U7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRHcHMobWF4aW11bUFnZSA9IDApIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkID09PSBudWxsKSB7XG4gICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihcbiAgICAgICAgKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZ3BzUmVjZWl2ZWQocG9zaXRpb24pO1xuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc2Vycm9yXCJdKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzZXJyb3JcIl0oZXJyb3IuY29kZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KGBHUFMgZXJyb3I6IGNvZGUgJHtlcnJvci5jb2RlfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgICAgICBtYXhpbXVtQWdlOiBtYXhpbXVtQWdlICE9IDAgPyBtYXhpbXVtQWdlIDogdGhpcy5fbWF4aW11bUFnZSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdG9wR3BzKCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQgIT09IG51bGwpIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XG4gICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZha2VHcHMobG9uLCBsYXQsIGVsZXYgPSBudWxsLCBhY2MgPSAwKSB7XG4gICAgaWYgKGVsZXYgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0RWxldmF0aW9uKGVsZXYpO1xuICAgIH1cblxuICAgIHRoaXMuX2dwc1JlY2VpdmVkKHtcbiAgICAgIGNvb3Jkczoge1xuICAgICAgICBsb25naXR1ZGU6IGxvbixcbiAgICAgICAgbGF0aXR1ZGU6IGxhdCxcbiAgICAgICAgYWNjdXJhY3k6IGFjYyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBsb25MYXRUb1dvcmxkQ29vcmRzKGxvbiwgbGF0KSB7XG4gICAgY29uc3QgcHJvamVjdGVkUG9zID0gdGhpcy5fcHJvai5wcm9qZWN0KGxvbiwgbGF0KTtcbiAgICBpZiAodGhpcy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbikge1xuICAgICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgIHByb2plY3RlZFBvc1swXSAtPSB0aGlzLmluaXRpYWxQb3NpdGlvblswXTtcbiAgICAgICAgcHJvamVjdGVkUG9zWzFdIC09IHRoaXMuaW5pdGlhbFBvc2l0aW9uWzFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJUcnlpbmcgdG8gdXNlICdpbml0aWFsIHBvc2l0aW9uIGFzIG9yaWdpbicgbW9kZSB3aXRoIG5vIGluaXRpYWwgcG9zaXRpb24gZGV0ZXJtaW5lZFwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW3Byb2plY3RlZFBvc1swXSwgLXByb2plY3RlZFBvc1sxXV07XG4gIH1cblxuICBhZGQob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbihvYmplY3QsIGxvbiwgbGF0LCBlbGV2KTtcbiAgICB0aGlzLl9zY2VuZS5hZGQob2JqZWN0KTtcbiAgfVxuXG4gIHNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgIGNvbnN0IHdvcmxkQ29vcmRzID0gdGhpcy5sb25MYXRUb1dvcmxkQ29vcmRzKGxvbiwgbGF0KTtcbiAgICBpZiAoZWxldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYmplY3QucG9zaXRpb24ueSA9IGVsZXY7XG4gICAgfVxuICAgIFtvYmplY3QucG9zaXRpb24ueCwgb2JqZWN0LnBvc2l0aW9uLnpdID0gd29ybGRDb29yZHM7XG4gIH1cblxuICBzZXRFbGV2YXRpb24oZWxldikge1xuICAgIHRoaXMuX2NhbWVyYS5wb3NpdGlvbi55ID0gZWxldjtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tldmVudE5hbWVdID0gZXZlbnRIYW5kbGVyO1xuICB9XG5cbiAgc2V0V29ybGRPcmlnaW4obG9uLCBsYXQpIHtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XG4gIH1cblxuICBfZ3BzUmVjZWl2ZWQocG9zaXRpb24pIHtcbiAgICBsZXQgZGlzdE1vdmVkID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICBpZiAocG9zaXRpb24uY29vcmRzLmFjY3VyYWN5IDw9IHRoaXMuX2dwc01pbkFjY3VyYWN5KSB7XG4gICAgICBpZiAodGhpcy5fbGFzdENvb3JkcyA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzID0ge1xuICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzdE1vdmVkID0gdGhpcy5faGF2ZXJzaW5lRGlzdCh0aGlzLl9sYXN0Q29vcmRzLCBwb3NpdGlvbi5jb29yZHMpO1xuICAgICAgfVxuICAgICAgaWYgKGRpc3RNb3ZlZCA+PSB0aGlzLl9ncHNNaW5EaXN0YW5jZSkge1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzLmxvbmdpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMubGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4gJiYgIXRoaXMuaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zZXRXb3JsZE9yaWdpbihcbiAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKFxuICAgICAgICAgIHRoaXMuX2NhbWVyYSxcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZVxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc3VwZGF0ZVwiXShwb3NpdGlvbiwgZGlzdE1vdmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgaGF2ZXJzaW5lIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdC9sb24gcGFpcnMuXG4gICAqXG4gICAqIFRha2VuIGZyb20gb3JpZ2luYWwgQS1GcmFtZSBjb21wb25lbnRzXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdChzcmMsIGRlc3QpIHtcbiAgICBjb25zdCBkbG9uZ2l0dWRlID0gdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXy5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICBjb25zdCBkbGF0aXR1ZGUgPSB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIGNvbnN0IGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyh0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLk1hdGhVdGlscy5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqXG4gICAgICAgIE1hdGguY29zKHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18uTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICB9XG59XG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3NwaG1lcmMtcHJvamVjdGlvbi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgoX191bnVzZWRfd2VicGFja19tb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pID0+IHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJTcGhNZXJjUHJvamVjdGlvblwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBTcGhNZXJjUHJvamVjdGlvbilcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7XG4gICAgdGhpcy5IQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG4gIH1cblxuICBwcm9qZWN0KGxvbiwgbGF0KSB7XG4gICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgfVxuXG4gIHVucHJvamVjdChwcm9qZWN0ZWQpIHtcbiAgICByZXR1cm4gW3RoaXMuc3BoTWVyY1RvTG9uKHByb2plY3RlZFswXSksIHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICB9XG5cbiAgbG9uVG9TcGhNZXJjKGxvbikge1xuICAgIHJldHVybiAobG9uIC8gMTgwKSAqIHRoaXMuSEFMRl9FQVJUSDtcbiAgfVxuXG4gIGxhdFRvU3BoTWVyYyhsYXQpIHtcbiAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCgoOTAgKyBsYXQpICogTWF0aC5QSSkgLyAzNjApKSAvIChNYXRoLlBJIC8gMTgwKTtcbiAgICByZXR1cm4gKHkgKiB0aGlzLkhBTEZfRUFSVEgpIC8gMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9Mb24oeCkge1xuICAgIHJldHVybiAoeCAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgfVxuXG4gIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgdmFyIGxhdCA9ICh5IC8gdGhpcy5IQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgIGxhdCA9XG4gICAgICAoMTgwIC8gTWF0aC5QSSkgKlxuICAgICAgKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoKGxhdCAqIE1hdGguUEkpIC8gMTgwKSkgLSBNYXRoLlBJIC8gMik7XG4gICAgcmV0dXJuIGxhdDtcbiAgfVxuXG4gIGdldElEKCkge1xuICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICB9XG59XG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3dlYmNhbS1yZW5kZXJlci5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvd2ViY2FtLXJlbmRlcmVyLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovICgoX191bnVzZWRfd2VicGFja19tb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pID0+IHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJXZWJjYW1SZW5kZXJlclwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBXZWJjYW1SZW5kZXJlcilcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISB0aHJlZSAqLyBcInRocmVlXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19fZGVmYXVsdCA9IC8qI19fUFVSRV9fKi9fX3dlYnBhY2tfcmVxdWlyZV9fLm4odGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyk7XG5cblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgdmlkZW9FbGVtZW50KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZVdlYmNhbSA9IG5ldyB0aHJlZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fLlNjZW5lKCk7XG4gICAgbGV0IHZpZGVvO1xuICAgIGlmICh2aWRlb0VsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLCB0cnVlKTtcbiAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xuICAgICAgdmlkZW8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWRlbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2aWRlb0VsZW1lbnQpO1xuICAgIH1cbiAgICB0aGlzLmdlb20gPSBuZXcgdGhyZWVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXy5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgdGhpcy50ZXh0dXJlID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uVmlkZW9UZXh0dXJlKHZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRoaXMudGV4dHVyZSB9KTtcbiAgICBjb25zdCBtZXNoID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmVXZWJjYW0uYWRkKG1lc2gpO1xuICAgIHRoaXMuY2FtZXJhV2ViY2FtID0gbmV3IHRocmVlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uT3J0aG9ncmFwaGljQ2FtZXJhKFxuICAgICAgLTAuNSxcbiAgICAgIDAuNSxcbiAgICAgIDAuNSxcbiAgICAgIC0wLjUsXG4gICAgICAwLFxuICAgICAgMTBcbiAgICApO1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICB3aWR0aDogMTI4MCxcbiAgICAgICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHVzaW5nIHRoZSB3ZWJjYW0gc3VjY2Vzc2Z1bGx5Li4uYCk7XG4gICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVycm9yUG9wdXAoXG4gICAgICAgICAgICAgIFwiV2ViY2FtIEVycm9yXFxuTmFtZTogXCIgKyBlLm5hbWUgKyBcIlxcbk1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlRXJyb3JQb3B1cChcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZVdlYmNhbSwgdGhpcy5jYW1lcmFXZWJjYW0pO1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gIH1cblxuICBjcmVhdGVFcnJvclBvcHVwKG1zZykge1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvci1wb3B1cFwiKSkge1xuICAgICAgdmFyIGVycm9yUG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZXJyb3JQb3B1cC5pbm5lckhUTUwgPSBtc2c7XG4gICAgICBlcnJvclBvcHVwLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZXJyb3ItcG9wdXBcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVycm9yUG9wdXApO1xuICAgIH1cbiAgfVxufVxuXG5cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCJ0aHJlZVwiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKG1vZHVsZSkgPT4ge1xuXG5tb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXztcblxuLyoqKi8gfSlcblxuLyoqKioqKi8gXHR9KTtcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuLyoqKioqKi8gXHRcdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuLyoqKioqKi8gXHRcdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcbi8qKioqKiovIFx0XHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuLyoqKioqKi8gXHRcdFx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcbi8qKioqKiovIFx0XHRcdFx0KCkgPT4gKG1vZHVsZSk7XG4vKioqKioqLyBcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcbi8qKioqKiovIFx0XHRcdHJldHVybiBnZXR0ZXI7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbi8qKioqKiovIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIG1vZHVsZXMgaW4gdGhlIGNodW5rLlxuKCgpID0+IHtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkRldmljZU9yaWVudGF0aW9uQ29udHJvbHNcIjogKCkgPT4gKC8qIHJlZXhwb3J0IHNhZmUgKi8gX2pzX2RldmljZV9vcmllbnRhdGlvbl9jb250cm9sc19qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxvY2F0aW9uQmFzZWRcIjogKCkgPT4gKC8qIHJlZXhwb3J0IHNhZmUgKi8gX2pzX2xvY2F0aW9uX2Jhc2VkX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18uTG9jYXRpb25CYXNlZCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiV2ViY2FtUmVuZGVyZXJcIjogKCkgPT4gKC8qIHJlZXhwb3J0IHNhZmUgKi8gX2pzX3dlYmNhbV9yZW5kZXJlcl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fLldlYmNhbVJlbmRlcmVyKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2pzX2xvY2F0aW9uX2Jhc2VkX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2pzL2xvY2F0aW9uLWJhc2VkLmpzICovIFwiLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanNcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2pzX3dlYmNhbV9yZW5kZXJlcl9qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9qcy93ZWJjYW0tcmVuZGVyZXIuanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanNcIik7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2pzX2RldmljZV9vcmllbnRhdGlvbl9jb250cm9sc19qc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMgKi8gXCIuL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIik7XG5cblxuXG5cblxuXG59KSgpO1xuXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xuLyoqKioqKi8gfSkoKVxuO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVlYSXRkR2h5WldWNExXeHZZMkYwYVc5dUxXOXViSGt1YW5NaUxDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1EwRkJRenRCUVVORUxFODdPenM3T3pzN096czdPenM3T3pzN1FVTldRVHRCUVVOQk96dEJRVkZsT3p0QlFVVm1MR2xDUVVGcFFpd3dRMEZCVHp0QlFVTjRRaXh0UWtGQmJVSXNkME5CUVVzN1FVRkRlRUlzWjBKQlFXZENMRFpEUVVGVk8wRkJRekZDTEdkQ1FVRm5RaXcyUTBGQlZTeDVRMEZCZVVNN08wRkJSVzVGTEhWQ1FVRjFRanM3UVVGRmRrSXNkME5CUVhkRExHdEVRVUZsTzBGQlEzWkVPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTEN0Q1FVRXJRaXcyUTBGQlZUczdRVUZGZWtNN1FVRkRRVHM3UVVGRlFUczdRVUZGUVR0QlFVTkJPenRCUVVWQkxEQkNRVUV3UWpzN1FVRkZNVUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN3NFEwRkJPRU03TzBGQlJUbERMSFZEUVVGMVF6czdRVUZGZGtNc1owTkJRV2RET3p0QlFVVm9ReXhuUlVGQlowVTdRVUZEYUVVN08wRkJSVUU3UVVGRFFTeDNRMEZCZDBNN08wRkJSWGhET3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNWMEZCVnp0QlFVTllPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFhRVUZYTzBGQlExZ3NVVUZCVVR0QlFVTlNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzY1VSQlFXdENPMEZCUXpsQ0xHVkJRV1U3TzBGQlJXWXNhVU5CUVdsRExIRkVRVUZyUWl4dFFrRkJiVUk3TzBGQlJYUkZMRzFEUVVGdFF5eHhSRUZCYTBJc2IwSkJRVzlDT3p0QlFVVjZSVHRCUVVOQkxGbEJRVmtzY1VSQlFXdENPMEZCUXpsQ0xHVkJRV1U3TzBGQlJXWTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc2FVSkJRV2xDTzBGQlEycENMRkZCUVZFN1FVRkRVaXhwUWtGQmFVSTdRVUZEYWtJN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZ4UXpzN096czdPenM3T3pzN096czdPenM3TzBGRE1VOTFRanRCUVVNM1FqczdRVUZGTDBJN1FVRkRRU3g1UTBGQmVVTTdRVUZEZWtNN1FVRkRRVHRCUVVOQkxIRkNRVUZ4UWl4eFJVRkJhVUk3UVVGRGRFTTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTERSQ1FVRTBRanRCUVVNMVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzVTBGQlV6dEJRVU5VTzBGQlEwRTdRVUZEUVR0QlFVTkJMRmxCUVZrN1FVRkRXaXh4UTBGQmNVTXNWMEZCVnp0QlFVTm9SRHRCUVVOQkxGTkJRVk03UVVGRFZEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1QwRkJUenRCUVVOUUxFdEJRVXM3UVVGRFREczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFJRVUZSTzBGQlExSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVVUZCVVR0QlFVTlNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMSFZDUVVGMVFpeHhSRUZCZDBJN1FVRkRMME1zYzBKQlFYTkNMSEZFUVVGM1FqczdRVUZGT1VNN1FVRkRRVHRCUVVOQkxHVkJRV1VzY1VSQlFYZENPMEZCUTNaRExHbENRVUZwUWl4eFJFRkJkMEk3UVVGRGVrTTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRmVVSTdPenM3T3pzN096czdPenM3T3p0QlF6ZExla0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJUWkNPenM3T3pzN096czdPenM3T3pzN096dEJRM2hEUlRzN1FVRkZMMEk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN3eVFrRkJNa0lzZDBOQlFWYzdRVUZEZEVNN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TlFVRk5PMEZCUTA0N1FVRkRRVHRCUVVOQkxHOUNRVUZ2UWl4elJFRkJlVUk3UVVGRE4wTXNkVUpCUVhWQ0xDdERRVUZyUWp0QlFVTjZReXgzUWtGQmQwSXNiMFJCUVhWQ0xFZEJRVWNzYlVKQlFXMUNPMEZCUTNKRkxIRkNRVUZ4UWl4MVEwRkJWVHRCUVVNdlFqdEJRVU5CTERSQ1FVRTBRaXh4UkVGQmQwSTdRVUZEY0VRN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFRRVUZUTzBGQlExUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFRRVUZUTzBGQlExUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGZEJRVmM3UVVGRFdDeFRRVUZUTzBGQlExUXNUVUZCVFR0QlFVTk9PMEZCUTBFN1FVRkRRU3hQUVVGUE8wRkJRMUE3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVV3UWpzN096czdPenM3T3pzN1FVTnFSakZDT3pzN096czdWVU5CUVR0VlFVTkJPenRWUVVWQk8xVkJRMEU3VlVGRFFUdFZRVU5CTzFWQlEwRTdWVUZEUVR0VlFVTkJPMVZCUTBFN1ZVRkRRVHRWUVVOQk8xVkJRMEU3VlVGRFFUdFZRVU5CT3p0VlFVVkJPMVZCUTBFN08xVkJSVUU3VlVGRFFUdFZRVU5CT3pzN096dFhRM1JDUVR0WFFVTkJPMWRCUTBFN1YwRkRRVHRYUVVOQk8xZEJRMEVzYVVOQlFXbERMRmRCUVZjN1YwRkROVU03VjBGRFFUczdPenM3VjBOUVFUdFhRVU5CTzFkQlEwRTdWMEZEUVR0WFFVTkJMSGxEUVVGNVF5eDNRMEZCZDBNN1YwRkRha1k3VjBGRFFUdFhRVU5CT3pzN096dFhRMUJCT3pzN096dFhRMEZCTzFkQlEwRTdWMEZEUVR0WFFVTkJMSFZFUVVGMVJDeHBRa0ZCYVVJN1YwRkRlRVU3VjBGRFFTeG5SRUZCWjBRc1lVRkJZVHRYUVVNM1JEczdPenM3T3pzN096czdPenM3T3pzN096dEJRMDUxUkR0QlFVTkZPMEZCUTNWQ096dEJRVVZhSWl3aWMyOTFjbU5sY3lJNld5SjNaV0p3WVdOck9pOHZWRWhTUlVWNEwzZGxZbkJoWTJzdmRXNXBkbVZ5YzJGc1RXOWtkV3hsUkdWbWFXNXBkR2x2YmlJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndkxpOTBhSEpsWlM1cWN5OXpjbU12Ykc5allYUnBiMjR0WW1GelpXUXZhbk12WkdWMmFXTmxMVzl5YVdWdWRHRjBhVzl1TFdOdmJuUnliMnh6TG1weklpd2lkMlZpY0dGamF6b3ZMMVJJVWtWRmVDOHVMM1JvY21WbExtcHpMM055WXk5c2IyTmhkR2x2YmkxaVlYTmxaQzlxY3k5c2IyTmhkR2x2YmkxaVlYTmxaQzVxY3lJc0luZGxZbkJoWTJzNkx5OVVTRkpGUlhndkxpOTBhSEpsWlM1cWN5OXpjbU12Ykc5allYUnBiMjR0WW1GelpXUXZhbk12YzNCb2JXVnlZeTF3Y205cVpXTjBhVzl1TG1weklpd2lkMlZpY0dGamF6b3ZMMVJJVWtWRmVDOHVMM1JvY21WbExtcHpMM055WXk5c2IyTmhkR2x2YmkxaVlYTmxaQzlxY3k5M1pXSmpZVzB0Y21WdVpHVnlaWEl1YW5NaUxDSjNaV0p3WVdOck9pOHZWRWhTUlVWNEwyVjRkR1Z5Ym1Gc0lIVnRaQ0I3WENKamIyMXRiMjVxYzF3aU9sd2lkR2h5WldWY0lpeGNJbU52YlcxdmJtcHpNbHdpT2x3aWRHaHlaV1ZjSWl4Y0ltRnRaRndpT2x3aWRHaHlaV1ZjSWl4Y0luSnZiM1JjSWpwY0lsUklVa1ZGWENKOUlpd2lkMlZpY0dGamF6b3ZMMVJJVWtWRmVDOTNaV0p3WVdOckwySnZiM1J6ZEhKaGNDSXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZkMlZpY0dGamF5OXlkVzUwYVcxbEwyTnZiWEJoZENCblpYUWdaR1ZtWVhWc2RDQmxlSEJ2Y25RaUxDSjNaV0p3WVdOck9pOHZWRWhTUlVWNEwzZGxZbkJoWTJzdmNuVnVkR2x0WlM5a1pXWnBibVVnY0hKdmNHVnlkSGtnWjJWMGRHVnljeUlzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMmhoYzA5M2JsQnliM0JsY25SNUlITm9iM0owYUdGdVpDSXNJbmRsWW5CaFkyczZMeTlVU0ZKRlJYZ3ZkMlZpY0dGamF5OXlkVzUwYVcxbEwyMWhhMlVnYm1GdFpYTndZV05sSUc5aWFtVmpkQ0lzSW5kbFluQmhZMnM2THk5VVNGSkZSWGd2TGk5MGFISmxaUzVxY3k5emNtTXZiRzlqWVhScGIyNHRZbUZ6WldRdmFXNWtaWGd1YW5NaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLR1oxYm1OMGFXOXVJSGRsWW5CaFkydFZibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUtISnZiM1FzSUdaaFkzUnZjbmtwSUh0Y2JseDBhV1lvZEhsd1pXOW1JR1Y0Y0c5eWRITWdQVDA5SUNkdlltcGxZM1FuSUNZbUlIUjVjR1Z2WmlCdGIyUjFiR1VnUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEcxdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm1GamRHOXllU2h5WlhGMWFYSmxLRndpZEdoeVpXVmNJaWtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCa1pXWnBibVVnUFQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnWkdWbWFXNWxMbUZ0WkNsY2JseDBYSFJrWldacGJtVW9XMXdpZEdoeVpXVmNJbDBzSUdaaFkzUnZjbmtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCbGVIQnZjblJ6SUQwOVBTQW5iMkpxWldOMEp5bGNibHgwWEhSbGVIQnZjblJ6VzF3aVZFaFNSVVY0WENKZElEMGdabUZqZEc5eWVTaHlaWEYxYVhKbEtGd2lkR2h5WldWY0lpa3BPMXh1WEhSbGJITmxYRzVjZEZ4MGNtOXZkRnRjSWxSSVVrVkZlRndpWFNBOUlHWmhZM1J2Y25rb2NtOXZkRnRjSWxSSVVrVkZYQ0pkS1R0Y2JuMHBLSFJvYVhNc0lDaGZYMWRGUWxCQlEwdGZSVmhVUlZKT1FVeGZUVTlFVlV4RlgzUm9jbVZsWDE4cElEMCtJSHRjYm5KbGRIVnliaUFpTENJdkx5Qk5iMlJwWm1sbFpDQjJaWEp6YVc5dUlHOW1JRlJJVWtWRkxrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyOXVkSEp2YkhNZ1puSnZiU0IwYUhKbFpTNXFjMXh1THk4Z2QybHNiQ0IxYzJVZ2RHaGxJR1JsZG1salpXOXlhV1Z1ZEdGMGFXOXVZV0p6YjJ4MWRHVWdaWFpsYm5RZ2FXWWdZWFpoYVd4aFlteGxYRzVjYm1sdGNHOXlkQ0I3WEc0Z0lFVjFiR1Z5TEZ4dUlDQkZkbVZ1ZEVScGMzQmhkR05vWlhJc1hHNGdJRTFoZEdoVmRHbHNjeXhjYmlBZ1VYVmhkR1Z5Ym1sdmJpeGNiaUFnVm1WamRHOXlNeXhjYm4wZ1puSnZiU0JjSW5Sb2NtVmxYQ0k3WEc1Y2JtTnZibk4wSUY5NlpXVWdQU0J1WlhjZ1ZtVmpkRzl5TXlnd0xDQXdMQ0F4S1R0Y2JtTnZibk4wSUY5bGRXeGxjaUE5SUc1bGR5QkZkV3hsY2lncE8xeHVZMjl1YzNRZ1gzRXdJRDBnYm1WM0lGRjFZWFJsY201cGIyNG9LVHRjYm1OdmJuTjBJRjl4TVNBOUlHNWxkeUJSZFdGMFpYSnVhVzl1S0MxTllYUm9Mbk54Y25Rb01DNDFLU3dnTUN3Z01Dd2dUV0YwYUM1emNYSjBLREF1TlNrcE95QXZMeUF0SUZCSkx6SWdZWEp2ZFc1a0lIUm9aU0I0TFdGNGFYTmNibHh1WTI5dWMzUWdYMk5vWVc1blpVVjJaVzUwSUQwZ2V5QjBlWEJsT2lCY0ltTm9ZVzVuWlZ3aUlIMDdYRzVjYm1Oc1lYTnpJRVJsZG1salpVOXlhV1Z1ZEdGMGFXOXVRMjl1ZEhKdmJITWdaWGgwWlc1a2N5QkZkbVZ1ZEVScGMzQmhkR05vWlhJZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2lodlltcGxZM1FwSUh0Y2JpQWdJQ0J6ZFhCbGNpZ3BPMXh1WEc0Z0lDQWdhV1lnS0hkcGJtUnZkeTVwYzFObFkzVnlaVU52Ym5SbGVIUWdQVDA5SUdaaGJITmxLU0I3WEc0Z0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtGeHVJQ0FnSUNBZ0lDQmNJbFJJVWtWRkxrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyOXVkSEp2YkhNNklFUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVJYWmxiblFnYVhNZ2IyNXNlU0JoZG1GcGJHRmliR1VnYVc0Z2MyVmpkWEpsSUdOdmJuUmxlSFJ6SUNob2RIUndjeWxjSWx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JqYjI1emRDQnpZMjl3WlNBOUlIUm9hWE03WEc1Y2JpQWdJQ0JqYjI1emRDQkZVRk1nUFNBd0xqQXdNREF3TVR0Y2JpQWdJQ0JqYjI1emRDQnNZWE4wVVhWaGRHVnlibWx2YmlBOUlHNWxkeUJSZFdGMFpYSnVhVzl1S0NrN1hHNWNiaUFnSUNCMGFHbHpMbTlpYW1WamRDQTlJRzlpYW1WamREdGNiaUFnSUNCMGFHbHpMbTlpYW1WamRDNXliM1JoZEdsdmJpNXlaVzl5WkdWeUtGd2lXVmhhWENJcE8xeHVYRzRnSUNBZ2RHaHBjeTVsYm1GaWJHVmtJRDBnZEhKMVpUdGNibHh1SUNBZ0lIUm9hWE11WkdWMmFXTmxUM0pwWlc1MFlYUnBiMjRnUFNCN2ZUdGNiaUFnSUNCMGFHbHpMbk5qY21WbGJrOXlhV1Z1ZEdGMGFXOXVJRDBnTUR0Y2JseHVJQ0FnSUhSb2FYTXVZV3h3YUdGUFptWnpaWFFnUFNBd095QXZMeUJ5WVdScFlXNXpYRzVjYmlBZ0lDQjBhR2x6TGxSWFQxOVFTU0E5SURJZ0tpQk5ZWFJvTGxCSk8xeHVJQ0FnSUhSb2FYTXVTRUZNUmw5UVNTQTlJREF1TlNBcUlFMWhkR2d1VUVrN1hHNGdJQ0FnZEdocGN5NXZjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwVG1GdFpTQTlYRzRnSUNBZ0lDQmNJbTl1WkdWMmFXTmxiM0pwWlc1MFlYUnBiMjVoWW5OdmJIVjBaVndpSUdsdUlIZHBibVJ2ZDF4dUlDQWdJQ0FnSUNBL0lGd2laR1YyYVdObGIzSnBaVzUwWVhScGIyNWhZbk52YkhWMFpWd2lYRzRnSUNBZ0lDQWdJRG9nWENKa1pYWnBZMlZ2Y21sbGJuUmhkR2x2Ymx3aU8xeHVYRzRnSUNBZ2RHaHBjeTV6Ylc5dmRHaHBibWRHWVdOMGIzSWdQU0F4TzF4dVhHNGdJQ0FnWTI5dWMzUWdiMjVFWlhacFkyVlBjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwSUQwZ1puVnVZM1JwYjI0Z0tHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCelkyOXdaUzVrWlhacFkyVlBjbWxsYm5SaGRHbHZiaUE5SUdWMlpXNTBPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQmpiMjV6ZENCdmJsTmpjbVZsYms5eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCelkyOXdaUzV6WTNKbFpXNVBjbWxsYm5SaGRHbHZiaUE5SUhkcGJtUnZkeTV2Y21sbGJuUmhkR2x2YmlCOGZDQXdPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQXZMeUJVYUdVZ1lXNW5iR1Z6SUdGc2NHaGhMQ0JpWlhSaElHRnVaQ0JuWVcxdFlTQm1iM0p0SUdFZ2MyVjBJRzltSUdsdWRISnBibk5wWXlCVVlXbDBMVUp5ZVdGdUlHRnVaMnhsY3lCdlppQjBlWEJsSUZvdFdDY3RXU2NuWEc1Y2JpQWdJQ0JqYjI1emRDQnpaWFJQWW1wbFkzUlJkV0YwWlhKdWFXOXVJRDBnWm5WdVkzUnBiMjRnS0Z4dUlDQWdJQ0FnY1hWaGRHVnlibWx2Yml4Y2JpQWdJQ0FnSUdGc2NHaGhMRnh1SUNBZ0lDQWdZbVYwWVN4Y2JpQWdJQ0FnSUdkaGJXMWhMRnh1SUNBZ0lDQWdiM0pwWlc1MFhHNGdJQ0FnS1NCN1hHNGdJQ0FnSUNCZlpYVnNaWEl1YzJWMEtHSmxkR0VzSUdGc2NHaGhMQ0F0WjJGdGJXRXNJRndpV1ZoYVhDSXBPeUF2THlBbldsaFpKeUJtYjNJZ2RHaGxJR1JsZG1salpTd2dZblYwSUNkWldGb25JR1p2Y2lCMWMxeHVYRzRnSUNBZ0lDQnhkV0YwWlhKdWFXOXVMbk5sZEVaeWIyMUZkV3hsY2loZlpYVnNaWElwT3lBdkx5QnZjbWxsYm5RZ2RHaGxJR1JsZG1salpWeHVYRzRnSUNBZ0lDQnhkV0YwWlhKdWFXOXVMbTExYkhScGNHeDVLRjl4TVNrN0lDOHZJR05oYldWeVlTQnNiMjlyY3lCdmRYUWdkR2hsSUdKaFkyc2diMllnZEdobElHUmxkbWxqWlN3Z2JtOTBJSFJvWlNCMGIzQmNibHh1SUNBZ0lDQWdjWFZoZEdWeWJtbHZiaTV0ZFd4MGFYQnNlU2hmY1RBdWMyVjBSbkp2YlVGNGFYTkJibWRzWlNoZmVtVmxMQ0F0YjNKcFpXNTBLU2s3SUM4dklHRmthblZ6ZENCbWIzSWdjMk55WldWdUlHOXlhV1Z1ZEdGMGFXOXVYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lIUm9hWE11WTI5dWJtVmpkQ0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lHOXVVMk55WldWdVQzSnBaVzUwWVhScGIyNURhR0Z1WjJWRmRtVnVkQ2dwT3lBdkx5QnlkVzRnYjI1alpTQnZiaUJzYjJGa1hHNWNiaUFnSUNBZ0lDOHZJR2xQVXlBeE15dGNibHh1SUNBZ0lDQWdhV1lnS0Z4dUlDQWdJQ0FnSUNCM2FXNWtiM2N1UkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVGZG1WdWRDQWhQVDBnZFc1a1pXWnBibVZrSUNZbVhHNGdJQ0FnSUNBZ0lIUjVjR1Z2WmlCM2FXNWtiM2N1UkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVGZG1WdWRDNXlaWEYxWlhOMFVHVnliV2x6YzJsdmJpQTlQVDBnWENKbWRXNWpkR2x2Ymx3aVhHNGdJQ0FnSUNBcElIdGNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVJYWmxiblF1Y21WeGRXVnpkRkJsY20xcGMzTnBiMjRvS1Z4dUlDQWdJQ0FnSUNBZ0lDNTBhR1Z1S0NoeVpYTndiMjV6WlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSEpsYzNCdmJuTmxJRDA5UFNCY0ltZHlZVzUwWldSY0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCY0ltOXlhV1Z1ZEdGMGFXOXVZMmhoYm1kbFhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiMjVUWTNKbFpXNVBjbWxsYm5SaGRHbHZia05vWVc1blpVVjJaVzUwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSGRwYm1SdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmpiM0JsTG05eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUk9ZVzFsTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc5dVJHVjJhV05sVDNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQWdJQ0FnTG1OaGRHTm9LR1oxYm1OMGFXOXVJQ2hsY25KdmNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0pVU0ZKRlJTNUVaWFpwWTJWUGNtbGxiblJoZEdsdmJrTnZiblJ5YjJ4ek9pQlZibUZpYkdVZ2RHOGdkWE5sSUVSbGRtbGpaVTl5YVdWdWRHRjBhVzl1SUVGUVNUcGNJaXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdaWEp5YjNKY2JpQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loY2JpQWdJQ0FnSUNBZ0lDQmNJbTl5YVdWdWRHRjBhVzl1WTJoaGJtZGxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ2IyNVRZM0psWlc1UGNtbGxiblJoZEdsdmJrTm9ZVzVuWlVWMlpXNTBYRzRnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRnh1SUNBZ0lDQWdJQ0FnSUhOamIzQmxMbTl5YVdWdWRHRjBhVzl1UTJoaGJtZGxSWFpsYm5ST1lXMWxMRnh1SUNBZ0lDQWdJQ0FnSUc5dVJHVjJhV05sVDNKcFpXNTBZWFJwYjI1RGFHRnVaMlZGZG1WdWRGeHVJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J6WTI5d1pTNWxibUZpYkdWa0lEMGdkSEoxWlR0Y2JpQWdJQ0I5TzF4dVhHNGdJQ0FnZEdocGN5NWthWE5qYjI1dVpXTjBJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2QybHVaRzkzTG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1hHNGdJQ0FnSUNBZ0lGd2liM0pwWlc1MFlYUnBiMjVqYUdGdVoyVmNJaXhjYmlBZ0lDQWdJQ0FnYjI1VFkzSmxaVzVQY21sbGJuUmhkR2x2YmtOb1lXNW5aVVYyWlc1MFhHNGdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ2QybHVaRzkzTG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1hHNGdJQ0FnSUNBZ0lITmpiM0JsTG05eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUk9ZVzFsTEZ4dUlDQWdJQ0FnSUNCdmJrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyaGhibWRsUlhabGJuUmNiaUFnSUNBZ0lDazdYRzVjYmlBZ0lDQWdJSE5qYjNCbExtVnVZV0pzWldRZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0I5TzF4dVhHNGdJQ0FnZEdocGN5NTFjR1JoZEdVZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0JwWmlBb2MyTnZjR1V1Wlc1aFlteGxaQ0E5UFQwZ1ptRnNjMlVwSUhKbGRIVnlianRjYmx4dUlDQWdJQ0FnWTI5dWMzUWdaR1YyYVdObElEMGdjMk52Y0dVdVpHVjJhV05sVDNKcFpXNTBZWFJwYjI0N1hHNWNiaUFnSUNBZ0lHbG1JQ2hrWlhacFkyVXBJSHRjYmlBZ0lDQWdJQ0FnYkdWMElHRnNjR2hoSUQwZ1pHVjJhV05sTG1Gc2NHaGhYRzRnSUNBZ0lDQWdJQ0FnUHlCTllYUm9WWFJwYkhNdVpHVm5WRzlTWVdRb1pHVjJhV05sTG1Gc2NHaGhLU0FySUhOamIzQmxMbUZzY0doaFQyWm1jMlYwWEc0Z0lDQWdJQ0FnSUNBZ09pQXdPeUF2THlCYVhHNWNiaUFnSUNBZ0lDQWdiR1YwSUdKbGRHRWdQU0JrWlhacFkyVXVZbVYwWVNBL0lFMWhkR2hWZEdsc2N5NWtaV2RVYjFKaFpDaGtaWFpwWTJVdVltVjBZU2tnT2lBd095QXZMeUJZSjF4dVhHNGdJQ0FnSUNBZ0lHeGxkQ0JuWVcxdFlTQTlJR1JsZG1salpTNW5ZVzF0WVNBL0lFMWhkR2hWZEdsc2N5NWtaV2RVYjFKaFpDaGtaWFpwWTJVdVoyRnRiV0VwSURvZ01Ec2dMeThnV1NjblhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2IzSnBaVzUwSUQwZ2MyTnZjR1V1YzJOeVpXVnVUM0pwWlc1MFlYUnBiMjVjYmlBZ0lDQWdJQ0FnSUNBL0lFMWhkR2hWZEdsc2N5NWtaV2RVYjFKaFpDaHpZMjl3WlM1elkzSmxaVzVQY21sbGJuUmhkR2x2YmlsY2JpQWdJQ0FnSUNBZ0lDQTZJREE3SUM4dklFOWNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTV6Ylc5dmRHaHBibWRHWVdOMGIzSWdQQ0F4S1NCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXViR0Z6ZEU5eWFXVnVkR0YwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JySUQwZ2RHaHBjeTV6Ylc5dmRHaHBibWRHWVdOMGIzSTdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGJIQm9ZU0E5SUhSb2FYTXVYMmRsZEZOdGIyOTBhR1ZrUVc1bmJHVW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHRnNjR2hoTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxteGhjM1JQY21sbGJuUmhkR2x2Ymk1aGJIQm9ZU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdhMXh1SUNBZ0lDQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUdKbGRHRWdQU0IwYUdsekxsOW5aWFJUYlc5dmRHaGxaRUZ1WjJ4bEtGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCaVpYUmhJQ3NnVFdGMGFDNVFTU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1c1lYTjBUM0pwWlc1MFlYUnBiMjR1WW1WMFlTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2ExeHVJQ0FnSUNBZ0lDQWdJQ0FnS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2RoYlcxaElEMGdkR2hwY3k1ZloyVjBVMjF2YjNSb1pXUkJibWRzWlNoY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnWjJGdGJXRWdLeUIwYUdsekxraEJURVpmVUVrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXViR0Z6ZEU5eWFXVnVkR0YwYVc5dUxtZGhiVzFoTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JyTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JOWVhSb0xsQkpYRzRnSUNBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaVpYUmhJQ3M5SUUxaGRHZ3VVRWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQm5ZVzF0WVNBclBTQjBhR2x6TGtoQlRFWmZVRWs3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NXNZWE4wVDNKcFpXNTBZWFJwYjI0Z1BTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGJIQm9ZVG9nWVd4d2FHRXNYRzRnSUNBZ0lDQWdJQ0FnSUNCaVpYUmhPaUJpWlhSaExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWjJGdGJXRTZJR2RoYlcxaExGeHVJQ0FnSUNBZ0lDQWdJSDA3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnpaWFJQWW1wbFkzUlJkV0YwWlhKdWFXOXVLRnh1SUNBZ0lDQWdJQ0FnSUhOamIzQmxMbTlpYW1WamRDNXhkV0YwWlhKdWFXOXVMRnh1SUNBZ0lDQWdJQ0FnSUdGc2NHaGhMRnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjMjF2YjNSb2FXNW5SbUZqZEc5eUlEd2dNU0EvSUdKbGRHRWdMU0JOWVhSb0xsQkpJRG9nWW1WMFlTeGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuTnRiMjkwYUdsdVowWmhZM1J2Y2lBOElERWdQeUJuWVcxdFlTQXRJSFJvYVhNdVNFRk1SbDlRU1NBNklHZGhiVzFoTEZ4dUlDQWdJQ0FnSUNBZ0lHOXlhV1Z1ZEZ4dUlDQWdJQ0FnSUNBcE8xeHVYRzRnSUNBZ0lDQWdJR2xtSUNnNElDb2dLREVnTFNCc1lYTjBVWFZoZEdWeWJtbHZiaTVrYjNRb2MyTnZjR1V1YjJKcVpXTjBMbkYxWVhSbGNtNXBiMjRwS1NBK0lFVlFVeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHeGhjM1JSZFdGMFpYSnVhVzl1TG1OdmNIa29jMk52Y0dVdWIySnFaV04wTG5GMVlYUmxjbTVwYjI0cE8xeHVJQ0FnSUNBZ0lDQWdJSE5qYjNCbExtUnBjM0JoZEdOb1JYWmxiblFvWDJOb1lXNW5aVVYyWlc1MEtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQXZMeUJPVnlCQlpHUmxaRnh1SUNBZ0lIUm9hWE11WDI5eVpHVnlRVzVuYkdVZ1BTQm1kVzVqZEdsdmJpQW9ZU3dnWWl3Z2NtRnVaMlVnUFNCMGFHbHpMbFJYVDE5UVNTa2dlMXh1SUNBZ0lDQWdhV1lnS0Z4dUlDQWdJQ0FnSUNBb1lpQStJR0VnSmlZZ1RXRjBhQzVoWW5Nb1lpQXRJR0VwSUR3Z2NtRnVaMlVnTHlBeUtTQjhmRnh1SUNBZ0lDQWdJQ0FvWVNBK0lHSWdKaVlnVFdGMGFDNWhZbk1vWWlBdElHRXBJRDRnY21GdVoyVWdMeUF5S1Z4dUlDQWdJQ0FnS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCN0lHeGxablE2SUdFc0lISnBaMmgwT2lCaUlIMDdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2V5QnNaV1owT2lCaUxDQnlhV2RvZERvZ1lTQjlPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQXZMeUJPVnlCQlpHUmxaRnh1SUNBZ0lIUm9hWE11WDJkbGRGTnRiMjkwYUdWa1FXNW5iR1VnUFNCbWRXNWpkR2x2YmlBb1lTd2dZaXdnYXl3Z2NtRnVaMlVnUFNCMGFHbHpMbFJYVDE5UVNTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1lXNW5iR1Z6SUQwZ2RHaHBjeTVmYjNKa1pYSkJibWRzWlNoaExDQmlMQ0J5WVc1blpTazdYRzRnSUNBZ0lDQmpiMjV6ZENCaGJtZHNaWE5vYVdaMElEMGdZVzVuYkdWekxteGxablE3WEc0Z0lDQWdJQ0JqYjI1emRDQnZjbWxuUVc1bmJHVnpVbWxuYUhRZ1BTQmhibWRzWlhNdWNtbG5hSFE3WEc0Z0lDQWdJQ0JoYm1kc1pYTXViR1ZtZENBOUlEQTdYRzRnSUNBZ0lDQmhibWRzWlhNdWNtbG5hSFFnTFQwZ1lXNW5iR1Z6YUdsbWREdGNiaUFnSUNBZ0lHbG1JQ2hoYm1kc1pYTXVjbWxuYUhRZ1BDQXdLU0JoYm1kc1pYTXVjbWxuYUhRZ0t6MGdjbUZ1WjJVN1hHNGdJQ0FnSUNCc1pYUWdibVYzWVc1bmJHVWdQVnh1SUNBZ0lDQWdJQ0J2Y21sblFXNW5iR1Z6VW1sbmFIUWdQVDBnWWx4dUlDQWdJQ0FnSUNBZ0lEOGdLREVnTFNCcktTQXFJR0Z1WjJ4bGN5NXlhV2RvZENBcklHc2dLaUJoYm1kc1pYTXViR1ZtZEZ4dUlDQWdJQ0FnSUNBZ0lEb2dheUFxSUdGdVoyeGxjeTV5YVdkb2RDQXJJQ2d4SUMwZ2F5a2dLaUJoYm1kc1pYTXViR1ZtZER0Y2JpQWdJQ0FnSUc1bGQyRnVaMnhsSUNzOUlHRnVaMnhsYzJocFpuUTdYRzRnSUNBZ0lDQnBaaUFvYm1WM1lXNW5iR1VnUGowZ2NtRnVaMlVwSUc1bGQyRnVaMnhsSUMwOUlISmhibWRsTzF4dUlDQWdJQ0FnY21WMGRYSnVJRzVsZDJGdVoyeGxPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQjBhR2x6TG1ScGMzQnZjMlVnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQnpZMjl3WlM1a2FYTmpiMjV1WldOMEtDazdYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lIUm9hWE11WTI5dWJtVmpkQ2dwTzF4dUlDQjlYRzU5WEc1Y2JtVjRjRzl5ZENCN0lFUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVEyOXVkSEp2YkhNZ2ZUdGNiaUlzSW1sdGNHOXlkQ0I3SUZOd2FFMWxjbU5RY205cVpXTjBhVzl1SUgwZ1puSnZiU0JjSWk0dmMzQm9iV1Z5WXkxd2NtOXFaV04wYVc5dUxtcHpYQ0k3WEc1cGJYQnZjblFnS2lCaGN5QlVTRkpGUlNCbWNtOXRJRndpZEdoeVpXVmNJanRjYmx4dVkyeGhjM01nVEc5allYUnBiMjVDWVhObFpDQjdYRzRnSUdOdmJuTjBjblZqZEc5eUtITmpaVzVsTENCallXMWxjbUVzSUc5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lIUm9hWE11WDNOalpXNWxJRDBnYzJObGJtVTdYRzRnSUNBZ2RHaHBjeTVmWTJGdFpYSmhJRDBnWTJGdFpYSmhPMXh1SUNBZ0lIUm9hWE11WDNCeWIyb2dQU0J1WlhjZ1UzQm9UV1Z5WTFCeWIycGxZM1JwYjI0b0tUdGNiaUFnSUNCMGFHbHpMbDlsZG1WdWRFaGhibVJzWlhKeklEMGdlMzA3WEc0Z0lDQWdkR2hwY3k1ZmJHRnpkRU52YjNKa2N5QTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NWZaM0J6VFdsdVJHbHpkR0Z1WTJVZ1BTQXdPMXh1SUNBZ0lIUm9hWE11WDJkd2MwMXBia0ZqWTNWeVlXTjVJRDBnTVRBd08xeHVJQ0FnSUhSb2FYTXVYMjFoZUdsdGRXMUJaMlVnUFNBd08xeHVJQ0FnSUhSb2FYTXVYM2RoZEdOb1VHOXphWFJwYjI1SlpDQTlJRzUxYkd3N1hHNGdJQ0FnZEdocGN5NXpaWFJIY0hOUGNIUnBiMjV6S0c5d2RHbHZibk1wTzF4dUlDQWdJSFJvYVhNdWFXNXBkR2xoYkZCdmMybDBhVzl1SUQwZ2JuVnNiRHRjYmlBZ0lDQjBhR2x6TG1sdWFYUnBZV3hRYjNOcGRHbHZia0Z6VDNKcFoybHVJRDBnYjNCMGFXOXVjeTVwYm1sMGFXRnNVRzl6YVhScGIyNUJjMDl5YVdkcGJpQjhmQ0JtWVd4elpUdGNiaUFnZlZ4dVhHNGdJSE5sZEZCeWIycGxZM1JwYjI0b2NISnZhaWtnZTF4dUlDQWdJSFJvYVhNdVgzQnliMm9nUFNCd2NtOXFPMXh1SUNCOVhHNWNiaUFnYzJWMFIzQnpUM0IwYVc5dWN5aHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0JwWmlBb2IzQjBhVzl1Y3k1bmNITk5hVzVFYVhOMFlXNWpaU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5bmNITk5hVzVFYVhOMFlXNWpaU0E5SUc5d2RHbHZibk11WjNCelRXbHVSR2x6ZEdGdVkyVTdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaHZjSFJwYjI1ekxtZHdjMDFwYmtGalkzVnlZV041SUNFOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJSFJvYVhNdVgyZHdjMDFwYmtGalkzVnlZV041SUQwZ2IzQjBhVzl1Y3k1bmNITk5hVzVCWTJOMWNtRmplVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLRzl3ZEdsdmJuTXViV0Y0YVcxMWJVRm5aU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5dFlYaHBiWFZ0UVdkbElEMGdiM0IwYVc5dWN5NXRZWGhwYlhWdFFXZGxPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSE4wWVhKMFIzQnpLRzFoZUdsdGRXMUJaMlVnUFNBd0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzZGhkR05vVUc5emFYUnBiMjVKWkNBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmZDJGMFkyaFFiM05wZEdsdmJrbGtJRDBnYm1GMmFXZGhkRzl5TG1kbGIyeHZZMkYwYVc5dUxuZGhkR05vVUc5emFYUnBiMjRvWEc0Z0lDQWdJQ0FnSUNod2IzTnBkR2x2YmlrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMmR3YzFKbFkyVnBkbVZrS0hCdmMybDBhVzl1S1R0Y2JpQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdLR1Z5Y205eUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgyVjJaVzUwU0dGdVpHeGxjbk5iWENKbmNITmxjbkp2Y2x3aVhTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmWlhabGJuUklZVzVrYkdWeWMxdGNJbWR3YzJWeWNtOXlYQ0pkS0dWeWNtOXlMbU52WkdVcE8xeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGJHVnlkQ2hnUjFCVElHVnljbTl5T2lCamIyUmxJQ1I3WlhKeWIzSXVZMjlrWlgxZ0tUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwc1hHNGdJQ0FnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdJQ0JsYm1GaWJHVklhV2RvUVdOamRYSmhZM2s2SUhSeWRXVXNYRzRnSUNBZ0lDQWdJQ0FnYldGNGFXMTFiVUZuWlRvZ2JXRjRhVzExYlVGblpTQWhQU0F3SUQ4Z2JXRjRhVzExYlVGblpTQTZJSFJvYVhNdVgyMWhlR2x0ZFcxQloyVXNYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQjlYRzVjYmlBZ2MzUnZjRWR3Y3lncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1ZmQyRjBZMmhRYjNOcGRHbHZia2xrSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCdVlYWnBaMkYwYjNJdVoyVnZiRzlqWVhScGIyNHVZMnhsWVhKWFlYUmphQ2gwYUdsekxsOTNZWFJqYUZCdmMybDBhVzl1U1dRcE8xeHVJQ0FnSUNBZ2RHaHBjeTVmZDJGMFkyaFFiM05wZEdsdmJrbGtJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUgxY2JseHVJQ0JtWVd0bFIzQnpLR3h2Yml3Z2JHRjBMQ0JsYkdWMklEMGdiblZzYkN3Z1lXTmpJRDBnTUNrZ2UxeHVJQ0FnSUdsbUlDaGxiR1YySUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbk5sZEVWc1pYWmhkR2x2YmlobGJHVjJLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TGw5bmNITlNaV05sYVhabFpDaDdYRzRnSUNBZ0lDQmpiMjl5WkhNNklIdGNiaUFnSUNBZ0lDQWdiRzl1WjJsMGRXUmxPaUJzYjI0c1hHNGdJQ0FnSUNBZ0lHeGhkR2wwZFdSbE9pQnNZWFFzWEc0Z0lDQWdJQ0FnSUdGalkzVnlZV041T2lCaFkyTXNYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnYkc5dVRHRjBWRzlYYjNKc1pFTnZiM0prY3loc2IyNHNJR3hoZENrZ2UxeHVJQ0FnSUdOdmJuTjBJSEJ5YjJwbFkzUmxaRkJ2Y3lBOUlIUm9hWE11WDNCeWIyb3VjSEp2YW1WamRDaHNiMjRzSUd4aGRDazdYRzRnSUNBZ2FXWWdLSFJvYVhNdWFXNXBkR2xoYkZCdmMybDBhVzl1UVhOUGNtbG5hVzRwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG1sdWFYUnBZV3hRYjNOcGRHbHZiaWtnZTF4dUlDQWdJQ0FnSUNCd2NtOXFaV04wWldSUWIzTmJNRjBnTFQwZ2RHaHBjeTVwYm1sMGFXRnNVRzl6YVhScGIyNWJNRjA3WEc0Z0lDQWdJQ0FnSUhCeWIycGxZM1JsWkZCdmMxc3hYU0F0UFNCMGFHbHpMbWx1YVhScFlXeFFiM05wZEdsdmJsc3hYVHRjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lGd2lWSEo1YVc1bklIUnZJSFZ6WlNBbmFXNXBkR2xoYkNCd2IzTnBkR2x2YmlCaGN5QnZjbWxuYVc0bklHMXZaR1VnZDJsMGFDQnVieUJwYm1sMGFXRnNJSEJ2YzJsMGFXOXVJR1JsZEdWeWJXbHVaV1JjSWp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlGdHdjbTlxWldOMFpXUlFiM05iTUYwc0lDMXdjbTlxWldOMFpXUlFiM05iTVYxZE8xeHVJQ0I5WEc1Y2JpQWdZV1JrS0c5aWFtVmpkQ3dnYkc5dUxDQnNZWFFzSUdWc1pYWXBJSHRjYmlBZ0lDQjBhR2x6TG5ObGRGZHZjbXhrVUc5emFYUnBiMjRvYjJKcVpXTjBMQ0JzYjI0c0lHeGhkQ3dnWld4bGRpazdYRzRnSUNBZ2RHaHBjeTVmYzJObGJtVXVZV1JrS0c5aWFtVmpkQ2s3WEc0Z0lIMWNibHh1SUNCelpYUlhiM0pzWkZCdmMybDBhVzl1S0c5aWFtVmpkQ3dnYkc5dUxDQnNZWFFzSUdWc1pYWXBJSHRjYmlBZ0lDQmpiMjV6ZENCM2IzSnNaRU52YjNKa2N5QTlJSFJvYVhNdWJHOXVUR0YwVkc5WGIzSnNaRU52YjNKa2N5aHNiMjRzSUd4aGRDazdYRzRnSUNBZ2FXWWdLR1ZzWlhZZ0lUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJQ0FnYjJKcVpXTjBMbkJ2YzJsMGFXOXVMbmtnUFNCbGJHVjJPMXh1SUNBZ0lIMWNiaUFnSUNCYmIySnFaV04wTG5CdmMybDBhVzl1TG5nc0lHOWlhbVZqZEM1d2IzTnBkR2x2Ymk1NlhTQTlJSGR2Y214a1EyOXZjbVJ6TzF4dUlDQjlYRzVjYmlBZ2MyVjBSV3hsZG1GMGFXOXVLR1ZzWlhZcElIdGNiaUFnSUNCMGFHbHpMbDlqWVcxbGNtRXVjRzl6YVhScGIyNHVlU0E5SUdWc1pYWTdYRzRnSUgxY2JseHVJQ0J2YmlobGRtVnVkRTVoYldVc0lHVjJaVzUwU0dGdVpHeGxjaWtnZTF4dUlDQWdJSFJvYVhNdVgyVjJaVzUwU0dGdVpHeGxjbk5iWlhabGJuUk9ZVzFsWFNBOUlHVjJaVzUwU0dGdVpHeGxjanRjYmlBZ2ZWeHVYRzRnSUhObGRGZHZjbXhrVDNKcFoybHVLR3h2Yml3Z2JHRjBLU0I3WEc0Z0lDQWdkR2hwY3k1cGJtbDBhV0ZzVUc5emFYUnBiMjRnUFNCMGFHbHpMbDl3Y205cUxuQnliMnBsWTNRb2JHOXVMQ0JzWVhRcE8xeHVJQ0I5WEc1Y2JpQWdYMmR3YzFKbFkyVnBkbVZrS0hCdmMybDBhVzl1S1NCN1hHNGdJQ0FnYkdWMElHUnBjM1JOYjNabFpDQTlJRTUxYldKbGNpNU5RVmhmVmtGTVZVVTdYRzRnSUNBZ2FXWWdLSEJ2YzJsMGFXOXVMbU52YjNKa2N5NWhZMk4xY21GamVTQThQU0IwYUdsekxsOW5jSE5OYVc1QlkyTjFjbUZqZVNrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgyeGhjM1JEYjI5eVpITWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiR0Z6ZEVOdmIzSmtjeUE5SUh0Y2JpQWdJQ0FnSUNBZ0lDQnNZWFJwZEhWa1pUb2djRzl6YVhScGIyNHVZMjl2Y21SekxteGhkR2wwZFdSbExGeHVJQ0FnSUNBZ0lDQWdJR3h2Ym1kcGRIVmtaVG9nY0c5emFYUnBiMjR1WTI5dmNtUnpMbXh2Ym1kcGRIVmtaU3hjYmlBZ0lDQWdJQ0FnZlR0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUdScGMzUk5iM1psWkNBOUlIUm9hWE11WDJoaGRtVnljMmx1WlVScGMzUW9kR2hwY3k1ZmJHRnpkRU52YjNKa2N5d2djRzl6YVhScGIyNHVZMjl2Y21SektUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2hrYVhOMFRXOTJaV1FnUGowZ2RHaHBjeTVmWjNCelRXbHVSR2x6ZEdGdVkyVXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiR0Z6ZEVOdmIzSmtjeTVzYjI1bmFYUjFaR1VnUFNCd2IzTnBkR2x2Ymk1amIyOXlaSE11Ykc5dVoybDBkV1JsTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlzWVhOMFEyOXZjbVJ6TG14aGRHbDBkV1JsSUQwZ2NHOXphWFJwYjI0dVkyOXZjbVJ6TG14aGRHbDBkV1JsTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtbHVhWFJwWVd4UWIzTnBkR2x2YmtGelQzSnBaMmx1SUNZbUlDRjBhR2x6TG1sdWFYUnBZV3hRYjNOcGRHbHZiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YzJWMFYyOXliR1JQY21sbmFXNG9YRzRnSUNBZ0lDQWdJQ0FnSUNCd2IzTnBkR2x2Ymk1amIyOXlaSE11Ykc5dVoybDBkV1JsTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdjRzl6YVhScGIyNHVZMjl2Y21SekxteGhkR2wwZFdSbFhHNGdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YzJWMFYyOXliR1JRYjNOcGRHbHZiaWhjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDlqWVcxbGNtRXNYRzRnSUNBZ0lDQWdJQ0FnY0c5emFYUnBiMjR1WTI5dmNtUnpMbXh2Ym1kcGRIVmtaU3hjYmlBZ0lDQWdJQ0FnSUNCd2IzTnBkR2x2Ymk1amIyOXlaSE11YkdGMGFYUjFaR1ZjYmlBZ0lDQWdJQ0FnS1R0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWZaWFpsYm5SSVlXNWtiR1Z5YzF0Y0ltZHdjM1Z3WkdGMFpWd2lYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11WDJWMlpXNTBTR0Z1Wkd4bGNuTmJYQ0puY0hOMWNHUmhkR1ZjSWwwb2NHOXphWFJwYjI0c0lHUnBjM1JOYjNabFpDazdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTJGc1kzVnNZWFJsSUdoaGRtVnljMmx1WlNCa2FYTjBZVzVqWlNCaVpYUjNaV1Z1SUhSM2J5QnNZWFF2Ykc5dUlIQmhhWEp6TGx4dUlDQWdLbHh1SUNBZ0tpQlVZV3RsYmlCbWNtOXRJRzl5YVdkcGJtRnNJRUV0Um5KaGJXVWdZMjl0Y0c5dVpXNTBjMXh1SUNBZ0tpOWNiaUFnWDJoaGRtVnljMmx1WlVScGMzUW9jM0pqTENCa1pYTjBLU0I3WEc0Z0lDQWdZMjl1YzNRZ1pHeHZibWRwZEhWa1pTQTlJRlJJVWtWRkxrMWhkR2hWZEdsc2N5NWtaV2RVYjFKaFpDaGtaWE4wTG14dmJtZHBkSFZrWlNBdElITnlZeTVzYjI1bmFYUjFaR1VwTzF4dUlDQWdJR052Ym5OMElHUnNZWFJwZEhWa1pTQTlJRlJJVWtWRkxrMWhkR2hWZEdsc2N5NWtaV2RVYjFKaFpDaGtaWE4wTG14aGRHbDBkV1JsSUMwZ2MzSmpMbXhoZEdsMGRXUmxLVHRjYmx4dUlDQWdJR052Ym5OMElHRWdQVnh1SUNBZ0lDQWdUV0YwYUM1emFXNG9aR3hoZEdsMGRXUmxJQzhnTWlrZ0tpQk5ZWFJvTG5OcGJpaGtiR0YwYVhSMVpHVWdMeUF5S1NBclhHNGdJQ0FnSUNCTllYUm9MbU52Y3loVVNGSkZSUzVOWVhSb1ZYUnBiSE11WkdWblZHOVNZV1FvYzNKakxteGhkR2wwZFdSbEtTa2dLbHh1SUNBZ0lDQWdJQ0JOWVhSb0xtTnZjeWhVU0ZKRlJTNU5ZWFJvVlhScGJITXVaR1ZuVkc5U1lXUW9aR1Z6ZEM1c1lYUnBkSFZrWlNrcElDcGNiaUFnSUNBZ0lDQWdLRTFoZEdndWMybHVLR1JzYjI1bmFYUjFaR1VnTHlBeUtTQXFJRTFoZEdndWMybHVLR1JzYjI1bmFYUjFaR1VnTHlBeUtTazdYRzRnSUNBZ1kyOXVjM1FnWVc1bmJHVWdQU0F5SUNvZ1RXRjBhQzVoZEdGdU1paE5ZWFJvTG5OeGNuUW9ZU2tzSUUxaGRHZ3VjM0Z5ZENneElDMGdZU2twTzF4dUlDQWdJSEpsZEhWeWJpQmhibWRzWlNBcUlEWXpOekV3TURBN1hHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElIc2dURzlqWVhScGIyNUNZWE5sWkNCOU8xeHVJaXdpWTJ4aGMzTWdVM0JvVFdWeVkxQnliMnBsWTNScGIyNGdlMXh1SUNCamIyNXpkSEoxWTNSdmNpZ3BJSHRjYmlBZ0lDQjBhR2x6TGtWQlVsUklJRDBnTkRBd056VXdNVFl1TmpnN1hHNGdJQ0FnZEdocGN5NUlRVXhHWDBWQlVsUklJRDBnTWpBd016YzFNRGd1TXpRN1hHNGdJSDFjYmx4dUlDQndjbTlxWldOMEtHeHZiaXdnYkdGMEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUZ0MGFHbHpMbXh2YmxSdlUzQm9UV1Z5WXloc2IyNHBMQ0IwYUdsekxteGhkRlJ2VTNCb1RXVnlZeWhzWVhRcFhUdGNiaUFnZlZ4dVhHNGdJSFZ1Y0hKdmFtVmpkQ2h3Y205cVpXTjBaV1FwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdXM1JvYVhNdWMzQm9UV1Z5WTFSdlRHOXVLSEJ5YjJwbFkzUmxaRnN3WFNrc0lIUm9hWE11YzNCb1RXVnlZMVJ2VEdGMEtIQnliMnBsWTNSbFpGc3hYU2xkTzF4dUlDQjlYRzVjYmlBZ2JHOXVWRzlUY0doTlpYSmpLR3h2YmlrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvYkc5dUlDOGdNVGd3S1NBcUlIUm9hWE11U0VGTVJsOUZRVkpVU0R0Y2JpQWdmVnh1WEc0Z0lHeGhkRlJ2VTNCb1RXVnlZeWhzWVhRcElIdGNiaUFnSUNCMllYSWdlU0E5SUUxaGRHZ3ViRzluS0UxaGRHZ3VkR0Z1S0Nnb09UQWdLeUJzWVhRcElDb2dUV0YwYUM1UVNTa2dMeUF6TmpBcEtTQXZJQ2hOWVhSb0xsQkpJQzhnTVRnd0tUdGNiaUFnSUNCeVpYUjFjbTRnS0hrZ0tpQjBhR2x6TGtoQlRFWmZSVUZTVkVncElDOGdNVGd3TGpBN1hHNGdJSDFjYmx4dUlDQnpjR2hOWlhKalZHOU1iMjRvZUNrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvZUNBdklIUm9hWE11U0VGTVJsOUZRVkpVU0NrZ0tpQXhPREF1TUR0Y2JpQWdmVnh1WEc0Z0lITndhRTFsY21OVWIweGhkQ2g1S1NCN1hHNGdJQ0FnZG1GeUlHeGhkQ0E5SUNoNUlDOGdkR2hwY3k1SVFVeEdYMFZCVWxSSUtTQXFJREU0TUM0d08xeHVJQ0FnSUd4aGRDQTlYRzRnSUNBZ0lDQW9NVGd3SUM4Z1RXRjBhQzVRU1NrZ0tseHVJQ0FnSUNBZ0tESWdLaUJOWVhSb0xtRjBZVzRvVFdGMGFDNWxlSEFvS0d4aGRDQXFJRTFoZEdndVVFa3BJQzhnTVRnd0tTa2dMU0JOWVhSb0xsQkpJQzhnTWlrN1hHNGdJQ0FnY21WMGRYSnVJR3hoZER0Y2JpQWdmVnh1WEc0Z0lHZGxkRWxFS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJjSW1Wd2MyYzZNemcxTjF3aU8xeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQjdJRk53YUUxbGNtTlFjbTlxWldOMGFXOXVJSDA3WEc0aUxDSnBiWEJ2Y25RZ0tpQmhjeUJVU0ZKRlJTQm1jbTl0SUZ3aWRHaHlaV1ZjSWp0Y2JseHVZMnhoYzNNZ1YyVmlZMkZ0VW1WdVpHVnlaWElnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWh5Wlc1a1pYSmxjaXdnZG1sa1pXOUZiR1Z0Wlc1MEtTQjdYRzRnSUNBZ2RHaHBjeTV5Wlc1a1pYSmxjaUE5SUhKbGJtUmxjbVZ5TzF4dUlDQWdJSFJvYVhNdWNtVnVaR1Z5WlhJdVlYVjBiME5zWldGeUlEMGdabUZzYzJVN1hHNGdJQ0FnZEdocGN5NXpZMlZ1WlZkbFltTmhiU0E5SUc1bGR5QlVTRkpGUlM1VFkyVnVaU2dwTzF4dUlDQWdJR3hsZENCMmFXUmxienRjYmlBZ0lDQnBaaUFvZG1sa1pXOUZiR1Z0Wlc1MElEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUhacFpHVnZJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDaGNJblpwWkdWdlhDSXBPMXh1SUNBZ0lDQWdkbWxrWlc4dWMyVjBRWFIwY21saWRYUmxLRndpWVhWMGIzQnNZWGxjSWl3Z2RISjFaU2s3WEc0Z0lDQWdJQ0IyYVdSbGJ5NXpaWFJCZEhSeWFXSjFkR1VvWENKd2JHRjVjMmx1YkdsdVpWd2lMQ0IwY25WbEtUdGNiaUFnSUNBZ0lIWnBaR1Z2TG5OMGVXeGxMbVJwYzNCc1lYa2dQU0JjSW01dmJtVmNJanRjYmlBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdVlYQndaVzVrUTJocGJHUW9kbWxrWlc4cE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0IyYVdSbGJ5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2RtbGtaVzlGYkdWdFpXNTBLVHRjYmlBZ0lDQjlYRzRnSUNBZ2RHaHBjeTVuWlc5dElEMGdibVYzSUZSSVVrVkZMbEJzWVc1bFFuVm1abVZ5UjJWdmJXVjBjbmtvS1R0Y2JpQWdJQ0IwYUdsekxuUmxlSFIxY21VZ1BTQnVaWGNnVkVoU1JVVXVWbWxrWlc5VVpYaDBkWEpsS0hacFpHVnZLVHRjYmlBZ0lDQjBhR2x6TG0xaGRHVnlhV0ZzSUQwZ2JtVjNJRlJJVWtWRkxrMWxjMmhDWVhOcFkwMWhkR1Z5YVdGc0tIc2diV0Z3T2lCMGFHbHpMblJsZUhSMWNtVWdmU2s3WEc0Z0lDQWdZMjl1YzNRZ2JXVnphQ0E5SUc1bGR5QlVTRkpGUlM1TlpYTm9LSFJvYVhNdVoyVnZiU3dnZEdocGN5NXRZWFJsY21saGJDazdYRzRnSUNBZ2RHaHBjeTV6WTJWdVpWZGxZbU5oYlM1aFpHUW9iV1Z6YUNrN1hHNGdJQ0FnZEdocGN5NWpZVzFsY21GWFpXSmpZVzBnUFNCdVpYY2dWRWhTUlVVdVQzSjBhRzluY21Gd2FHbGpRMkZ0WlhKaEtGeHVJQ0FnSUNBZ0xUQXVOU3hjYmlBZ0lDQWdJREF1TlN4Y2JpQWdJQ0FnSURBdU5TeGNiaUFnSUNBZ0lDMHdMalVzWEc0Z0lDQWdJQ0F3TEZ4dUlDQWdJQ0FnTVRCY2JpQWdJQ0FwTzF4dUlDQWdJR2xtSUNodVlYWnBaMkYwYjNJdWJXVmthV0ZFWlhacFkyVnpJQ1ltSUc1aGRtbG5ZWFJ2Y2k1dFpXUnBZVVJsZG1salpYTXVaMlYwVlhObGNrMWxaR2xoS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1emRISmhhVzUwY3lBOUlIdGNiaUFnSUNBZ0lDQWdkbWxrWlc4NklIdGNiaUFnSUNBZ0lDQWdJQ0IzYVdSMGFEb2dNVEk0TUN4Y2JpQWdJQ0FnSUNBZ0lDQm9aV2xuYUhRNklEY3lNQ3hjYmlBZ0lDQWdJQ0FnSUNCbVlXTnBibWROYjJSbE9pQmNJbVZ1ZG1seWIyNXRaVzUwWENJc1hHNGdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lDQWdibUYyYVdkaGRHOXlMbTFsWkdsaFJHVjJhV05sYzF4dUlDQWdJQ0FnSUNBdVoyVjBWWE5sY2sxbFpHbGhLR052Ym5OMGNtRnBiblJ6S1Z4dUlDQWdJQ0FnSUNBdWRHaGxiaWdvYzNSeVpXRnRLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvWUhWemFXNW5JSFJvWlNCM1pXSmpZVzBnYzNWalkyVnpjMloxYkd4NUxpNHVZQ2s3WEc0Z0lDQWdJQ0FnSUNBZ2RtbGtaVzh1YzNKalQySnFaV04wSUQwZ2MzUnlaV0Z0TzF4dUlDQWdJQ0FnSUNBZ0lIWnBaR1Z2TG5Cc1lYa29LVHRjYmlBZ0lDQWdJQ0FnZlNsY2JpQWdJQ0FnSUNBZ0xtTmhkR05vS0NobEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2MyVjBWR2x0Wlc5MWRDZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtTnlaV0YwWlVWeWNtOXlVRzl3ZFhBb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUZ3aVYyVmlZMkZ0SUVWeWNtOXlYRnh1VG1GdFpUb2dYQ0lnS3lCbExtNWhiV1VnS3lCY0lseGNiazFsYzNOaFoyVTZJRndpSUNzZ1pTNXRaWE56WVdkbFhHNGdJQ0FnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNBZ0lIMHNJREV3TURBcE8xeHVJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2MyVjBWR2x0Wlc5MWRDZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WTNKbFlYUmxSWEp5YjNKUWIzQjFjQ2hjSW5OdmNuSjVJQzBnYldWa2FXRWdaR1YyYVdObGN5QkJVRWtnYm05MElITjFjSEJ2Y25SbFpGd2lLVHRjYmlBZ0lDQWdJSDBzSURFd01EQXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSFZ3WkdGMFpTZ3BJSHRjYmlBZ0lDQjBhR2x6TG5KbGJtUmxjbVZ5TG1Oc1pXRnlLQ2s3WEc0Z0lDQWdkR2hwY3k1eVpXNWtaWEpsY2k1eVpXNWtaWElvZEdocGN5NXpZMlZ1WlZkbFltTmhiU3dnZEdocGN5NWpZVzFsY21GWFpXSmpZVzBwTzF4dUlDQWdJSFJvYVhNdWNtVnVaR1Z5WlhJdVkyeGxZWEpFWlhCMGFDZ3BPMXh1SUNCOVhHNWNiaUFnWkdsemNHOXpaU2dwSUh0Y2JpQWdJQ0IwYUdsekxtMWhkR1Z5YVdGc0xtUnBjM0J2YzJVb0tUdGNiaUFnSUNCMGFHbHpMblJsZUhSMWNtVXVaR2x6Y0c5elpTZ3BPMXh1SUNBZ0lIUm9hWE11WjJWdmJTNWthWE53YjNObEtDazdYRzRnSUgxY2JseHVJQ0JqY21WaGRHVkZjbkp2Y2xCdmNIVndLRzF6WnlrZ2UxeHVJQ0FnSUdsbUlDZ2haRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb1hDSmxjbkp2Y2kxd2IzQjFjRndpS1NrZ2UxeHVJQ0FnSUNBZ2RtRnlJR1Z5Y205eVVHOXdkWEFnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLRndpWkdsMlhDSXBPMXh1SUNBZ0lDQWdaWEp5YjNKUWIzQjFjQzVwYm01bGNraFVUVXdnUFNCdGMyYzdYRzRnSUNBZ0lDQmxjbkp2Y2xCdmNIVndMbk5sZEVGMGRISnBZblYwWlNoY0ltbGtYQ0lzSUZ3aVpYSnliM0l0Y0c5d2RYQmNJaWs3WEc0Z0lDQWdJQ0JrYjJOMWJXVnVkQzVpYjJSNUxtRndjR1Z1WkVOb2FXeGtLR1Z5Y205eVVHOXdkWEFwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnZXlCWFpXSmpZVzFTWlc1a1pYSmxjaUI5TzF4dUlpd2liVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQmZYMWRGUWxCQlEwdGZSVmhVUlZKT1FVeGZUVTlFVlV4RlgzUm9jbVZsWDE4N0lpd2lMeThnVkdobElHMXZaSFZzWlNCallXTm9aVnh1ZG1GeUlGOWZkMlZpY0dGamExOXRiMlIxYkdWZlkyRmphR1ZmWHlBOUlIdDlPMXh1WEc0dkx5QlVhR1VnY21WeGRXbHlaU0JtZFc1amRHbHZibHh1Wm5WdVkzUnBiMjRnWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHlodGIyUjFiR1ZKWkNrZ2UxeHVYSFF2THlCRGFHVmpheUJwWmlCdGIyUjFiR1VnYVhNZ2FXNGdZMkZqYUdWY2JseDBkbUZ5SUdOaFkyaGxaRTF2WkhWc1pTQTlJRjlmZDJWaWNHRmphMTl0YjJSMWJHVmZZMkZqYUdWZlgxdHRiMlIxYkdWSlpGMDdYRzVjZEdsbUlDaGpZV05vWldSTmIyUjFiR1VnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1WEhSY2RISmxkSFZ5YmlCallXTm9aV1JOYjJSMWJHVXVaWGh3YjNKMGN6dGNibHgwZlZ4dVhIUXZMeUJEY21WaGRHVWdZU0J1WlhjZ2JXOWtkV3hsSUNoaGJtUWdjSFYwSUdsMElHbHVkRzhnZEdobElHTmhZMmhsS1Z4dVhIUjJZWElnYlc5a2RXeGxJRDBnWDE5M1pXSndZV05yWDIxdlpIVnNaVjlqWVdOb1pWOWZXMjF2WkhWc1pVbGtYU0E5SUh0Y2JseDBYSFF2THlCdWJ5QnRiMlIxYkdVdWFXUWdibVZsWkdWa1hHNWNkRngwTHk4Z2JtOGdiVzlrZFd4bExteHZZV1JsWkNCdVpXVmtaV1JjYmx4MFhIUmxlSEJ2Y25Sek9pQjdmVnh1WEhSOU8xeHVYRzVjZEM4dklFVjRaV04xZEdVZ2RHaGxJRzF2WkhWc1pTQm1kVzVqZEdsdmJseHVYSFJmWDNkbFluQmhZMnRmYlc5a2RXeGxjMTlmVzIxdlpIVnNaVWxrWFNodGIyUjFiR1VzSUcxdlpIVnNaUzVsZUhCdmNuUnpMQ0JmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmS1R0Y2JseHVYSFF2THlCU1pYUjFjbTRnZEdobElHVjRjRzl5ZEhNZ2IyWWdkR2hsSUcxdlpIVnNaVnh1WEhSeVpYUjFjbTRnYlc5a2RXeGxMbVY0Y0c5eWRITTdYRzU5WEc1Y2JpSXNJaTh2SUdkbGRFUmxabUYxYkhSRmVIQnZjblFnWm5WdVkzUnBiMjRnWm05eUlHTnZiWEJoZEdsaWFXeHBkSGtnZDJsMGFDQnViMjR0YUdGeWJXOXVlU0J0YjJSMWJHVnpYRzVmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG00Z1BTQW9iVzlrZFd4bEtTQTlQaUI3WEc1Y2RIWmhjaUJuWlhSMFpYSWdQU0J0YjJSMWJHVWdKaVlnYlc5a2RXeGxMbDlmWlhOTmIyUjFiR1VnUDF4dVhIUmNkQ2dwSUQwK0lDaHRiMlIxYkdWYkoyUmxabUYxYkhRblhTa2dPbHh1WEhSY2RDZ3BJRDArSUNodGIyUjFiR1VwTzF4dVhIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbVFvWjJWMGRHVnlMQ0I3SUdFNklHZGxkSFJsY2lCOUtUdGNibHgwY21WMGRYSnVJR2RsZEhSbGNqdGNibjA3SWl3aUx5OGdaR1ZtYVc1bElHZGxkSFJsY2lCbWRXNWpkR2x2Ym5NZ1ptOXlJR2hoY20xdmJua2daWGh3YjNKMGMxeHVYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTVrSUQwZ0tHVjRjRzl5ZEhNc0lHUmxabWx1YVhScGIyNHBJRDArSUh0Y2JseDBabTl5S0haaGNpQnJaWGtnYVc0Z1pHVm1hVzVwZEdsdmJpa2dlMXh1WEhSY2RHbG1LRjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1Ynloa1pXWnBibWwwYVc5dUxDQnJaWGtwSUNZbUlDRmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbThvWlhod2IzSjBjeXdnYTJWNUtTa2dlMXh1WEhSY2RGeDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUd0bGVTd2dleUJsYm5WdFpYSmhZbXhsT2lCMGNuVmxMQ0JuWlhRNklHUmxabWx1YVhScGIyNWJhMlY1WFNCOUtUdGNibHgwWEhSOVhHNWNkSDFjYm4wN0lpd2lYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV2SUQwZ0tHOWlhaXdnY0hKdmNDa2dQVDRnS0U5aWFtVmpkQzV3Y205MGIzUjVjR1V1YUdGelQzZHVVSEp2Y0dWeWRIa3VZMkZzYkNodlltb3NJSEJ5YjNBcEtTSXNJaTh2SUdSbFptbHVaU0JmWDJWelRXOWtkV3hsSUc5dUlHVjRjRzl5ZEhOY2JsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVjaUE5SUNobGVIQnZjblJ6S1NBOVBpQjdYRzVjZEdsbUtIUjVjR1Z2WmlCVGVXMWliMndnSVQwOUlDZDFibVJsWm1sdVpXUW5JQ1ltSUZONWJXSnZiQzUwYjFOMGNtbHVaMVJoWnlrZ2UxeHVYSFJjZEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGxlSEJ2Y25SekxDQlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY3NJSHNnZG1Gc2RXVTZJQ2ROYjJSMWJHVW5JSDBwTzF4dVhIUjlYRzVjZEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGxlSEJ2Y25SekxDQW5YMTlsYzAxdlpIVnNaU2NzSUhzZ2RtRnNkV1U2SUhSeWRXVWdmU2s3WEc1OU95SXNJbWx0Y0c5eWRDQjdJRXh2WTJGMGFXOXVRbUZ6WldRZ2ZTQm1jbTl0SUZ3aUxpOXFjeTlzYjJOaGRHbHZiaTFpWVhObFpDNXFjMXdpTzF4dWFXMXdiM0owSUhzZ1YyVmlZMkZ0VW1WdVpHVnlaWElnZlNCbWNtOXRJRndpTGk5cWN5OTNaV0pqWVcwdGNtVnVaR1Z5WlhJdWFuTmNJanRjYm1sdGNHOXlkQ0I3SUVSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UTI5dWRISnZiSE1nZlNCbWNtOXRJRndpTGk5cWN5OWtaWFpwWTJVdGIzSnBaVzUwWVhScGIyNHRZMjl1ZEhKdmJITXVhbk5jSWp0Y2JseHVaWGh3YjNKMElIc2dURzlqWVhScGIyNUNZWE5sWkN3Z1YyVmlZMkZ0VW1WdVpHVnlaWElzSUVSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UTI5dWRISnZiSE1nZlR0Y2JpSmRMQ0p1WVcxbGN5STZXMTBzSW5OdmRYSmpaVkp2YjNRaU9pSWlmUT09IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuLi9sb2NhdGlvbi1iYXNlZC9hcmpzLXdlYmNhbS10ZXh0dXJlXCI7XG5pbXBvcnQgXCIuL2dwcy1uZXctY2FtZXJhXCI7XG5pbXBvcnQgXCIuL2dwcy1uZXctZW50aXR5LXBsYWNlXCI7XG5pbXBvcnQgXCIuL2FyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=