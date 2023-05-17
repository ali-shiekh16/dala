attribute vec3 secondaryPosition;
attribute vec3 secondaryNormal;
attribute vec3 aRand;
attribute vec3 aRandSecondary;

uniform float uSize;
uniform float uTransformationFactor;
uniform float uDestruction;

varying vec3 vColor;
varying float vVisible;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


void main() {

	// vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	vec4 modelPositionA = modelMatrix * vec4(position, 1.0);
	vec4 modelPositionB = modelMatrix * vec4(secondaryPosition, 1.0);

	vec4 modelPosition = mix(modelPositionA, modelPositionB, uTransformationFactor); 
	modelPosition.xyz += aRand.xyz * 850.0 * uDestruction;


	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;


	gl_Position = projectedPosition;

	vec3 vNormal = normalize( normalMatrix * mix(normal, secondaryNormal, uTransformationFactor));
	vec3 vDir = vec3(0, 0, 1);
	vVisible = step( 0., dot( vDir, vNormal ) );
	
  gl_PointSize = uSize * 60.0;
  gl_PointSize *= (1.0 / -viewPosition.z);
}