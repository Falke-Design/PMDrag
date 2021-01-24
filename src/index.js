import DragMixin from "./DragMixin";

L.PMDrag = L.Class.extend({
    options: {
        position: undefined,
        text: {
            layer: "Layer",
            layergroup: "Layergroup",
            finish: "Finish"
        },
        overwriteLayerGroup: false,
    },
    cssadded: false,
    initialize(map, options) {
        this.map = map;
        if (options && options.text) {
            options.text = this.setText(options.text);
        }
        L.setOptions(this, options);

        this.map.pm._markBtnAction = this._markBtnAction;
        this.map.pm.changeDragMode = function(mode){
            this._dragMode = mode;
            this.toggleGlobalDragMode();
            this.toggleGlobalDragMode();

            var action = mode === 0 ? 'layer' : 'layergroup';
            this._markBtnAction(action);
        };

        this.map.on('pm:globaldragmodetoggled', e => {
            if(e.enabled &&  e.map.pm._dragMode === 1){
                e.map.eachLayer(function(layer){
                    if(layer instanceof L.LayerGroup && !!layer.pm && !layer._pmTempLayer){
                        if(layer.options){
                            if(layer.options.pmDrag == false){
                                return; //Continue
                            }
                        }
                        e.map.pm.lgdrag = true;
                        layer.pm.enableLayerDrag();
                    }
                });
            }else{
                if( e.map.pm.lgdrag) {
                    e.map.pm.lgdrag = false;
                    e.map.eachLayer(function (layer) {
                        if (layer instanceof L.LayerGroup && !!layer.pm && !layer._pmTempLayer) { //&& layer.options && layer.options.pmDrag) {
                            layer.pm.disableLayerDrag();
                        }
                    });
                }
            }
        });

        this._overwriteFunctions();
        this._addCss();

        var that = this;
        const actions = [{
                name: 'layer',
                text: this.options.text.layer,
                onClick() {
                    that.map.pm.changeDragMode(0);
                },
            },
            {
                name: 'layergroup',
                text: this.options.text.layergroup,
                onClick() {
                    that.map.pm.changeDragMode(1);
                },
            }
        ];
        this.map.pm.Toolbar.changeActionsOfControl("dragMode",actions.concat(this.map.pm.Toolbar.buttons.dragMode._button.actions));

        this.map.pm.changeDragMode(0);  //0 Layer, 1 Layergroup

    },
    setText: function(text){
        if(text.layer){
            this.options.text.layer = text.layer;
        }
        if(text.layergroup){
            this.options.text.layergroup = text.layergroup;
        }
        this._createActionBtn(this)();
        this.setMode(this.getMode());
        return this.options.text;
    },
    getMode: function(){
        return  this.map.pm._dragMode;
    },
    getTextMode: function(){
        return  this.getMode() == 0 ? "layer" : "layergroup";
    },
    setMode: function(mode){
        var _mode = 0;
        if(mode == 0 || mode == "layer"){
            _mode = 0;
        }else if( mode == 1 || mode == "layergroup"){
            _mode = 1;
        }else{
            return;
        }
        this.map.pm.changeDragMode(_mode);
    },
    _addCss: function () {
        if (this.cssadded) {
            return;
        }
        this.cssadded = true;
        var styles = ".leaflet-pm-action.pmdrag-active{background-color: #3d3d3d !important;}";
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    },
    _overwriteFunctions: function() {

        if(this.options.overwriteLayerGroup) {
            L.LayerGroup.prototype.addLayerOrg = L.LayerGroup.prototype.addLayer;
            L.LayerGroup.prototype.addLayer = function (layer) {
                layer.addEventParent(this);
                this.addLayerOrg(layer);
                this.fire('layeradd', {layer: layer});
            };
        }

        L.PM.PMDrag = Object.assign(Object.create(Object.getPrototypeOf(L.PM.Edit.Line)), L.PM.Edit.Line);

        //Overwrite DragMixin
        L.PM.Edit.LayerGroup.include(DragMixin);
        L.PM.Edit.Circle.include(DragMixin);
        L.PM.Edit.CircleMarker.include(DragMixin);
        L.PM.Edit.Line.include(DragMixin);
        L.PM.Edit.Marker.include(DragMixin);
        L.PM.Edit.Polygon.include(DragMixin);
        L.PM.Edit.Rectangle.include(DragMixin);
    },
    _markBtnAction: function(name){
        //Clear active btn
        var allBtns = document.getElementsByClassName('leaflet-pm-action pmdrag-active');
        if(allBtns.length > 0) {
            for(var i = 0; i < allBtns.length; i++){
                L.DomUtil.removeClass(allBtns[i],'pmdrag-active');
            }
        }

        if(name) {
            var elms = document.getElementsByClassName('action-' + name);
            if (elms.length > 0) {
                var elm = elms[0];
                L.DomUtil.addClass(elm, 'pmdrag-active');
            }
        }
    },
});




