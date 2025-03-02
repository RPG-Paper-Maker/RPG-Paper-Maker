import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Particle effects";

const emitterList = [];
const dummy = new THREE.Object3D();
const clock = new THREE.Clock();
const loader = new THREE.TextureLoader().setPath(RPM.Common.Paths.PLUGINS + pluginName + "/textures/");

const vertShader = `
attribute float instanceAlpha;

varying float vAlpha;
varying vec2 vUV;

void main()
{
	gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
	vUV = vec3(uv, 1).xy;
	vAlpha = instanceAlpha;
}`;

const fragShader = `
#include <fog_pars_fragment>

uniform sampler2D diffuseTexture;

varying float vAlpha;
varying vec2 vUV;

void main()
{
	vec4 tex = texture2D(diffuseTexture, vec2(vUV.x, vUV.y));
	if (tex.a < 0.5)
		discard;
	tex.a = vAlpha;
	gl_FragColor = tex;

	#include <fog_fragment>
}`;

class Token
{
	static ADD   =  0;
	static SUB   =  1;
	static MULT  =  2;
	static DIV   =  3;
	static MOD   =  4;
	static OPEN  =  5;
	static CLOSE =  6;
	static LN    =  7;
	static SIN   =  8;
	static COS   =  9;
	static TAN   = 10;
	static ABS   = 11;
	static TIME  = 12;
	static RAND  = 13;
	static NUM   = 14;
	static SQRT  = 15;
	static POW   = 16;
	static ROUND = 17;
	static RAND2 = 18;
}

function tokenize(text)
{
	text = text.toLowerCase();
	while (text.search(" ") !== -1)
		text = text.replace(" ", "");
	while (text.search("\t") !== -1)
		text = text.replace("\t", "");
	while (text.search("\n") !== -1)
		text = text.replace("\n", "");
	const expr = [];
	for (var i = 0; i < text.length; i++)
	{
		if (text[i] == '+')
			expr.push({ token: Token.ADD, type: "op", value: null });
		else if (text[i] == '*')
		{
			if (text[++i] == '*')
				expr.push({ token: Token.POW, type: "op", value: null });
			else
			{
				expr.push({ token: Token.MULT, type: "op", value: null });
				i--;
			}
		}
		else if (text[i] == '/')
			expr.push({ token: Token.DIV, type: "op", value: null });
		else if (text[i] == '%')
			expr.push({ token: Token.MOD, type: "op", value: null });
		else if (text[i] == '(')
			expr.push({ token: Token.OPEN, type: null, value: null });
		else if (text[i] == ')')
			expr.push({ token: Token.CLOSE, type: null, value: null });
		else if (text[i] == 'l')
		{
			if (text[++i] == 'n')
				expr.push({ token: Token.LN, type: "func", value: null });
			else
				return null;
		}
		else if (text[i] == 's')
		{
			if (text[++i] == 'i')
			{
				if (text[++i] == 'n')
					expr.push({ token: Token.SIN, type: "func", value: null });
				else
					return null;
			}
			else if (text[++i] == 'q')
			{
				if (text[++i] == 'r')
				{
					if (text[++i] == 't')
						expr.push({ token: Token.SQRT, type: "func", value: null });
					else
						return null;
				}
				else
					return null;
			}
			else
				return null;
		}
		else if (text[i] == 'c')
		{
			if (text[++i] == 'o')
			{
				if (text[++i] == 's')
					expr.push({ token: Token.COS, type: "func", value: null });
				else
					return null;
			}
			else
				return null;
		}
		else if (text[i] == 'a')
		{
			if (text[++i] == 'b')
			{
				if (text[++i] == 's')
					expr.push({ token: Token.ABS, type: "func", value: null });
				else
					return null;
			}
			else
				return null;
		}
		else if (text[i] == 't')
		{
			if (text[++i] == 'a')
			{
				if (text[++i] == 'n')
					expr.push({ token: Token.TAN, type: "func", value: null });
				else
					return null;
			}
			else
			{
				expr.push({ token: Token.TIME, type: "val", value: null });
				i--;
			}
		}
		else if (text[i] == 'r')
		{
			if (text[++i] == 'o')
			{
				if (text[++i] == 'u')
				{
					if (text[++i] == 'n')
					{
						if (text[++i] == 'd')
							expr.push({ token: Token.ROUND, type: "func", value: null });
						else
							return null;
					}
					else
						return null;
				}
				else
					return null;
			}
			else if (text[i] == '2')
			{
				expr.push({ token: Token.RAND2, type: "val", value: null });
			}
			else
			{
				expr.push({ token: Token.RAND, type: "val", value: null });
				i--;
			}
		}
		else
		{
			var num = "";
			while (num.search(/^-?\d*(\.\d*)?$/) === 0 && i < text.length)
				num += text[i++].toString();
			if (num.search(/^-?\d*(\.\d*)?$/) !== 0)
			{
				num = num.slice(0, -1);
				i--;
			}
			i--;
			if (num.length > 0)
			{
				if (num == '-')
					expr.push({ token: Token.SUB, type: "op", value: null });
				else
				{
					if (num[0] == '-' && expr[expr.length - 1].type == "val")
					{
						expr.push({ token: Token.SUB, type: "op", value: null });
						num = num.slice(1);
					}
					expr.push({ token: Token.NUM, type: "val", value: parseFloat(num) });
				}
			}
			else
				return null;
		}
	}
	var par = 0;
	for (var i = 0; i < expr.length; i++)
	{
		if (expr[i].token === Token.OPEN)
		{
			if (i < expr.length - 1 && expr[i + 1].token === Token.CLOSE)
				return null;
			else
				par++;
		}
		else if (expr[i].token === Token.CLOSE)
			par--;
		else if (i < expr.length - 1)
		{
			if (expr[i].type === expr[i + 1].type)
				return null;
			if (expr[i].type == "func" && expr[i + 1].type !== null)
				return null;
		}
		if (par < 0)
			return null;
	}
	if (par === 0)
		return buildTree(expr);
	return null;
}

