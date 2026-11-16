/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';

type TintLight = THREE.DirectionalLight | THREE.SpotLight | THREE.PointLight;

type TintEntry = {
	target: THREE.WebGLRenderTarget | THREE.WebGLCubeRenderTarget;
	size: number;
	/** Depth tolerance in the units the receiver compares in (directional only). */
	bias: number;
	near: number;
	far: number;
	camera: THREE.PerspectiveCamera | null;
	rendered: boolean;
	/** Advanced shadows only: product of all glass layers (color) and depth of the farthest one. */
	overlap: THREE.WebGLRenderTarget | THREE.WebGLCubeRenderTarget | null;
};

type TintVariant = 'nearest' | 'product' | 'far';

/**
 * Colored translucent shadows ("stained glass") for directional, spot and
 * point lights.
 *
 * The regular shadow map only knows opaque casters (see GL.SHADOW_ALPHA_THRESHOLD).
 * For each shadow casting light this class renders a second map from the light's
 * point of view. It stores, for the nearest translucent caster of each texel, the
 * fraction and color of light that passes through (RGB) and its depth (depth
 * texture). The default fragment shader multiplies the light by that tint when
 * the receiver lies behind the translucent surface. Only the nearest translucent
 * layer tints.
 */
class ShadowTint {
	/** Texture alpha * opacity below this is treated as fully transparent. */
	public static MIN_ALPHA = 0.02;
	/** Depth tolerance in world units, avoids glass tinting itself. */
	public static BIAS_WORLD = 0.015;
	/** Tint strength = alpha ^ this. Below 1 makes faint pixels (low alpha) still visibly tint. */
	public static STRENGTH_CURVE = 0.5;
	/** Options > General options > Advanced shadows. Off keeps low-end PCs fast. */
	public static advanced = false;
	public static readonly SUN_MAP_SIZE = 2048;
	public static readonly SUN_MAP_SIZE_ADVANCED = 4096;
	/** Tint map sizes by light type: [normal, advanced] */
	public static readonly TINT_SIZES = {
		directional: [1024, 2048],
		spot: [512, 1024],
		point: [256, 512],
	};
	/**
	 * Every tint map costs two texture units in the lit shader (color and depth),
	 * and the GPU only has 16. Programs with more shadow casting lights than this
	 * simply skip the tint (see the TINT_ENABLED define below).
	 */
	public static readonly MAX_LIGHTS = 4;
	/** Overlapping glass needs two more texture units per light, so it only works with few lights. */
	public static readonly MAX_OVERLAP_LIGHTS = 2;

	public static uniforms = {
		tintOn: { value: 0 } as THREE.IUniform<number>,
		tintBiasWorld: { value: 0.015 } as THREE.IUniform<number>,
		directionalTintOn: { value: [] as number[] } as THREE.IUniform<number[]>,
		directionalTintMap: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		directionalTintDepth: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		directionalOverlapOn: { value: [] as number[] } as THREE.IUniform<number[]>,
		directionalOverlapMap: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		directionalOverlapDepth: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		directionalTintBias: { value: [] as number[] } as THREE.IUniform<number[]>,
		directionalTintTexel: { value: [] as number[] } as THREE.IUniform<number[]>,
		spotTintOn: { value: [] as number[] } as THREE.IUniform<number[]>,
		spotTintMap: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		spotTintDepth: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		spotOverlapOn: { value: [] as number[] } as THREE.IUniform<number[]>,
		spotOverlapMap: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		spotOverlapDepth: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		spotTintRange: { value: [] as THREE.Vector2[] } as THREE.IUniform<THREE.Vector2[]>,
		spotTintTexel: { value: [] as number[] } as THREE.IUniform<number[]>,
		pointTintOn: { value: [] as number[] } as THREE.IUniform<number[]>,
		pointTintMap: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		pointTintDepth: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		pointOverlapOn: { value: [] as number[] } as THREE.IUniform<number[]>,
		pointOverlapMap: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
		pointOverlapDepth: { value: [] as THREE.Texture[] } as THREE.IUniform<THREE.Texture[]>,
	};

	private static patched = false;
	private static placeholder: THREE.DataTexture | null = null;
	private static entries = new Map<TintLight, TintEntry>();
	private static materials = new WeakMap<THREE.Material, Partial<Record<TintVariant, THREE.ShaderMaterial>>>();
	private static translucency = new WeakMap<THREE.Texture, { version: number; value: boolean }>();
	private static noop = () => {};
	private static readonly CUBE_DIRECTIONS = [
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(0, 0, -1),
	];
	private static readonly CUBE_UPS = [
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(0, 0, -1),
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(0, -1, 0),
	];

