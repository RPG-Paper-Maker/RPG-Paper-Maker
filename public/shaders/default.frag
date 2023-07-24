uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
uniform float alpha_threshold;
uniform vec4 colorD;
uniform bool reverseH;
uniform vec2 offset;
uniform float repeat;
uniform bool enableShadows;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>

	vec2 pos;
	vec2 coords = vec2(vUv.x + offset.x, vUv.y + offset.y);
	if (reverseH)
		pos = vec2(1.0 - coords.x, coords.y);
	else
		pos = coords;
	pos = vec2(pos.x - floor(pos.x), pos.y - floor(pos.y));
	vec4 sampledDiffuseColor = texture2D(map, pos * repeat);
	if (sampledDiffuseColor.a <= alpha_threshold)
        discard;
	#ifdef DECODE_VIDEO_TEXTURE
		// inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	#endif
	diffuseColor *= sampledDiffuseColor;
	if (enableShadows && sampledDiffuseColor.a >= 1.0) {
		#include <color_fragment>
		#include <alphamap_fragment>
		#include <alphatest_fragment>
		#include <specularmap_fragment>
		#include <emissivemap_fragment>
		#ifdef DOUBLE_SIDED
			reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
		#else
			reflectedLight.indirectDiffuse += vIndirectFront;
		#endif
		#include <lightmap_fragment>
		reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );
		#ifdef DOUBLE_SIDED
			reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
		#else
			reflectedLight.directDiffuse = vLightFront;
		#endif
		reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();
		#include <aomap_fragment>
		vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
		#include <envmap_fragment>
		#include <output_fragment>
		#include <tonemapping_fragment>
		#include <encodings_fragment>
	} else {
		gl_FragColor = sampledDiffuseColor;
	}

	vec3 rgb = vec3(gl_FragColor.x + colorD.x, gl_FragColor.y + colorD.y, gl_FragColor.z + colorD.z);
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    gl_FragColor = vec4(mix(intensity, rgb, colorD.w), gl_FragColor.a);
    if (opacity < 1.0)
    	gl_FragColor = vec4(gl_FragColor.x, gl_FragColor.y, gl_FragColor.z, opacity);

	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}