attribute vec3 position2;
attribute vec3 position3;
attribute vec3 position4;

attribute vec3 normal2;
attribute vec3 normal3;
attribute vec3 normal4;

attribute vec3 aRand;
attribute vec3 aRandSecondary;
attribute vec3 aColor;


uniform float uMorph2;
uniform float uMorph3;
uniform float uMorph4;

uniform float uSize;
uniform float uDestruction;


varying vec3 vColor;
varying float vVisible;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


void main() {

	vec4 modelPosition1 = modelMatrix * vec4(position, 1.0);
	vec4 modelPosition2 = modelMatrix * vec4(position2, 1.0);
	vec4 modelPosition3 = modelMatrix * vec4(position3, 1.0);
	vec4 modelPosition4 = modelMatrix * vec4(position4, 1.0);

	vec4 modelPosition = mix(modelPosition1, modelPosition2, uMorph2); 
	modelPosition = mix(modelPosition, modelPosition3, uMorph3); 
	modelPosition = mix(modelPosition, modelPosition4, uMorph4); 

	modelPosition.xyz += aRand.xyz * 850.0 * uDestruction;


	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;


	gl_Position = projectedPosition;

	vec3 currentNormal = mix(normal, normal2 , uMorph2);
	currentNormal = mix(currentNormal, normal3 , uMorph3);
	currentNormal = mix(currentNormal, normal4 , uMorph4);

	vec3 vNormal = normalize( normalMatrix * currentNormal);

	vec3 vDir = vec3(0, 0, 1);
	vVisible = step( 0., dot( vDir, vNormal ) );

	if(currentNormal == vec3(0.0, 0.0, 0.0))
	vVisible = -1.0;
	
  gl_PointSize = uSize * 60.0;
  gl_PointSize *= (1.0 / -viewPosition.z);

	vColor = aColor;
}