	/** Patch three's shader chunks once, before any engine material compiles. */
	static patchShaderChunks() {
		if (this.patched) {
			return;
		}
		this.patched = true;
		const chunks = THREE.ShaderChunk as unknown as Record<string, string>;
		const max = this.MAX_LIGHTS;
		const maxOverlap = this.MAX_OVERLAP_LIGHTS;
		chunks.shadowmap_pars_fragment += `
// Opt-in: only materials created by GL.createMaterial define USE_SHADOW_TINT and receive the tint uniforms
#if defined( USE_SHADOWMAP ) && defined( USE_SHADOW_TINT ) && ( NUM_DIR_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS + NUM_POINT_LIGHT_SHADOWS ) > 0 && ( NUM_DIR_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS + NUM_POINT_LIGHT_SHADOWS ) <= ${max}
	#define TINT_ENABLED
	uniform float tintOn;
	uniform float tintBiasWorld;
	#if ( NUM_DIR_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS + NUM_POINT_LIGHT_SHADOWS ) <= ${maxOverlap}
		#define TINT_OVERLAP_ENABLED
	#endif
#endif

#if defined( TINT_ENABLED ) && NUM_DIR_LIGHT_SHADOWS > 0
	uniform float directionalTintOn[ NUM_DIR_LIGHT_SHADOWS ];
	uniform sampler2D directionalTintMap[ NUM_DIR_LIGHT_SHADOWS ];
	uniform sampler2D directionalTintDepth[ NUM_DIR_LIGHT_SHADOWS ];
	uniform float directionalTintBias[ NUM_DIR_LIGHT_SHADOWS ];
	uniform float directionalTintTexel[ NUM_DIR_LIGHT_SHADOWS ];
	#ifdef TINT_OVERLAP_ENABLED
		uniform float directionalOverlapOn[ NUM_DIR_LIGHT_SHADOWS ];
		uniform sampler2D directionalOverlapMap[ NUM_DIR_LIGHT_SHADOWS ];
		uniform sampler2D directionalOverlapDepth[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	vec3 getDirectionalTint( sampler2D tintMap, sampler2D tintDepth,
		#ifdef TINT_OVERLAP_ENABLED
			float overlapOn, sampler2D overlapMap, sampler2D overlapDepth,
		#endif
		float bias, float texel, vec4 shadowCoord ) {
		shadowCoord.xyz /= shadowCoord.w;
		if ( shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0 || shadowCoord.z > 1.0 ) return vec3( 1.0 );
		// 5-tap average so the edges of the tinted shadow are smooth
		vec2 o = vec2( texel );
		vec2 offsets[ 5 ] = vec2[ 5 ]( vec2( 0.0 ), vec2( o.x, 0.0 ), vec2( -o.x, 0.0 ), vec2( 0.0, o.y ), vec2( 0.0, -o.y ) );
		vec3 sum = vec3( 0.0 );
		for ( int k = 0; k < 5; k ++ ) {
			vec2 uv = shadowCoord.xy + offsets[ k ];
			vec3 t = vec3( 1.0 );
			if ( shadowCoord.z - bias > textureLod( tintDepth, uv, 0.0 ).r ) {
				t = textureLod( tintMap, uv, 0.0 ).rgb;
				#ifdef TINT_OVERLAP_ENABLED
					// Behind every glass layer: all of them tint, not just the nearest
					if ( overlapOn > 0.5 && shadowCoord.z - bias > textureLod( overlapDepth, uv, 0.0 ).r ) t = textureLod( overlapMap, uv, 0.0 ).rgb;
				#endif
			}
			sum += t;
		}
		return sum * 0.2;
	}
#endif

#if defined( TINT_ENABLED ) && NUM_SPOT_LIGHT_SHADOWS > 0
	uniform float spotTintOn[ NUM_SPOT_LIGHT_SHADOWS ];
	uniform sampler2D spotTintMap[ NUM_SPOT_LIGHT_SHADOWS ];
	uniform sampler2D spotTintDepth[ NUM_SPOT_LIGHT_SHADOWS ];
	uniform vec2 spotTintRange[ NUM_SPOT_LIGHT_SHADOWS ];
	uniform float spotTintTexel[ NUM_SPOT_LIGHT_SHADOWS ];
	#ifdef TINT_OVERLAP_ENABLED
		uniform float spotOverlapOn[ NUM_SPOT_LIGHT_SHADOWS ];
		uniform sampler2D spotOverlapMap[ NUM_SPOT_LIGHT_SHADOWS ];
		uniform sampler2D spotOverlapDepth[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	vec3 getSpotTint( sampler2D tintMap, sampler2D tintDepth,
		#ifdef TINT_OVERLAP_ENABLED
			float overlapOn, sampler2D overlapMap, sampler2D overlapDepth,
		#endif
		vec2 range, float texel, vec4 shadowCoord ) {
		float viewZ = shadowCoord.w;
		if ( viewZ <= 0.0 ) return vec3( 1.0 );
		shadowCoord.xyz /= shadowCoord.w;
		if ( shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0 || shadowCoord.z > 1.0 ) return vec3( 1.0 );
		// Perspective depth is not linear: convert the world tolerance at this distance
		float bias = tintBiasWorld * range.x * range.y / ( viewZ * viewZ * ( range.y - range.x ) );
		vec2 o = vec2( texel );
		vec2 offsets[ 5 ] = vec2[ 5 ]( vec2( 0.0 ), vec2( o.x, 0.0 ), vec2( -o.x, 0.0 ), vec2( 0.0, o.y ), vec2( 0.0, -o.y ) );
		vec3 sum = vec3( 0.0 );
		for ( int k = 0; k < 5; k ++ ) {
			vec2 uv = shadowCoord.xy + offsets[ k ];
			vec3 t = vec3( 1.0 );
			if ( shadowCoord.z - bias > textureLod( tintDepth, uv, 0.0 ).r ) {
				t = textureLod( tintMap, uv, 0.0 ).rgb;
				#ifdef TINT_OVERLAP_ENABLED
					if ( overlapOn > 0.5 && shadowCoord.z - bias > textureLod( overlapDepth, uv, 0.0 ).r ) t = textureLod( overlapMap, uv, 0.0 ).rgb;
				#endif
			}
			sum += t;
		}
		return sum * 0.2;
	}
#endif

#if defined( TINT_ENABLED ) && NUM_POINT_LIGHT_SHADOWS > 0
	uniform float pointTintOn[ NUM_POINT_LIGHT_SHADOWS ];
	uniform samplerCube pointTintMap[ NUM_POINT_LIGHT_SHADOWS ];
	uniform samplerCube pointTintDepth[ NUM_POINT_LIGHT_SHADOWS ];
	#ifdef TINT_OVERLAP_ENABLED
		uniform float pointOverlapOn[ NUM_POINT_LIGHT_SHADOWS ];
		uniform samplerCube pointOverlapMap[ NUM_POINT_LIGHT_SHADOWS ];
		uniform samplerCube pointOverlapDepth[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	vec3 getPointTint( samplerCube tintMap, samplerCube tintDepth,
		#ifdef TINT_OVERLAP_ENABLED
			float overlapOn, samplerCube overlapMap, samplerCube overlapDepth,
		#endif
		vec3 lightToPosition, float near, float far ) {
		vec3 absVec = abs( lightToPosition );
		float z = max( max( absVec.x, absVec.y ), absVec.z );
		if ( z > far || z < near ) return vec3( 1.0 );
		vec3 dir = normalize( lightToPosition );
		// Same perspective depth that three.js compares against, plus a world tolerance
		float dp = far * ( z - near ) / ( z * ( far - near ) );
		float bias = tintBiasWorld * near * far / ( z * z * ( far - near ) );
		vec3 t = vec3( 1.0 );
		if ( dp - bias > textureLod( tintDepth, dir, 0.0 ).r ) {
			t = textureLod( tintMap, dir, 0.0 ).rgb;
			#ifdef TINT_OVERLAP_ENABLED
				if ( overlapOn > 0.5 && dp - bias > textureLod( overlapDepth, dir, 0.0 ).r ) t = textureLod( overlapMap, dir, 0.0 ).rgb;
			#endif
		}
		return t;
	}
#endif
`;
		// Stained glass: the other side of a semitransparent surface glows with the light that passes through it,
		// the less opaque the brighter (rpmTranslucent = 1 - alpha, set by the default fragment shader), instead of
		// being black. Only the materials of the engine (USE_SHADOW_TINT) use it.
		const dotNL = 'float dotNL = saturate( dot( geometryNormal, directLight.direction ) );';
		if (chunks.lights_phong_pars_fragment.includes(dotNL)) {
			chunks.lights_phong_pars_fragment = chunks.lights_phong_pars_fragment.replace(
				dotNL,
				`#ifdef USE_SHADOW_TINT
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) ) + saturate( - dot( geometryNormal, directLight.direction ) ) * rpmTranslucent;
	#else
	${dotNL}
	#endif`,
			);
		} else {
			console.warn('ShadowTint: lights_phong_pars_fragment changed, translucent back lighting disabled');
		}
		const replaceOnce = (name: string, marker: string, addition: string) => {
			if (!chunks[name].includes(marker)) {
				console.warn(`ShadowTint: ${name} changed, colored shadows disabled for that light type`);
				return;
			}
			chunks[name] = chunks[name].replace(marker, `${marker}\n${addition}`);
		};
		replaceOnce(
			'lights_fragment_begin',
			'vDirectionalShadowCoord[ i ] ) : 1.0;',
			`#ifdef TINT_ENABLED
		if ( tintOn > 0.5 && directionalTintOn[ i ] > 0.5 && directLight.visible && receiveShadow ) directLight.color *= getDirectionalTint( directionalTintMap[ i ], directionalTintDepth[ i ],
		#ifdef TINT_OVERLAP_ENABLED
			directionalOverlapOn[ i ], directionalOverlapMap[ i ], directionalOverlapDepth[ i ],
		#endif
			directionalTintBias[ i ], directionalTintTexel[ i ], vDirectionalShadowCoord[ i ] );
		#endif`,
		);
		replaceOnce(
			'lights_fragment_begin',
			'vSpotLightCoord[ i ] ) : 1.0;',
			`#ifdef TINT_ENABLED
		if ( tintOn > 0.5 && spotTintOn[ i ] > 0.5 && directLight.visible && receiveShadow ) directLight.color *= getSpotTint( spotTintMap[ i ], spotTintDepth[ i ],
		#ifdef TINT_OVERLAP_ENABLED
			spotOverlapOn[ i ], spotOverlapMap[ i ], spotOverlapDepth[ i ],
		#endif
			spotTintRange[ i ], spotTintTexel[ i ], vSpotLightCoord[ i ] );
		#endif`,
		);
		replaceOnce(
			'lights_fragment_begin',
			'pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;',
			`#ifdef TINT_ENABLED
		if ( tintOn > 0.5 && pointTintOn[ i ] > 0.5 && directLight.visible && receiveShadow ) directLight.color *= getPointTint( pointTintMap[ i ], pointTintDepth[ i ],
		#ifdef TINT_OVERLAP_ENABLED
			pointOverlapOn[ i ], pointOverlapMap[ i ], pointOverlapDepth[ i ],
		#endif
			vPointShadowCoord[ i ].xyz, pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar );
		#endif`,
		);
	}

