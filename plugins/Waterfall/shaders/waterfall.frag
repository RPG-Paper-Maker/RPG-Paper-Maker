// https://codesandbox.io/p/sandbox/funny-lake-7rkse

#include <common>
#include <packing>
#include <fog_pars_fragment>

varying vec2 vUv;
uniform sampler2D tNoise;
uniform sampler2D tDudv;
uniform vec3 topDarkColor;
uniform vec3 bottomDarkColor;
uniform vec3 topLightColor;
uniform vec3 bottomLightColor;
uniform vec3 foamColor;
uniform float time;
uniform float speed;
uniform float opacity;

const float strength = 0.02;
const float foamThreshold = 0.15;

float round(float a)
{
	return floor(a + 0.5);
}

void main()
{
	float t = time * speed * 0.001;

	vec2 displacement = texture2D(tDudv, vUv + t * 0.1).rg;
	displacement = ((displacement * 2.0) - 1.0) * strength;

	float noise = texture2D(tNoise, vec2(vUv.x, (vUv.y / 5.0) + t * 0.2) + displacement).r;
	noise = round(noise * 5.0) / 5.0; // banding, values in the range [0, 0.2, 0.4, 0.6, 0.8, 1]

	vec3 color = mix(mix(bottomDarkColor, topDarkColor, vUv.y), mix(bottomLightColor, topLightColor, vUv.y), noise);
	color = mix(color, foamColor, step(vUv.y + displacement.y, foamThreshold)); // add foam

	gl_FragColor.rgb = color;
	gl_FragColor.a = opacity;

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
