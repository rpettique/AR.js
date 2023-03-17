(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["THREEx"] = factory(require("three"));
	else
		root["THREEx"] = factory(root["THREE"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./three.js/src/location-based/js/device-orientation-controls.js":
/*!***********************************************************************!*\
  !*** ./three.js/src/location-based/js/device-orientation-controls.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* binding */ DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocationBased": () => (/* binding */ LocationBased)
/* harmony export */ });
/* harmony import */ var _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sphmerc-projection.js */ "./three.js/src/location-based/js/sphmerc-projection.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);



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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebcamRenderer": () => (/* binding */ WebcamRenderer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);


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
    this.geom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry();
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************************!*\
  !*** ./three.js/src/location-based/index.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* reexport safe */ _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__.DeviceOrientationControls),
/* harmony export */   "LocationBased": () => (/* reexport safe */ _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__.LocationBased),
/* harmony export */   "WebcamRenderer": () => (/* reexport safe */ _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__.WebcamRenderer)
/* harmony export */ });
/* harmony import */ var _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/location-based.js */ "./three.js/src/location-based/js/location-based.js");
/* harmony import */ var _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/webcam-renderer.js */ "./three.js/src/location-based/js/webcam-renderer.js");
/* harmony import */ var _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/device-orientation-controls.js */ "./three.js/src/location-based/js/device-orientation-controls.js");






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXVCLEdBQUcsbUJBQW1CO0FBQ3JFLHFCQUFxQix1Q0FBVTtBQUMvQjtBQUNBLDRCQUE0QixxREFBd0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7QUNqRjFCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ051RDtBQUNFO0FBQ3VCOztBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4L2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1widGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVEhSRUV4XCJdID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRIUkVFeFwiXSA9IGZhY3Rvcnkocm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pID0+IHtcbnJldHVybiAiLCIvLyBNb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSB0aHJlZS5qc1xuLy8gd2lsbCB1c2UgdGhlIGRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUgZXZlbnQgaWYgYXZhaWxhYmxlXG5cbmltcG9ydCB7XG4gIEV1bGVyLFxuICBFdmVudERpc3BhdGNoZXIsXG4gIE1hdGhVdGlscyxcbiAgUXVhdGVybmlvbixcbiAgVmVjdG9yMyxcbn0gZnJvbSBcInRocmVlXCI7XG5cbmNvbnN0IF96ZWUgPSBuZXcgVmVjdG9yMygwLCAwLCAxKTtcbmNvbnN0IF9ldWxlciA9IG5ldyBFdWxlcigpO1xuY29uc3QgX3EwID0gbmV3IFF1YXRlcm5pb24oKTtcbmNvbnN0IF9xMSA9IG5ldyBRdWF0ZXJuaW9uKC1NYXRoLnNxcnQoMC41KSwgMCwgMCwgTWF0aC5zcXJ0KDAuNSkpOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcblxuY29uc3QgX2NoYW5nZUV2ZW50ID0geyB0eXBlOiBcImNoYW5nZVwiIH07XG5cbmNsYXNzIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcihvYmplY3QpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIlRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IERldmljZU9yaWVudGF0aW9uRXZlbnQgaXMgb25seSBhdmFpbGFibGUgaW4gc2VjdXJlIGNvbnRleHRzIChodHRwcylcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZSA9IHRoaXM7XG5cbiAgICBjb25zdCBFUFMgPSAwLjAwMDAwMTtcbiAgICBjb25zdCBsYXN0UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLm9iamVjdC5yb3RhdGlvbi5yZW9yZGVyKFwiWVhaXCIpO1xuXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcbiAgICB0aGlzLnNjcmVlbk9yaWVudGF0aW9uID0gMDtcblxuICAgIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgICB0aGlzLlRXT19QSSA9IDIgKiBNYXRoLlBJO1xuICAgIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG4gICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9XG4gICAgICBcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvd1xuICAgICAgICA/IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiXG4gICAgICAgIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuXG4gICAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gICAgY29uc3Qgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuICAgIH07XG5cbiAgICBjb25zdCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cbiAgICBjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKFxuICAgICAgcXVhdGVybmlvbixcbiAgICAgIGFscGhhLFxuICAgICAgYmV0YSxcbiAgICAgIGdhbW1hLFxuICAgICAgb3JpZW50XG4gICAgKSB7XG4gICAgICBfZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihfZXVsZXIpOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMSk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTAuc2V0RnJvbUF4aXNBbmdsZShfemVlLCAtb3JpZW50KSk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpOyAvLyBydW4gb25jZSBvbiBsb2FkXG5cbiAgICAgIC8vIGlPUyAxMytcblxuICAgICAgaWYgKFxuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICApIHtcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBVbmFibGUgdG8gdXNlIERldmljZU9yaWVudGF0aW9uIEFQSTpcIixcbiAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBzY29wZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICApO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIHNjb3BlLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICk7XG5cbiAgICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgbGV0IGFscGhhID0gZGV2aWNlLmFscGhhXG4gICAgICAgICAgPyBNYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmFscGhhKSArIHNjb3BlLmFscGhhT2Zmc2V0XG4gICAgICAgICAgOiAwOyAvLyBaXG5cbiAgICAgICAgbGV0IGJldGEgPSBkZXZpY2UuYmV0YSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYmV0YSkgOiAwOyAvLyBYJ1xuXG4gICAgICAgIGxldCBnYW1tYSA9IGRldmljZS5nYW1tYSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXG5cbiAgICAgICAgY29uc3Qgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgICA/IE1hdGhVdGlscy5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcbiAgICAgICAgICA6IDA7IC8vIE9cblxuICAgICAgICBpZiAodGhpcy5zbW9vdGhpbmdGYWN0b3IgPCAxKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGFzdE9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gdGhpcy5zbW9vdGhpbmdGYWN0b3I7XG4gICAgICAgICAgICBhbHBoYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgICAgIGFscGhhLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5hbHBoYSxcbiAgICAgICAgICAgICAga1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJldGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgICAgICBiZXRhICsgTWF0aC5QSSxcbiAgICAgICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYmV0YSxcbiAgICAgICAgICAgICAga1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGdhbW1hID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICAgICAgZ2FtbWEgKyB0aGlzLkhBTEZfUEksXG4gICAgICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmdhbW1hLFxuICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICBNYXRoLlBJXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXRhICs9IE1hdGguUEk7XG4gICAgICAgICAgICBnYW1tYSArPSB0aGlzLkhBTEZfUEk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24gPSB7XG4gICAgICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgICAgICBiZXRhOiBiZXRhLFxuICAgICAgICAgICAgZ2FtbWE6IGdhbW1hLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxuICAgICAgICAgIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLFxuICAgICAgICAgIGFscGhhLFxuICAgICAgICAgIHRoaXMuc21vb3RoaW5nRmFjdG9yIDwgMSA/IGJldGEgLSBNYXRoLlBJIDogYmV0YSxcbiAgICAgICAgICB0aGlzLnNtb290aGluZ0ZhY3RvciA8IDEgPyBnYW1tYSAtIHRoaXMuSEFMRl9QSSA6IGdhbW1hLFxuICAgICAgICAgIG9yaWVudFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICg4ICogKDEgLSBsYXN0UXVhdGVybmlvbi5kb3Qoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pKSA+IEVQUykge1xuICAgICAgICAgIGxhc3RRdWF0ZXJuaW9uLmNvcHkoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pO1xuICAgICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoX2NoYW5nZUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBOVyBBZGRlZFxuICAgIHRoaXMuX29yZGVyQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgICAgaWYgKFxuICAgICAgICAoYiA+IGEgJiYgTWF0aC5hYnMoYiAtIGEpIDwgcmFuZ2UgLyAyKSB8fFxuICAgICAgICAoYSA+IGIgJiYgTWF0aC5hYnMoYiAtIGEpID4gcmFuZ2UgLyAyKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB7IGxlZnQ6IGEsIHJpZ2h0OiBiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyBsZWZ0OiBiLCByaWdodDogYSB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBOVyBBZGRlZFxuICAgIHRoaXMuX2dldFNtb290aGVkQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgaywgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgICAgY29uc3QgYW5nbGVzID0gdGhpcy5fb3JkZXJBbmdsZShhLCBiLCByYW5nZSk7XG4gICAgICBjb25zdCBhbmdsZXNoaWZ0ID0gYW5nbGVzLmxlZnQ7XG4gICAgICBjb25zdCBvcmlnQW5nbGVzUmlnaHQgPSBhbmdsZXMucmlnaHQ7XG4gICAgICBhbmdsZXMubGVmdCA9IDA7XG4gICAgICBhbmdsZXMucmlnaHQgLT0gYW5nbGVzaGlmdDtcbiAgICAgIGlmIChhbmdsZXMucmlnaHQgPCAwKSBhbmdsZXMucmlnaHQgKz0gcmFuZ2U7XG4gICAgICBsZXQgbmV3YW5nbGUgPVxuICAgICAgICBvcmlnQW5nbGVzUmlnaHQgPT0gYlxuICAgICAgICAgID8gKDEgLSBrKSAqIGFuZ2xlcy5yaWdodCArIGsgKiBhbmdsZXMubGVmdFxuICAgICAgICAgIDogayAqIGFuZ2xlcy5yaWdodCArICgxIC0gaykgKiBhbmdsZXMubGVmdDtcbiAgICAgIG5ld2FuZ2xlICs9IGFuZ2xlc2hpZnQ7XG4gICAgICBpZiAobmV3YW5nbGUgPj0gcmFuZ2UpIG5ld2FuZ2xlIC09IHJhbmdlO1xuICAgICAgcmV0dXJuIG5ld2FuZ2xlO1xuICAgIH07XG5cbiAgICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5kaXNjb25uZWN0KCk7XG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCgpO1xuICB9XG59XG5cbmV4cG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcbiIsImltcG9ydCB7IFNwaE1lcmNQcm9qZWN0aW9uIH0gZnJvbSBcIi4vc3BobWVyYy1wcm9qZWN0aW9uLmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY2xhc3MgTG9jYXRpb25CYXNlZCB7XG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBjYW1lcmEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xuICAgIHRoaXMuX3Byb2ogPSBuZXcgU3BoTWVyY1Byb2plY3Rpb24oKTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzID0ge307XG4gICAgdGhpcy5fbGFzdENvb3JkcyA9IG51bGw7XG4gICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSAwO1xuICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gMTAwO1xuICAgIHRoaXMuX21heGltdW1BZ2UgPSAwO1xuICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgdGhpcy5zZXRHcHNPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luID0gb3B0aW9ucy5pbml0aWFsUG9zaXRpb25Bc09yaWdpbiB8fCBmYWxzZTtcbiAgfVxuXG4gIHNldFByb2plY3Rpb24ocHJvaikge1xuICAgIHRoaXMuX3Byb2ogPSBwcm9qO1xuICB9XG5cbiAgc2V0R3BzT3B0aW9ucyhvcHRpb25zID0ge30pIHtcbiAgICBpZiAob3B0aW9ucy5ncHNNaW5EaXN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IG9wdGlvbnMuZ3BzTWluRGlzdGFuY2U7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmdwc01pbkFjY3VyYWN5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gb3B0aW9ucy5ncHNNaW5BY2N1cmFjeTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubWF4aW11bUFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9tYXhpbXVtQWdlID0gb3B0aW9ucy5tYXhpbXVtQWdlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0R3BzKG1heGltdW1BZ2UgPSAwKSB7XG4gICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24oXG4gICAgICAgIChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgIHRoaXMuX2dwc1JlY2VpdmVkKHBvc2l0aW9uKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXSkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc2Vycm9yXCJdKGVycm9yLmNvZGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChgR1BTIGVycm9yOiBjb2RlICR7ZXJyb3IuY29kZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAgICAgbWF4aW11bUFnZTogbWF4aW11bUFnZSAhPSAwID8gbWF4aW11bUFnZSA6IHRoaXMuX21heGltdW1BZ2UsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RvcEdwcygpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmYWtlR3BzKGxvbiwgbGF0LCBlbGV2ID0gbnVsbCwgYWNjID0gMCkge1xuICAgIGlmIChlbGV2ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldEVsZXZhdGlvbihlbGV2KTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncHNSZWNlaXZlZCh7XG4gICAgICBjb29yZHM6IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXG4gICAgICAgIGxhdGl0dWRlOiBsYXQsXG4gICAgICAgIGFjY3VyYWN5OiBhY2MsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgbG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCkge1xuICAgIGNvbnN0IHByb2plY3RlZFBvcyA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbFBvc2l0aW9uQXNPcmlnaW4pIHtcbiAgICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICBwcm9qZWN0ZWRQb3NbMF0gLT0gdGhpcy5pbml0aWFsUG9zaXRpb25bMF07XG4gICAgICAgIHByb2plY3RlZFBvc1sxXSAtPSB0aGlzLmluaXRpYWxQb3NpdGlvblsxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiVHJ5aW5nIHRvIHVzZSAnaW5pdGlhbCBwb3NpdGlvbiBhcyBvcmlnaW4nIG1vZGUgd2l0aCBubyBpbml0aWFsIHBvc2l0aW9uIGRldGVybWluZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtwcm9qZWN0ZWRQb3NbMF0sIC1wcm9qZWN0ZWRQb3NbMV1dO1xuICB9XG5cbiAgYWRkKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldik7XG4gICAgdGhpcy5fc2NlbmUuYWRkKG9iamVjdCk7XG4gIH1cblxuICBzZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICBjb25zdCB3b3JsZENvb3JkcyA9IHRoaXMubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gICAgaWYgKGVsZXYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb2JqZWN0LnBvc2l0aW9uLnkgPSBlbGV2O1xuICAgIH1cbiAgICBbb2JqZWN0LnBvc2l0aW9uLngsIG9iamVjdC5wb3NpdGlvbi56XSA9IHdvcmxkQ29vcmRzO1xuICB9XG5cbiAgc2V0RWxldmF0aW9uKGVsZXYpIHtcbiAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24ueSA9IGVsZXY7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSA9IGV2ZW50SGFuZGxlcjtcbiAgfVxuXG4gIHNldFdvcmxkT3JpZ2luKGxvbiwgbGF0KSB7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSB0aGlzLl9wcm9qLnByb2plY3QobG9uLCBsYXQpO1xuICB9XG5cbiAgX2dwc1JlY2VpdmVkKHBvc2l0aW9uKSB7XG4gICAgbGV0IGRpc3RNb3ZlZCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgaWYgKHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLl9ncHNNaW5BY2N1cmFjeSkge1xuICAgICAgaWYgKHRoaXMuX2xhc3RDb29yZHMgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbGFzdENvb3JkcyA9IHtcbiAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QodGhpcy5fbGFzdENvb3JkcywgcG9zaXRpb24uY29vcmRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXN0TW92ZWQgPj0gdGhpcy5fZ3BzTWluRGlzdGFuY2UpIHtcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzLmxhdGl0dWRlID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxQb3NpdGlvbkFzT3JpZ2luICYmICF0aGlzLmluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICAgIHRoaXMuc2V0V29ybGRPcmlnaW4oXG4gICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbihcbiAgICAgICAgICB0aGlzLl9jYW1lcmEsXG4gICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc3VwZGF0ZVwiXSkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHN1cGRhdGVcIl0ocG9zaXRpb24sIGRpc3RNb3ZlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGhhdmVyc2luZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsYXQvbG9uIHBhaXJzLlxuICAgKlxuICAgKiBUYWtlbiBmcm9tIG9yaWdpbmFsIEEtRnJhbWUgY29tcG9uZW50c1xuICAgKi9cbiAgX2hhdmVyc2luZURpc3Qoc3JjLCBkZXN0KSB7XG4gICAgY29uc3QgZGxvbmdpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIGNvbnN0IGRsYXRpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIGNvbnN0IGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKlxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICpcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH1cbn1cblxuZXhwb3J0IHsgTG9jYXRpb25CYXNlZCB9O1xuIiwiY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7XG4gICAgdGhpcy5IQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG4gIH1cblxuICBwcm9qZWN0KGxvbiwgbGF0KSB7XG4gICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgfVxuXG4gIHVucHJvamVjdChwcm9qZWN0ZWQpIHtcbiAgICByZXR1cm4gW3RoaXMuc3BoTWVyY1RvTG9uKHByb2plY3RlZFswXSksIHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICB9XG5cbiAgbG9uVG9TcGhNZXJjKGxvbikge1xuICAgIHJldHVybiAobG9uIC8gMTgwKSAqIHRoaXMuSEFMRl9FQVJUSDtcbiAgfVxuXG4gIGxhdFRvU3BoTWVyYyhsYXQpIHtcbiAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCgoOTAgKyBsYXQpICogTWF0aC5QSSkgLyAzNjApKSAvIChNYXRoLlBJIC8gMTgwKTtcbiAgICByZXR1cm4gKHkgKiB0aGlzLkhBTEZfRUFSVEgpIC8gMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9Mb24oeCkge1xuICAgIHJldHVybiAoeCAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgfVxuXG4gIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgdmFyIGxhdCA9ICh5IC8gdGhpcy5IQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgIGxhdCA9XG4gICAgICAoMTgwIC8gTWF0aC5QSSkgKlxuICAgICAgKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoKGxhdCAqIE1hdGguUEkpIC8gMTgwKSkgLSBNYXRoLlBJIC8gMik7XG4gICAgcmV0dXJuIGxhdDtcbiAgfVxuXG4gIGdldElEKCkge1xuICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICB9XG59XG5cbmV4cG9ydCB7IFNwaE1lcmNQcm9qZWN0aW9uIH07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgdmlkZW9FbGVtZW50KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZVdlYmNhbSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIGxldCB2aWRlbztcbiAgICBpZiAodmlkZW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICAgIHZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlkZW8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodmlkZW9FbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoKTtcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZVdlYmNhbS5hZGQobWVzaCk7XG4gICAgdGhpcy5jYW1lcmFXZWJjYW0gPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKFxuICAgICAgLTAuNSxcbiAgICAgIDAuNSxcbiAgICAgIDAuNSxcbiAgICAgIC0wLjUsXG4gICAgICAwLFxuICAgICAgMTBcbiAgICApO1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICB3aWR0aDogMTI4MCxcbiAgICAgICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHVzaW5nIHRoZSB3ZWJjYW0gc3VjY2Vzc2Z1bGx5Li4uYCk7XG4gICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVycm9yUG9wdXAoXG4gICAgICAgICAgICAgIFwiV2ViY2FtIEVycm9yXFxuTmFtZTogXCIgKyBlLm5hbWUgKyBcIlxcbk1lc3NhZ2U6IFwiICsgZS5tZXNzYWdlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlRXJyb3JQb3B1cChcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZVdlYmNhbSwgdGhpcy5jYW1lcmFXZWJjYW0pO1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gIH1cblxuICBjcmVhdGVFcnJvclBvcHVwKG1zZykge1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvci1wb3B1cFwiKSkge1xuICAgICAgdmFyIGVycm9yUG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZXJyb3JQb3B1cC5pbm5lckhUTUwgPSBtc2c7XG4gICAgICBlcnJvclBvcHVwLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZXJyb3ItcG9wdXBcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVycm9yUG9wdXApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBXZWJjYW1SZW5kZXJlciB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2F0aW9uQmFzZWQgfSBmcm9tIFwiLi9qcy9sb2NhdGlvbi1iYXNlZC5qc1wiO1xuaW1wb3J0IHsgV2ViY2FtUmVuZGVyZXIgfSBmcm9tIFwiLi9qcy93ZWJjYW0tcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfSBmcm9tIFwiLi9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIjtcblxuZXhwb3J0IHsgTG9jYXRpb25CYXNlZCwgV2ViY2FtUmVuZGVyZXIsIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==