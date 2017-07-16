#version 130

in vec3 centerPosition;
in vec2 texCoord0;
in vec2 size;
in vec2 model;

uniform vec3 cameraRightWorldspace;
uniform vec3 cameraUpWorldspace;

out vec2 coordTexture;

void main()
{
    vec3 vertexPositionWorldspace =
        centerPosition
        + cameraRightWorldspace * model[0] * size[0]
        + cameraUpWorldspace * model[1] * size[1];

    gl_Position = vec4(vertexPositionWorldspace, 1.0);
    coordTexture = texCoord0;
}
