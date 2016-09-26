'use strict';

var resizeCanvas = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.onresize = function(event) {
    resizeCanvas();
};

var stats = require('./render_stats.js');

//Three.js init renderer
var container = document.getElementById('container');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);

// Instanced cubes
var CubeInstanceArray = require('./cube_instance_array');
var instanceArray = new CubeInstanceArray(2000, scene);

if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === false ) {
    console.log('instancing not supported');
}

var lastTime = 0;
var moveQ = ( new THREE.Quaternion( .5, .5, .5, 0.0 ) ).normalize();
var tmpQ = new THREE.Quaternion();
var currentQ = new THREE.Quaternion();

var animate = function() {
    var time = performance.now();
    var object = instanceArray.mesh;
    object.rotation.y = time * 0.00005;

    var delta = ( time - lastTime ) / 5000;
    tmpQ.set( moveQ.x * delta, moveQ.y * delta, moveQ.z * delta, 1 ).normalize();

    var orientations = instanceArray.orientations;
    for ( var i = 0, ul = orientations.count; i < ul; i++ ) {
        var index = i * 4;
        currentQ.set( orientations.array[index], orientations.array[index + 1], orientations.array[index + 2], orientations.array[index + 3] );
        currentQ.multiply( tmpQ );

        orientations.setXYZW( i, currentQ.x, currentQ.y, currentQ.z, currentQ.w );

    }
    orientations.needsUpdate = true;
    lastTime = time;
}

var cameraLookTarget = new THREE.Object3D();
cameraLookTarget.position.y = 1.0;

// camera location
camera.position.z = 6;
camera.position.y = 2;

// plane mesh
var planeMaterial = new THREE.MeshPhongMaterial({
    shading		: THREE.FlatShading,
    color : 0xeeeeee
});

var planeGeometry = new THREE.PlaneGeometry( 10, 10, 1, 1 );
var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = Math.PI / 180 * (-90);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// Lighting 
var alight	= new THREE.AmbientLight( 0x202020 );
scene.add( alight );
var dlight	= new THREE.DirectionalLight('white', 2);
dlight.position.set(0, 1, 0);
dlight.castShadow = true;
scene.add( dlight );

var render = function () {
    stats.beginFrame();
    requestAnimationFrame( render );

    animate();

    camera.lookAt(cameraLookTarget.position);

    renderer.render(scene, camera);
    stats.endFrame(renderer);
};
render();