	private static getPlaceholder(): THREE.DataTexture {
		if (!this.placeholder) {
			this.placeholder = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
			this.placeholder.needsUpdate = true;
		}
		return this.placeholder;
	}

	private static createTarget(light: TintLight, size: number): THREE.WebGLRenderTarget | THREE.WebGLCubeRenderTarget {
		if (light instanceof THREE.PointLight) {
			const target = new THREE.WebGLCubeRenderTarget(size);
			const depthTexture = new THREE.CubeDepthTexture(size, THREE.UnsignedIntType);
			depthTexture.format = THREE.DepthFormat;
			depthTexture.minFilter = THREE.NearestFilter;
			depthTexture.magFilter = THREE.NearestFilter;
			target.depthTexture = depthTexture as unknown as THREE.DepthTexture;
			target.texture.minFilter = THREE.LinearFilter;
			target.texture.magFilter = THREE.LinearFilter;
			return target;
		}
		const depthTexture = new THREE.DepthTexture(size, size);
		depthTexture.minFilter = THREE.NearestFilter;
		depthTexture.magFilter = THREE.NearestFilter;
		const target = new THREE.WebGLRenderTarget(size, size, { depthTexture });
		target.texture.minFilter = THREE.LinearFilter;
		target.texture.magFilter = THREE.LinearFilter;
		return target;
	}

