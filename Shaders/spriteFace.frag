#version 130

in highp vec2 coordTexture;

uniform sampler2D texture;
uniform float alpha_threshold;

out highp vec4 fColor;

void main()
{
    vec4 color = texture2D(texture, coordTexture);
    fColor = texture2D(texture, coordTexture);
    if (color.a <= alpha_threshold) // Or whichever comparison here
        discard;

    fColor = color;
}
