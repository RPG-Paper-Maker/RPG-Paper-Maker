#version 130

in vec3 position;
in vec2 texCoord0;

uniform mat4 modelviewProjection;
uniform vec3 cursorPosition;
uniform float frameTex;

out vec2 coordTexture;
out float frame;

void main()
{
    gl_Position = modelviewProjection * vec4(position + cursorPosition, 1.0);
    coordTexture = texCoord0;
    frame = frameTex;
}
