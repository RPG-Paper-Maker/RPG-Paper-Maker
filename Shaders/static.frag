precision mediump float;
varying highp vec2 coordTexture;

uniform sampler2D texture;
uniform float alpha_threshold;

void main()
{
    vec4 color = texture2D(texture, coordTexture);
    if (color.a <= alpha_threshold) // Or whichever comparison here
        discard;

    gl_FragColor = color;
}
