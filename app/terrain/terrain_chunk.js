
function TerrainChunk(terrain, id) {
    var _this = this;
    var segments = terrain.chunkSegments;

    var offset = id;
    var chunkOffset = id * terrain.chunkWidth;
    
    var planeGeometry = new THREE.PlaneGeometry( terrain.chunkWidth, terrain.chunkWidth, segments, segments );
    planeGeometry.dynamic = true;

    var updateGeometry = function() {
        var index = 0;
        var off = segments * offset;
        console.log('segments offset = ' + off);

        // set the height of the terrain from the simplex noise function.
        // should provide a continuous flowing infinite terrain.
        for(var i = 0; i <= segments; i++) {
            for(var j = 0; j <= segments; j++) {

                var iSeg = -off - i;
                planeGeometry.vertices[index].z = terrain.noise(iSeg, j);
                index++;
            }
        }
        planeGeometry.computeFaceNormals();
        planeGeometry.computeVertexNormals();
        planeGeometry.verticesNeedUpdate = true;
    }
    updateGeometry();

    var terrainMesh = new THREE.Mesh(planeGeometry, terrain.material);
    terrainMesh.rotation.x = Math.PI / 180 * (-90);
    terrainMesh.position.z = chunkOffset;

    this.mesh = function() { return terrainMesh; }
}

module.exports = TerrainChunk;