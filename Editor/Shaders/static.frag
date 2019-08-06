precision mediump float;
varying highp vec2 coordTexture;

uniform sampler2D texture;
uniform float alpha_threshold;
uniform bool hovered;
float colorHover = 0.1f;

void main()
{
    vec4 color = texture2D(texture, coordTexture);
    if (color.a <= alpha_threshold) // Or whichever comparison here
        discard;

    if (!hovered) {
        colorHover = 0.0f;
    }
    gl_FragColor = vec4(color.x + colorHover, color.y + colorHover, color.z +
        colorHover, color.w);
}
