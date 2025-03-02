/**
 * @author Mugen87 / https://github.com/Mugen87
 */

//import * as THREE from 'three';
import { THREE } from "../../System/Globals.js";

const dummy = new THREE.Object3D();

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 0;

    this._needsUpdate = false;
    this._instancedMesh = null;
  }

  add(particle) {
    this.particles.push(particle);

    this._needsUpdate = true;

    return this;
  }

  remove(particle) {
    const index = this.particles.indexOf(particle);
    this.particles.splice(index, 1);

    this._needsUpdate = true;

    return this;
  }

  clear() {
    this.particles.length = 0;
  }

  init(geometry, material, maxParticles) {
    // prepare geometry

    var instancedGeometry = new THREE.InstancedBufferGeometry();

    instancedGeometry.setAttribute('position', geometry.getAttribute('position'));
    instancedGeometry.setAttribute('uv', geometry.getAttribute('uv'));

    const tAttribute = new THREE.InstancedBufferAttribute(new Float32Array(maxParticles), 1);
    tAttribute.setUsage(THREE.DynamicDrawUsage);
    instancedGeometry.setAttribute('t', tAttribute);

    //

    this._instancedMesh = new THREE.InstancedMesh(instancedGeometry, material, maxParticles);

    this.maxParticles = maxParticles;

    return this;
  }

  update(delta) {
    const particles = this.particles;
    const instancedMesh = this._instancedMesh;

    // update particles array

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle._elapsedTime += delta;

      if (particle._elapsedTime >= particle.lifetime) {
        this.remove(particle);
      }
    }

    // update transformation data

    if (this._needsUpdate === true) {
      for (let i = 0, l = particles.length; i < l; i++) {
        const particle = particles[i];

        const position = particle.position;
        const size = particle.size;

        dummy.position.copy(position);
        dummy.scale.set(1, 1, 1).multiplyScalar(size);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
    }

    // rebuild "t" attribute which is used for animation

    const tAttribute = instancedMesh.geometry.getAttribute('t');

    for (let i = 0, l = particles.length; i < l; i++) {
      const particle = particles[i];

      tAttribute.setX(i, particle._elapsedTime / particle.lifetime);
    }
    tAttribute.needsUpdate = true;

    instancedMesh.count = particles.length;

    return this;
  }
}

class Particle {
  constructor(position = new THREE.Vector3(), lifetime = 1, size = 1) {
    this.position = position;
    this.lifetime = lifetime;
    this.size = size;

    this._elapsedTime = 0;
  }
}

export { ParticleSystem, Particle };
