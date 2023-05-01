attribute vec3 secondaryPosition;
attribute vec3 aColor;

uniform float uSize;
uniform float uTransformationFactor;

varying vec3 vColor;

void main() {
	// vUv = position; 

	vec4 modelPositionA = modelMatrix * vec4(position, 1.0);
	vec4 modelPositionB = modelMatrix * vec4(secondaryPosition * 20.0, 1.0);

	vec4 modelPosition = mix(modelPositionA, modelPositionB, uTransformationFactor); 

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;
	gl_Position = projectedPosition;

  gl_PointSize = uSize * 600.0;
  gl_PointSize *= (1.0 / -viewPosition.z);

	vColor = aColor;
}