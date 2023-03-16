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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/ArjsDeviceOrientationControls.js":
/*!********************************************************************!*\
  !*** ./aframe/src/location-based/ArjsDeviceOrientationControls.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

/* NOTE that this is a modified version of THREE.DeviceOrientationControls to
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */



const ArjsDeviceOrientationControls = function (object) {
  var scope = this;

  this.object = object;
  this.object.rotation.reorder("YXZ");

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;

  var onDeviceOrientationChangeEvent = function (event) {
    scope.deviceOrientation = event;
  };

  var onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = (function () {
    var zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);

    var euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();

    var q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    var q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  })();

  this.connect = function () {
    onScreenOrientationChangeEvent();

    window.addEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.addEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = true;
  };

  this.disconnect = function () {
    window.removeEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.removeEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = false;
  };

  this.update = function () {
    if (scope.enabled === false) return;

    var device = scope.deviceOrientation;

    if (device) {
      var alpha = device.alpha
        ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.alpha) + scope.alphaOffset
        : 0; // Z

      var beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.beta) : 0; // X'

      var gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(device.gamma) : 0; // Y''

      var orient = scope.screenOrientation
        ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad(scope.screenOrientation)
        : 0; // O

      // NW Added smoothing code
      var k = this.smoothingFactor;

      if (this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
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
      setObjectQuaternion(
        scope.object.quaternion,
        alpha,
        beta - Math.PI,
        gamma - this.HALF_PI,
        orient
      );
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
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArjsDeviceOrientationControls);


/***/ }),

/***/ "./aframe/src/location-based/arjs-look-controls.js":
/*!*********************************************************!*\
  !*** ./aframe/src/location-based/arjs-look-controls.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
// To avoid recalculation at every mouse movement tick
var PI_2 = Math.PI / 2;

/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */

/* NOTE that this is a modified version of A-Frame's look-controls to
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-look-controls", {
  dependencies: ["position", "rotation"],

  schema: {
    enabled: { default: true },
    magicWindowTrackingEnabled: { default: true },
    pointerLockEnabled: { default: false },
    reverseMouseDrag: { default: false },
    reverseTouchDrag: { default: false },
    touchEnabled: { default: true },
    smoothingFactor: { type: "number", default: 1 },
  },

  init: function () {
    this.deltaYaw = 0;
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.magicWindowAbsoluteEuler = new THREE.Euler();
    this.magicWindowDeltaEuler = new THREE.Euler();
    this.position = new THREE.Vector3();
    this.magicWindowObject = new THREE.Object3D();
    this.rotation = {};
    this.deltaRotation = {};
    this.savedPose = null;
    this.pointerLocked = false;
    this.setupMouseControls();
    this.bindMethods();
    this.previousMouseEvent = {};

    this.setupMagicWindowControls();

    // To save / restore camera pose
    this.savedPose = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
    };

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is("vr-mode")) {
      this.onEnterVR();
    }
  },

  setupMagicWindowControls: function () {
    var magicWindowControls;
    var data = this.data;

    // Only on mobile devices and only enabled if DeviceOrientation permission has been granted.
    if (aframe__WEBPACK_IMPORTED_MODULE_0__.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls =
        new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__["default"](this.magicWindowObject);
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        DeviceOrientationEvent.requestPermission
      ) {
        magicWindowControls.enabled = false;
        if (
          this.el.sceneEl.components["device-orientation-permission-ui"]
            .permissionGranted
        ) {
          magicWindowControls.enabled = data.magicWindowTrackingEnabled;
        } else {
          this.el.sceneEl.addEventListener(
            "deviceorientationpermissiongranted",
            function () {
              magicWindowControls.enabled = data.magicWindowTrackingEnabled;
            }
          );
        }
      }
    }
  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }

    // Reset magic window eulers if tracking is disabled.
    if (
      oldData &&
      !data.magicWindowTrackingEnabled &&
      oldData.magicWindowTrackingEnabled
    ) {
      this.magicWindowAbsoluteEuler.set(0, 0, 0);
      this.magicWindowDeltaEuler.set(0, 0, 0);
    }

    // Pass on magic window tracking setting to magicWindowControls.
    if (this.magicWindowControls) {
      this.magicWindowControls.enabled = data.magicWindowTrackingEnabled;
      this.magicWindowControls.smoothingFactor = data.smoothingFactor;
    }

    if (oldData && !data.pointerLockEnabled !== oldData.pointerLockEnabled) {
      this.removeEventListeners();
      this.addEventListeners();
      if (this.pointerLocked) {
        this.exitPointerLock();
      }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) {
      return;
    }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  remove: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  bindMethods: function () {
    this.onMouseDown = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseDown, this);
    this.onMouseMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseMove, this);
    this.onMouseUp = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseUp, this);
    this.onTouchStart = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchStart, this);
    this.onTouchMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchMove, this);
    this.onTouchEnd = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchEnd, this);
    this.onEnterVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onEnterVR, this);
    this.onExitVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onExitVR, this);
    this.onPointerLockChange = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(
      this.onPointerLockChange,
      this
    );
    this.onPointerLockError = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockError, this);
  },

  /**
   * Set up states and Object3Ds needed to store rotation data.
   */
  setupMouseControls: function () {
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener(
        "render-target-loaded",
        aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.addEventListeners, this)
      );
      return;
    }

    // Mouse events.
    canvasEl.addEventListener("mousedown", this.onMouseDown, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("mouseup", this.onMouseUp, false);

    // Touch events.
    canvasEl.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener("enter-vr", this.onEnterVR);
    sceneEl.addEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener(
        "pointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "mozpointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "pointerlockerror",
        this.onPointerLockError,
        false
      );
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) {
      return;
    }

    // Mouse events.
    canvasEl.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);

    // Touch events.
    canvasEl.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener("enter-vr", this.onEnterVR);
    sceneEl.removeEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener(
      "pointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "mozpointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "pointerlockerror",
      this.onPointerLockError,
      false
    );
  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientation: (function () {
    var poseMatrix = new THREE.Matrix4();

    return function () {
      var object3D = this.el.object3D;
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      var pose;
      var sceneEl = this.el.sceneEl;

      // In VR mode, THREE is in charge of updating the camera pose.
      if (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected()) {
        // With WebXR THREE applies headset pose to the object3D matrixWorld internally.
        // Reflect values back on position, rotation, scale for getAttribute to return the expected values.
        if (sceneEl.hasWebXR) {
          pose = sceneEl.renderer.xr.getCameraPose();
          if (pose) {
            poseMatrix.elements = pose.transform.matrix;
            poseMatrix.decompose(
              object3D.position,
              object3D.rotation,
              object3D.scale
            );
          }
        }
        return;
      }

      this.updateMagicWindowOrientation();

      // On mobile, do camera rotation with touch events and sensors.
      object3D.rotation.x =
        this.magicWindowDeltaEuler.x + pitchObject.rotation.x;
      object3D.rotation.y = this.magicWindowDeltaEuler.y + yawObject.rotation.y;
      object3D.rotation.z = this.magicWindowDeltaEuler.z;
    };
  })(),

  updateMagicWindowOrientation: function () {
    var magicWindowAbsoluteEuler = this.magicWindowAbsoluteEuler;
    var magicWindowDeltaEuler = this.magicWindowDeltaEuler;
    // Calculate magic window HMD quaternion.
    if (this.magicWindowControls && this.magicWindowControls.enabled) {
      this.magicWindowControls.update();
      magicWindowAbsoluteEuler.setFromQuaternion(
        this.magicWindowObject.quaternion,
        "YXZ"
      );
      if (!this.previousMagicWindowYaw && magicWindowAbsoluteEuler.y !== 0) {
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
      if (this.previousMagicWindowYaw) {
        magicWindowDeltaEuler.x = magicWindowAbsoluteEuler.x;
        magicWindowDeltaEuler.y +=
          magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
        magicWindowDeltaEuler.z = magicWindowAbsoluteEuler.z;
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
    }
  },

  /**
   * Translate mouse drag into rotation.
   *
   * Dragging up and down rotates the camera around the X-axis (yaw).
   * Dragging left and right rotates the camera around the Y-axis (pitch).
   */
  onMouseMove: function (evt) {
    var direction;
    var movementX;
    var movementY;
    var pitchObject = this.pitchObject;
    var previousMouseEvent = this.previousMouseEvent;
    var yawObject = this.yawObject;

    // Not dragging or not enabled.
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) {
      return;
    }

    // Calculate delta.
    if (this.pointerLocked) {
      movementX = evt.movementX || evt.mozMovementX || 0;
      movementY = evt.movementY || evt.mozMovementY || 0;
    } else {
      movementX = evt.screenX - previousMouseEvent.screenX;
      movementY = evt.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;

    // Calculate rotation.
    direction = this.data.reverseMouseDrag ? 1 : -1;
    yawObject.rotation.y += movementX * 0.002 * direction;
    pitchObject.rotation.x += movementY * 0.002 * direction;
    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    var sceneEl = this.el.sceneEl;
    if (
      !this.data.enabled ||
      (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected())
    ) {
      return;
    }
    // Handle only primary button.
    if (evt.button !== 0) {
      return;
    }

    var canvasEl = sceneEl && sceneEl.canvas;

    this.mouseDown = true;
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;
    this.showGrabbingCursor();

    if (this.data.pointerLockEnabled && !this.pointerLocked) {
      if (canvasEl.requestPointerLock) {
        canvasEl.requestPointerLock();
      } else if (canvasEl.mozRequestPointerLock) {
        canvasEl.mozRequestPointerLock();
      }
    }
  },

  /**
   * Shows grabbing cursor on scene
   */
  showGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "grabbing";
  },

  /**
   * Hides grabbing cursor on scene
   */
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "";
  },

  /**
   * Register mouse up to detect release of mouse drag.
   */
  onMouseUp: function () {
    this.mouseDown = false;
    this.hideGrabbingCursor();
  },

  /**
   * Register touch down to detect touch drag.
   */
  onTouchStart: function (evt) {
    if (
      evt.touches.length !== 1 ||
      !this.data.touchEnabled ||
      this.el.sceneEl.is("vr-mode")
    ) {
      return;
    }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
    };
    this.touchStarted = true;
  },

  /**
   * Translate touch move to Y-axis rotation.
   */
  onTouchMove: function (evt) {
    var direction;
    var canvas = this.el.sceneEl.canvas;
    var deltaY;
    var yawObject = this.yawObject;

    if (!this.touchStarted || !this.data.touchEnabled) {
      return;
    }

    deltaY =
      (2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x)) /
      canvas.clientWidth;

    direction = this.data.reverseTouchDrag ? 1 : -1;
    // Limit touch orientaion to to yaw (y axis).
    yawObject.rotation.y -= deltaY * 0.5 * direction;
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
    };
  },

  /**
   * Register touch end to detect release of touch drag.
   */
  onTouchEnd: function () {
    this.touchStarted = false;
  },

  /**
   * Save pose.
   */
  onEnterVR: function () {
    var sceneEl = this.el.sceneEl;
    if (!sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.saveCameraPose();
    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);
    if (sceneEl.hasWebXR) {
      this.el.object3D.matrixAutoUpdate = false;
      this.el.object3D.updateMatrix();
    }
  },

  /**
   * Restore the pose.
   */
  onExitVR: function () {
    if (!this.el.sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
    this.el.object3D.matrixAutoUpdate = true;
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(
      document.pointerLockElement || document.mozPointerLockElement
    );
  },

  /**
   * Recover from Pointer Lock error.
   */
  onPointerLockError: function () {
    this.pointerLocked = false;
  },

  // Exits pointer-locked mode.
  exitPointerLock: function () {
    document.exitPointerLock();
    this.pointerLocked = false;
  },

  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor() {
      sceneEl.canvas.classList.add("a-grab-cursor");
    }
    function disableGrabCursor() {
      sceneEl.canvas.classList.remove("a-grab-cursor");
    }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener("render-target-loaded", enableGrabCursor);
      } else {
        sceneEl.addEventListener("render-target-loaded", disableGrabCursor);
      }
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

  /**
   * Save camera pose before entering VR to restore later if exiting.
   */
  saveCameraPose: function () {
    var el = this.el;

    this.savedPose.position.copy(el.object3D.position);
    this.savedPose.rotation.copy(el.object3D.rotation);
    this.hasSavedPose = true;
  },

  /**
   * Reset camera pose to before entering VR.
   */
  restoreCameraPose: function () {
    var el = this.el;
    var savedPose = this.savedPose;

    if (!this.hasSavedPose) {
      return;
    }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  },
});


