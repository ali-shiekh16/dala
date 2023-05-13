attribute vec3 secondaryPosition;

uniform float uSize;
uniform float uTransformationFactor;

varying vec3 vColor;
varying float vVisible;

void main() {

	// vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	vec4 modelPositionA = modelMatrix * vec4(position, 1.0);
	vec4 modelPositionB = modelMatrix * vec4(secondaryPosition, 1.0);

	vec4 modelPosition = mix(modelPositionA, modelPositionB, uTransformationFactor); 

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition;


	vec3 vNormal = normalize( normalMatrix * normal);
	vec3 vDir = vec3(0, 0, 1);
	vVisible = step( 0., dot( vDir, vNormal ) );
	
  gl_PointSize = uSize * 60.0;
  gl_PointSize *= (1.0 / -viewPosition.z);
}