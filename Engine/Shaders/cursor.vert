#version 130

in vec3 position;

uniform mat4 modelviewProjection;
uniform vec3 cursorPosition;

void main()
{
    gl_Position = modelviewProjection * vec4(position + cursorPosition, 1.0);
}
