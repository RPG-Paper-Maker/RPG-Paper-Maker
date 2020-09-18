precision mediump float;
varying highp vec2 coordTexture;

uniform sampler2D texture;

void main()
{
    gl_FragColor = texture2D(texture, coordTexture);
}
