#version 130

in highp vec2 coordTexture;
in float frame;

uniform sampler2D texture;
uniform float alpha_threshold;

out highp vec4 fColor;

void main()
{
    vec2 coord = vec2(coordTexture[0] + frame, coordTexture[1]);
    vec4 color = texture2D(texture, coord);
    if (color.a <= alpha_threshold) // Or whichever comparison here
        discard;

    fColor = color;
}
