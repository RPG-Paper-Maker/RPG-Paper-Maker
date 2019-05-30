#version 330

layout(location = 0) in vec3 position;

uniform mat4 modelviewProjection;
uniform float yPosition;

void main()
{
    gl_Position = modelviewProjection * vec4(position.x, yPosition, position.z, 1.0);
}
