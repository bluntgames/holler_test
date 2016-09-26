'use strict';
require('three/examples/js/shaders/ConvolutionShader');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/ShaderPass');

var resizeCanvas = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.onresize = function(event) {
    resizeCanvas();
};

var stats = require('./render_stats.js');

//Three.js stuff...
var container = document.getElementById('container');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry( 1, .2, 1 );
var cubeMaterial	= new THREE.MeshPhongMaterial({
		shading		: THREE.FlatShading,
		color : 0x00ff
	});

var cube = new THREE.Object3D();
var cubeMesh = new THREE.Mesh( geometry, cubeMaterial );
cube.position.y = 1;

cube.add(cubeMesh);
scene.add( cube );
camera.position.z = 5;
camera.position.y = 1;

////////// terrain
var Terrain = require('./terrain/terrain.js');
var terrain = new Terrain(scene);

// Fog and sky..
var fogAmount = 0.06;
var fogColour = 0x00ccff;
scene.fog = new THREE.FogExp2(fogColour, fogAmount);

var skyGeometry = new THREE.CubeGeometry( -1000 , -1000, -1000  );
var skyMaterial = new THREE.MeshBasicMaterial( { color: 0x00ccff } );
var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
scene.add( skyBox );

// Lighting 
var alight	= new THREE.AmbientLight( 0x202020 );
scene.add( alight );
var dlight	= new THREE.DirectionalLight('white', 2);
dlight.position.set(0.5, 0.5, 2);
scene.add( dlight );

// Input
var mouse = {x:0, y:0};
function onDocumentMouseMove( event ) {
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

var speed = 5;
var turnSpeed = 2.0;
var deadZone = 0.05;
var clock = new THREE.Clock();
var yaw = 0;

var render = function () {
    stats.beginFrame();
    requestAnimationFrame( render );

    var currentSpeed = speed;
    if (mouse.y < 0) {
        currentSpeed = 0;
    }

    var delta = clock.getDelta();
    var frameMovement = delta * currentSpeed;
    cube.translateZ(-frameMovement);

    terrain.alignObject(cube, cubeMesh);
    terrain.update(cube.position);

    var frameRotation = delta * turnSpeed;
    if (mouse.x > deadZone) {
        yaw += -frameRotation * mouse.x
    } else if (mouse.x < -deadZone) {
        yaw += -frameRotation * mouse.x
    }
    cube.rotation.y = yaw;

    var localOffset = new THREE.Vector3(0,1,5);
    var cameraOffset = localOffset.applyMatrix4(cube.matrixWorld);
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt(cube.position);

    skyBox.position.x = cube.position.x;
    skyBox.position.z = cube.position.z;

    renderer.render(scene, camera);
    stats.endFrame(renderer);
};
render();