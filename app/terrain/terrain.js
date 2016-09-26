var TerrainChunk = require('./terrain_chunk.js');
var SimplexNoise = require('exports?SimplexNoise!three/examples/js/SimplexNoise');

function Terrain(scene) {
    var _this = this;

    this.chunkWidth = 25;
    var halfChunk = this.chunkWidth / 2;
    this.chunkSegments = 25;
    this.smoothness = 0.1;
    this.maxHeight = 0.5;
    
    var chunks = new Array();

    var simplex = new SimplexNoise();

    this.noise = function( x, y ) {
        var multR = _this.maxHeight;
        var mult = _this.smoothness;
        var r = multR * simplex.noise( x * mult, y * mult );
	    return r;
    }
    
    this.material = new THREE.MeshPhongMaterial({
		shading		: THREE.FlatShading,
		color : 0x336600
	});

    var addChunk = function(id) {
        var chunk = new TerrainChunk(_this, id);
        chunks[id] = chunk;
        scene.add(chunks[id].mesh());
        return chunk;
    }

    //var id = _this.generateId_2D(pos.x, pos.z);
    //var id = _this.generateId_2D(pos.x, pos.z);
    //addChunk(-1);
    //this.currentChunk = addChunk(0);

    //TODO: dynamic chunk radius
    addChunk(0);
    addChunk(-1);
    addChunk(1);

    //TODO: maybe add all the chunk to the heirachy of this terrain object.
    //this.terrainMesh.position.z = -5;

    var caster = new THREE.Raycaster();
    var ray = new THREE.Vector3(0,-1,0);

    this.getHeightAtPoint = function(pos) {
        var id = _this.generateId_1D(pos.z);
        //var id = _this.generateId_2D(pos.x, pos.z);

        var chunk = chunks[id];
        if (chunk === undefined){
            console.log('undefined chunk for id: ' + id);
            chunk = addChunk(id);
            //return {success : false};
        }

        var castPos = pos;
        castPos.y = 2;
        caster.set(castPos, ray);
    
        var intersections = caster.intersectObject(chunk.mesh(), false);
        if (intersections.length > 0) {
            var groundHeight = intersections[0].point.y;
            return {success : true, height: groundHeight};
        } else {
            return {success : false};
        }
    }
     
    this.alignObject = function(root, mesh) {
        // updating root transform and mesh transform seperately
        // root used to drive the actual movement. mesh for the visuals
        var castPos1 = new THREE.Vector3(root.position.x, root.position.y, root.position.z);
        var height1 = castPos1.y;
        var result = _this.getHeightAtPoint(castPos1);
        if (result.success) {
            height1 = result.height;
        } else {
            return;
        }
        
        var matrix = new THREE.Matrix4();
        matrix.extractRotation(root.matrix);
        var rootDir = new THREE.Vector3(0,0,1);
        rootDir.y = 0;
        rootDir.applyMatrix4(matrix);

        // a second cast to determin the slope of the ground in the direction we're heading.
        var castPos2 = new THREE.Vector3(root.position.x, root.position.y, root.position.z);
        castPos2.add(rootDir);
        var height2 = castPos2.y;
        var result2 = _this.getHeightAtPoint(castPos2);
        if (result2.success) {
            height2 = result2.height;
        } else {
            return;
        }

        root.position.y = height1 + 0.1;
        var heightDelta = height2 - height1;
        var angle = -Math.atan(heightDelta);
        
        // rotating the mesh locally only...
        mesh.rotation.x = angle;
    }

    this.update = function(pos) {
        //TODO: load/unload visible chunks based on distance from player

        // //var id = generateId_2D(pos.x, pos.z);
        // var chunk = chunks[id];
        // if (chunk === undefined){
        //     chunk = addChunk(id);            
        // }
        // currentChunk = chunk
        // chunk.update(pos);
    }

    this.generateId_2D = function(xPos, yPos) {
        var x = generateId_1D(xPos);
        var y = generateId_1D(yPos);
		var id = (x & 0xffff) | ( (y << 16) & 0xffff0000);
		return id;
	}

    this.generateId_1D = function(pos) {
        var id = (pos + halfChunk) / _this.chunkWidth;
        id = Math.floor(id);
        return Math.floor(id);
	}

    this.getChunkPosition = function(id) {
		var x = (id & 0xffff);
        var y = ((id >> 16) & 0xffff);
		return { x: x, y: y };
    }
}

module.exports = Terrain;