	private static getEntry(light: TintLight): TintEntry {
		const kind =
			light instanceof THREE.PointLight ? 'point' : light instanceof THREE.SpotLight ? 'spot' : 'directional';
		const size = this.TINT_SIZES[kind][this.advanced ? 1 : 0];
		let entry = this.entries.get(light);
		if (entry && entry.size !== size) {
			this.disposeEntry(entry);
			entry = undefined;
		}
		if (!entry) {
			entry = {
				target: this.createTarget(light, size),
				size,
				bias: 0.001,
				near: 0.1,
				far: 100,
				camera: null,
				rendered: false,
				overlap: null,
			};
			this.entries.set(light, entry);
		}
		return entry;
	}

	private static disposeEntry(entry: TintEntry) {
		entry.target.depthTexture?.dispose();
		entry.target.dispose();
		this.disposeOverlap(entry);
	}

	private static disposeOverlap(entry: TintEntry) {
		if (entry.overlap) {
			entry.overlap.depthTexture?.dispose();
			entry.overlap.dispose();
			entry.overlap = null;
		}
	}

	private static isInScene(object: THREE.Object3D, scene: THREE.Scene): boolean {
		let current: THREE.Object3D | null = object;
		while (current) {
			if (current === scene) {
				return true;
			}
			current = current.parent;
		}
		return false;
	}

