attribute vec3 secondaryPosition;
attribute vec3 aColor;
attribute vec3 aRandom;

uniform float uSize;
uniform float uTransformationFactor;
uniform float uDestruction;

varying vec3 vColor;

void main() {
	// vUv = position; 

	vec4 modelPositionA = modelMatrix * vec4(position, 1.0);
	vec4 modelPositionB = modelMatrix * vec4(secondaryPosition, 1.0);

	vec4 modelPosition = mix(modelPositionA, modelPositionB, uTransformationFactor); 

	modelPosition.xyz += aRandom.xyz * uDestruction; 


	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;
	gl_Position = projectedPosition;

  gl_PointSize = uSize * 600.0;
  gl_PointSize *= (1.0 / -viewPosition.z);

	vColor = aColor;
}