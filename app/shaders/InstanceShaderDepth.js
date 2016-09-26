/**  Replicate the instanced geometry transforms in the depth pass. (shadows)
 */

THREE.InstanceShaderDepth = {
	uniforms: {
	},

	vertexShader: [
        "precision highp float;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",

        "attribute vec3 position;",
        "attribute vec3 offset;",
        "attribute vec2 uv;",
        "attribute vec4 orientation;",

        "void main() {",
            "vec3 vPosition = position;",
            "vec3 vcV = cross(orientation.xyz, vPosition);",
            "vPosition = vcV * (2.0 * orientation.w) + (cross(orientation.xyz, vcV) * 2.0 + vPosition);",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition, 1.0 );",
        "}"
			
	].join( "\n" ),

	fragmentShader: [
        "precision highp float;",

        "uniform float mNear;",
        "uniform float mFar;",
        "uniform float opacity;",
        "varying vec2 vUv;",

        "void main() {",
            "float depth = gl_FragCoord.z / gl_FragCoord.w;",
            "float color = 1.0 - smoothstep( mNear, mFar, depth );",
            "gl_FragColor = vec4( vec3( color ), opacity );",
        "}"
        
	].join( "\n" )

};
