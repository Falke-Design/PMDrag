# Deprecated! Implemented in Leaflet-Geoman Core
Implemented in Leaflet-Geoman with [Release 2.11.0](https://github.com/geoman-io/leaflet-geoman/releases/tag/2.11.0). This Library will not longer supported


# Leaflet PMDrag: Extends the drag mode for layergroups
This is a [Leaflet Geoman](https://github.com/geoman-io/leaflet-geoman) Subplugin 

Demo: [PMDrag](https://falke-design.github.io/PMDrag/)

### Installation
Download [pmDrag.js](https://raw.githubusercontent.com/Falke-Design/PMDrag/master/dist/pmDrag.js) and include them in your project.

`<script src="./dist/pmDrag.js"></script>`

or use the script over cdn:

`<script src="https://cdn.jsdelivr.net/gh/Falke-Design/PMDrag/dist/pmDrag.js"></script>`

### Init PMDrag
Add PMDrag after added Controls of Leaflet Geoman **map.pm.addControls()**

`pmDrag = new L.PMDrag(map)`

If you want to use **L.LayerGroup** instead of L.FeatureGroup (recommended) you have to set the option "overwriteLayerGroup: true" to overwrite the default L.LayerGroup of Leaflet and adding events.

`pmDrag = new L.PMDrag(map, {overwriteLayerGroup: true})`

##### Disable drag on layer
Disable layer and layergroup drag

`L.marker([lat,lng],{pmDrag: false})`

Disable layer drag

`L.marker([lat,lng],{pmDrag: {layer: false})`

Disable layergroup drag

`L.marker([lat,lng],{pmDrag: {layergroup: false}})`

### Functions

##### setText
`pmDrag.setText(text)`
```
text: {layer: "Layer", layergroup: "Layergroup"}
```

##### setMode
Mode layer: 0 or "layer", mode layergroup: 1 or "layergroup"
`pmDrag.setMode(mode)`

##### getMode
Mode layer = 0, layergroup = 1
`pmDrag.getMode()`

##### getTextMode
Returns "layer" or "layergroup"
`pmDrag.getTextMode()`

