/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/DragMixin.js":
/*!**************************!*\
  !*** ./src/DragMixin.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst DragMixin = {\r\n    enableLayerDrag() {\r\n        // before enabling layer drag, disable layer editing\r\n        this.disable();\r\n\r\n        if (this._layers && this._layers.length > 0 && this._layers[0]._map.pm._dragMode === 1) { //Check if Layergroup\r\n            this._layerGroup.on('mousedown', this._dragMixinOnMouseDownLayerGroup, this);\r\n            this._layers.forEach(function (layer) {\r\n                if (layer.pm.options.snappable) {\r\n                    if(layer instanceof L.Circle){\r\n                        if (layer.pm._markers && layer.pm._disableSnapping) {\r\n                            layer.pm._disableSnapping();\r\n                        }\r\n                    }else{\r\n                        if (layer.pm._disableSnapping) {\r\n                            layer.pm._disableSnapping();\r\n                        }\r\n                    }\r\n                }\r\n\r\n                if(!(layer instanceof L.Marker)) {\r\n                    // add CSS class\r\n                    const el = layer._path\r\n                        ? layer._path\r\n                        : layer._renderer._container;\r\n                    L.DomUtil.addClass(el, 'leaflet-pm-draggable');\r\n                }\r\n            })\r\n        } else if(this._layer._map.pm._dragMode === 0 ){\r\n            if (this._layer instanceof L.Marker && !this._checkDragAllowed()) {\r\n                return;\r\n            }\r\n\r\n            L.PM.PMDrag.__super__.enableLayerDrag.call(this);\r\n        }\r\n    },\r\n    disableLayerDrag() {\r\n        if (this._layers) { //Check if Layergroup\r\n\r\n            this._layerGroup.off('mousedown', this._dragMixinOnMouseDownLayerGroup, this);\r\n\r\n        } else {\r\n\r\n            if (this._layer instanceof L.Marker) {\r\n                this._layer.off('dragstart', this._fireDragStart, this);\r\n                this._layer.off('drag', this._fireDrag, this);\r\n                this._layer.off('dragend', this._fireDragEnd, this);\r\n                if (this._layer.dragging) {\r\n                    this._layer.dragging.disable();\r\n                }\r\n                return;\r\n            }\r\n\r\n            // remove CSS class\r\n            if (this._layer._map.options.preferCanvas) {\r\n                this._layer.off('mouseout', this.removeDraggingClass, this);\r\n                this._layer.off('mouseover', this.addDraggingClass, this);\r\n            } else {\r\n                this.removeDraggingClass();\r\n            }\r\n            // no longer save the drag state\r\n            this._safeToCacheDragState = false;\r\n\r\n            // disable mousedown event\r\n            this._layer.off('mousedown', this._dragMixinOnMouseDown, this);\r\n        }\r\n    },\r\n    _dragMixinOnMouseDown(e) {\r\n        if(!this._checkDragAllowed()){\r\n            return;\r\n        }\r\n        L.PM.PMDrag.__super__._dragMixinOnMouseDown.call(this,e);\r\n    },\r\n    _dragMixinOnMouseDownLayerGroup(e) {\r\n\r\n        if(!e.layer.pm._checkDragAllowed()){\r\n            return;\r\n        }\r\n\r\n        this._layers.forEach((layer) => {\r\n            if (!layer.pm._map) {\r\n                layer.pm._map = layer.pm._layer._map;\r\n            }\r\n\r\n            if (layer instanceof L.Marker) {\r\n                // save for delta calculation\r\n                layer.pm._tempDragCoord = e.latlng;\r\n                layer.pm._map.on('mousemove', this._dragMixinOnMouseMoveLayerGroupMarker, layer.pm);\r\n            } else {\r\n                layer.pm._dragMixinOnMouseDown(e);\r\n            }\r\n        });\r\n        this._layerGroup._map.on('mouseup', this._dragMixinOnMouseUpLayerGroup, this);\r\n\r\n    },\r\n    _dragMixinOnMouseUpLayerGroup() {\r\n        // clear up mouseup event\r\n        this._layerGroup._map.off('mouseup', this._dragMixinOnMouseUpLayerGroup, this);\r\n        this._layers.forEach((layer) => {\r\n            if (!layer.pm._map) {\r\n                layer.pm._map = layer.pm._layer._map;\r\n            }\r\n\r\n            if (layer instanceof L.Marker) {\r\n                layer.pm._map.off('mousemove', this._dragMixinOnMouseMoveLayerGroupMarker, layer.pm);\r\n            } else {\r\n                layer.pm._dragMixinOnMouseUp();\r\n            }\r\n        });\r\n        return true;\r\n    },\r\n    _dragMixinOnMouseMoveLayerGroupMarker(e) {\r\n        this._onLayerDrag(e);\r\n    },\r\n    dragging() {\r\n        return this._dragging;\r\n    },\r\n    _onLayerDrag(e) {\r\n        if(!this._checkDragAllowed()){\r\n            return;\r\n        }\r\n\r\n        var isMarker = this._layer instanceof L.Marker\r\n        if(isMarker){\r\n            this._tempLayer = this._layer;\r\n            this._layer = L.circle(this._tempLayer.getLatLng(),{radius: 0.001});\r\n        }\r\n\r\n        L.PM.PMDrag.__super__._onLayerDrag.call(this,e);\r\n\r\n        if(isMarker){\r\n            this._tempLayer.setLatLng(this._layer.getLatLng());\r\n            this._layer = this._tempLayer;\r\n            // fire pm:dragstart event\r\n            this._layer.fire('pm:drag', e);\r\n        }\r\n    },\r\n    _checkDragAllowed: function () {\r\n        if (this._layer.options.pmDrag === false) {\r\n            return false;\r\n        }else if(this._layer._map.pm._dragMode === 1 && this._layer.options.pmDrag !== undefined && this._layer.options.pmDrag.layergroup === false) {\r\n            return false;\r\n        }else if (this._layer._map.pm._dragMode === 0 && this._layer.options.pmDrag !== undefined && this._layer.options.pmDrag.layer === false) {\r\n            return false;\r\n        }\r\n        return true;\r\n    }\r\n};\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (DragMixin);\r\n\n\n//# sourceURL=webpack:///./src/DragMixin.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _DragMixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DragMixin */ \"./src/DragMixin.js\");\n\n\nL.PMDrag = L.Class.extend({\n    options: {\n        position: undefined,\n        text: {\n            layer: \"Layer\",\n            layergroup: \"Layergroup\",\n            finish: \"Finish\"\n        },\n        overwriteLayerGroup: false,\n    },\n    cssadded: false,\n    initialize(map, options) {\n        this.map = map;\n        if (options && options.text) {\n            options.text = this.setText(options.text);\n        }\n        L.setOptions(this, options);\n\n        this.map.pm._markBtnAction = this._markBtnAction;\n        this.map.pm.changeDragMode = function(mode){\n            this._dragMode = mode;\n            this.toggleGlobalDragMode();\n            this.toggleGlobalDragMode();\n\n            var action = mode === 0 ? 'layer' : 'layergroup';\n            this._markBtnAction(action);\n        };\n\n        this.map.on('pm:globaldragmodetoggled', e => {\n            if(e.enabled &&  e.map.pm._dragMode === 1){\n                e.map.eachLayer(function(layer){\n                    if(layer instanceof L.LayerGroup && !!layer.pm && !layer._pmTempLayer){\n                        if(layer.options){\n                            if(layer.options.pmDrag == false){\n                                return; //Continue\n                            }\n                        }\n                        e.map.pm.lgdrag = true;\n                        layer.pm.enableLayerDrag();\n                    }\n                });\n            }else{\n                if( e.map.pm.lgdrag) {\n                    e.map.pm.lgdrag = false;\n                    e.map.eachLayer(function (layer) {\n                        if (layer instanceof L.LayerGroup && !!layer.pm && !layer._pmTempLayer) { //&& layer.options && layer.options.pmDrag) {\n                            layer.pm.disableLayerDrag();\n                        }\n                    });\n                }\n            }\n        });\n\n        this._overwriteFunctions();\n        this._addCss();\n\n        var that = this;\n        const actions = [{\n                name: 'layer',\n                text: this.options.text.layer,\n                onClick() {\n                    that.map.pm.changeDragMode(0);\n                },\n            },\n            {\n                name: 'layergroup',\n                text: this.options.text.layergroup,\n                onClick() {\n                    that.map.pm.changeDragMode(1);\n                },\n            }\n        ];\n        this.map.pm.Toolbar.changeActionsOfControl(\"dragMode\",actions.concat(this.map.pm.Toolbar.buttons.dragMode._button.actions));\n\n        this.map.pm.changeDragMode(0);  //0 Layer, 1 Layergroup\n\n    },\n    setText: function(text){\n        if(text.layer){\n            this.options.text.layer = text.layer;\n        }\n        if(text.layergroup){\n            this.options.text.layergroup = text.layergroup;\n        }\n        this._createActionBtn(this)();\n        this.setMode(this.getMode());\n        return this.options.text;\n    },\n    getMode: function(){\n        return  this.map.pm._dragMode;\n    },\n    getTextMode: function(){\n        return  this.getMode() == 0 ? \"layer\" : \"layergroup\";\n    },\n    setMode: function(mode){\n        var _mode = 0;\n        if(mode == 0 || mode == \"layer\"){\n            _mode = 0;\n        }else if( mode == 1 || mode == \"layergroup\"){\n            _mode = 1;\n        }else{\n            return;\n        }\n        this.map.pm.changeDragMode(_mode);\n    },\n    _addCss: function () {\n        if (this.cssadded) {\n            return;\n        }\n        this.cssadded = true;\n        var styles = \".leaflet-pm-action.pmdrag-active{background-color: #3d3d3d !important;}\";\n        var styleSheet = document.createElement(\"style\");\n        styleSheet.type = \"text/css\";\n        styleSheet.innerText = styles;\n        document.head.appendChild(styleSheet);\n    },\n    _overwriteFunctions: function() {\n\n        if(this.options.overwriteLayerGroup) {\n            L.LayerGroup.prototype.addLayerOrg = L.LayerGroup.prototype.addLayer;\n            L.LayerGroup.prototype.addLayer = function (layer) {\n                layer.addEventParent(this);\n                this.addLayerOrg(layer);\n                this.fire('layeradd', {layer: layer});\n            };\n        }\n\n        L.PM.PMDrag = Object.assign(Object.create(Object.getPrototypeOf(L.PM.Edit.Line)), L.PM.Edit.Line);\n\n        //Overwrite DragMixin\n        L.PM.Edit.LayerGroup.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        L.PM.Edit.Circle.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        L.PM.Edit.CircleMarker.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        L.PM.Edit.Line.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        L.PM.Edit.Marker.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        L.PM.Edit.Polygon.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n        L.PM.Edit.Rectangle.include(_DragMixin__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n    },\n    _markBtnAction: function(name){\n        //Clear active btn\n        var allBtns = document.getElementsByClassName('leaflet-pm-action pmdrag-active');\n        if(allBtns.length > 0) {\n            for(var i = 0; i < allBtns.length; i++){\n                L.DomUtil.removeClass(allBtns[i],'pmdrag-active');\n            }\n        }\n\n        if(name) {\n            var elms = document.getElementsByClassName('action-' + name);\n            if (elms.length > 0) {\n                var elm = elms[0];\n                L.DomUtil.addClass(elm, 'pmdrag-active');\n            }\n        }\n    },\n});\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });