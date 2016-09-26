
function CubeInstanceArray(instanceCount, scene) {
    var _this = this;

    var cubeWidth = 0.1;
    var geometry = new THREE.InstancedBufferGeometry();

    // per mesh data
    var vertices = new THREE.BufferAttribute( new Float32Array( [
        // Front
        -cubeWidth, cubeWidth, cubeWidth,
        cubeWidth, cubeWidth, cubeWidth,
        -cubeWidth, -cubeWidth, cubeWidth,
        cubeWidth, -cubeWidth, cubeWidth,
        // Back
        cubeWidth, cubeWidth, -cubeWidth,
        -cubeWidth, cubeWidth, -cubeWidth,
        cubeWidth, -cubeWidth, -cubeWidth,
        -cubeWidth, -cubeWidth, -cubeWidth,
        // Left
        -cubeWidth, cubeWidth, -cubeWidth,
        -cubeWidth, cubeWidth, cubeWidth,
        -cubeWidth, -cubeWidth, -cubeWidth,
        -cubeWidth, -cubeWidth, cubeWidth,
        // Right
        cubeWidth, cubeWidth, cubeWidth,
        cubeWidth, cubeWidth, -cubeWidth,
        cubeWidth, -cubeWidth, cubeWidth,
        cubeWidth, -cubeWidth, -cubeWidth,
        // Top
        -cubeWidth, cubeWidth, cubeWidth,
        cubeWidth, cubeWidth, cubeWidth,
        -cubeWidth, cubeWidth, -cubeWidth,
        cubeWidth, cubeWidth, -cubeWidth,
        // Bottom
        cubeWidth, -cubeWidth, cubeWidth,
        -cubeWidth, -cubeWidth, cubeWidth,
        cubeWidth, -cubeWidth, -cubeWidth,
        -cubeWidth, -cubeWidth, -cubeWidth
    ] ), 3 );

    geometry.addAttribute( 'position', vertices );

    var uvs = new THREE.BufferAttribute( new Float32Array( [
        //x	y	z
        // Front
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // Back
        1, 0,
        0, 0,
        1, 1,
        0, 1,
        // Left
        1, 1,
        1, 0,
        0, 1,
        0, 0,
        // Right
        1, 0,
        1, 1,
        0, 0,
        0, 1,
        // Top
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // Bottom
        1, 0,
        0, 0,
        1, 1,
        0, 1
    ] ), 2 );

    geometry.addAttribute( 'uv', uvs );

    var indices = new Uint16Array( [
        0, 1, 2,
        2, 1, 3,
        4, 5, 6,
        6, 5, 7,
        8, 9, 10,
        10, 9, 11,
        12, 13, 14,
        14, 13, 15,
        16, 17, 18,
        18, 17, 19,
        20, 21, 22,
        22, 21, 23
    ] );

    geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );

    var offsets = new THREE.InstancedBufferAttribute( new Float32Array( instanceCount * 3 ), 3, 1 );
    var vector = new THREE.Vector4();

    for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
        var x = Math.random() * 10 - 5;
        var y = Math.random() * 10 - 5;
        var z = Math.random() * 10 - 5;
        vector.set( x, y, z, 0 ).normalize();
        offsets.setXYZ( i, x + vector.x, y + vector.y * 5, z + vector.z);
    }
    geometry.addAttribute( 'offset', offsets );

    this.orientations = new THREE.InstancedBufferAttribute( new Float32Array( instanceCount * 4 ), 4, 1 ).setDynamic( true );

    for ( var i = 0, ul = this.orientations.count; i < ul; i++ ) {
        vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
        vector.normalize();
        this.orientations.setXYZW( i, vector.x, vector.y, vector.z, vector.w );
    }
    geometry.addAttribute( 'orientation', this.orientations ); // per mesh orientation

    var material = new THREE.RawShaderMaterial( {
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide,
        transparent: false
    } );

    var depthMaterial = new THREE.RawShaderMaterial({
        vertexShader: document.getElementById( 'depthVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'depthFragmentShader' ).textContent
    });

    var instanceMesh = new THREE.Mesh( geometry, material );
    instanceMesh.customDepthMaterial = depthMaterial;
    instanceMesh.castShadow = true;
    scene.add( instanceMesh );

    this.mesh = instanceMesh;
}

module.exports = CubeInstanceArray;