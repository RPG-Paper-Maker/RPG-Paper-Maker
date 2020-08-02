#version 130
in vec3 aPosition;
out vec3 vTexCoord;
uniform mat4 modelviewProjection;
uniform vec3 pos;
uniform vec3 size;

void main()
{
    gl_Position = modelviewProjection * vec4(aPosition * size + pos, 1.0);
    vTexCoord = aPosition;
}
