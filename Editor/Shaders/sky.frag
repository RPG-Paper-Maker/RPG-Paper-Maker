uniform samplerCube uTexture;
varying highp vec3 vTexCoord;

void main()
{
    gl_FragColor = textureCube(uTexture, vTexCoord);
}
