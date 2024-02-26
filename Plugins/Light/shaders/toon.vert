#include <common>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>

varying vec3 vNormal;
varying vec3 fragPos;

void main()
{
	#include <begin_vertex>
	#include <beginnormal_vertex>
	#include <defaultnormal_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <uv_vertex>
	#include <color_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <skinning_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>

	vNormal = normal * inverse(normalMatrix); // why, three.js???
	fragPos = vec3(modelViewMatrix * vec4(position, 1.0));
	//gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