/***/ }),

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./aframe/src/location-based/gps-camera.js":
/*!*************************************************!*\
  !*** ./aframe/src/location-based/gps-camera.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);
/*
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-camera", {
  _watchPositionId: null,
  originCoords: null,
  currentCoords: null,
  lookControls: null,
  heading: null,
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
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    maxDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 5,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.longitude = this.data.simulateLongitude;
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.altitude = this.data.simulateAltitude;
      this.currentCoords = localPosition;

      // re-trigger initialization for new origin
      this.originCoords = null;
      this._updatePosition();
    }
  },
  init: function () {
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      // iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
        var timeout = setTimeout(function () {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
          );
        }, 750);
        window.addEventListener(eventName, function () {
          clearTimeout(timeout);
        });
      }
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.longitude = this.data.simulateLongitude;
      if (this.data.simulateAltitude !== 0) {
        localPosition.altitude = this.data.simulateAltitude;
      }
      this.currentCoords = localPosition;
      this._updatePosition();
    } else {
      this._watchPositionId = this._initWatchGPS(
        function (position) {
          var localPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          };

          if (this.data.simulateAltitude !== 0) {
            localPosition.altitude = this.data.simulateAltitude;
          }

          this.currentCoords = localPosition;
          var distMoved = this._haversineDist(
            this.lastPosition,
            this.currentCoords
          );

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);

    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
  },

  /**
   * Get current user position.
   *
   * @param {function} onSuccess
   * @param {function} onError
   * @returns {Promise}
   */
  _initWatchGPS: function (onSuccess, onError) {
    if (!onError) {
      onError = function (err) {
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
      return Promise.resolve();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: this.data.gpsTimeInterval,
      timeout: 27000,
    });
  },

  /**
   * Update user position.
   *
   * @returns {void}
   */
  _updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      this.originCoords = this.currentCoords;
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    // compute position.x
    var dstCoords = {
      longitude: this.currentCoords.longitude,
      latitude: this.originCoords.latitude,
    };

    position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.x *=
      this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

    // compute position.z
    var dstCoords = {
      longitude: this.originCoords.longitude,
      latitude: this.currentCoords.latitude,
    };

    position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.z *=
      this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

    // update position
    this.el.setAttribute("position", position);

    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
  },
  /**
   * Returns distance in meters between source and destination inputs.
   *
   *  Calculate distance, bearing and more between Latitude/Longitude points
   *  Details: https://www.movable-type.co.uk/scripts/latlong.html
   *
   * @param {Position} src
   * @param {Position} dest
   * @param {Boolean} isPlace
   *
   * @returns {number} distance | Number.MAX_SAFE_INTEGER
   */
  computeDistanceMeters: function (src, dest, isPlace) {
    var distance = this._haversineDist(src, dest);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    // if function has been called for a place, and if it's too far and a max distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.maxDistance &&
      this.data.maxDistance > 0 &&
      distance > this.data.maxDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },

  _haversineDist: function (src, dest) {
    var dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.longitude - src.longitude);
    var dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  /**
   * Compute compass heading.
   *
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   *
   * @returns {number} compass heading
   */
  _computeCompassHeading: function (alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  },

  /**
   * Handler for device orientation event.
   *
   * @param {Event} event
   * @returns {void}
   */
  _onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
      if (event.webkitCompassAccuracy < 50) {
        this.heading = event.webkitCompassHeading;
      } else {
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(offset);
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-entity-place.js":
/*!*******************************************************!*\
  !*** ./aframe/src/location-based/gps-entity-place.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-entity-place", {
  _cameraGps: null,
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
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-camera]");
        if (!camera.components["gps-camera"]) {
          console.error("gps-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-camera"];
      }
      this._updatePosition();
    };

    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = {
        longitude: this.data.longitude,
        latitude: this.data.latitude,
      };

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      var distanceForMsg = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords
      );

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));
      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */
  _updatePosition: function () {
    var position = { x: 0, y: this.el.getAttribute("position").y || 0, z: 0 };

    // update position.x
    var dstCoords = {
      longitude: this.data.longitude,
      latitude: this._cameraGps.originCoords.latitude,
    };

    position.x = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    this._positionXDebug = position.x;

    position.x *=
      this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

    // update position.z
    var dstCoords = {
      longitude: this._cameraGps.originCoords.longitude,
      latitude: this.data.latitude,
    };

    position.z = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    position.z *=
      this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

    if (position.y !== 0) {
      var altitude =
        this._cameraGps.originCoords.altitude !== undefined
          ? this._cameraGps.originCoords.altitude
          : 0;
      position.y = position.y - altitude;
    }

    // update element's position in 3D world
    this.el.setAttribute("position", position);
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-camera.js":
/*!***********************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-camera.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-camera
 *
 * based on the original gps-camera, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original position (lat/lon) is projected into Spherical Mercator and
 * stored.
 *
 * Then, when we receive a new position (lat/lon), this new position is
 * projected into Spherical Mercator and then its world position calculated
 * by comparing against the original position.
 *
 * The same is also the case for 'entity-places'; when these are added, their
 * Spherical Mercator coords are calculated (see gps-projected-entity-place).
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 *
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-camera", {
  _watchPositionId: null,
  originCoords: null, // original coords now in Spherical Mercator
  currentCoords: null,
  lookControls: null,
  heading: null,
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
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.longitude = this.data.simulateLongitude;
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.altitude = this.data.simulateAltitude;
      this.currentCoords = localPosition;

      // re-trigger initialization for new origin
      this.originCoords = null;
      this._updatePosition();
    }
  },
  init: function () {
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      // iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
        var timeout = setTimeout(function () {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
          );
        }, 750);
        window.addEventListener(eventName, function () {
          clearTimeout(timeout);
        });
      }
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.longitude = this.data.simulateLongitude;
      if (this.data.simulateAltitude !== 0) {
        localPosition.altitude = this.data.simulateAltitude;
      }
      this.currentCoords = localPosition;
      this._updatePosition();
    } else {
      this._watchPositionId = this._initWatchGPS(
        function (position) {
          var localPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          };

          if (this.data.simulateAltitude !== 0) {
            localPosition.altitude = this.data.simulateAltitude;
          }

          this.currentCoords = localPosition;
          var distMoved = this._haversineDist(
            this.lastPosition,
            this.currentCoords
          );

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);
    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
  },

  /**
   * Get current user position.
   *
   * @param {function} onSuccess
   * @param {function} onError
   * @returns {Promise}
   */
  _initWatchGPS: function (onSuccess, onError) {
    if (!onError) {
      onError = function (err) {
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
      return Promise.resolve();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: this.data.gpsTimeInterval,
      timeout: 27000,
    });
  },

  /**
   * Update user position.
   *
   * @returns {void}
   */
  _updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      // Now store originCoords as PROJECTED original lat/lon, so that
      // we can set the world origin to the original position in "metres"
      this.originCoords = this._project(
        this.currentCoords.latitude,
        this.currentCoords.longitude
      );
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  /**
   * Set the current position (in world coords, based on Spherical Mercator)
   *
   * @returns {void}
   */
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    var worldCoords = this.latLonToWorld(
      this.currentCoords.latitude,
      this.currentCoords.longitude
    );

    position.x = worldCoords[0];
    position.z = worldCoords[1];

    // update position
    this.el.setAttribute("position", position);

    // add the sphmerc position to the event (for testing only)
    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
  },
  /**
   * Returns distance in meters between camera and destination input.
   *
   * Assume we are using a metre-based projection. Not all 'metre-based'
   * projections give exact metres, e.g. Spherical Mercator, but it appears
   * close enough to be used for AR at least in middle temperate
   * latitudes (40 - 55). It is heavily distorted near the poles, however.
   *
   * @param {Position} dest
   * @param {Boolean} isPlace
   *
   * @returns {number} distance | Number.MAX_SAFE_INTEGER
   */
  computeDistanceMeters: function (dest, isPlace) {
    var src = this.el.getAttribute("position");
    var dx = dest.x - src.x;
    var dz = dest.z - src.z;
    var distance = Math.sqrt(dx * dx + dz * dz);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the  method caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },
  /**
   * Converts latitude/longitude to OpenGL world coordinates.
   *
   * First projects lat/lon to absolute Spherical Mercator and then
   * calculates the world coordinates by comparing the Spherical Mercator
   * coordinates with the Spherical Mercator coordinates of the origin point.
   *
   * @param {Number} lat
   * @param {Number} lon
   *
   * @returns {array} world coordinates
   */
  latLonToWorld: function (lat, lon) {
    var projected = this._project(lat, lon);
    // Sign of z needs to be reversed compared to projected coordinates
    return [
      projected[0] - this.originCoords[0],
      -(projected[1] - this.originCoords[1]),
    ];
  },
  /**
   * Converts latitude/longitude to Spherical Mercator coordinates.
   * Algorithm is used in several OpenStreetMap-related applications.
   *
   * @param {Number} lat
   * @param {Number} lon
   *
   * @returns {array} Spherical Mercator coordinates
   */
  _project: function (lat, lon) {
    const HALF_EARTH = 20037508.34;

    // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
    // known as 'Google Projection', using the algorithm used extensively
    // in various OpenStreetMap software.
    var y =
      Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
    return [(lon / 180.0) * HALF_EARTH, (y * HALF_EARTH) / 180.0];
  },
  /**
   * Converts Spherical Mercator coordinates to latitude/longitude.
   * Algorithm is used in several OpenStreetMap-related applications.
   *
   * @param {Number} spherical mercator easting
   * @param {Number} spherical mercator northing
   *
   * @returns {object} lon/lat
   */
  _unproject: function (e, n) {
    const HALF_EARTH = 20037508.34;
    var yp = (n / HALF_EARTH) * 180.0;
    return {
      longitude: (e / HALF_EARTH) * 180.0,
      latitude:
        (180.0 / Math.PI) *
        (2 * Math.atan(Math.exp((yp * Math.PI) / 180.0)) - Math.PI / 2),
    };
  },
  /**
   * Compute compass heading.
   *
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   *
   * @returns {number} compass heading
   */
  _computeCompassHeading: function (alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  },

  /**
   * Handler for device orientation event.
   *
   * @param {Event} event
   * @returns {void}
   */
  _onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
      if (event.webkitCompassAccuracy < 50) {
        this.heading = event.webkitCompassHeading;
      } else {
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = THREE.MathUtils.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = THREE.MathUtils.degToRad(offset);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    var dlongitude = THREE.MathUtils.degToRad(dest.longitude - src.longitude);
    var dlatitude = THREE.MathUtils.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.MathUtils.degToRad(src.latitude)) *
        Math.cos(THREE.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-entity-place.js":
/*!*****************************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-entity-place.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-entity-place
 *
 * based on the original gps-entity-place, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original location on startup (lat/lon) is projected into Spherical
 * Mercator and stored.
 *
 * When 'entity-places' are added, their Spherical Mercator coords are
 * calculated and converted into world coordinates, relative to the original
 * position, using the Spherical Mercator projection calculation in
 * gps-projected-camera.
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-entity-place", {
  _cameraGps: null,
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
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    // Used now to get the GPS camera when it's been setup
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-projected-camera]");
        if (!camera.components["gps-projected-camera"]) {
          console.error("gps-projected-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-projected-camera"];
        this._updatePosition();
      }
    };

    // update position needs to worry about distance but nothing else?
    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = this.el.getAttribute("position");

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      // _computeDistanceMeters is now going to use the projected
      var distanceForMsg = this._cameraGps.computeDistanceMeters(dstCoords);

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));

      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    // Retain as this event is fired when the GPS camera is set up
    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */

  // set position to world coords using the lat/lon
  _updatePosition: function () {
    var worldPos = this._cameraGps.latLonToWorld(
      this.data.latitude,
      this.data.longitude
    );
    var position = this.el.getAttribute("position");

    // update element's position in 3D world
    //this.el.setAttribute('position', position);
    this.el.setAttribute("position", {
      x: worldPos[0],
      y: position.y,
      z: worldPos[1],
    });
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
});


/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

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
/*!********************************************!*\
  !*** ./aframe/src/location-based/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arjs_look_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arjs-look-controls */ "./aframe/src/location-based/arjs-look-controls.js");
