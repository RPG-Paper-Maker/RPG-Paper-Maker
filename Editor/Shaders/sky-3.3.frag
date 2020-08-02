#version 330

uniform samplerCube uTexture;
in highp vec3 vTexCoord;
out highp vec4 fColor;

void main()
{
    fColor = texture(uTexture, vTexCoord);
}
