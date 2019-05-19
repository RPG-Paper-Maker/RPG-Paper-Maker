attribute vec3 centerPosition;
attribute vec2 texCoord0;
attribute vec2 size;
attribute vec3 model;

uniform vec3 cameraRightWorldspace;
uniform vec3 cameraUpWorldspace; // Used for full billboard
uniform vec3 cameraDeepWorldspace;
uniform mat4 modelViewProjection;

varying vec2 coordTexture;

void main()
{
    vec3 vertexPositionWorldspace =
        centerPosition
        + cameraRightWorldspace * model.x * size.x
        + vec3(0.0, 1.0, 0.0) * model.y * size.y
        + cameraDeepWorldspace * model.z;

    gl_Position = modelViewProjection * vec4(vertexPositionWorldspace, 1.0);
    coordTexture = texCoord0;
}
