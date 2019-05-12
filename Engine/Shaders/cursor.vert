attribute vec3 position;
attribute vec2 texCoord0;

uniform mat4 modelviewProjection;
uniform vec3 cursorPosition;
uniform float frameTex;

varying vec2 coordTexture;
varying float frame;

void main()
{
    gl_Position = modelviewProjection * vec4(position + cursorPosition, 1.0);
    coordTexture = texCoord0;
    frame = frameTex;
}
