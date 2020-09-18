attribute vec3 position;
attribute vec2 texCoord0;

uniform mat4 modelviewProjection;
uniform vec3 pos;

varying vec2 coordTexture;

void main()
{
    gl_Position = modelviewProjection * vec4(position + pos, 1.0);
    coordTexture = texCoord0;
}
