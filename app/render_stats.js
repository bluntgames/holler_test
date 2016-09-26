'use strict';

// Stats...
var Stats = require('stats.js');
var stats = new Stats();
stats.showPanel(0);
// override the panel style
stats.dom.style.cssText = 'position:absolute;left:0;top:0;cursor:pointer;opacity:0.9;z-index:10000';
document.body.appendChild(stats.dom);

var THREEx = require('exports?THREEx!../bower_components/threex.rendererstats/threex.rendererstats.js');
var rendererStats   = new THREEx.RendererStats();
rendererStats.domElement.style.position = 'absolute';
rendererStats.domElement.style.left = '0px';
rendererStats.domElement.style.bottom   = '0px';
document.body.appendChild( rendererStats.domElement );

module.exports = { 
    beginFrame : function() {
        stats.begin();
    },
    endFrame : function(renderer) {
        stats.end();
        rendererStats.update(renderer);
    }
}
