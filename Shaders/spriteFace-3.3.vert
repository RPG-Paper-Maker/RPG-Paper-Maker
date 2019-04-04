#version 330

layout(location = 0) in vec3 centerPosition;
layout(location = 1) in vec2 texCoord0;
layout(location = 2) in vec2 size;
layout(location = 3) in vec3 model;

uniform vec3 cameraRightWorldspace;
uniform vec3 cameraUpWorldspace; // Used for full billboard
uniform vec3 cameraDeepWorldspace;
uniform mat4 modelViewProjection;

out vec2 coordTexture;

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