	/** Does a texture contain pixels that are neither (nearly) transparent nor opaque? */
	private static textureIsTranslucent(map: THREE.Texture, threshold: number): boolean {
		const cached = this.translucency.get(map);
		if (cached && cached.version === map.version) {
			return cached.value;
		}
		let value = true;
		try {
			const image = map.image as CanvasImageSource & { width: number; height: number };
			if (image && image.width > 0 && image.height > 0) {
				const canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;
				const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
				ctx.drawImage(image, 0, 0);
				const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				const low = Math.ceil(this.MIN_ALPHA * 255);
				const high = Math.floor(threshold * 255);
				value = false;
				for (let i = 3; i < data.length; i += 4) {
					if (data[i] >= low && data[i] < high) {
						value = true;
						break;
					}
				}
			}
		} catch {
			value = true;
		}
		this.translucency.set(map, { version: map.version, value });
		return value;
	}

	private static isTranslucent(material: THREE.Material, threshold: number): boolean {
		if (material.opacity < 1) {
			return true;
		}
		const map = (material as THREE.MeshPhongMaterial).map;
		return !!map && this.textureIsTranslucent(map, threshold);
	}

	private static getTintMaterial(
		source: THREE.Material,
		threshold: number,
		variant: TintVariant,
	): THREE.ShaderMaterial {
		let variants = this.materials.get(source);
		if (!variants) {
			variants = {};
			this.materials.set(source, variants);
		}
		let material = variants[variant];
		if (!material) {
			material = new THREE.ShaderMaterial({
				side: THREE.DoubleSide,
				uniforms: {
					map: { value: null },
					opacity: { value: 1 },
					offset: { value: new THREE.Vector2() },
					repeat: { value: 1 },
					reverseH: { value: false },
					threshold: { value: threshold },
					minAlpha: { value: this.MIN_ALPHA },
					curve: { value: this.STRENGTH_CURVE },
				},
				vertexShader: `
					varying vec2 vUv;
					void main() {
						vUv = uv;
						gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
					}`,
				fragmentShader: `
					uniform sampler2D map;
					uniform float opacity;
					uniform vec2 offset;
					uniform float repeat;
					uniform bool reverseH;
					uniform float threshold;
					uniform float minAlpha;
					uniform float curve;
					varying vec2 vUv;
					void main() {
						vec2 coords = vUv * repeat + offset;
						if ( reverseH ) coords.x = 1.0 - coords.x;
						vec4 c = texture2D( map, coords );
						float a = c.a * opacity;
						// Transparent: lets everything through. Opaque: handled by the regular shadow map.
						if ( a < minAlpha || a >= threshold ) discard;
						gl_FragColor = vec4( mix( vec3( 1.0 ), c.rgb, pow( a, curve ) ), 1.0 );
					}`,
			});
			if (variant === 'product') {
				// Every glass layer multiplies the color: no depth test, result = source * destination
				material.depthTest = false;
				material.depthWrite = false;
				material.blending = THREE.CustomBlending;
				material.blendEquation = THREE.AddEquation;
				material.blendSrc = THREE.DstColorFactor;
				material.blendDst = THREE.ZeroFactor;
				material.blendSrcAlpha = THREE.ZeroFactor;
				material.blendDstAlpha = THREE.OneFactor;
			} else if (variant === 'far') {
				// Keeps the depth of the farthest glass layer
				material.colorWrite = false;
				material.depthFunc = THREE.GreaterDepth;
			}
			variants[variant] = material;
		}
		material.uniforms.map.value = (source as THREE.MeshPhongMaterial).map ?? this.getPlaceholder();
		material.uniforms.opacity.value = source.opacity;
		const live = source.userData.uniforms as Record<string, THREE.IUniform<unknown>> | undefined;
		if (live) {
			(material.uniforms.offset.value as THREE.Vector2).copy(
				(live.offset?.value as THREE.Vector2) ?? new THREE.Vector2(),
			);
			material.uniforms.repeat.value = (live.repeat?.value as number) ?? 1;
			material.uniforms.reverseH.value = !!live.reverseH?.value;
		}
		return material;
	}

	/** Shadow casting lights in the order three.js numbers them (per type, by scene order). */
	private static collectLights(object: THREE.Object3D, lights: TintLight[]) {
		if (!object.visible) {
			return;
		}
		if (
			(object instanceof THREE.DirectionalLight ||
				object instanceof THREE.SpotLight ||
				object instanceof THREE.PointLight) &&
			object.castShadow
		) {
			lights.push(object);
		}
		for (const child of object.children) {
			this.collectLights(child, lights);
		}
	}

