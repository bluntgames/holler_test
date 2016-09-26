'use strict';

require('three/examples/js/shaders/ConvolutionShader');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/RGBShiftShader');
require('three/examples/js/shaders/HueSaturationShader');

require('./shaders/RedShiftShader');

require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/BloomPass');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/TexturePass');

var video = document.querySelector("#videoElement");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
if (navigator.getUserMedia) {
    var constraints = { audio: false, video: true };
    navigator.getUserMedia(constraints, handleVideo, videoError);
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    // do something
    console.log("video error");
}

video.addEventListener('canplay', function(ev){
    resizeCanvas();
 }, false);


var resizeCanvas = function() {
    var videoAspect = video.videoWidth / video.videoHeight;
    var windowAspect = window.innerWidth / window.innerHeight;

    if (videoAspect > windowAspect) {
        var w = window.innerHeight * videoAspect;
        renderer.setSize(w, window.innerHeight);

        var halfVideo = w * 0.5;
        var halfWindow = window.innerWidth * 0.5;
        var offset = -(halfVideo - halfWindow);                
        renderer.domElement.style.left = offset + 'px';         
        renderer.domElement.style.top = '0px';
    } else {
        renderer.domElement.style.left = offset + 'px';       
        var h = window.innerWidth / videoAspect;
        renderer.setSize(window.innerWidth, h);
        
        var halfVideo = h * 0.5;
        var halfWindow = window.innerHeight * 0.5;
        var offset = -(halfVideo - halfWindow);
        renderer.domElement.style.top = offset + 'px';
        renderer.domElement.style.left = '0px';
   }
}

window.onresize = function(event) {
    resizeCanvas();
};

var stats = require('./render_stats.js');

//Three.js stuff...
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//resizeCanvas();
document.body.appendChild( renderer.domElement );

var videoTexture = new THREE.Texture( video );
videoTexture.generateMipmaps = false;
videoTexture.minFilter = THREE.LinearFilter;

var composer = new THREE.EffectComposer(renderer);
var texturePass = new THREE.TexturePass(videoTexture);
var satPass = new THREE.ShaderPass(THREE.HueSaturationShader);
satPass.uniforms["saturation"] = {value: -1};

var shiftPass = new THREE.ShaderPass(THREE.RedShiftShader);
shiftPass.renderToScreen = true;
shiftPass.uniforms["amount"] = {value: 0.025};

composer.addPass(texturePass);
composer.addPass(satPass);
composer.addPass(shiftPass);

var clock = new THREE.Clock();
var render = function () {
    requestAnimationFrame( render );
    stats.beginFrame();

    var delta = clock.getDelta();

    if( video.readyState === video.HAVE_ENOUGH_DATA ){
        videoTexture.needsUpdate = true;
    }

    composer.render(delta);
    stats.endFrame(renderer);
};
render();