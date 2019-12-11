!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("three")):"function"==typeof define&&define.amd?define(["exports","three"],e):e((t=t||self).ThreeInstancedParticles={},t.THREE)}(this,function(t,e){"use strict";var i=function(){function t(){this.position=new e.Vector3,this.quaternion=new e.Quaternion,this.scale=new e.Vector3}return t.compose=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return function(e,i){var r=t.length,n=t.map(function(t){return t(e,function(){--r||i()})});return{pause:function(){return n.forEach(function(t){t&&t.pause()})}}}},t.prototype.start=function(t,e){var i=this;this.stop(),this.animation=t(this,function(){e(),i.animation=void 0})},t.prototype.stop=function(){this.animation&&!this.animation.pause&&console.log(this.animation),this.animation&&this.animation.pause()},t.prototype.dispose=function(){this.animation&&this.animation.pause(),this.animation=void 0},t.show=function(t,e){t.scale.set(1,1,1),e()},t.hide=function(t,e){t.scale.set(0,0,0),e()},t}(),r=function(){function t(){this.position=new e.Vector3,this.quaternion=new e.Quaternion,this.scale=new e.Vector3(1,1,1),this.matrix=new e.Matrix4,this.transition=new i,this.appended=!1}return t.prototype.append=function(t,e){this.appended=!0,this.transition.start(t||i.show,function(){e&&e()})},t.prototype.remove=function(t,e){var r=this;this.transition.start(t||i.hide,function(){r.appended=!1,e&&e()})},t.prototype.update=function(){return!!this.appended&&(this.matrix.compose(this.position.clone().add(this.transition.position),this.quaternion.clone().multiply(this.transition.quaternion),this.scale.clone().multiply(this.transition.scale)),!0)},t.prototype.dispose=function(){this.transition.dispose()},t}(),n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};function o(t,e){var i={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(i[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&(i[r[n]]=t[r[n]])}return i}var a,s=function(t,e,i){var r=i.get;i.get=function(){return Object.defineProperty(t,e,{value:r.call(t)})[e]}};!function(t){t[t.Append=1]="Append",t[t.Remove=-1]="Remove"}(a||(a={}));var c=function(t){function i(e){var i=void 0===e?{}:e,r=i.geometry,n=void 0===r?void 0:r,o=i.material,a=void 0===o?void 0:o,s=i.count,c=void 0===s?0:s,p=i.color,h=void 0===p?16777215:p,l=i.transition,u=void 0===l?{}:l,f=t.call(this)||this;return f.particles=[],f._usesNormalMaterial=!1,f.appendedParticles=0,f.transition=u,f.geometry=n,f.material=a,f.color=h,f.count=c,f}return function(t,e){function i(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}(i,t),Object.defineProperty(i.prototype,"normalMaterial",{get:function(){return new e.MeshNormalMaterial({morphTargets:!0,skinning:!0})},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"generated",{get:function(){return!!this.mesh},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"geometry",{get:function(){return this._geometry},set:function(t){this._geometry=t,this.mesh&&t&&(this.mesh.geometry=t)},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"material",{get:function(){return this._material},set:function(t){var e=this;this._material=t,this.mesh&&t&&(Array.isArray(t)?t.forEach(function(t){return t.color.set(e.color)}):t.color.set(this.color),this.usesNormalMaterial||(this.mesh.material=t))},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"color",{get:function(){return this._color},set:function(t){this._color=t,this.material&&(Array.isArray(this.material)?this.material.forEach(function(e){return e.color.set(t)}):this.material.color.set(t))},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"usesNormalMaterial",{get:function(){return this._usesNormalMaterial},set:function(t){this._usesNormalMaterial=t,this.mesh&&(t||this.material)&&(this.mesh.material=t?this.normalMaterial:this.material)},enumerable:!0,configurable:!0}),i.prototype.createParticle=function(){return new r},i.prototype.prepareParticle=function(t,e){if(!this.mesh)throw new Error("The mesh and particles have not been generated, call generate() before calling appendParticle() or removeParticle()");var i;switch(t){case a.Append:if(this.appendedParticles>=this.mesh.count)throw new Error("All "+this.mesh.count+" particles have already been appended, increase count and call generate() to append more particles.");i=this.particles[this.appendedParticles++];break;case a.Remove:if(this.appendedParticles<=0)throw new Error("All "+this.mesh.count+" particles have already been removed, you cannot remove more particles.");i=this.particles[--this.appendedParticles]}return e&&e(i),i},i.prototype.generate=function(){if(!this.geometry||!this.material)throw new Error("geometry and material must be set before calling generate()");var t=this.particles,i=this.count;for(this.dispose(),this.mesh=new e.InstancedMesh(this.geometry,this.material,i),this.mesh.frustumCulled=!1,this.appendedParticles=Math.min(this.appendedParticles,i);t.length<i;)t.push(this.createParticle());t.splice(i).forEach(function(t){return t.dispose()}),this.add(this.mesh)},i.prototype.dispose=function(t){void 0===t&&(t=!1),this.mesh&&(this.remove(this.mesh),this.mesh=void 0),t&&this.particles.splice(0).forEach(function(t){return t.dispose()})},i.prototype.update=function(){if(this.mesh){var t=this.mesh;this.particles.forEach(function(e,i){e.update()&&(t.setMatrixAt(i,e.matrix),t.instanceMatrix.needsUpdate=!0)})}},i.prototype.appendParticle=function(t){var e=void 0===t?{}:t,i=e.prepare,r=void 0===i?void 0:i,n=e.complete,o=void 0===n?void 0:n,s=e.transition,c=void 0===s?this.transition.append:s;this.prepareParticle(a.Append,r).append(c,o)},i.prototype.removeParticle=function(t){var e=void 0===t?{}:t,i=e.prepare,r=void 0===i?void 0:i,n=e.complete,o=void 0===n?void 0:n,s=e.transition,c=void 0===s?this.transition.remove:s;this.prepareParticle(a.Remove,r).append(c,o)},i.prototype.appendParticles=function(t){void 0===t&&(t={});var e=t.amount,i=void 0===e?1/0:e,r=o(t,["amount"]);i=Math.min(i,this.count-this.appendedParticles);for(var n=0;n<i;n++)this.appendParticle(r)},i.prototype.removeParticles=function(t){void 0===t&&(t={});var e=t.amount,i=void 0===e?1/0:e,r=o(t,["amount"]);i=Math.min(i,this.appendedParticles);for(var n=0;n<i;n++)this.removeParticle(r)},function(t,e,i,r){var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);o>3&&a&&Object.defineProperty(e,i,a)}([s],i.prototype,"normalMaterial",null),i}(e.Object3D);t.Particle=r,t.ParticleSource=c,t.Transition=i,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.umd.js.map
