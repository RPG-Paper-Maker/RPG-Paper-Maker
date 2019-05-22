#version 130

in vec3 position;

uniform mat4 modelviewProjection;
uniform int yPosition;

void main()
{
    gl_Position = modelviewProjection * vec4(position.x, yPosition, position.z, 1.0);
}
