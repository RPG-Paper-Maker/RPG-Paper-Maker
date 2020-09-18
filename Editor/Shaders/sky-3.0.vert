#version 130

in vec3 position;
in vec2 texCoord0;

uniform mat4 modelviewProjection;
uniform vec3 pos;

out vec2 coordTexture;

void main()
{
    gl_Position = modelviewProjection * vec4(position + pos, 1.0);
    coordTexture = texCoord0;
}