/* harmony import */ var _arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
/* harmony import */ var _gps_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gps-camera */ "./aframe/src/location-based/gps-camera.js");
/* harmony import */ var _gps_entity_place__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gps-entity-place */ "./aframe/src/location-based/gps-entity-place.js");
/* harmony import */ var _gps_projected_camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gps-projected-camera */ "./aframe/src/location-based/gps-projected-camera.js");
/* harmony import */ var _gps_projected_entity_place__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gps-projected-entity-place */ "./aframe/src/location-based/gps-projected-entity-place.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FB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Q0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsVUFBVTtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdktEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVpQzs7QUFFakMscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSwwQ0FBMEMsMEJBQTBCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsVUFBVTtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQ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QUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOOEI7QUFDQztBQUNVO0FBQ25CO0FBQ007QUFDSTtBQUNNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy1sb29rLWNvbnRyb2xzLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2FyanMtd2ViY2FtLXRleHR1cmUuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLWNhbWVyYS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtZW50aXR5LXBsYWNlLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1wcm9qZWN0ZWQtY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlLmpzIiwid2VicGFjazovL0FSanMvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJhZnJhbWVcIixcImNvbW1vbmpzMlwiOlwiYWZyYW1lXCIsXCJhbWRcIjpcImFmcmFtZVwiLFwicm9vdFwiOlwiQUZSQU1FXCJ9Iiwid2VicGFjazovL0FSanMvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYWZyYW1lXCIsIFwidGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQVJqc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBUmpzXCJdID0gZmFjdG9yeShyb290W1wiQUZSQU1FXCJdLCByb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsIi8qKlxuICogQGF1dGhvciByaWNodCAvIGh0dHA6Ly9yaWNodC5tZVxuICogQGF1dGhvciBXZXN0TGFuZ2xleSAvIGh0dHA6Ly9naXRodWIuY29tL1dlc3RMYW5nbGV5XG4gKlxuICogVzNDIERldmljZSBPcmllbnRhdGlvbiBjb250cm9sIChodHRwOi8vdzNjLmdpdGh1Yi5pby9kZXZpY2VvcmllbnRhdGlvbi9zcGVjLXNvdXJjZS1vcmllbnRhdGlvbi5odG1sKVxuICovXG5cbi8qIE5PVEUgdGhhdCB0aGlzIGlzIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIHRvXG4gKiBhbGxvdyBleHBvbmVudGlhbCBzbW9vdGhpbmcsIGZvciB1c2UgaW4gQVIuanMuXG4gKlxuICogTW9kaWZpY2F0aW9ucyBOaWNrIFdoaXRlbGVnZyAobmlja3cxIGdpdGh1YilcbiAqL1xuXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY29uc3QgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gIHRoaXMub2JqZWN0LnJvdGF0aW9uLnJlb3JkZXIoXCJZWFpcIik7XG5cbiAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICB0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG4gIHRoaXMuc2NyZWVuT3JpZW50YXRpb24gPSAwO1xuXG4gIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gIHRoaXMuVFdPX1BJID0gMiAqIE1hdGguUEk7XG4gIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG5cbiAgdmFyIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHNjb3BlLmRldmljZU9yaWVudGF0aW9uID0gZXZlbnQ7XG4gIH07XG5cbiAgdmFyIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICB9O1xuXG4gIC8vIFRoZSBhbmdsZXMgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGZvcm0gYSBzZXQgb2YgaW50cmluc2ljIFRhaXQtQnJ5YW4gYW5nbGVzIG9mIHR5cGUgWi1YJy1ZJydcblxuICB2YXIgc2V0T2JqZWN0UXVhdGVybmlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHplZSA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpO1xuXG4gICAgdmFyIGV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG5cbiAgICB2YXIgcTAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuXG4gICAgdmFyIHExID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oLU1hdGguc3FydCgwLjUpLCAwLCAwLCBNYXRoLnNxcnQoMC41KSk7IC8vIC0gUEkvMiBhcm91bmQgdGhlIHgtYXhpc1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChxdWF0ZXJuaW9uLCBhbHBoYSwgYmV0YSwgZ2FtbWEsIG9yaWVudCkge1xuICAgICAgZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihldWxlcik7IC8vIG9yaWVudCB0aGUgZGV2aWNlXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkocTEpOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkocTAuc2V0RnJvbUF4aXNBbmdsZSh6ZWUsIC1vcmllbnQpKTsgLy8gYWRqdXN0IGZvciBzY3JlZW4gb3JpZW50YXRpb25cbiAgICB9O1xuICB9KSgpO1xuXG4gIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxuICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgc2NvcGUuZW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxuICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgc2NvcGUuZW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgdmFyIGRldmljZSA9IHNjb3BlLmRldmljZU9yaWVudGF0aW9uO1xuXG4gICAgaWYgKGRldmljZSkge1xuICAgICAgdmFyIGFscGhhID0gZGV2aWNlLmFscGhhXG4gICAgICAgID8gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5hbHBoYSkgKyBzY29wZS5hbHBoYU9mZnNldFxuICAgICAgICA6IDA7IC8vIFpcblxuICAgICAgdmFyIGJldGEgPSBkZXZpY2UuYmV0YSA/IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYmV0YSkgOiAwOyAvLyBYJ1xuXG4gICAgICB2YXIgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmdhbW1hKSA6IDA7IC8vIFknJ1xuXG4gICAgICB2YXIgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgPyBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoc2NvcGUuc2NyZWVuT3JpZW50YXRpb24pXG4gICAgICAgIDogMDsgLy8gT1xuXG4gICAgICAvLyBOVyBBZGRlZCBzbW9vdGhpbmcgY29kZVxuICAgICAgdmFyIGsgPSB0aGlzLnNtb290aGluZ0ZhY3RvcjtcblxuICAgICAgaWYgKHRoaXMubGFzdE9yaWVudGF0aW9uKSB7XG4gICAgICAgIGFscGhhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShhbHBoYSwgdGhpcy5sYXN0T3JpZW50YXRpb24uYWxwaGEsIGspO1xuICAgICAgICBiZXRhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICBiZXRhICsgTWF0aC5QSSxcbiAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5iZXRhLFxuICAgICAgICAgIGtcbiAgICAgICAgKTtcbiAgICAgICAgZ2FtbWEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKFxuICAgICAgICAgIGdhbW1hICsgdGhpcy5IQUxGX1BJLFxuICAgICAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uLmdhbW1hLFxuICAgICAgICAgIGssXG4gICAgICAgICAgTWF0aC5QSVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmV0YSArPSBNYXRoLlBJO1xuICAgICAgICBnYW1tYSArPSB0aGlzLkhBTEZfUEk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uID0ge1xuICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgIGJldGE6IGJldGEsXG4gICAgICAgIGdhbW1hOiBnYW1tYSxcbiAgICAgIH07XG4gICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxuICAgICAgICBzY29wZS5vYmplY3QucXVhdGVybmlvbixcbiAgICAgICAgYWxwaGEsXG4gICAgICAgIGJldGEgLSBNYXRoLlBJLFxuICAgICAgICBnYW1tYSAtIHRoaXMuSEFMRl9QSSxcbiAgICAgICAgb3JpZW50XG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICAvLyBOVyBBZGRlZFxuICB0aGlzLl9vcmRlckFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICBpZiAoXG4gICAgICAoYiA+IGEgJiYgTWF0aC5hYnMoYiAtIGEpIDwgcmFuZ2UgLyAyKSB8fFxuICAgICAgKGEgPiBiICYmIE1hdGguYWJzKGIgLSBhKSA+IHJhbmdlIC8gMilcbiAgICApIHtcbiAgICAgIHJldHVybiB7IGxlZnQ6IGEsIHJpZ2h0OiBiIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IGxlZnQ6IGIsIHJpZ2h0OiBhIH07XG4gICAgfVxuICB9O1xuXG4gIC8vIE5XIEFkZGVkXG4gIHRoaXMuX2dldFNtb290aGVkQW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgaywgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHRoaXMuX29yZGVyQW5nbGUoYSwgYiwgcmFuZ2UpO1xuICAgIGNvbnN0IGFuZ2xlc2hpZnQgPSBhbmdsZXMubGVmdDtcbiAgICBjb25zdCBvcmlnQW5nbGVzUmlnaHQgPSBhbmdsZXMucmlnaHQ7XG4gICAgYW5nbGVzLmxlZnQgPSAwO1xuICAgIGFuZ2xlcy5yaWdodCAtPSBhbmdsZXNoaWZ0O1xuICAgIGlmIChhbmdsZXMucmlnaHQgPCAwKSBhbmdsZXMucmlnaHQgKz0gcmFuZ2U7XG4gICAgbGV0IG5ld2FuZ2xlID1cbiAgICAgIG9yaWdBbmdsZXNSaWdodCA9PSBiXG4gICAgICAgID8gKDEgLSBrKSAqIGFuZ2xlcy5yaWdodCArIGsgKiBhbmdsZXMubGVmdFxuICAgICAgICA6IGsgKiBhbmdsZXMucmlnaHQgKyAoMSAtIGspICogYW5nbGVzLmxlZnQ7XG4gICAgbmV3YW5nbGUgKz0gYW5nbGVzaGlmdDtcbiAgICBpZiAobmV3YW5nbGUgPj0gcmFuZ2UpIG5ld2FuZ2xlIC09IHJhbmdlO1xuICAgIHJldHVybiBuZXdhbmdsZTtcbiAgfTtcblxuICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2NvcGUuZGlzY29ubmVjdCgpO1xuICB9O1xuXG4gIHRoaXMuY29ubmVjdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHM7XG4iLCIvLyBUbyBhdm9pZCByZWNhbGN1bGF0aW9uIGF0IGV2ZXJ5IG1vdXNlIG1vdmVtZW50IHRpY2tcbnZhciBQSV8yID0gTWF0aC5QSSAvIDI7XG5cbi8qKlxuICogbG9vay1jb250cm9scy4gVXBkYXRlIGVudGl0eSBwb3NlLCBmYWN0b3JpbmcgbW91c2UsIHRvdWNoLCBhbmQgV2ViVlIgQVBJIGRhdGEuXG4gKi9cblxuLyogTk9URSB0aGF0IHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIEEtRnJhbWUncyBsb29rLWNvbnRyb2xzIHRvXG4gKiBhbGxvdyBleHBvbmVudGlhbCBzbW9vdGhpbmcsIGZvciB1c2UgaW4gQVIuanMuXG4gKlxuICogTW9kaWZpY2F0aW9ucyBOaWNrIFdoaXRlbGVnZyAobmlja3cxIGdpdGh1YilcbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuaW1wb3J0IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGZyb20gXCIuL0FyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtbG9vay1jb250cm9sc1wiLCB7XG4gIGRlcGVuZGVuY2llczogW1wicG9zaXRpb25cIiwgXCJyb3RhdGlvblwiXSxcblxuICBzY2hlbWE6IHtcbiAgICBlbmFibGVkOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBtYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgcG9pbnRlckxvY2tFbmFibGVkOiB7IGRlZmF1bHQ6IGZhbHNlIH0sXG4gICAgcmV2ZXJzZU1vdXNlRHJhZzogeyBkZWZhdWx0OiBmYWxzZSB9LFxuICAgIHJldmVyc2VUb3VjaERyYWc6IHsgZGVmYXVsdDogZmFsc2UgfSxcbiAgICB0b3VjaEVuYWJsZWQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIHNtb290aGluZ0ZhY3RvcjogeyB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAxIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGVsdGFZYXcgPSAwO1xuICAgIHRoaXMucHJldmlvdXNITURQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5obWRRdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcbiAgICB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlciA9IG5ldyBUSFJFRS5FdWxlcigpO1xuICAgIHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5tYWdpY1dpbmRvd09iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIHRoaXMucm90YXRpb24gPSB7fTtcbiAgICB0aGlzLmRlbHRhUm90YXRpb24gPSB7fTtcbiAgICB0aGlzLnNhdmVkUG9zZSA9IG51bGw7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XG4gICAgdGhpcy5zZXR1cE1vdXNlQ29udHJvbHMoKTtcbiAgICB0aGlzLmJpbmRNZXRob2RzKCk7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQgPSB7fTtcblxuICAgIHRoaXMuc2V0dXBNYWdpY1dpbmRvd0NvbnRyb2xzKCk7XG5cbiAgICAvLyBUbyBzYXZlIC8gcmVzdG9yZSBjYW1lcmEgcG9zZVxuICAgIHRoaXMuc2F2ZWRQb3NlID0ge1xuICAgICAgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKCksXG4gICAgICByb3RhdGlvbjogbmV3IFRIUkVFLkV1bGVyKCksXG4gICAgfTtcblxuICAgIC8vIENhbGwgZW50ZXIgVlIgaGFuZGxlciBpZiB0aGUgc2NlbmUgaGFzIGVudGVyZWQgVlIgYmVmb3JlIHRoZSBldmVudCBsaXN0ZW5lcnMgYXR0YWNoZWQuXG4gICAgaWYgKHRoaXMuZWwuc2NlbmVFbC5pcyhcInZyLW1vZGVcIikpIHtcbiAgICAgIHRoaXMub25FbnRlclZSKCk7XG4gICAgfVxuICB9LFxuXG4gIHNldHVwTWFnaWNXaW5kb3dDb250cm9sczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYWdpY1dpbmRvd0NvbnRyb2xzO1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgLy8gT25seSBvbiBtb2JpbGUgZGV2aWNlcyBhbmQgb25seSBlbmFibGVkIGlmIERldmljZU9yaWVudGF0aW9uIHBlcm1pc3Npb24gaGFzIGJlZW4gZ3JhbnRlZC5cbiAgICBpZiAoQUZSQU1FLnV0aWxzLmRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzID0gdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzID1cbiAgICAgICAgbmV3IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKHRoaXMubWFnaWNXaW5kb3dPYmplY3QpO1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uXG4gICAgICApIHtcbiAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuY29tcG9uZW50c1tcImRldmljZS1vcmllbnRhdGlvbi1wZXJtaXNzaW9uLXVpXCJdXG4gICAgICAgICAgICAucGVybWlzc2lvbkdyYW50ZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZGV2aWNlb3JpZW50YXRpb25wZXJtaXNzaW9uZ3JhbnRlZFwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAob2xkRGF0YSkge1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgLy8gRGlzYWJsZSBncmFiIGN1cnNvciBjbGFzc2VzIGlmIG5vIGxvbmdlciBlbmFibGVkLlxuICAgIGlmIChkYXRhLmVuYWJsZWQgIT09IG9sZERhdGEuZW5hYmxlZCkge1xuICAgICAgdGhpcy51cGRhdGVHcmFiQ3Vyc29yKGRhdGEuZW5hYmxlZCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgbWFnaWMgd2luZG93IGV1bGVycyBpZiB0cmFja2luZyBpcyBkaXNhYmxlZC5cbiAgICBpZiAoXG4gICAgICBvbGREYXRhICYmXG4gICAgICAhZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZCAmJlxuICAgICAgb2xkRGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuc2V0KDAsIDAsIDApO1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIuc2V0KDAsIDAsIDApO1xuICAgIH1cblxuICAgIC8vIFBhc3Mgb24gbWFnaWMgd2luZG93IHRyYWNraW5nIHNldHRpbmcgdG8gbWFnaWNXaW5kb3dDb250cm9scy5cbiAgICBpZiAodGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzKSB7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuc21vb3RoaW5nRmFjdG9yID0gZGF0YS5zbW9vdGhpbmdGYWN0b3I7XG4gICAgfVxuXG4gICAgaWYgKG9sZERhdGEgJiYgIWRhdGEucG9pbnRlckxvY2tFbmFibGVkICE9PSBvbGREYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCkge1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xuICAgICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgICB0aGlzLmV4aXRQb2ludGVyTG9jaygpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB0aWNrOiBmdW5jdGlvbiAodCkge1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGlmICghZGF0YS5lbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudXBkYXRlT3JpZW50YXRpb24oKTtcbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgIHRoaXMuZXhpdFBvaW50ZXJMb2NrKCk7XG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICB0aGlzLmV4aXRQb2ludGVyTG9jaygpO1xuICAgIH1cbiAgfSxcblxuICBiaW5kTWV0aG9kczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub25Nb3VzZURvd24gPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VEb3duLCB0aGlzKTtcbiAgICB0aGlzLm9uTW91c2VNb3ZlID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbk1vdXNlTW92ZSwgdGhpcyk7XG4gICAgdGhpcy5vbk1vdXNlVXAgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VVcCwgdGhpcyk7XG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hTdGFydCwgdGhpcyk7XG4gICAgdGhpcy5vblRvdWNoTW92ZSA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaE1vdmUsIHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XG4gICAgdGhpcy5vbkVudGVyVlIgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uRW50ZXJWUiwgdGhpcyk7XG4gICAgdGhpcy5vbkV4aXRWUiA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25FeGl0VlIsIHRoaXMpO1xuICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSA9IEFGUkFNRS51dGlscy5iaW5kKFxuICAgICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLFxuICAgICAgdGhpc1xuICAgICk7XG4gICAgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uUG9pbnRlckxvY2tFcnJvciwgdGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldCB1cCBzdGF0ZXMgYW5kIE9iamVjdDNEcyBuZWVkZWQgdG8gc3RvcmUgcm90YXRpb24gZGF0YS5cbiAgICovXG4gIHNldHVwTW91c2VDb250cm9sczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5waXRjaE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIHRoaXMueWF3T2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgdGhpcy55YXdPYmplY3QucG9zaXRpb24ueSA9IDEwO1xuICAgIHRoaXMueWF3T2JqZWN0LmFkZCh0aGlzLnBpdGNoT2JqZWN0KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIG1vdXNlIGFuZCB0b3VjaCBldmVudCBsaXN0ZW5lcnMgdG8gY2FudmFzLlxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsLmNhbnZhcztcblxuICAgIC8vIFdhaXQgZm9yIGNhbnZhcyB0byBsb2FkLlxuICAgIGlmICghY2FudmFzRWwpIHtcbiAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJyZW5kZXItdGFyZ2V0LWxvYWRlZFwiLFxuICAgICAgICBBRlJBTUUudXRpbHMuYmluZCh0aGlzLmFkZEV2ZW50TGlzdGVuZXJzLCB0aGlzKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBNb3VzZSBldmVudHMuXG4gICAgY2FudmFzRWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgLy8gVG91Y2ggZXZlbnRzLlxuICAgIGNhbnZhc0VsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25Ub3VjaEVuZCk7XG5cbiAgICAvLyBzY2VuZUVsIGV2ZW50cy5cbiAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJlbnRlci12clwiLCB0aGlzLm9uRW50ZXJWUik7XG4gICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFwiZXhpdC12clwiLCB0aGlzLm9uRXhpdFZSKTtcblxuICAgIC8vIFBvaW50ZXIgTG9jayBldmVudHMuXG4gICAgaWYgKHRoaXMuZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwicG9pbnRlcmxvY2tjaGFuZ2VcIixcbiAgICAgICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwibW96cG9pbnRlcmxvY2tjaGFuZ2VcIixcbiAgICAgICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwicG9pbnRlcmxvY2tlcnJvclwiLFxuICAgICAgICB0aGlzLm9uUG9pbnRlckxvY2tFcnJvcixcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbW91c2UgYW5kIHRvdWNoIGV2ZW50IGxpc3RlbmVycyBmcm9tIGNhbnZhcy5cbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbCAmJiBzY2VuZUVsLmNhbnZhcztcblxuICAgIGlmICghY2FudmFzRWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBNb3VzZSBldmVudHMuXG4gICAgY2FudmFzRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5vbk1vdXNlVXApO1xuXG4gICAgLy8gVG91Y2ggZXZlbnRzLlxuICAgIGNhbnZhc0VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25Ub3VjaEVuZCk7XG5cbiAgICAvLyBzY2VuZUVsIGV2ZW50cy5cbiAgICBzY2VuZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbnRlci12clwiLCB0aGlzLm9uRW50ZXJWUik7XG4gICAgc2NlbmVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXhpdC12clwiLCB0aGlzLm9uRXhpdFZSKTtcblxuICAgIC8vIFBvaW50ZXIgTG9jayBldmVudHMuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicG9pbnRlcmxvY2tjaGFuZ2VcIixcbiAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJtb3pwb2ludGVybG9ja2NoYW5nZVwiLFxuICAgICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcInBvaW50ZXJsb2NrZXJyb3JcIixcbiAgICAgIHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgb3JpZW50YXRpb24gZm9yIG1vYmlsZSwgbW91c2UgZHJhZywgYW5kIGhlYWRzZXQuXG4gICAqIE1vdXNlLWRyYWcgb25seSBlbmFibGVkIGlmIEhNRCBpcyBub3QgYWN0aXZlLlxuICAgKi9cbiAgdXBkYXRlT3JpZW50YXRpb246IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvc2VNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvYmplY3QzRCA9IHRoaXMuZWwub2JqZWN0M0Q7XG4gICAgICB2YXIgcGl0Y2hPYmplY3QgPSB0aGlzLnBpdGNoT2JqZWN0O1xuICAgICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xuICAgICAgdmFyIHBvc2U7XG4gICAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcblxuICAgICAgLy8gSW4gVlIgbW9kZSwgVEhSRUUgaXMgaW4gY2hhcmdlIG9mIHVwZGF0aW5nIHRoZSBjYW1lcmEgcG9zZS5cbiAgICAgIGlmIChzY2VuZUVsLmlzKFwidnItbW9kZVwiKSAmJiBzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7XG4gICAgICAgIC8vIFdpdGggV2ViWFIgVEhSRUUgYXBwbGllcyBoZWFkc2V0IHBvc2UgdG8gdGhlIG9iamVjdDNEIG1hdHJpeFdvcmxkIGludGVybmFsbHkuXG4gICAgICAgIC8vIFJlZmxlY3QgdmFsdWVzIGJhY2sgb24gcG9zaXRpb24sIHJvdGF0aW9uLCBzY2FsZSBmb3IgZ2V0QXR0cmlidXRlIHRvIHJldHVybiB0aGUgZXhwZWN0ZWQgdmFsdWVzLlxuICAgICAgICBpZiAoc2NlbmVFbC5oYXNXZWJYUikge1xuICAgICAgICAgIHBvc2UgPSBzY2VuZUVsLnJlbmRlcmVyLnhyLmdldENhbWVyYVBvc2UoKTtcbiAgICAgICAgICBpZiAocG9zZSkge1xuICAgICAgICAgICAgcG9zZU1hdHJpeC5lbGVtZW50cyA9IHBvc2UudHJhbnNmb3JtLm1hdHJpeDtcbiAgICAgICAgICAgIHBvc2VNYXRyaXguZGVjb21wb3NlKFxuICAgICAgICAgICAgICBvYmplY3QzRC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgb2JqZWN0M0Qucm90YXRpb24sXG4gICAgICAgICAgICAgIG9iamVjdDNELnNjYWxlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlTWFnaWNXaW5kb3dPcmllbnRhdGlvbigpO1xuXG4gICAgICAvLyBPbiBtb2JpbGUsIGRvIGNhbWVyYSByb3RhdGlvbiB3aXRoIHRvdWNoIGV2ZW50cyBhbmQgc2Vuc29ycy5cbiAgICAgIG9iamVjdDNELnJvdGF0aW9uLnggPVxuICAgICAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci54ICsgcGl0Y2hPYmplY3Qucm90YXRpb24ueDtcbiAgICAgIG9iamVjdDNELnJvdGF0aW9uLnkgPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci55ICsgeWF3T2JqZWN0LnJvdGF0aW9uLnk7XG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi56ID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIuejtcbiAgICB9O1xuICB9KSgpLFxuXG4gIHVwZGF0ZU1hZ2ljV2luZG93T3JpZW50YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyID0gdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXI7XG4gICAgdmFyIG1hZ2ljV2luZG93RGVsdGFFdWxlciA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyO1xuICAgIC8vIENhbGN1bGF0ZSBtYWdpYyB3aW5kb3cgSE1EIHF1YXRlcm5pb24uXG4gICAgaWYgKHRoaXMubWFnaWNXaW5kb3dDb250cm9scyAmJiB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnNldEZyb21RdWF0ZXJuaW9uKFxuICAgICAgICB0aGlzLm1hZ2ljV2luZG93T2JqZWN0LnF1YXRlcm5pb24sXG4gICAgICAgIFwiWVhaXCJcbiAgICAgICk7XG4gICAgICBpZiAoIXRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdyAmJiBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueSAhPT0gMCkge1xuICAgICAgICB0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcgPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcpIHtcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnggPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueDtcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnkgKz1cbiAgICAgICAgICBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueSAtIHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdztcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnogPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuejtcbiAgICAgICAgdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgbW91c2UgZHJhZyBpbnRvIHJvdGF0aW9uLlxuICAgKlxuICAgKiBEcmFnZ2luZyB1cCBhbmQgZG93biByb3RhdGVzIHRoZSBjYW1lcmEgYXJvdW5kIHRoZSBYLWF4aXMgKHlhdykuXG4gICAqIERyYWdnaW5nIGxlZnQgYW5kIHJpZ2h0IHJvdGF0ZXMgdGhlIGNhbWVyYSBhcm91bmQgdGhlIFktYXhpcyAocGl0Y2gpLlxuICAgKi9cbiAgb25Nb3VzZU1vdmU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIHZhciBtb3ZlbWVudFg7XG4gICAgdmFyIG1vdmVtZW50WTtcbiAgICB2YXIgcGl0Y2hPYmplY3QgPSB0aGlzLnBpdGNoT2JqZWN0O1xuICAgIHZhciBwcmV2aW91c01vdXNlRXZlbnQgPSB0aGlzLnByZXZpb3VzTW91c2VFdmVudDtcbiAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XG5cbiAgICAvLyBOb3QgZHJhZ2dpbmcgb3Igbm90IGVuYWJsZWQuXG4gICAgaWYgKCF0aGlzLmRhdGEuZW5hYmxlZCB8fCAoIXRoaXMubW91c2VEb3duICYmICF0aGlzLnBvaW50ZXJMb2NrZWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIGRlbHRhLlxuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgIG1vdmVtZW50WCA9IGV2dC5tb3ZlbWVudFggfHwgZXZ0Lm1vek1vdmVtZW50WCB8fCAwO1xuICAgICAgbW92ZW1lbnRZID0gZXZ0Lm1vdmVtZW50WSB8fCBldnQubW96TW92ZW1lbnRZIHx8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdmVtZW50WCA9IGV2dC5zY3JlZW5YIC0gcHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblg7XG4gICAgICBtb3ZlbWVudFkgPSBldnQuc2NyZWVuWSAtIHByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZO1xuICAgIH1cbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YID0gZXZ0LnNjcmVlblg7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWSA9IGV2dC5zY3JlZW5ZO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHJvdGF0aW9uLlxuICAgIGRpcmVjdGlvbiA9IHRoaXMuZGF0YS5yZXZlcnNlTW91c2VEcmFnID8gMSA6IC0xO1xuICAgIHlhd09iamVjdC5yb3RhdGlvbi55ICs9IG1vdmVtZW50WCAqIDAuMDAyICogZGlyZWN0aW9uO1xuICAgIHBpdGNoT2JqZWN0LnJvdGF0aW9uLnggKz0gbW92ZW1lbnRZICogMC4wMDIgKiBkaXJlY3Rpb247XG4gICAgcGl0Y2hPYmplY3Qucm90YXRpb24ueCA9IE1hdGgubWF4KFxuICAgICAgLVBJXzIsXG4gICAgICBNYXRoLm1pbihQSV8yLCBwaXRjaE9iamVjdC5yb3RhdGlvbi54KVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIG1vdXNlIGRvd24gdG8gZGV0ZWN0IG1vdXNlIGRyYWcuXG4gICAqL1xuICBvbk1vdXNlRG93bjogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIGlmIChcbiAgICAgICF0aGlzLmRhdGEuZW5hYmxlZCB8fFxuICAgICAgKHNjZW5lRWwuaXMoXCJ2ci1tb2RlXCIpICYmIHNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEhhbmRsZSBvbmx5IHByaW1hcnkgYnV0dG9uLlxuICAgIGlmIChldnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbCAmJiBzY2VuZUVsLmNhbnZhcztcblxuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YID0gZXZ0LnNjcmVlblg7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWSA9IGV2dC5zY3JlZW5ZO1xuICAgIHRoaXMuc2hvd0dyYWJiaW5nQ3Vyc29yKCk7XG5cbiAgICBpZiAodGhpcy5kYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCAmJiAhdGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICBpZiAoY2FudmFzRWwucmVxdWVzdFBvaW50ZXJMb2NrKSB7XG4gICAgICAgIGNhbnZhc0VsLnJlcXVlc3RQb2ludGVyTG9jaygpO1xuICAgICAgfSBlbHNlIGlmIChjYW52YXNFbC5tb3pSZXF1ZXN0UG9pbnRlckxvY2spIHtcbiAgICAgICAgY2FudmFzRWwubW96UmVxdWVzdFBvaW50ZXJMb2NrKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTaG93cyBncmFiYmluZyBjdXJzb3Igb24gc2NlbmVcbiAgICovXG4gIHNob3dHcmFiYmluZ0N1cnNvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2NlbmVFbC5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuICB9LFxuXG4gIC8qKlxuICAgKiBIaWRlcyBncmFiYmluZyBjdXJzb3Igb24gc2NlbmVcbiAgICovXG4gIGhpZGVHcmFiYmluZ0N1cnNvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2NlbmVFbC5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJcIjtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgbW91c2UgdXAgdG8gZGV0ZWN0IHJlbGVhc2Ugb2YgbW91c2UgZHJhZy5cbiAgICovXG4gIG9uTW91c2VVcDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlR3JhYmJpbmdDdXJzb3IoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgdG91Y2ggZG93biB0byBkZXRlY3QgdG91Y2ggZHJhZy5cbiAgICovXG4gIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChcbiAgICAgIGV2dC50b3VjaGVzLmxlbmd0aCAhPT0gMSB8fFxuICAgICAgIXRoaXMuZGF0YS50b3VjaEVuYWJsZWQgfHxcbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5pcyhcInZyLW1vZGVcIilcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy50b3VjaFN0YXJ0ID0ge1xuICAgICAgeDogZXZ0LnRvdWNoZXNbMF0ucGFnZVgsXG4gICAgICB5OiBldnQudG91Y2hlc1swXS5wYWdlWSxcbiAgICB9O1xuICAgIHRoaXMudG91Y2hTdGFydGVkID0gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogVHJhbnNsYXRlIHRvdWNoIG1vdmUgdG8gWS1heGlzIHJvdGF0aW9uLlxuICAgKi9cbiAgb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIHZhciBjYW52YXMgPSB0aGlzLmVsLnNjZW5lRWwuY2FudmFzO1xuICAgIHZhciBkZWx0YVk7XG4gICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xuXG4gICAgaWYgKCF0aGlzLnRvdWNoU3RhcnRlZCB8fCAhdGhpcy5kYXRhLnRvdWNoRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbHRhWSA9XG4gICAgICAoMiAqIE1hdGguUEkgKiAoZXZ0LnRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoU3RhcnQueCkpIC9cbiAgICAgIGNhbnZhcy5jbGllbnRXaWR0aDtcblxuICAgIGRpcmVjdGlvbiA9IHRoaXMuZGF0YS5yZXZlcnNlVG91Y2hEcmFnID8gMSA6IC0xO1xuICAgIC8vIExpbWl0IHRvdWNoIG9yaWVudGFpb24gdG8gdG8geWF3ICh5IGF4aXMpLlxuICAgIHlhd09iamVjdC5yb3RhdGlvbi55IC09IGRlbHRhWSAqIDAuNSAqIGRpcmVjdGlvbjtcbiAgICB0aGlzLnRvdWNoU3RhcnQgPSB7XG4gICAgICB4OiBldnQudG91Y2hlc1swXS5wYWdlWCxcbiAgICAgIHk6IGV2dC50b3VjaGVzWzBdLnBhZ2VZLFxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRvdWNoIGVuZCB0byBkZXRlY3QgcmVsZWFzZSBvZiB0b3VjaCBkcmFnLlxuICAgKi9cbiAgb25Ub3VjaEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudG91Y2hTdGFydGVkID0gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmUgcG9zZS5cbiAgICovXG4gIG9uRW50ZXJWUjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIGlmICghc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNhdmVDYW1lcmFQb3NlKCk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgaWYgKHNjZW5lRWwuaGFzV2ViWFIpIHtcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbC5vYmplY3QzRC51cGRhdGVNYXRyaXgoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc3RvcmUgdGhlIHBvc2UuXG4gICAqL1xuICBvbkV4aXRWUjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbC5zY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVzdG9yZUNhbWVyYVBvc2UoKTtcbiAgICB0aGlzLnByZXZpb3VzSE1EUG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMuZWwub2JqZWN0M0QubWF0cml4QXV0b1VwZGF0ZSA9IHRydWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBQb2ludGVyIExvY2sgc3RhdGUuXG4gICAqL1xuICBvblBvaW50ZXJMb2NrQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gISEoXG4gICAgICBkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgfHwgZG9jdW1lbnQubW96UG9pbnRlckxvY2tFbGVtZW50XG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVjb3ZlciBmcm9tIFBvaW50ZXIgTG9jayBlcnJvci5cbiAgICovXG4gIG9uUG9pbnRlckxvY2tFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vIEV4aXRzIHBvaW50ZXItbG9ja2VkIG1vZGUuXG4gIGV4aXRQb2ludGVyTG9jazogZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIGZlYXR1cmUgb2Ygc2hvd2luZy9oaWRpbmcgdGhlIGdyYWIgY3Vyc29yLlxuICAgKi9cbiAgdXBkYXRlR3JhYkN1cnNvcjogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUdyYWJDdXJzb3IoKSB7XG4gICAgICBzY2VuZUVsLmNhbnZhcy5jbGFzc0xpc3QuYWRkKFwiYS1ncmFiLWN1cnNvclwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGlzYWJsZUdyYWJDdXJzb3IoKSB7XG4gICAgICBzY2VuZUVsLmNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwiYS1ncmFiLWN1cnNvclwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXNjZW5lRWwuY2FudmFzKSB7XG4gICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJyZW5kZXItdGFyZ2V0LWxvYWRlZFwiLCBlbmFibGVHcmFiQ3Vyc29yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcInJlbmRlci10YXJnZXQtbG9hZGVkXCIsIGRpc2FibGVHcmFiQ3Vyc29yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgZW5hYmxlR3JhYkN1cnNvcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkaXNhYmxlR3JhYkN1cnNvcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlIGNhbWVyYSBwb3NlIGJlZm9yZSBlbnRlcmluZyBWUiB0byByZXN0b3JlIGxhdGVyIGlmIGV4aXRpbmcuXG4gICAqL1xuICBzYXZlQ2FtZXJhUG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG5cbiAgICB0aGlzLnNhdmVkUG9zZS5wb3NpdGlvbi5jb3B5KGVsLm9iamVjdDNELnBvc2l0aW9uKTtcbiAgICB0aGlzLnNhdmVkUG9zZS5yb3RhdGlvbi5jb3B5KGVsLm9iamVjdDNELnJvdGF0aW9uKTtcbiAgICB0aGlzLmhhc1NhdmVkUG9zZSA9IHRydWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc2V0IGNhbWVyYSBwb3NlIHRvIGJlZm9yZSBlbnRlcmluZyBWUi5cbiAgICovXG4gIHJlc3RvcmVDYW1lcmFQb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICB2YXIgc2F2ZWRQb3NlID0gdGhpcy5zYXZlZFBvc2U7XG5cbiAgICBpZiAoIXRoaXMuaGFzU2F2ZWRQb3NlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgY2FtZXJhIG9yaWVudGF0aW9uLlxuICAgIGVsLm9iamVjdDNELnBvc2l0aW9uLmNvcHkoc2F2ZWRQb3NlLnBvc2l0aW9uKTtcbiAgICBlbC5vYmplY3QzRC5yb3RhdGlvbi5jb3B5KHNhdmVkUG9zZS5yb3RhdGlvbik7XG4gICAgdGhpcy5oYXNTYXZlZFBvc2UgPSBmYWxzZTtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJhcmpzLXdlYmNhbS10ZXh0dXJlXCIsIHtcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2NlbmUgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgdGhpcy50ZXhDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKC0wLjUsIDAuNSwgMC41LCAtMC41LCAwLCAxMCk7XG4gICAgdGhpcy50ZXhTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWRlbyk7XG4gICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTsgLy8wLjUsIDAuNSk7XG4gICAgdGhpcy50ZXh0dXJlID0gbmV3IFRIUkVFLlZpZGVvVGV4dHVyZSh0aGlzLnZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy50ZXhTY2VuZS5hZGQobWVzaCk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBgV2ViY2FtIGVycm9yOiAke2V9YFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICBcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICB0aWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhcigpO1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIucmVuZGVyKHRoaXMudGV4U2NlbmUsIHRoaXMudGV4Q2FtZXJhKTtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0LmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICB0cmFjay5zdG9wKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XG4gICAgdGhpcy50ZXh0dXJlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICB9LFxufSk7XG4iLCIvKlxuICogVVBEQVRFUyAyOC8wOC8yMDpcbiAqXG4gKiAtIGFkZCBncHNNaW5EaXN0YW5jZSBhbmQgZ3BzVGltZUludGVydmFsIHByb3BlcnRpZXMgdG8gY29udHJvbCBob3dcbiAqIGZyZXF1ZW50bHkgR1BTIHVwZGF0ZXMgYXJlIHByb2Nlc3NlZC4gQWltIGlzIHRvIHByZXZlbnQgJ3N0dXR0ZXJpbmcnXG4gKiBlZmZlY3RzIHdoZW4gY2xvc2UgdG8gQVIgY29udGVudCBkdWUgdG8gY29udGludW91cyBzbWFsbCBjaGFuZ2VzIGluXG4gKiBsb2NhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1jYW1lcmFcIiwge1xuICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxuICBvcmlnaW5Db29yZHM6IG51bGwsXG4gIGN1cnJlbnRDb29yZHM6IG51bGwsXG4gIGxvb2tDb250cm9sczogbnVsbCxcbiAgaGVhZGluZzogbnVsbCxcbiAgc2NoZW1hOiB7XG4gICAgc2ltdWxhdGVMYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUFsdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcbiAgICAgIHR5cGU6IFwiaW50XCIsXG4gICAgICBkZWZhdWx0OiAxMDAsXG4gICAgfSxcbiAgICBhbGVydDoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIG1pbkRpc3RhbmNlOiB7XG4gICAgICB0eXBlOiBcImludFwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG1heERpc3RhbmNlOiB7XG4gICAgICB0eXBlOiBcImludFwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGdwc01pbkRpc3RhbmNlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogNSxcbiAgICB9LFxuICAgIGdwc1RpbWVJbnRlcnZhbDoge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuXG4gICAgICAvLyByZS10cmlnZ2VyIGluaXRpYWxpemF0aW9uIGZvciBuZXcgb3JpZ2luXG4gICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IG51bGw7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gJiZcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJsb29rLWNvbnRyb2xzXCJdXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICBsYXRpdHVkZTogMCxcbiAgICAgIGxvbmdpdHVkZTogMCxcbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJhcmpzLWxvYWRlclwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubG9hZGVyKTtcblxuICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkID0gdGhpcy5fb25HcHNFbnRpdHlQbGFjZUFkZGVkLmJpbmQodGhpcyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcbiAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkXG4gICAgKTtcblxuICAgIHRoaXMubG9va0NvbnRyb2xzID1cbiAgICAgIHRoaXMuZWwuY29tcG9uZW50c1tcImFyanMtbG9vay1jb250cm9sc1wiXSB8fFxuICAgICAgdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXTtcblxuICAgIC8vIGxpc3RlbiB0byBkZXZpY2VvcmllbnRhdGlvbiBldmVudFxuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24gPSB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLmJpbmQodGhpcyk7XG5cbiAgICAvLyBpZiBTYWZhcmlcbiAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcbiAgICAgIC8vIGlPUyAxMytcbiAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyBkZXZpY2Ugb3JpZW50YXRpb24gcGVybWlzc2lvbnMuLi5cIik7XG4gICAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwidG91Y2hlbmRcIixcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBoYW5kbGVyKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgXCJBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi5cIlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgXCJQbGVhc2UgZW5hYmxlIGRldmljZSBvcmllbnRhdGlvbiBpbiBTZXR0aW5ncyA+IFNhZmFyaSA+IE1vdGlvbiAmIE9yaWVudGF0aW9uIEFjY2Vzcy5cIlxuICAgICAgICAgICk7XG4gICAgICAgIH0sIDc1MCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICE9PSAwKSB7XG4gICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSB0aGlzLl9pbml0V2F0Y2hHUFMoXG4gICAgICAgIGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGFsdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGUsXG4gICAgICAgICAgICBhY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5LFxuICAgICAgICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICAgICAgdmFyIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QoXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbixcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3Jkc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSB8fCAhdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmhlYWRpbmcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fdXBkYXRlUm90YXRpb24oKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQpIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XG4gICAgfVxuICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLFxuICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWRcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50IG5hbWUsIGRlcGVuZHMgb24gYnJvd3NlciBpbXBsZW1lbnRhdGlvbi5cbiAgICogQHJldHVybnMge3N0cmluZ30gZXZlbnQgbmFtZVxuICAgKi9cbiAgX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFwib25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIgaW4gd2luZG93KSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCI7XG4gICAgfSBlbHNlIGlmIChcIm9uZGV2aWNlb3JpZW50YXRpb25cIiBpbiB3aW5kb3cpIHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBcIlwiO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBhc3Mgbm90IHN1cHBvcnRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnROYW1lO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCB1c2VyIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblN1Y2Nlc3NcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25FcnJvclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIF9pbml0V2F0Y2hHUFM6IGZ1bmN0aW9uIChvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICBpZiAoIW9uRXJyb3IpIHtcbiAgICAgIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIkVSUk9SKFwiICsgZXJyLmNvZGUgKyBcIik6IFwiICsgZXJyLm1lc3NhZ2UpO1xuXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMSkge1xuICAgICAgICAgIC8vIFVzZXIgZGVuaWVkIEdlb0xvY2F0aW9uLCBsZXQgdGhlaXIga25vdyB0aGF0XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiUGxlYXNlIGFjdGl2YXRlIEdlb2xvY2F0aW9uIGFuZCByZWZyZXNoIHRoZSBwYWdlLiBJZiBpdCBpcyBhbHJlYWR5IGFjdGl2ZSwgcGxlYXNlIGNoZWNrIHBlcm1pc3Npb25zIGZvciB0aGlzIHdlYnNpdGUuXCJcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMykge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBcIkNhbm5vdCByZXRyaWV2ZSBHUFMgcG9zaXRpb24uIFNpZ25hbCBpcyBhYnNlbnQuXCJcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIG9uRXJyb3Ioe1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBtZXNzYWdlOiBcIkdlb2xvY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyXCIsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvR2VvbG9jYXRpb24vd2F0Y2hQb3NpdGlvblxuICAgIHJldHVybiBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIHtcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgIG1heGltdW1BZ2U6IHRoaXMuZGF0YS5ncHNUaW1lSW50ZXJ2YWwsXG4gICAgICB0aW1lb3V0OiAyNzAwMCxcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIHVzZXIgcG9zaXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZG9uJ3QgdXBkYXRlIGlmIGFjY3VyYWN5IGlzIG5vdCBnb29kIGVub3VnaFxuICAgIGlmICh0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPiB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5hbGVydCAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1wb3B1cFwiKSkge1xuICAgICAgICB2YXIgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwb3B1cC5pbm5lckhUTUwgPVxuICAgICAgICAgIFwiR1BTIHNpZ25hbCBpcyB2ZXJ5IHBvb3IuIFRyeSBtb3ZlIG91dGRvb3Igb3IgdG8gYW4gYXJlYSB3aXRoIGEgYmV0dGVyIHNpZ25hbC5cIjtcbiAgICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJhbGVydC1wb3B1cFwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFsZXJ0UG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXBvcHVwXCIpO1xuICAgIGlmIChcbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSAmJlxuICAgICAgYWxlcnRQb3B1cFxuICAgICkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhbGVydFBvcHVwKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAvLyBmaXJzdCBjYW1lcmEgaW5pdGlhbGl6YXRpb25cbiAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gdGhpcy5jdXJyZW50Q29vcmRzO1xuICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcblxuICAgICAgdmFyIGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYXJqcy1sb2FkZXJcIik7XG4gICAgICBpZiAobG9hZGVyKSB7XG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG4gICAgfVxuICB9LFxuICBfc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuXG4gICAgLy8gY29tcHV0ZSBwb3NpdGlvbi54XG4gICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgIGxhdGl0dWRlOiB0aGlzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSxcbiAgICB9O1xuXG4gICAgcG9zaXRpb24ueCA9IHRoaXMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKHRoaXMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xuICAgIHBvc2l0aW9uLnggKj1cbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUgPiB0aGlzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUgPyAxIDogLTE7XG5cbiAgICAvLyBjb21wdXRlIHBvc2l0aW9uLnpcbiAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgbG9uZ2l0dWRlOiB0aGlzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLFxuICAgIH07XG5cbiAgICBwb3NpdGlvbi56ID0gdGhpcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5vcmlnaW5Db29yZHMsIGRzdENvb3Jkcyk7XG4gICAgcG9zaXRpb24ueiAqPVxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlID4gdGhpcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUgPyAtMSA6IDE7XG5cbiAgICAvLyB1cGRhdGUgcG9zaXRpb25cbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIsIHBvc2l0aW9uKTtcblxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIiwge1xuICAgICAgICBkZXRhaWw6IHsgcG9zaXRpb246IHRoaXMuY3VycmVudENvb3Jkcywgb3JpZ2luOiB0aGlzLm9yaWdpbkNvb3JkcyB9LFxuICAgICAgfSlcbiAgICApO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyBkaXN0YW5jZSBpbiBtZXRlcnMgYmV0d2VlbiBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGlucHV0cy5cbiAgICpcbiAgICogIENhbGN1bGF0ZSBkaXN0YW5jZSwgYmVhcmluZyBhbmQgbW9yZSBiZXR3ZWVuIExhdGl0dWRlL0xvbmdpdHVkZSBwb2ludHNcbiAgICogIERldGFpbHM6IGh0dHBzOi8vd3d3Lm1vdmFibGUtdHlwZS5jby51ay9zY3JpcHRzL2xhdGxvbmcuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBzcmNcbiAgICogQHBhcmFtIHtQb3NpdGlvbn0gZGVzdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzUGxhY2VcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gZGlzdGFuY2UgfCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgKi9cbiAgY29tcHV0ZURpc3RhbmNlTWV0ZXJzOiBmdW5jdGlvbiAoc3JjLCBkZXN0LCBpc1BsYWNlKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gdGhpcy5faGF2ZXJzaW5lRGlzdChzcmMsIGRlc3QpO1xuXG4gICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gbmVhciBhbmQgYSBtaW4gZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxuICAgIC8vIHJldHVybiBtYXggZGlzdGFuY2UgcG9zc2libGUgLSB0byBiZSBoYW5kbGVkIGJ5IHRoZSBjYWxsZXJcbiAgICBpZiAoXG4gICAgICBpc1BsYWNlICYmXG4gICAgICB0aGlzLmRhdGEubWluRGlzdGFuY2UgJiZcbiAgICAgIHRoaXMuZGF0YS5taW5EaXN0YW5jZSA+IDAgJiZcbiAgICAgIGRpc3RhbmNlIDwgdGhpcy5kYXRhLm1pbkRpc3RhbmNlXG4gICAgKSB7XG4gICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfVxuXG4gICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gZmFyIGFuZCBhIG1heCBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXG4gICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGNhbGxlclxuICAgIGlmIChcbiAgICAgIGlzUGxhY2UgJiZcbiAgICAgIHRoaXMuZGF0YS5tYXhEaXN0YW5jZSAmJlxuICAgICAgdGhpcy5kYXRhLm1heERpc3RhbmNlID4gMCAmJlxuICAgICAgZGlzdGFuY2UgPiB0aGlzLmRhdGEubWF4RGlzdGFuY2VcbiAgICApIHtcbiAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzdGFuY2U7XG4gIH0sXG5cbiAgX2hhdmVyc2luZURpc3Q6IGZ1bmN0aW9uIChzcmMsIGRlc3QpIHtcbiAgICB2YXIgZGxvbmdpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIHZhciBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICB2YXIgYSA9XG4gICAgICBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICtcbiAgICAgIE1hdGguY29zKFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqXG4gICAgICAgIE1hdGguY29zKFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKSkgKlxuICAgICAgICAoTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpKTtcbiAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgY29tcGFzcyBoZWFkaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJldGFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGdhbW1hXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvbXBhc3MgaGVhZGluZ1xuICAgKi9cbiAgX2NvbXB1dGVDb21wYXNzSGVhZGluZzogZnVuY3Rpb24gKGFscGhhLCBiZXRhLCBnYW1tYSkge1xuICAgIC8vIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG4gICAgdmFyIGFscGhhUmFkID0gYWxwaGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgdmFyIGJldGFSYWQgPSBiZXRhICogKE1hdGguUEkgLyAxODApO1xuICAgIHZhciBnYW1tYVJhZCA9IGdhbW1hICogKE1hdGguUEkgLyAxODApO1xuXG4gICAgLy8gQ2FsY3VsYXRlIGVxdWF0aW9uIGNvbXBvbmVudHNcbiAgICB2YXIgY0EgPSBNYXRoLmNvcyhhbHBoYVJhZCk7XG4gICAgdmFyIHNBID0gTWF0aC5zaW4oYWxwaGFSYWQpO1xuICAgIHZhciBzQiA9IE1hdGguc2luKGJldGFSYWQpO1xuICAgIHZhciBjRyA9IE1hdGguY29zKGdhbW1hUmFkKTtcbiAgICB2YXIgc0cgPSBNYXRoLnNpbihnYW1tYVJhZCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgQSwgQiwgQyByb3RhdGlvbiBjb21wb25lbnRzXG4gICAgdmFyIHJBID0gLWNBICogc0cgLSBzQSAqIHNCICogY0c7XG4gICAgdmFyIHJCID0gLXNBICogc0cgKyBjQSAqIHNCICogY0c7XG5cbiAgICAvLyBDYWxjdWxhdGUgY29tcGFzcyBoZWFkaW5nXG4gICAgdmFyIGNvbXBhc3NIZWFkaW5nID0gTWF0aC5hdGFuKHJBIC8gckIpO1xuXG4gICAgLy8gQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcbiAgICBpZiAockIgPCAwKSB7XG4gICAgICBjb21wYXNzSGVhZGluZyArPSBNYXRoLlBJO1xuICAgIH0gZWxzZSBpZiAockEgPCAwKSB7XG4gICAgICBjb21wYXNzSGVhZGluZyArPSAyICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuICAgIGNvbXBhc3NIZWFkaW5nICo9IDE4MCAvIE1hdGguUEk7XG5cbiAgICByZXR1cm4gY29tcGFzc0hlYWRpbmc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEhhbmRsZXIgZm9yIGRldmljZSBvcmllbnRhdGlvbiBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfb25EZXZpY2VPcmllbnRhdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3kgPCA1MCkge1xuICAgICAgICB0aGlzLmhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIndlYmtpdENvbXBhc3NBY2N1cmFjeSBpcyBldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3lcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChldmVudC5hbHBoYSAhPT0gbnVsbCkge1xuICAgICAgaWYgKGV2ZW50LmFic29sdXRlID09PSB0cnVlIHx8IGV2ZW50LmFic29sdXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gdGhpcy5fY29tcHV0ZUNvbXBhc3NIZWFkaW5nKFxuICAgICAgICAgIGV2ZW50LmFscGhhLFxuICAgICAgICAgIGV2ZW50LmJldGEsXG4gICAgICAgICAgZXZlbnQuZ2FtbWFcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcImV2ZW50LmFic29sdXRlID09PSBmYWxzZVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWxwaGEgPT09IG51bGxcIik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlciByb3RhdGlvbiBkYXRhLlxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF91cGRhdGVSb3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBoZWFkaW5nID0gMzYwIC0gdGhpcy5oZWFkaW5nO1xuICAgIHZhciBjYW1lcmFSb3RhdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicm90YXRpb25cIikueTtcbiAgICB2YXIgeWF3Um90YXRpb24gPSBUSFJFRS5NYXRoVXRpbHMucmFkVG9EZWcoXG4gICAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueVxuICAgICk7XG4gICAgdmFyIG9mZnNldCA9IChoZWFkaW5nIC0gKGNhbWVyYVJvdGF0aW9uIC0geWF3Um90YXRpb24pKSAlIDM2MDtcbiAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChvZmZzZXQpO1xuICB9LFxuXG4gIF9vbkdwc0VudGl0eVBsYWNlQWRkZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBpZiBwbGFjZXMgYXJlIGFkZGVkIGFmdGVyIGNhbWVyYSBpbml0aWFsaXphdGlvbiBpcyBmaW5pc2hlZFxuICAgIGlmICh0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyICYmIHRoaXMubG9hZGVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5sb2FkZXIpO1xuICAgIH1cbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLWVudGl0eS1wbGFjZVwiLCB7XG4gIF9jYW1lcmFHcHM6IG51bGwsXG4gIHNjaGVtYToge1xuICAgIGxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBsYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2xlYW5pbmcgbGlzdGVuZXJzIHdoZW4gdGhlIGVudGl0eSBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIixcbiAgICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lclxuICAgICk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsXG4gICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXJcbiAgICApO1xuICB9LFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb29yZFNldExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jYW1lcmFHcHMpIHtcbiAgICAgICAgdmFyIGNhbWVyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZ3BzLWNhbWVyYV1cIik7XG4gICAgICAgIGlmICghY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtY2FtZXJhXCJdKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImdwcy1jYW1lcmEgbm90IGluaXRpYWxpemVkXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYW1lcmFHcHMgPSBjYW1lcmEuY29tcG9uZW50c1tcImdwcy1jYW1lcmFcIl07XG4gICAgICB9XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXIgPSAoZXYpID0+IHtcbiAgICAgIGlmICghdGhpcy5kYXRhIHx8ICF0aGlzLl9jYW1lcmFHcHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubGF0aXR1ZGUsXG4gICAgICB9O1xuXG4gICAgICAvLyBpdCdzIGFjdHVhbGx5IGEgJ2Rpc3RhbmNlIHBsYWNlJywgYnV0IHdlIGRvbid0IGNhbGwgaXQgd2l0aCBsYXN0IHBhcmFtLCBiZWNhdXNlIHdlIHdhbnQgdG8gcmV0cmlldmUgZGlzdGFuY2UgZXZlbiBpZiBpdCdzIDwgbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICAgIHZhciBkaXN0YW5jZUZvck1zZyA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoXG4gICAgICAgIGV2LmRldGFpbC5wb3NpdGlvbixcbiAgICAgICAgZHN0Q29vcmRzXG4gICAgICApO1xuXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRpc3RhbmNlXCIsIGRpc3RhbmNlRm9yTXNnKTtcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiZGlzdGFuY2VNc2dcIiwgdGhpcy5fZm9ybWF0RGlzdGFuY2UoZGlzdGFuY2VGb3JNc2cpKTtcbiAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWVudGl0eS1wbGFjZS11cGRhdGUtcG9zaXRpb25cIiwge1xuICAgICAgICAgIGRldGFpbDogeyBkaXN0YW5jZTogZGlzdGFuY2VGb3JNc2cgfSxcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIHZhciBhY3R1YWxEaXN0YW5jZSA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoXG4gICAgICAgIGV2LmRldGFpbC5wb3NpdGlvbixcbiAgICAgICAgZHN0Q29vcmRzLFxuICAgICAgICB0cnVlXG4gICAgICApO1xuXG4gICAgICBpZiAoYWN0dWFsRGlzdGFuY2UgPT09IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIsXG4gICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXJcbiAgICApO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLFxuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyXG4gICAgKTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gMDtcblxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLCB7XG4gICAgICAgIGRldGFpbDogeyBjb21wb25lbnQ6IHRoaXMuZWwgfSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIEhpZGUgZW50aXR5IGFjY29yZGluZyB0byBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGhpZGVGb3JNaW5EaXN0YW5jZTogZnVuY3Rpb24gKGVsLCBoaWRlRW50aXR5KSB7XG4gICAgaWYgKGhpZGVFbnRpdHkpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZpc2libGVcIiwgXCJmYWxzZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmlzaWJsZVwiLCBcInRydWVcIik7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogVXBkYXRlIHBsYWNlIHBvc2l0aW9uXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0geyB4OiAwLCB5OiB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpLnkgfHwgMCwgejogMCB9O1xuXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uLnhcbiAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgbG9uZ2l0dWRlOiB0aGlzLmRhdGEubG9uZ2l0dWRlLFxuICAgICAgbGF0aXR1ZGU6IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUsXG4gICAgfTtcblxuICAgIHBvc2l0aW9uLnggPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxuICAgICAgdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3JkcyxcbiAgICAgIGRzdENvb3Jkc1xuICAgICk7XG5cbiAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IHBvc2l0aW9uLng7XG5cbiAgICBwb3NpdGlvbi54ICo9XG4gICAgICB0aGlzLmRhdGEubG9uZ2l0dWRlID4gdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUgPyAxIDogLTE7XG5cbiAgICAvLyB1cGRhdGUgcG9zaXRpb24uelxuICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICBsb25naXR1ZGU6IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlLFxuICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sYXRpdHVkZSxcbiAgICB9O1xuXG4gICAgcG9zaXRpb24ueiA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoXG4gICAgICB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLFxuICAgICAgZHN0Q29vcmRzXG4gICAgKTtcblxuICAgIHBvc2l0aW9uLnogKj1cbiAgICAgIHRoaXMuZGF0YS5sYXRpdHVkZSA+IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUgPyAtMSA6IDE7XG5cbiAgICBpZiAocG9zaXRpb24ueSAhPT0gMCkge1xuICAgICAgdmFyIGFsdGl0dWRlID1cbiAgICAgICAgdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5hbHRpdHVkZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmFsdGl0dWRlXG4gICAgICAgICAgOiAwO1xuICAgICAgcG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgLSBhbHRpdHVkZTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZWxlbWVudCdzIHBvc2l0aW9uIGluIDNEIHdvcmxkXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCBwb3NpdGlvbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcm1hdCBkaXN0YW5jZXMgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxuICAgKi9cblxuICBfZm9ybWF0RGlzdGFuY2U6IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xuICAgIGRpc3RhbmNlID0gZGlzdGFuY2UudG9GaXhlZCgwKTtcblxuICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XG4gICAgICByZXR1cm4gZGlzdGFuY2UgLyAxMDAwICsgXCIga2lsb21ldGVyc1wiO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZSArIFwiIG1ldGVyc1wiO1xuICB9LFxufSk7XG4iLCIvKiogZ3BzLXByb2plY3RlZC1jYW1lcmFcbiAqXG4gKiBiYXNlZCBvbiB0aGUgb3JpZ2luYWwgZ3BzLWNhbWVyYSwgbW9kaWZpZWQgYnkgbmlja3cgMDIvMDQvMjBcbiAqXG4gKiBSYXRoZXIgdGhhbiBrZWVwaW5nIHRyYWNrIG9mIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZSBkaXN0YW5jZSBvZlxuICogZW50aXRpZXMgb3IgdGhlIGN1cnJlbnQgbG9jYXRpb24gdG8gdGhlIG9yaWdpbmFsIGxvY2F0aW9uLCB0aGlzIHZlcnNpb25cbiAqIG1ha2VzIHVzZSBvZiB0aGUgXCJHb29nbGVcIiBTcGhlcmljYWwgTWVyY2FjdG9yIHByb2plY3Rpb24sIGFrYSBlcHNnOjM4NTcuXG4gKlxuICogVGhlIG9yaWdpbmFsIHBvc2l0aW9uIChsYXQvbG9uKSBpcyBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWwgTWVyY2F0b3IgYW5kXG4gKiBzdG9yZWQuXG4gKlxuICogVGhlbiwgd2hlbiB3ZSByZWNlaXZlIGEgbmV3IHBvc2l0aW9uIChsYXQvbG9uKSwgdGhpcyBuZXcgcG9zaXRpb24gaXNcbiAqIHByb2plY3RlZCBpbnRvIFNwaGVyaWNhbCBNZXJjYXRvciBhbmQgdGhlbiBpdHMgd29ybGQgcG9zaXRpb24gY2FsY3VsYXRlZFxuICogYnkgY29tcGFyaW5nIGFnYWluc3QgdGhlIG9yaWdpbmFsIHBvc2l0aW9uLlxuICpcbiAqIFRoZSBzYW1lIGlzIGFsc28gdGhlIGNhc2UgZm9yICdlbnRpdHktcGxhY2VzJzsgd2hlbiB0aGVzZSBhcmUgYWRkZWQsIHRoZWlyXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRzIGFyZSBjYWxjdWxhdGVkIChzZWUgZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UpLlxuICpcbiAqIFNwaGVyaWNhbCBNZXJjYXRvciB1bml0cyBhcmUgY2xvc2UgdG8sIGJ1dCBub3QgZXhhY3RseSwgbWV0cmVzLCBhbmQgYXJlXG4gKiBoZWF2aWx5IGRpc3RvcnRlZCBuZWFyIHRoZSBwb2xlcy4gTm9uZXRoZWxlc3MgdGhleSBhcmUgYSBnb29kIGFwcHJveGltYXRpb25cbiAqIGZvciBtYW55IGFyZWFzIG9mIHRoZSB3b3JsZCBhbmQgYXBwZWFyIG5vdCB0byBjYXVzZSB1bmFjY2VwdGFibGUgZGlzdG9ydGlvbnNcbiAqIHdoZW4gdXNlZCBhcyB0aGUgdW5pdHMgZm9yIEFSIGFwcHMuXG4gKlxuICogVVBEQVRFUyAyOC8wOC8yMDpcbiAqXG4gKiAtIGFkZCBncHNNaW5EaXN0YW5jZSBhbmQgZ3BzVGltZUludGVydmFsIHByb3BlcnRpZXMgdG8gY29udHJvbCBob3dcbiAqIGZyZXF1ZW50bHkgR1BTIHVwZGF0ZXMgYXJlIHByb2Nlc3NlZC4gQWltIGlzIHRvIHByZXZlbnQgJ3N0dXR0ZXJpbmcnXG4gKiBlZmZlY3RzIHdoZW4gY2xvc2UgdG8gQVIgY29udGVudCBkdWUgdG8gY29udGludW91cyBzbWFsbCBjaGFuZ2VzIGluXG4gKiBsb2NhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtcHJvamVjdGVkLWNhbWVyYVwiLCB7XG4gIF93YXRjaFBvc2l0aW9uSWQ6IG51bGwsXG4gIG9yaWdpbkNvb3JkczogbnVsbCwgLy8gb3JpZ2luYWwgY29vcmRzIG5vdyBpbiBTcGhlcmljYWwgTWVyY2F0b3JcbiAgY3VycmVudENvb3JkczogbnVsbCxcbiAgbG9va0NvbnRyb2xzOiBudWxsLFxuICBoZWFkaW5nOiBudWxsLFxuICBzY2hlbWE6IHtcbiAgICBzaW11bGF0ZUxhdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHNpbXVsYXRlQWx0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgcG9zaXRpb25NaW5BY2N1cmFjeToge1xuICAgICAgdHlwZTogXCJpbnRcIixcbiAgICAgIGRlZmF1bHQ6IDEwMCxcbiAgICB9LFxuICAgIGFsZXJ0OiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgbWluRGlzdGFuY2U6IHtcbiAgICAgIHR5cGU6IFwiaW50XCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgZ3BzTWluRGlzdGFuY2U6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG5cbiAgICAgIC8vIHJlLXRyaWdnZXIgaW5pdGlhbGl6YXRpb24gZm9yIG5ldyBvcmlnaW5cbiAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gbnVsbDtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9LFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImFyanMtbG9vay1jb250cm9sc1wiXSAmJlxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl1cbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcbiAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgbG9uZ2l0dWRlOiAwLFxuICAgIH07XG5cbiAgICB0aGlzLmxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgdGhpcy5sb2FkZXIuY2xhc3NMaXN0LmFkZChcImFyanMtbG9hZGVyXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5sb2FkZXIpO1xuXG4gICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQgPSB0aGlzLl9vbkdwc0VudGl0eVBsYWNlQWRkZWQuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLFxuICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWRcbiAgICApO1xuXG4gICAgdGhpcy5sb29rQ29udHJvbHMgPVxuICAgICAgdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1sb29rLWNvbnRyb2xzXCJdIHx8XG4gICAgICB0aGlzLmVsLmNvbXBvbmVudHNbXCJsb29rLWNvbnRyb2xzXCJdO1xuXG4gICAgLy8gbGlzdGVuIHRvIGRldmljZW9yaWVudGF0aW9uIGV2ZW50XG4gICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiA9IHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24uYmluZCh0aGlzKTtcblxuICAgIC8vIGlmIFNhZmFyaVxuICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xuICAgICAgLy8gaU9TIDEzK1xuICAgICAgaWYgKHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLlwiKTtcbiAgICAgICAgICBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJ0b3VjaGVuZFwiLFxuICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICBcIkFmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLlwiXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBcIlBsZWFzZSBlbmFibGUgZGV2aWNlIG9yaWVudGF0aW9uIGluIFNldHRpbmdzID4gU2FmYXJpID4gTW90aW9uICYgT3JpZW50YXRpb24gQWNjZXNzLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XG4gICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IHRoaXMuX2luaXRXYXRjaEdQUyhcbiAgICAgICAgZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSB7XG4gICAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgYWx0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgICAgICAgIGFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3ksXG4gICAgICAgICAgICBhbHRpdHVkZUFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGVBY2N1cmFjeSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcbiAgICAgICAgICB2YXIgZGlzdE1vdmVkID0gdGhpcy5faGF2ZXJzaW5lRGlzdChcbiAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uLFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChkaXN0TW92ZWQgPj0gdGhpcy5kYXRhLmdwc01pbkRpc3RhbmNlIHx8ICF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICB0aWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaGVhZGluZyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl91cGRhdGVSb3RhdGlvbigpO1xuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCkge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hQb3NpdGlvbklkKTtcbiAgICB9XG4gICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLFxuICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWRcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50IG5hbWUsIGRlcGVuZHMgb24gYnJvd3NlciBpbXBsZW1lbnRhdGlvbi5cbiAgICogQHJldHVybnMge3N0cmluZ30gZXZlbnQgbmFtZVxuICAgKi9cbiAgX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFwib25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIgaW4gd2luZG93KSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCI7XG4gICAgfSBlbHNlIGlmIChcIm9uZGV2aWNlb3JpZW50YXRpb25cIiBpbiB3aW5kb3cpIHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBcIlwiO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBhc3Mgbm90IHN1cHBvcnRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnROYW1lO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCB1c2VyIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblN1Y2Nlc3NcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25FcnJvclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIF9pbml0V2F0Y2hHUFM6IGZ1bmN0aW9uIChvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICBpZiAoIW9uRXJyb3IpIHtcbiAgICAgIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIkVSUk9SKFwiICsgZXJyLmNvZGUgKyBcIik6IFwiICsgZXJyLm1lc3NhZ2UpO1xuXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMSkge1xuICAgICAgICAgIC8vIFVzZXIgZGVuaWVkIEdlb0xvY2F0aW9uLCBsZXQgdGhlaXIga25vdyB0aGF0XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiUGxlYXNlIGFjdGl2YXRlIEdlb2xvY2F0aW9uIGFuZCByZWZyZXNoIHRoZSBwYWdlLiBJZiBpdCBpcyBhbHJlYWR5IGFjdGl2ZSwgcGxlYXNlIGNoZWNrIHBlcm1pc3Npb25zIGZvciB0aGlzIHdlYnNpdGUuXCJcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMykge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBcIkNhbm5vdCByZXRyaWV2ZSBHUFMgcG9zaXRpb24uIFNpZ25hbCBpcyBhYnNlbnQuXCJcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIG9uRXJyb3Ioe1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBtZXNzYWdlOiBcIkdlb2xvY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyXCIsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvR2VvbG9jYXRpb24vd2F0Y2hQb3NpdGlvblxuICAgIHJldHVybiBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIHtcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgIG1heGltdW1BZ2U6IHRoaXMuZGF0YS5ncHNUaW1lSW50ZXJ2YWwsXG4gICAgICB0aW1lb3V0OiAyNzAwMCxcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIHVzZXIgcG9zaXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZG9uJ3QgdXBkYXRlIGlmIGFjY3VyYWN5IGlzIG5vdCBnb29kIGVub3VnaFxuICAgIGlmICh0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPiB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5hbGVydCAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1wb3B1cFwiKSkge1xuICAgICAgICB2YXIgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwb3B1cC5pbm5lckhUTUwgPVxuICAgICAgICAgIFwiR1BTIHNpZ25hbCBpcyB2ZXJ5IHBvb3IuIFRyeSBtb3ZlIG91dGRvb3Igb3IgdG8gYW4gYXJlYSB3aXRoIGEgYmV0dGVyIHNpZ25hbC5cIjtcbiAgICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJhbGVydC1wb3B1cFwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFsZXJ0UG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXBvcHVwXCIpO1xuICAgIGlmIChcbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSAmJlxuICAgICAgYWxlcnRQb3B1cFxuICAgICkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhbGVydFBvcHVwKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAvLyBmaXJzdCBjYW1lcmEgaW5pdGlhbGl6YXRpb25cbiAgICAgIC8vIE5vdyBzdG9yZSBvcmlnaW5Db29yZHMgYXMgUFJPSkVDVEVEIG9yaWdpbmFsIGxhdC9sb24sIHNvIHRoYXRcbiAgICAgIC8vIHdlIGNhbiBzZXQgdGhlIHdvcmxkIG9yaWdpbiB0byB0aGUgb3JpZ2luYWwgcG9zaXRpb24gaW4gXCJtZXRyZXNcIlxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSB0aGlzLl9wcm9qZWN0KFxuICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXG4gICAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGVcbiAgICAgICk7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuXG4gICAgICB2YXIgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hcmpzLWxvYWRlclwiKTtcbiAgICAgIGlmIChsb2FkZXIpIHtcbiAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gKGluIHdvcmxkIGNvb3JkcywgYmFzZWQgb24gU3BoZXJpY2FsIE1lcmNhdG9yKVxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF9zZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG5cbiAgICB2YXIgd29ybGRDb29yZHMgPSB0aGlzLmxhdExvblRvV29ybGQoXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlXG4gICAgKTtcblxuICAgIHBvc2l0aW9uLnggPSB3b3JsZENvb3Jkc1swXTtcbiAgICBwb3NpdGlvbi56ID0gd29ybGRDb29yZHNbMV07XG5cbiAgICAvLyB1cGRhdGUgcG9zaXRpb25cbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIsIHBvc2l0aW9uKTtcblxuICAgIC8vIGFkZCB0aGUgc3BobWVyYyBwb3NpdGlvbiB0byB0aGUgZXZlbnQgKGZvciB0ZXN0aW5nIG9ubHkpXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XG4gICAgICAgIGRldGFpbDogeyBwb3NpdGlvbjogdGhpcy5jdXJyZW50Q29vcmRzLCBvcmlnaW46IHRoaXMub3JpZ2luQ29vcmRzIH0sXG4gICAgICB9KVxuICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIGRpc3RhbmNlIGluIG1ldGVycyBiZXR3ZWVuIGNhbWVyYSBhbmQgZGVzdGluYXRpb24gaW5wdXQuXG4gICAqXG4gICAqIEFzc3VtZSB3ZSBhcmUgdXNpbmcgYSBtZXRyZS1iYXNlZCBwcm9qZWN0aW9uLiBOb3QgYWxsICdtZXRyZS1iYXNlZCdcbiAgICogcHJvamVjdGlvbnMgZ2l2ZSBleGFjdCBtZXRyZXMsIGUuZy4gU3BoZXJpY2FsIE1lcmNhdG9yLCBidXQgaXQgYXBwZWFyc1xuICAgKiBjbG9zZSBlbm91Z2ggdG8gYmUgdXNlZCBmb3IgQVIgYXQgbGVhc3QgaW4gbWlkZGxlIHRlbXBlcmF0ZVxuICAgKiBsYXRpdHVkZXMgKDQwIC0gNTUpLiBJdCBpcyBoZWF2aWx5IGRpc3RvcnRlZCBuZWFyIHRoZSBwb2xlcywgaG93ZXZlci5cbiAgICpcbiAgICogQHBhcmFtIHtQb3NpdGlvbn0gZGVzdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzUGxhY2VcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gZGlzdGFuY2UgfCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgKi9cbiAgY29tcHV0ZURpc3RhbmNlTWV0ZXJzOiBmdW5jdGlvbiAoZGVzdCwgaXNQbGFjZSkge1xuICAgIHZhciBzcmMgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuICAgIHZhciBkeCA9IGRlc3QueCAtIHNyYy54O1xuICAgIHZhciBkeiA9IGRlc3QueiAtIHNyYy56O1xuICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHogKiBkeik7XG5cbiAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBuZWFyIGFuZCBhIG1pbiBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXG4gICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlICBtZXRob2QgY2FsbGVyXG4gICAgaWYgKFxuICAgICAgaXNQbGFjZSAmJlxuICAgICAgdGhpcy5kYXRhLm1pbkRpc3RhbmNlICYmXG4gICAgICB0aGlzLmRhdGEubWluRGlzdGFuY2UgPiAwICYmXG4gICAgICBkaXN0YW5jZSA8IHRoaXMuZGF0YS5taW5EaXN0YW5jZVxuICAgICkge1xuICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlcnRzIGxhdGl0dWRlL2xvbmdpdHVkZSB0byBPcGVuR0wgd29ybGQgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEZpcnN0IHByb2plY3RzIGxhdC9sb24gdG8gYWJzb2x1dGUgU3BoZXJpY2FsIE1lcmNhdG9yIGFuZCB0aGVuXG4gICAqIGNhbGN1bGF0ZXMgdGhlIHdvcmxkIGNvb3JkaW5hdGVzIGJ5IGNvbXBhcmluZyB0aGUgU3BoZXJpY2FsIE1lcmNhdG9yXG4gICAqIGNvb3JkaW5hdGVzIHdpdGggdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcyBvZiB0aGUgb3JpZ2luIHBvaW50LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbGF0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb25cbiAgICpcbiAgICogQHJldHVybnMge2FycmF5fSB3b3JsZCBjb29yZGluYXRlc1xuICAgKi9cbiAgbGF0TG9uVG9Xb3JsZDogZnVuY3Rpb24gKGxhdCwgbG9uKSB7XG4gICAgdmFyIHByb2plY3RlZCA9IHRoaXMuX3Byb2plY3QobGF0LCBsb24pO1xuICAgIC8vIFNpZ24gb2YgeiBuZWVkcyB0byBiZSByZXZlcnNlZCBjb21wYXJlZCB0byBwcm9qZWN0ZWQgY29vcmRpbmF0ZXNcbiAgICByZXR1cm4gW1xuICAgICAgcHJvamVjdGVkWzBdIC0gdGhpcy5vcmlnaW5Db29yZHNbMF0sXG4gICAgICAtKHByb2plY3RlZFsxXSAtIHRoaXMub3JpZ2luQ29vcmRzWzFdKSxcbiAgICBdO1xuICB9LFxuICAvKipcbiAgICogQ29udmVydHMgbGF0aXR1ZGUvbG9uZ2l0dWRlIHRvIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcy5cbiAgICogQWxnb3JpdGhtIGlzIHVzZWQgaW4gc2V2ZXJhbCBPcGVuU3RyZWV0TWFwLXJlbGF0ZWQgYXBwbGljYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbGF0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb25cbiAgICpcbiAgICogQHJldHVybnMge2FycmF5fSBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXNcbiAgICovXG4gIF9wcm9qZWN0OiBmdW5jdGlvbiAobGF0LCBsb24pIHtcbiAgICBjb25zdCBIQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG5cbiAgICAvLyBDb252ZXJ0IHRoZSBzdXBwbGllZCBjb29yZHMgdG8gU3BoZXJpY2FsIE1lcmNhdG9yIChFUFNHOjM4NTcpLCBhbHNvXG4gICAgLy8ga25vd24gYXMgJ0dvb2dsZSBQcm9qZWN0aW9uJywgdXNpbmcgdGhlIGFsZ29yaXRobSB1c2VkIGV4dGVuc2l2ZWx5XG4gICAgLy8gaW4gdmFyaW91cyBPcGVuU3RyZWV0TWFwIHNvZnR3YXJlLlxuICAgIHZhciB5ID1cbiAgICAgIE1hdGgubG9nKE1hdGgudGFuKCgoOTAgKyBsYXQpICogTWF0aC5QSSkgLyAzNjAuMCkpIC8gKE1hdGguUEkgLyAxODAuMCk7XG4gICAgcmV0dXJuIFsobG9uIC8gMTgwLjApICogSEFMRl9FQVJUSCwgKHkgKiBIQUxGX0VBUlRIKSAvIDE4MC4wXTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlcnRzIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcyB0byBsYXRpdHVkZS9sb25naXR1ZGUuXG4gICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNwaGVyaWNhbCBtZXJjYXRvciBlYXN0aW5nXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzcGhlcmljYWwgbWVyY2F0b3Igbm9ydGhpbmdcbiAgICpcbiAgICogQHJldHVybnMge29iamVjdH0gbG9uL2xhdFxuICAgKi9cbiAgX3VucHJvamVjdDogZnVuY3Rpb24gKGUsIG4pIHtcbiAgICBjb25zdCBIQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG4gICAgdmFyIHlwID0gKG4gLyBIQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgIHJldHVybiB7XG4gICAgICBsb25naXR1ZGU6IChlIC8gSEFMRl9FQVJUSCkgKiAxODAuMCxcbiAgICAgIGxhdGl0dWRlOlxuICAgICAgICAoMTgwLjAgLyBNYXRoLlBJKSAqXG4gICAgICAgICgyICogTWF0aC5hdGFuKE1hdGguZXhwKCh5cCAqIE1hdGguUEkpIC8gMTgwLjApKSAtIE1hdGguUEkgLyAyKSxcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ29tcHV0ZSBjb21wYXNzIGhlYWRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxuICAgKiBAcGFyYW0ge251bWJlcn0gYmV0YVxuICAgKiBAcGFyYW0ge251bWJlcn0gZ2FtbWFcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY29tcGFzcyBoZWFkaW5nXG4gICAqL1xuICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbiAoYWxwaGEsIGJldGEsIGdhbW1hKSB7XG4gICAgLy8gQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcbiAgICB2YXIgYWxwaGFSYWQgPSBhbHBoYSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB2YXIgYmV0YVJhZCA9IGJldGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgdmFyIGdhbW1hUmFkID0gZ2FtbWEgKiAoTWF0aC5QSSAvIDE4MCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuICAgIHZhciBjQSA9IE1hdGguY29zKGFscGhhUmFkKTtcbiAgICB2YXIgc0EgPSBNYXRoLnNpbihhbHBoYVJhZCk7XG4gICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XG4gICAgdmFyIGNHID0gTWF0aC5jb3MoZ2FtbWFSYWQpO1xuICAgIHZhciBzRyA9IE1hdGguc2luKGdhbW1hUmFkKTtcblxuICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcbiAgICB2YXIgckEgPSAtY0EgKiBzRyAtIHNBICogc0IgKiBjRztcbiAgICB2YXIgckIgPSAtc0EgKiBzRyArIGNBICogc0IgKiBjRztcblxuICAgIC8vIENhbGN1bGF0ZSBjb21wYXNzIGhlYWRpbmdcbiAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XG5cbiAgICAvLyBDb252ZXJ0IGZyb20gaGFsZiB1bml0IGNpcmNsZSB0byB3aG9sZSB1bml0IGNpcmNsZVxuICAgIGlmIChyQiA8IDApIHtcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IE1hdGguUEk7XG4gICAgfSBlbHNlIGlmIChyQSA8IDApIHtcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzXG4gICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcblxuICAgIHJldHVybiBjb21wYXNzSGVhZGluZztcbiAgfSxcblxuICAvKipcbiAgICogSGFuZGxlciBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF9vbkRldmljZU9yaWVudGF0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeSA8IDUwKSB7XG4gICAgICAgIHRoaXMuaGVhZGluZyA9IGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwid2Via2l0Q29tcGFzc0FjY3VyYWN5IGlzIGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ZW50LmFscGhhICE9PSBudWxsKSB7XG4gICAgICBpZiAoZXZlbnQuYWJzb2x1dGUgPT09IHRydWUgfHwgZXZlbnQuYWJzb2x1dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmhlYWRpbmcgPSB0aGlzLl9jb21wdXRlQ29tcGFzc0hlYWRpbmcoXG4gICAgICAgICAgZXZlbnQuYWxwaGEsXG4gICAgICAgICAgZXZlbnQuYmV0YSxcbiAgICAgICAgICBldmVudC5nYW1tYVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJldmVudC5hbHBoYSA9PT0gbnVsbFwiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyIHJvdGF0aW9uIGRhdGEuXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3VwZGF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhlYWRpbmcgPSAzNjAgLSB0aGlzLmhlYWRpbmc7XG4gICAgdmFyIGNhbWVyYVJvdGF0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJyb3RhdGlvblwiKS55O1xuICAgIHZhciB5YXdSb3RhdGlvbiA9IFRIUkVFLk1hdGhVdGlscy5yYWRUb0RlZyhcbiAgICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55XG4gICAgKTtcbiAgICB2YXIgb2Zmc2V0ID0gKGhlYWRpbmcgLSAoY2FtZXJhUm90YXRpb24gLSB5YXdSb3RhdGlvbikpICUgMzYwO1xuICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55ID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKG9mZnNldCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICpcbiAgICogVGFrZW4gZnJvbSBncHMtY2FtZXJhXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xuICAgIHZhciBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgdmFyIGRsYXRpdHVkZSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgIHZhciBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIHZhciBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcbiAgfSxcblxuICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgcGxhY2VzIGFyZSBhZGRlZCBhZnRlciBjYW1lcmEgaW5pdGlhbGl6YXRpb24gaXMgZmluaXNoZWRcbiAgICBpZiAodGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlciAmJiB0aGlzLmxvYWRlci5wYXJlbnRFbGVtZW50KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubG9hZGVyKTtcbiAgICB9XG4gIH0sXG59KTtcbiIsIi8qKiBncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZVxuICpcbiAqIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBncHMtZW50aXR5LXBsYWNlLCBtb2RpZmllZCBieSBuaWNrdyAwMi8wNC8yMFxuICpcbiAqIFJhdGhlciB0aGFuIGtlZXBpbmcgdHJhY2sgb2YgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlIGRpc3RhbmNlIG9mXG4gKiBlbnRpdGllcyBvciB0aGUgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgb3JpZ2luYWwgbG9jYXRpb24sIHRoaXMgdmVyc2lvblxuICogbWFrZXMgdXNlIG9mIHRoZSBcIkdvb2dsZVwiIFNwaGVyaWNhbCBNZXJjYWN0b3IgcHJvamVjdGlvbiwgYWthIGVwc2c6Mzg1Ny5cbiAqXG4gKiBUaGUgb3JpZ2luYWwgbG9jYXRpb24gb24gc3RhcnR1cCAobGF0L2xvbikgaXMgcHJvamVjdGVkIGludG8gU3BoZXJpY2FsXG4gKiBNZXJjYXRvciBhbmQgc3RvcmVkLlxuICpcbiAqIFdoZW4gJ2VudGl0eS1wbGFjZXMnIGFyZSBhZGRlZCwgdGhlaXIgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmVcbiAqIGNhbGN1bGF0ZWQgYW5kIGNvbnZlcnRlZCBpbnRvIHdvcmxkIGNvb3JkaW5hdGVzLCByZWxhdGl2ZSB0byB0aGUgb3JpZ2luYWxcbiAqIHBvc2l0aW9uLCB1c2luZyB0aGUgU3BoZXJpY2FsIE1lcmNhdG9yIHByb2plY3Rpb24gY2FsY3VsYXRpb24gaW5cbiAqIGdwcy1wcm9qZWN0ZWQtY2FtZXJhLlxuICpcbiAqIFNwaGVyaWNhbCBNZXJjYXRvciB1bml0cyBhcmUgY2xvc2UgdG8sIGJ1dCBub3QgZXhhY3RseSwgbWV0cmVzLCBhbmQgYXJlXG4gKiBoZWF2aWx5IGRpc3RvcnRlZCBuZWFyIHRoZSBwb2xlcy4gTm9uZXRoZWxlc3MgdGhleSBhcmUgYSBnb29kIGFwcHJveGltYXRpb25cbiAqIGZvciBtYW55IGFyZWFzIG9mIHRoZSB3b3JsZCBhbmQgYXBwZWFyIG5vdCB0byBjYXVzZSB1bmFjY2VwdGFibGUgZGlzdG9ydGlvbnNcbiAqIHdoZW4gdXNlZCBhcyB0aGUgdW5pdHMgZm9yIEFSIGFwcHMuXG4gKi9cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXCIsIHtcbiAgX2NhbWVyYUdwczogbnVsbCxcbiAgc2NoZW1hOiB7XG4gICAgbG9uZ2l0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGxhdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjbGVhbmluZyBsaXN0ZW5lcnMgd2hlbiB0aGUgZW50aXR5IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsXG4gICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXJcbiAgICApO1xuICB9LFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVXNlZCBub3cgdG8gZ2V0IHRoZSBHUFMgY2FtZXJhIHdoZW4gaXQncyBiZWVuIHNldHVwXG4gICAgdGhpcy5jb29yZFNldExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9jYW1lcmFHcHMpIHtcbiAgICAgICAgdmFyIGNhbWVyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZ3BzLXByb2plY3RlZC1jYW1lcmFdXCIpO1xuICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLXByb2plY3RlZC1jYW1lcmFcIl0pIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ3BzLXByb2plY3RlZC1jYW1lcmEgbm90IGluaXRpYWxpemVkXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYW1lcmFHcHMgPSBjYW1lcmEuY29tcG9uZW50c1tcImdwcy1wcm9qZWN0ZWQtY2FtZXJhXCJdO1xuICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyB1cGRhdGUgcG9zaXRpb24gbmVlZHMgdG8gd29ycnkgYWJvdXQgZGlzdGFuY2UgYnV0IG5vdGhpbmcgZWxzZT9cbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXIgPSAoZXYpID0+IHtcbiAgICAgIGlmICghdGhpcy5kYXRhIHx8ICF0aGlzLl9jYW1lcmFHcHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZHN0Q29vcmRzID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcblxuICAgICAgLy8gaXQncyBhY3R1YWxseSBhICdkaXN0YW5jZSBwbGFjZScsIGJ1dCB3ZSBkb24ndCBjYWxsIGl0IHdpdGggbGFzdCBwYXJhbSwgYmVjYXVzZSB3ZSB3YW50IHRvIHJldHJpZXZlIGRpc3RhbmNlIGV2ZW4gaWYgaXQncyA8IG1pbkRpc3RhbmNlIHByb3BlcnR5XG4gICAgICAvLyBfY29tcHV0ZURpc3RhbmNlTWV0ZXJzIGlzIG5vdyBnb2luZyB0byB1c2UgdGhlIHByb2plY3RlZFxuICAgICAgdmFyIGRpc3RhbmNlRm9yTXNnID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhkc3RDb29yZHMpO1xuXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRpc3RhbmNlXCIsIGRpc3RhbmNlRm9yTXNnKTtcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiZGlzdGFuY2VNc2dcIiwgdGhpcy5fZm9ybWF0RGlzdGFuY2UoZGlzdGFuY2VGb3JNc2cpKTtcblxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtZW50aXR5LXBsYWNlLXVwZGF0ZS1wb3NpdGlvblwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IGRpc3RhbmNlOiBkaXN0YW5jZUZvck1zZyB9LFxuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgdmFyIGFjdHVhbERpc3RhbmNlID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcbiAgICAgICAgZHN0Q29vcmRzLFxuICAgICAgICB0cnVlXG4gICAgICApO1xuXG4gICAgICBpZiAoYWN0dWFsRGlzdGFuY2UgPT09IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBSZXRhaW4gYXMgdGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBHUFMgY2FtZXJhIGlzIHNldCB1cFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIixcbiAgICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lclxuICAgICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsXG4gICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXJcbiAgICApO1xuXG4gICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSAwO1xuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7IGNvbXBvbmVudDogdGhpcy5lbCB9LFxuICAgICAgfSlcbiAgICApO1xuICB9LFxuICAvKipcbiAgICogSGlkZSBlbnRpdHkgYWNjb3JkaW5nIHRvIG1pbkRpc3RhbmNlIHByb3BlcnR5XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgaGlkZUZvck1pbkRpc3RhbmNlOiBmdW5jdGlvbiAoZWwsIGhpZGVFbnRpdHkpIHtcbiAgICBpZiAoaGlkZUVudGl0eSkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmlzaWJsZVwiLCBcImZhbHNlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ2aXNpYmxlXCIsIFwidHJ1ZVwiKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBVcGRhdGUgcGxhY2UgcG9zaXRpb25cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuXG4gIC8vIHNldCBwb3NpdGlvbiB0byB3b3JsZCBjb29yZHMgdXNpbmcgdGhlIGxhdC9sb25cbiAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdvcmxkUG9zID0gdGhpcy5fY2FtZXJhR3BzLmxhdExvblRvV29ybGQoXG4gICAgICB0aGlzLmRhdGEubGF0aXR1ZGUsXG4gICAgICB0aGlzLmRhdGEubG9uZ2l0dWRlXG4gICAgKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuXG4gICAgLy8gdXBkYXRlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiAzRCB3b3JsZFxuICAgIC8vdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgcG9zaXRpb24pO1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwge1xuICAgICAgeDogd29ybGRQb3NbMF0sXG4gICAgICB5OiBwb3NpdGlvbi55LFxuICAgICAgejogd29ybGRQb3NbMV0sXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcm1hdCBkaXN0YW5jZXMgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxuICAgKi9cblxuICBfZm9ybWF0RGlzdGFuY2U6IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xuICAgIGRpc3RhbmNlID0gZGlzdGFuY2UudG9GaXhlZCgwKTtcblxuICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XG4gICAgICByZXR1cm4gZGlzdGFuY2UgLyAxMDAwICsgXCIga2lsb21ldGVyc1wiO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZSArIFwiIG1ldGVyc1wiO1xuICB9LFxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vYXJqcy1sb29rLWNvbnRyb2xzXCI7XG5pbXBvcnQgXCIuL2FyanMtd2ViY2FtLXRleHR1cmVcIjtcbmltcG9ydCBcIi4vQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHNcIjtcbmltcG9ydCBcIi4vZ3BzLWNhbWVyYVwiO1xuaW1wb3J0IFwiLi9ncHMtZW50aXR5LXBsYWNlXCI7XG5pbXBvcnQgXCIuL2dwcy1wcm9qZWN0ZWQtY2FtZXJhXCI7XG5pbXBvcnQgXCIuL2dwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=