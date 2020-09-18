#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord0;

uniform mat4 modelviewProjection;
uniform vec3 pos;

out vec2 coordTexture;

void main()
{
    gl_Position = modelviewProjection * vec4(position + pos, 1.0);
    coordTexture = texCoord0;
}
