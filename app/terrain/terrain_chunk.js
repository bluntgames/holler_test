
function TerrainChunk(terrain, xIndex, yIndex) {
    var _this = this;
    var segments = terrain.chunkSegments;

    var xOffset = xIndex;
    var yOffset = yIndex;
    //var chunkOffset = id * terrain.chunkWidth;
    var chunkOffsetX = xIndex * terrain.chunkWidth;
    var chunkOffsetY = yIndex * terrain.chunkWidth;
    
    var planeGeometry = new THREE.PlaneGeometry( terrain.chunkWidth, terrain.chunkWidth, segments, segments );
    planeGeometry.dynamic = true;

    var updateGeometry = function() {
        var index = 0;
        var xOff = segments * xOffset;
        var yOff = segments * yOffset;

        // set the height of the terrain from the simplex noise function.
        // should provide a continuous flowing infinite terrain.
        for(var i = 0; i <= segments; i++) {
            for(var j = 0; j <= segments; j++) {

                var iSeg = -yOff - i;
                var jSeg = -xOff - j;
                planeGeometry.vertices[index].z = terrain.noise(iSeg, jSeg);
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
    terrainMesh.position.x = chunkOffsetX;
    terrainMesh.position.z = chunkOffsetY;

    this.mesh = function() { return terrainMesh; }
}

module.exports = TerrainChunk;