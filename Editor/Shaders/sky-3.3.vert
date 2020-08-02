#version 330

in highp vec3 position;
out highp vec3 vTexCoord;
uniform mat4 modelviewProjection;
uniform vec3 pos;
uniform vec3 size;

void main()
{
    gl_Position = modelviewProjection * vec4(position * size + pos, 1.0);
    vTexCoord = position;
}
