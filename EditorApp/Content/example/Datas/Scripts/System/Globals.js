/*
  The module who hold libraries who can't be loaded normally using the ES6 module fashion.
  Such as Three.js
  It allow to use an ES6 module approach without comprimising it's typing and the require file.
  @author nio kasgami
 */
/**
 * @module Three.js
 */
export const THREE = require('./Content/Datas/Scripts/Libs/three.js');
/**
 * @module Howler.js
 */
const { Howl } = require('./Content/Datas/Scripts/Libs/howler.js');
export { Howl };
