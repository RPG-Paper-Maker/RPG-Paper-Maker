attribute vec3 position;
attribute vec2 texCoord0;

uniform mat4 modelviewProjection;

varying vec2 coordTexture;

void main()
{
    gl_Position = modelviewProjection * vec4(position, 1.0);
    coordTexture = texCoord0;
}