	/** Shadow map size of the shadow casting spot and point lights of the objects (same as their tint map). */
	static getLightShadowMapSize(light: THREE.SpotLight | THREE.PointLight): number {
		return this.TINT_SIZES[light instanceof THREE.PointLight ? 'point' : 'spot'][this.advanced ? 1 : 0];
	}

	/** Resize the sun's shadow map when the Advanced shadows option changed. */
	static applyQuality(sun: THREE.DirectionalLight | null) {
		if (!sun) {
			return;
		}
		const size = this.advanced ? this.SUN_MAP_SIZE_ADVANCED : this.SUN_MAP_SIZE;
		if (sun.shadow.mapSize.x !== size) {
			sun.shadow.mapSize.set(size, size);
			sun.shadow.map?.dispose();
			sun.shadow.map = null;
			// Keep the normal offset at about one texel (see Camera.ts)
			sun.shadow.normalBias = ((2 * sun.shadow.camera.right) / size) * 1.0;
		}
	}

	/**
	 * Size the uniform arrays like the shader's (one entry per shadow casting light
	 * of each type), all switched off. The lengths must always match: empty or short
	 * arrays make WebGL report errors.
	 */
	private static prepareUniforms(lights: TintLight[]) {
		const u = this.uniforms;
		const count = (type: new (...args: never[]) => TintLight) => lights.filter((l) => l instanceof type).length;
		const nD = count(THREE.DirectionalLight);
		const nS = count(THREE.SpotLight);
		const nP = count(THREE.PointLight);
		const nulls = (n: number) => new Array<THREE.Texture>(n).fill(null as unknown as THREE.Texture);
		u.tintOn.value = 0;
		u.directionalTintOn.value = new Array<number>(nD).fill(0);
		u.directionalTintMap.value = nulls(nD);
		u.directionalTintDepth.value = nulls(nD);
		u.directionalOverlapOn.value = new Array<number>(nD).fill(0);
		u.directionalOverlapMap.value = nulls(nD);
		u.directionalOverlapDepth.value = nulls(nD);
		u.directionalTintBias.value = new Array<number>(nD).fill(0);
		u.directionalTintTexel.value = new Array<number>(nD).fill(1);
		u.spotTintOn.value = new Array<number>(nS).fill(0);
		u.spotTintMap.value = nulls(nS);
		u.spotTintDepth.value = nulls(nS);
		u.spotOverlapOn.value = new Array<number>(nS).fill(0);
		u.spotOverlapMap.value = nulls(nS);
		u.spotOverlapDepth.value = nulls(nS);
		u.spotTintRange.value = Array.from({ length: nS }, () => new THREE.Vector2(0.1, 100));
		u.spotTintTexel.value = new Array<number>(nS).fill(1);
		u.pointTintOn.value = new Array<number>(nP).fill(0);
		u.pointTintMap.value = nulls(nP);
		u.pointTintDepth.value = nulls(nP);
		u.pointOverlapOn.value = new Array<number>(nP).fill(0);
		u.pointOverlapMap.value = nulls(nP);
		u.pointOverlapDepth.value = nulls(nP);
	}

	/** Clear a target for a pass. The 'far' pass keeps the color and starts from depth 0 (farthest wins). */
	private static clearTarget(renderer: THREE.WebGLRenderer, variant: TintVariant) {
		if (variant === 'far') {
			renderer.state.buffers.depth.setClear(0);
			renderer.clear(false, true, false);
			renderer.state.buffers.depth.setClear(1);
		} else {
			renderer.clear(true, true, false);
		}
	}

	private static renderLight(
		renderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		light: TintLight,
		entry: TintEntry,
		target: THREE.WebGLRenderTarget | THREE.WebGLCubeRenderTarget,
		variant: TintVariant,
	) {
		if (light instanceof THREE.PointLight) {
			const shadowCamera = light.shadow.camera as THREE.PerspectiveCamera;
			const near = shadowCamera.near;
			const far = light.distance || shadowCamera.far;
			if (!entry.camera) {
				entry.camera = new THREE.PerspectiveCamera(90, 1, near, far);
			}
			const camera = entry.camera;
			if (camera.near !== near || camera.far !== far) {
				camera.near = near;
				camera.far = far;
				camera.updateProjectionMatrix();
			}
			entry.near = near;
			entry.far = far;
			light.updateMatrixWorld();
			const position = new THREE.Vector3().setFromMatrixPosition(light.matrixWorld);
			const look = new THREE.Vector3();
			for (let face = 0; face < 6; face++) {
				camera.position.copy(position);
				look.copy(position).add(this.CUBE_DIRECTIONS[face]);
				camera.up.copy(this.CUBE_UPS[face]);
				camera.lookAt(look);
				camera.updateMatrixWorld();
				renderer.setRenderTarget(target as THREE.WebGLCubeRenderTarget, face);
				this.clearTarget(renderer, variant);
				renderer.render(scene, camera);
			}
			return;
		}
		light.updateMatrixWorld();
		light.target.updateMatrixWorld();
		light.shadow.updateMatrices(light);
		const camera = light.shadow.camera;
		entry.near = camera.near;
		entry.far = camera.far;
		entry.bias = light instanceof THREE.DirectionalLight ? this.BIAS_WORLD / (camera.far - camera.near) : 0;
		renderer.setRenderTarget(target as THREE.WebGLRenderTarget);
		this.clearTarget(renderer, variant);
		renderer.render(scene, camera);
	}