function buildTree(expr)
{
	if (expr[0].type == "op" || expr[expr.length - 1].type == "op")
		return null;
	var tree = [];
	for (var i = 0; i < expr.length; i++)
	{
		if (expr[i].token === Token.OPEN)
		{
			var nested = [];
			var j, par = 1;
			for (j = 1; par !== 0 && i + j < expr.length; j++)
			{
				nested.push(expr[i + j]);
				if (expr[i + j].token === Token.OPEN)
					par++;
				else if (expr[i + j].token === Token.CLOSE)
					par--;
			}
			if (par !== 0)
				return null;
			nested.pop();
			var node = buildTree(nested);
			if (!node)
				return null;
			tree.push(node);
			i += j - 1;
		}
		else
			tree.push(expr[i]);
	}
	for (var i = 0; i < tree.length; i++)
	{
		if (!tree[i])
			return null;
		if (tree[i].type == "func")
			tree[i].left = tree.splice(i + 1, 1)[0];
	}
	for (var i = 0; i < tree.length; i++)
	{
		if (tree[i].token === Token.POW)
		{
			tree[i].left = tree.splice(--i, 1)[0];
			tree[i].right = tree.splice(i + 1, 1)[0];
		}
	}
	for (var i = 0; i < tree.length; i++)
	{
		if (tree[i].token === Token.MULT || tree[i].token === Token.DIV || tree[i].token === Token.MOD)
		{
			tree[i].left = tree.splice(--i, 1)[0];
			tree[i].right = tree.splice(i + 1, 1)[0];
		}
	}
	for (var i = 0; i < tree.length; i++)
	{
		if (tree[i].token === Token.ADD || tree[i].token === Token.SUB)
		{
			tree[i].left = tree.splice(--i, 1)[0];
			tree[i].right = tree.splice(i + 1, 1)[0];
		}
	}
	return tree[0];
}

