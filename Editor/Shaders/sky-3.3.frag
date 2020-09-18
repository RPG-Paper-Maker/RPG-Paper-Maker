#version 330

in highp vec2 coordTexture;

uniform sampler2D text;

out highp vec4 fColor;

void main()
{
    fColor = texture(text, coordTexture);
}
