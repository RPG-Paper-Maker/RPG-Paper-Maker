/*
  The module who hold libraries who can't be loaded normally using the ES6 module fashion.
  Such as Three.js
  It allow to use an ES6 module approach without comprimising it's typing and the require file.
  @author nio kasgami
 */
/**
 * @module Three.js
 */
import * as THREE from '../Libs/three.js';
export { THREE };
/**
 * @module Howler.js
 */
import { Howl } from '../Libs/howler.js';
export { Howl };

import localforage from '../Libs/localforage/localforage.js';
export { localforage };