function evaluate(expr, t, r, r2)
{
	switch (expr.token)
	{
		case Token.ADD:   return evaluate(expr.left, t, r, r2) + evaluate(expr.right, t, r, r2);
		case Token.SUB:   return evaluate(expr.left, t, r, r2) - evaluate(expr.right, t, r, r2);
		case Token.MULT:  return evaluate(expr.left, t, r, r2) * evaluate(expr.right, t, r, r2);
		case Token.DIV:   return evaluate(expr.left, t, r, r2) / evaluate(expr.right, t, r, r2);
		case Token.MOD:   return evaluate(expr.left, t, r, r2) % evaluate(expr.right, t, r, r2);
		case Token.POW:   return Math.pow(evaluate(expr.left, t, r, r2), evaluate(expr.right, t, r, r2));
		case Token.SQRT:  return Math.sqrt(evaluate(expr.left, t, r, r2));
		case Token.LN:    return Math.log(evaluate(expr.left, t, r, r2));
		case Token.SIN:   return Math.sin(evaluate(expr.left, t, r, r2));
		case Token.COS:   return Math.cos(evaluate(expr.left, t, r, r2));
		case Token.TAN:   return Math.tan(evaluate(expr.left, t, r, r2));
		case Token.ABS:   return Math.abs(evaluate(expr.left, t, r, r2));
		case Token.ROUND: return Math.round(evaluate(expr.left, t, r, r2));
		case Token.TIME:  return t;
		case Token.RAND:  return r;
		case Token.RAND2: return r2;
		case Token.NUM:   return expr.value;
		default:		  return null;
	}
}

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const delta = clock.getDelta();
		for (var i = 0; i < emitterList.length; i++)
		{
			const e = emitterList[i];
			if (e.map === RPM.Scene.Map.current && !!e.mesh.parent)
			{
				e.emissionTime += delta;
				if (e.rate > 0 && e.emissionTime > e.nextEmission)
				{
					e.nextEmission = e.emissionTime + (1 + Math.random()) / (2 * e.rate);
					e.particles.push({ time: 0, rand: Math.random(), rand2: Math.random() });
				}
				for (var j = 0; j < e.maxParticles; j++)
				{
					if (j < e.particles.length)
					{
						const p = e.particles[j];
						if (p.time > e.lifespan)
							e.particles.splice(j--, 1);
						else
						{
							p.time += delta;
							dummy.position.set(evaluate(e.px, p.time, p.rand, p.rand2), evaluate(e.py, p.time, p.rand, p.rand2), evaluate(e.pz, p.time, p.rand, p.rand2));
							dummy.position.multiplyScalar(RPM.Datas.Systems.SQUARE_SIZE);
							dummy.scale.set(1, 1, 1).multiplyScalar(evaluate(e.size, p.time, p.rand, p.rand2));
							dummy.rotation.y = (270 - RPM.Scene.Map.current.camera.horizontalAngle) * Math.PI / 180.0;
							e.instanceAlpha[j] = evaluate(e.opacity, p.time, p.rand, p.rand2);
							dummy.updateMatrix();
							e.mesh.setMatrixAt(j, dummy.matrix);
						}
					}
					else
					{
						dummy.position.set(0, 0, 0);
						dummy.scale.set(0, 0, 0);
						dummy.updateMatrix();
						e.mesh.setMatrixAt(j, dummy.matrix);
					}
				}
				e.mesh.geometry.setAttribute("instanceAlpha", new THREE.InstancedBufferAttribute(e.instanceAlpha, 1));
				e.mesh.geometry.attributes.instanceAlpha.needsUpdate = true;
				e.mesh.instanceMatrix.needsUpdate = true;
			}
			else
				emitterList.splice(i--, 1);
		}
	}
}, 16);

