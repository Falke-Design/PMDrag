const DragMixin = {
    enableLayerDrag() {
        // before enabling layer drag, disable layer editing
        this.disable();

        if (this._layers ) { //Check if Layergroup
            if(this._layers.length > 0 && this._layers[0]._map.pm._dragMode === 1) {
                this._layerGroup.on('mousedown', this._dragMixinOnMouseDownLayerGroup, this);
                this._layers.forEach(function (layer) {
                    if (layer.pm.options.snappable) {
                        if (layer instanceof L.Circle) {
                            if (layer.pm._markers && layer.pm._disableSnapping) {
                                layer.pm._disableSnapping();
                            }
                        } else {
                            if (layer.pm._disableSnapping) {
                                layer.pm._disableSnapping();
                            }
                        }
                    }

                    if (!(layer instanceof L.Marker)) {
                        // add CSS class
                        const el = layer._path
                            ? layer._path
                            : layer._renderer._container;
                        L.DomUtil.addClass(el, 'leaflet-pm-draggable');
                    }
                })
            }
        } else if(this._layer && this._layer._map.pm._dragMode === 0 ){
            if (this._layer instanceof L.Marker && !this._checkDragAllowed()) {
                return;
            }

            L.PM.PMDrag.__super__.enableLayerDrag.call(this);
        }
    },
    disableLayerDrag() {
        if (this._layers) { //Check if Layergroup
            this._layerGroup.off('mousedown', this._dragMixinOnMouseDownLayerGroup, this);
        } else {
            L.PM.PMDrag.__super__.disableLayerDrag.call(this);
        }
    },
    _dragMixinOnMouseDown(e) {
        if(!this._checkDragAllowed()){
            return;
        }
        L.PM.PMDrag.__super__._dragMixinOnMouseDown.call(this,e);
    },
    _dragMixinOnMouseDownLayerGroup(e) {

        if(!e.layer.pm._checkDragAllowed()){
            return;
        }

        this._layers.forEach((layer) => {
            if (!layer.pm._map) {
                layer.pm._map = layer.pm._layer._map;
            }

            if (layer instanceof L.Marker) {
                // save for delta calculation
                layer.pm._tempDragCoord = e.latlng;
                layer.pm._map.on('mousemove', this._dragMixinOnMouseMoveLayerGroupMarker, layer.pm);
            } else {
                layer.pm._dragMixinOnMouseDown(e);
            }
        });
        this._layerGroup._map.on('mouseup', this._dragMixinOnMouseUpLayerGroup, this);

    },
    _dragMixinOnMouseUpLayerGroup() {
        // clear up mouseup event
        this._layerGroup._map.off('mouseup', this._dragMixinOnMouseUpLayerGroup, this);
        this._layers.forEach((layer) => {
            if (!layer.pm._map) {
                layer.pm._map = layer.pm._layer._map;
            }

            if (layer instanceof L.Marker) {
                layer.pm._map.off('mousemove', this._dragMixinOnMouseMoveLayerGroupMarker, layer.pm);
            } else {
                layer.pm._dragMixinOnMouseUp();
            }
        });
        return true;
    },
    _dragMixinOnMouseMoveLayerGroupMarker(e) {
        this._onLayerDrag(e);
    },
    dragging() {
        return this._dragging;
    },
    _onLayerDrag(e) {
        if(!this._checkDragAllowed()){
            return;
        }

        var isMarker = this._layer instanceof L.Marker
        if(isMarker){
            this._tempLayer = this._layer;
            this._layer = L.circle(this._tempLayer.getLatLng(),{radius: 0.001});
        }

        L.PM.PMDrag.__super__._onLayerDrag.call(this,e);

        if(isMarker){
            this._tempLayer.setLatLng(this._layer.getLatLng());
            this._layer = this._tempLayer;
            // fire pm:dragstart event
            this._layer.fire('pm:drag', e);
        }
    },
    _checkDragAllowed: function () {
        if (this._layer.options.pmDrag === false) {
            return false;
        }else if(this._layer._map.pm._dragMode === 1 && this._layer.options.pmDrag !== undefined && this._layer.options.pmDrag.layergroup === false) {
            return false;
        }else if (this._layer._map.pm._dragMode === 0 && this._layer.options.pmDrag !== undefined && this._layer.options.pmDrag.layer === false) {
            return false;
        }
        return true;
    }
};

export default DragMixin;