	/**
	 * Semitransparent sprites and objects must not write depth while they are drawn: three.js sorts transparent
	 * objects by their position, and a pane drawn too early would hide everything behind it. The static map
	 * (renderOrder 0 or below, often sharing its material with them) keeps writing depth. The change is made
	 * only around the draw of each mesh, since the material is shared.
	 */
	private static updateGlassDepthWrite(scene: THREE.Scene, threshold: number) {
		scene.traverse((object) => {
			if (!(object instanceof THREE.Mesh) || object.renderOrder <= 0 || object.userData.rpmGlassChecked) {
				return;
			}
			const materials = (Array.isArray(object.material) ? object.material : [object.material]).filter(
				// Only the materials of the engine (see USE_SHADOW_TINT)
				(material) => (material as THREE.MeshPhongMaterial)?.defines?.USE_SHADOW_TINT !== undefined,
			);
			if (materials.length === 0) {
				return;
			}
			object.userData.rpmGlassChecked = true;
			const previousBefore = object.onBeforeRender;
			const previousAfter = object.onAfterRender;
			const saved = new Map<THREE.Material, boolean>();
			object.onBeforeRender = (...args) => {
				previousBefore.apply(object, args);
				const material = Array.isArray(object.material) ? object.material : [object.material];
				for (const m of material) {
					if (m.depthWrite && this.isTranslucent(m, threshold)) {
						saved.set(m, true);
						m.depthWrite = false;
					}
				}
			};
			object.onAfterRender = (...args) => {
				for (const m of saved.keys()) {
					m.depthWrite = true;
				}
				saved.clear();
				previousAfter.apply(object, args);
			};
		});
	}

