/*
  This file was created to fix the Three.JS typing errors since normal Module is incomplet and buggy. So we switched to 
  Require. Although, it doesn't allow a proper typing. 
  This file allows proper typing and is not shown into the JS render.
  @author Nio Kasgami
 */

import * as three from "three";
import * as howler from "howler";

export const THREE_TYPE: typeof three;
export const HOWLER_TYPE: typeof howler;
