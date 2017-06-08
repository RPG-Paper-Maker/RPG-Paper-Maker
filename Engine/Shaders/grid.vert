#version 130

in vec3 position;

uniform mat4 modelviewProjection;

void main()
{
    gl_Position = modelviewProjection * vec4(position, 1.0);
}
