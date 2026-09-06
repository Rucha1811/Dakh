// Global DOMRect & DOMPoint Polyfills for React Native Hermes runtime
if (typeof global.DOMRect === 'undefined') {
  class DOMRect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = Number(x) || 0;
      this.y = Number(y) || 0;
      this.width = Number(width) || 0;
      this.height = Number(height) || 0;
      this.top = this.y;
      this.right = this.x + this.width;
      this.bottom = this.y + this.height;
      this.left = this.x;
    }
    static fromRect(other) {
      return new DOMRect(other?.x, other?.y, other?.width, other?.height);
    }
    toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        top: this.top,
        right: this.right,
        bottom: this.bottom,
        left: this.left,
      };
    }
  }
  global.DOMRect = DOMRect;
  global.DOMRectReadOnly = DOMRect;
}

if (typeof global.DOMPoint === 'undefined') {
  class DOMPoint {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = Number(x) || 0;
      this.y = Number(y) || 0;
      this.z = Number(z) || 0;
      this.w = Number(w) || 1;
    }
    static fromPoint(other) {
      return new DOMPoint(other?.x, other?.y, other?.z, other?.w);
    }
  }
  global.DOMPoint = DOMPoint;
  global.DOMPointReadOnly = DOMPoint;
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