RPM.Manager.Plugins.registerCommand(pluginName, "Start particle effect", (object, rate, lifespan, position, size, opacity, texture, additiveBlending) =>
{
	if (object == -1)
		object = RPM.Core.ReactionInterpreter.currentObject.id;
	else if (object == 0)
		object = RPM.Core.Game.current.hero.id;
	RPM.Core.MapObject.search(object, (result) =>
	{
		const tex = loader.load(texture, function (tex)
		{
			tex.minFilter = THREE.NearestFilter;
			tex.magFilter = THREE.NearestFilter;
			const maxParticles = rate * lifespan * 2;
			const geo = new THREE.PlaneGeometry(tex.image.width, tex.image.height);
			const mat = new THREE.ShaderMaterial(
			{
				vertexShader: vertShader,
				fragmentShader: fragShader,
				blending: additiveBlending ? THREE.AdditiveBlending : THREE.NormalBlending,
				transparent: true,
				uniforms:
				{
					diffuseTexture: { value: tex }
				}
			});
			const mesh = new THREE.InstancedMesh(geo, mat, maxParticles);
			mesh.renderOrder = 1;
			if (!result.object.mesh)
			{
				result.object.mesh = new THREE.Mesh();
				RPM.Scene.Map.current.scene.add(result.object.mesh);
			}
			result.object.mesh.add(mesh);
			position = position.split(";");
			const exprPx = tokenize(position[0]);
			const exprPy = tokenize(position[1]);
			const exprPz = tokenize(position[2]);
			const exprSize = tokenize(size);
			const exprAlpha = tokenize(opacity);
			var errorPx = false;
			var errorPy = false;
			var errorPz = false;
			var errorSize = false;
			var errorAlpha = false;
			try
			{
				evaluate(exprPx, 0, 0, 0);
			}
			catch (e)
			{
				errorPx = true;
			}
			try
			{
				evaluate(exprPy, 0, 0, 0);
			}
			catch (e)
			{
				errorPy = true;
			}
			try
			{
				evaluate(exprPz, 0, 0, 0);
			}
			catch (e)
			{
				errorPz = true;
			}
			try
			{
				evaluate(exprSize, 0, 0, 0);
			}
			catch (e)
			{
				errorSize = true;
			}
			try
			{
				evaluate(exprAlpha, 0, 0, 0);
			}
			catch (e)
			{
				errorAlpha = true;
			}
			if (errorPx || errorPy || errorPz || errorSize || errorAlpha)
			{
				var msg = "The program found one or more errors in the following formulas:";
				if (errorPx)
					msg += "\nposition (x): " + position[0];
				if (errorPy)
					msg += "\nposition (y): " + position[1];
				if (errorPz)
					msg += "\nposition (z): " + position[2];
				if (errorSize)
					msg += "\nsize: " + size;
				if (errorAlpha)
					msg += "\nopacity: " + opacity;
				alert(msg);
			}
			else
			{
				emitterList.push(
				{
					id: object,
					emissionTime: 0,
					nextEmission: 0,
					maxParticles: maxParticles,
					map: RPM.Scene.Map.current,
					instanceAlpha: new Float32Array(maxParticles),
					mesh: mesh,
					particles: [],
					rate: rate,
					lifespan: lifespan,
					px: exprPx,
					py: exprPy,
					pz: exprPz,
					size: exprSize,
					opacity: exprAlpha
				});
			}
		});
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "End particle effect", (object, smooth) =>
{
	if (object == -1)
		object = RPM.Core.ReactionInterpreter.currentObject.id;
	else if (object == 0)
		object = RPM.Core.Game.current.hero.id;
	for (var i = 0; i < emitterList.length; i++)
	{
		const e = emitterList[i];
		if (e.id === object)
		{
			e.rate = 0;
			setTimeout(function ()
			{
				e.mesh.parent.remove(e.mesh);
			}, smooth ? e.lifespan * 1000 : 1);
			break;
		}
	}
});