	/** Render the tint maps of the lights. Call before the regular render of the scene. */
	static render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, threshold: number) {
		this.patchShaderChunks();
		this.updateGlassDepthWrite(scene, threshold);

		const lights: TintLight[] = [];
		this.collectLights(scene, lights);
		this.prepareUniforms(lights);
		// Release the maps of lights that left the scene
		for (const [light, entry] of this.entries) {
			if (!this.isInScene(light, scene)) {
				this.disposeEntry(entry);
				this.entries.delete(light);
			}
		}
		if (lights.length === 0 || lights.length > this.MAX_LIGHTS) {
			return;
		}

		// Find the translucent casters; everything else is hidden during the passes
		const casters: THREE.Mesh[] = [];
		const hidden: THREE.Object3D[] = [];
		const visit = (object: THREE.Object3D) => {
			if (!object.visible) {
				return;
			}
			if (object instanceof THREE.Mesh) {
				const materials = Array.isArray(object.material) ? object.material : [object.material];
				if (
					object.castShadow &&
					!(object instanceof THREE.SkinnedMesh) &&
					!(object instanceof THREE.InstancedMesh) &&
					materials.some((m) => this.isTranslucent(m, threshold))
				) {
					casters.push(object);
				} else {
					hidden.push(object);
				}
			} else if (
				(object as THREE.Line).isLine ||
				(object as THREE.Points).isPoints ||
				(object as THREE.Sprite).isSprite
			) {
				hidden.push(object);
			}
			for (const child of object.children) {
				visit(child);
			}
		};
		visit(scene);
		if (casters.length === 0) {
			return;
		}

		// Decide what to render. Point lights follow three.js: static ones only update on request.
		const jobs: { light: TintLight; entry: TintEntry; render: boolean }[] = lights.map((light) => {
			const entry = this.getEntry(light);
			const render =
				!(light instanceof THREE.PointLight) ||
				!entry.rendered ||
				light.shadow.autoUpdate ||
				light.shadow.needsUpdate;
			return { light, entry, render };
		});

		// Advanced shadows: overlapping glass also needs the product of all layers and the farthest one
		const overlapAllowed = this.advanced && lights.length <= this.MAX_OVERLAP_LIGHTS;
		for (const job of jobs) {
			if (overlapAllowed && !job.entry.overlap) {
				job.entry.overlap = this.createTarget(job.light, job.entry.size);
				job.render = true;
			} else if (!overlapAllowed && job.entry.overlap) {
				this.disposeOverlap(job.entry);
			}
		}

		if (jobs.some((job) => job.render)) {
			const original = new Map<
				THREE.Mesh,
				{ material: THREE.Material | THREE.Material[]; onBeforeRender: unknown }
			>();
			for (const mesh of casters) {
				original.set(mesh, { material: mesh.material, onBeforeRender: mesh.onBeforeRender });
				mesh.onBeforeRender = this.noop;
			}
			const useVariant = (variant: TintVariant) => {
				for (const [mesh, state] of original) {
					mesh.material = Array.isArray(state.material)
						? state.material.map((m) => this.getTintMaterial(m, threshold, variant))
						: this.getTintMaterial(state.material, threshold, variant);
				}
			};
			for (const object of hidden) {
				object.visible = false;
			}

			const previousTarget = renderer.getRenderTarget();
			const previousFace = renderer.getActiveCubeFace();
			const previousAutoUpdate = renderer.shadowMap.autoUpdate;
			const previousClearColor = renderer.getClearColor(new THREE.Color());
			const previousClearAlpha = renderer.getClearAlpha();
			const previousBackground = scene.background;
			try {
				renderer.shadowMap.autoUpdate = false;
				scene.background = null;
				renderer.setClearColor(0xffffff, 1);
				const passes: { variant: TintVariant; overlap: boolean }[] = [
					{ variant: 'nearest', overlap: false },
					{ variant: 'product', overlap: true },
					{ variant: 'far', overlap: true },
				];
				for (const pass of passes) {
					useVariant(pass.variant);
					for (const job of jobs) {
						const target = pass.overlap ? job.entry.overlap : job.entry.target;
						if (job.render && target) {
							this.renderLight(renderer, scene, job.light, job.entry, target, pass.variant);
						}
					}
				}
				for (const job of jobs) {
					if (job.render) {
						job.entry.rendered = true;
					}
				}
			} finally {
				renderer.setRenderTarget(previousTarget, previousFace);
				renderer.setClearColor(previousClearColor, previousClearAlpha);
				renderer.shadowMap.autoUpdate = previousAutoUpdate;
				scene.background = previousBackground;
				for (const object of hidden) {
					object.visible = true;
				}
				for (const [mesh, state] of original) {
					mesh.material = state.material;
					mesh.onBeforeRender = state.onBeforeRender as THREE.Mesh['onBeforeRender'];
				}
			}
		}

		// Hand the maps to the shaders, in three.js' per-type order
		const u = this.uniforms;
		let d = 0;
		let s = 0;
		let p = 0;
		for (const { light, entry } of jobs) {
			if (light instanceof THREE.PointLight) {
				u.pointTintOn.value[p] = 1;
				u.pointTintMap.value[p] = entry.target.texture;
				u.pointTintDepth.value[p] = entry.target.depthTexture!;
				if (entry.overlap) {
					u.pointOverlapOn.value[p] = 1;
					u.pointOverlapMap.value[p] = entry.overlap.texture;
					u.pointOverlapDepth.value[p] = entry.overlap.depthTexture!;
				}
				p++;
			} else if (light instanceof THREE.SpotLight) {
				u.spotTintOn.value[s] = 1;
				u.spotTintMap.value[s] = entry.target.texture;
				u.spotTintDepth.value[s] = entry.target.depthTexture!;
				if (entry.overlap) {
					u.spotOverlapOn.value[s] = 1;
					u.spotOverlapMap.value[s] = entry.overlap.texture;
					u.spotOverlapDepth.value[s] = entry.overlap.depthTexture!;
				}
				u.spotTintRange.value[s].set(entry.near, entry.far);
				u.spotTintTexel.value[s] = 1 / entry.size;
				s++;
			} else {
				u.directionalTintOn.value[d] = 1;
				u.directionalTintMap.value[d] = entry.target.texture;
				u.directionalTintDepth.value[d] = entry.target.depthTexture!;
				if (entry.overlap) {
					u.directionalOverlapOn.value[d] = 1;
					u.directionalOverlapMap.value[d] = entry.overlap.texture;
					u.directionalOverlapDepth.value[d] = entry.overlap.depthTexture!;
				}
				u.directionalTintBias.value[d] = entry.bias;
				u.directionalTintTexel.value[d] = 1 / entry.size;
				d++;
			}
		}
		u.tintBiasWorld.value = this.BIAS_WORLD;
		u.tintOn.value = 1;
	}
}

export { ShadowTint };
