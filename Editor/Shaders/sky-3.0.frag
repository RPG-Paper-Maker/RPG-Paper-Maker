#version 130

in highp vec2 coordTexture;

uniform sampler2D texture;

out highp vec4 fColor;

void main()
{
    fColor = texture2D(texture, coordTexture);
}
