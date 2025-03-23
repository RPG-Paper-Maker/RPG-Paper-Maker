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
	static SQR   = 19;
	static MIN   = 20;
	static MAX   = 21;
	static COMMA = 22;
	static VAR   = 23;
	static RAND3 = 24;
	static RAND4 = 25;
	static RAND5 = 26;
	static RAND6 = 27;
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
		else if (text[i] == ',')
			expr.push({ token: Token.COMMA, type: "op", value: null });
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
			else if (text[i] == 'q')
			{
				if (text[++i] == 'r')
				{
					if (text[++i] == 't')
						expr.push({ token: Token.SQRT, type: "func", value: null });
					else
						return null;
				}
				else
				{
					expr.push({ token: Token.SQR, type: "val", value: null });
					i--;
				}
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
			else if (text[i] == '3')
			{
				expr.push({ token: Token.RAND3, type: "val", value: null });
			}
			else if (text[i] == '4')
			{
				expr.push({ token: Token.RAND4, type: "val", value: null });
			}
			else if (text[i] == '5')
			{
				expr.push({ token: Token.RAND5, type: "val", value: null });
			}
			else if (text[i] == '6')
			{
				expr.push({ token: Token.RAND6, type: "val", value: null });
			}
			else
			{
				expr.push({ token: Token.RAND, type: "val", value: null });
				i--;
			}
		}
		else if (text[i] == 'm')
		{
			if (text[++i] == 'i')
			{
				if (text[++i] == 'n')
					expr.push({ token: Token.MIN, type: "func", value: null });
				else
					return null;
			}
			else if (text[i] == 'a')
			{
				if (text[++i] == 'x')
					expr.push({ token: Token.MAX, type: "func", value: null });
				else
					return null;
			}
			else
				return null;
		}
		else if (text[i] == 'v')
		{
			if (text[++i] == 'a')
			{
				if (text[++i] == 'r')
					expr.push({ token: Token.VAR, type: "func", value: null });
				else
					return null;
			}
			else
				return null;
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
	for (var i = 0; i < tree.length; i++)
	{
		if (tree[i].token === Token.COMMA)
		{
			tree[i].left = tree.splice(--i, 1)[0];
			tree[i].right = tree.splice(i + 1, 1)[0];
		}
	}
	return tree[0];
}

function evaluate(expr, t, r)
{
	switch (expr.token)
	{
		case Token.TIME:  return t;
		case Token.RAND:  return r[0];
		case Token.RAND2: return r[1];
		case Token.RAND3: return r[2];
		case Token.RAND4: return r[3];
		case Token.RAND5: return r[4];
		case Token.RAND6: return r[5];
		case Token.SQR:   return RPM.Datas.Systems.SQUARE_SIZE;
		case Token.NUM:   return expr.value;
		default:          break;
	}
	const left = evaluate(expr.left, t, r);
	if (Array.isArray(left) && expr.token !== Token.MIN && expr.token !== Token.MAX)
		return null;
	switch (expr.token)
	{
		case Token.ADD:   return left + evaluate(expr.right, t, r);
		case Token.SUB:   return left - evaluate(expr.right, t, r);
		case Token.MULT:  return left * evaluate(expr.right, t, r);
		case Token.DIV:   return left / evaluate(expr.right, t, r);
		case Token.MOD:   return left % evaluate(expr.right, t, r);
		case Token.POW:   return Math.pow(left, evaluate(expr.right, t, r));
		case Token.SQRT:  return Math.sqrt(left);
		case Token.LN:    return Math.log(left);
		case Token.SIN:   return Math.sin(left);
		case Token.COS:   return Math.cos(left);
		case Token.TAN:   return Math.tan(left);
		case Token.ABS:   return Math.abs(left);
		case Token.ROUND: return Math.round(left);
		case Token.VAR:   return RPM.Core.Game.current.variables[Math.round(left)];
		case Token.MIN:   return Math.min(...left);
		case Token.MAX:   return Math.max(...left);
		case Token.COMMA: return [left].concat([evaluate(expr.right, t, r)]);
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
			e.mesh.visible = e.origin.isInScene;
			if (e.map === RPM.Scene.Map.current && !e.origin.removed)
			{
				e.emissionTime += delta;
				if (e.rate > 0 && e.emissionTime > e.nextEmission)
				{
					e.nextEmission = e.emissionTime + (1 + Math.random()) / (2 * e.rate);
					e.particles.push({ time: 0, rand: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()], origin: e.origin.position.clone() });
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
							dummy.position.set(evaluate(e.px, p.time, p.rand) + p.origin.x, evaluate(e.py, p.time, p.rand)  + p.origin.y, evaluate(e.pz, p.time, p.rand)  + p.origin.z);
							dummy.scale.set(1, 1, 1).multiplyScalar(evaluate(e.size, p.time, p.rand));
							dummy.lookAt(RPM.Scene.Map.current.camera.getThreeCamera().position);
							dummy.rotation.z += evaluate(e.rot, p.time, p.rand) * Math.PI / 180.0;
							e.instanceAlpha[j] = evaluate(e.opacity, p.time, p.rand);
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

function endParticles(object, smooth)
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
				RPM.Scene.Map.current.scene.remove(e.mesh);
			}, smooth ? e.lifespan * 1000 : 1);
			break;
		}
	}
}

RPM.Manager.Plugins.registerCommand(pluginName, "Start particle effect", (object, rate, lifespan, position, rotation, size, opacity, texture, additiveBlending) =>
{
	endParticles(object, false);
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
			RPM.Scene.Map.current.scene.add(mesh);
			position = position.split(";");
			const exprPx = tokenize(position[0]);
			const exprPy = tokenize(position[1]);
			const exprPz = tokenize(position[2]);
			const exprRot = tokenize(rotation);
			const exprSize = tokenize(size);
			const exprAlpha = tokenize(opacity);
			var errorPx = false;
			var errorPy = false;
			var errorPz = false;
			var errorRot = false;
			var errorSize = false;
			var errorAlpha = false;
			try
			{
				evaluate(exprPx, 0, [0, 0, 0, 0, 0, 0]);
			}
			catch (e)
			{
				errorPx = true;
			}
			try
			{
				evaluate(exprPy, 0, [0, 0, 0, 0, 0, 0]);
			}
			catch (e)
			{
				errorPy = true;
			}
			try
			{
				evaluate(exprPz, 0, [0, 0, 0, 0, 0, 0]);
			}
			catch (e)
			{
				errorPz = true;
			}
			try
			{
				evaluate(exprRot, 0, [0, 0, 0, 0, 0, 0]);
			}
			catch (e)
			{
				errorRot = true;
			}
			try
			{
				evaluate(exprSize, 0, [0, 0, 0, 0, 0, 0]);
			}
			catch (e)
			{
				errorSize = true;
			}
			try
			{
				evaluate(exprAlpha, 0, [0, 0, 0, 0, 0, 0]);
			}
			catch (e)
			{
				errorAlpha = true;
			}
			if (errorPx || errorPy || errorPz || errorRot || errorSize || errorAlpha)
			{
				var msg = "The program found one or more errors in the following formulas:";
				if (errorPx)
					msg += "\nposition (x): " + position[0];
				if (errorPy)
					msg += "\nposition (y): " + position[1];
				if (errorPz)
					msg += "\nposition (z): " + position[2];
				if (errorRot)
					msg += "\nrotation: " + rotation;
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
					origin: result.object,
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
					rot: exprRot,
					size: exprSize,
					opacity: exprAlpha
				});
			}
		});
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "End particle effect", (object, smooth) =>
{
	endParticles(object, smooth);
});