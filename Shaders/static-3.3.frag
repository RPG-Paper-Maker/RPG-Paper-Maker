#version 330

in highp vec2 coordTexture;

uniform sampler2D text;
uniform float alpha_threshold;

out highp vec4 fColor;

void main()
{
    vec4 color = texture(text, coordTexture);
    fColor = texture(text, coordTexture);
    if (color.a <= alpha_threshold) // Or whichever comparison here
        discard;

    fColor = color;
}
