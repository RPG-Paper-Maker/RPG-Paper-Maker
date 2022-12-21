attribute vec3 centerPosition;
attribute vec3 size;

varying vec2 vUv;

void main() {
	vUv = uv;

	vec3 cameraRightWorldSpace = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
	vec3 cameraUpWorldSpace = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]); // later for 100% billboards
	vec3 cameraDeepWorldSpace = vec3(modelViewMatrix[0][2], modelViewMatrix[1][2], modelViewMatrix[2][2]);
	vec3 pos =
        centerPosition
        + cameraRightWorldSpace * position.x * size.x
        + vec3(0.0, 1.0, 0.0) * position.y * size.y
        + cameraDeepWorldSpace * position.z;
  	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}