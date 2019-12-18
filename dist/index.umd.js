!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("three"),require("three/examples/jsm/loaders/GLTFLoader"),require("three/examples/jsm/utils/BufferGeometryUtils"),require("cannon")):"function"==typeof define&&define.amd?define(["exports","three","three/examples/jsm/loaders/GLTFLoader","three/examples/jsm/utils/BufferGeometryUtils","cannon"],t):t((e=e||self).THREEInstancedParticles={},e.THREE,e.THREE.GLTFLoader,e.THREE.BufferGeometryUtils,e.CANNON)}(this,function(e,t,o,i,r){"use strict";var n=function(){function e(){this.position=new t.Vector3,this.quaternion=new t.Quaternion,this.scale=new t.Vector3}return e.compose=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return function(t,o){var i=e.length,r=e.map(function(e){return e(t,function(){--i||o()})});return{pause:function(){return r.forEach(function(e){e&&e.pause()})}}}},e.prototype.start=function(e,t){var o=this;this.stop(),this.animation=e(this,function(){t(),o.animation=void 0})},e.prototype.stop=function(){this.animation&&!this.animation.pause&&console.log(this.animation),this.animation&&this.animation.pause()},e.prototype.dispose=function(){this.animation&&this.animation.pause(),this.animation=void 0},e.show=function(e,t){e.scale.set(1,1,1),t()},e.hide=function(e,t){e.scale.set(0,0,0),t()},e}(),a=function(){function e(){this.position=new t.Vector3,this.quaternion=new t.Quaternion,this.scale=new t.Vector3(1,1,1),this.matrix=new t.Matrix4,this.transition=new n,this.appended=!1,this.removed=!1}return Object.defineProperty(e.prototype,"needsUpdate",{get:function(){return this.appended||this.removed},enumerable:!0,configurable:!0}),e.prototype.append=function(e,t){var o=this;this.appended=!0,this.transition.start(e||n.show,function(){t&&t(o)})},e.prototype.remove=function(e,t){var o=this;this.transition.start(e||n.hide,function(){o.removed=!0,o.appended=!1,t&&t(o)})},e.prototype.update=function(){return!!this.needsUpdate&&(this.matrix.compose(this.position.clone().add(this.transition.position),this.quaternion.clone().multiply(this.transition.quaternion),this.scale.clone().multiply(this.transition.scale)),this.removed&&(this.removed=!1),!0)},e.prototype.dispose=function(){this.transition.dispose()},e}(),s=function(e,t){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])})(e,t)};function p(e,t){function o(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}var c,h=function(){return(h=Object.assign||function(e){for(var t,o=1,i=arguments.length;o<i;o++)for(var r in t=arguments[o])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)};function l(e,t){var o={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(o[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&(o[i[r]]=e[i[r]])}return o}function u(e,t,o){var i=o.get;o.get=function(){return Object.defineProperty(e,t,{value:i.call(e)})[t]}}!function(e){e[e.Append=1]="Append",e[e.Remove=-1]="Remove"}(c||(c={}));var d=function(e){function r(t){var o=void 0===t?{}:t,i=o.geometry,r=void 0===i?void 0:i,n=o.material,a=void 0===n?void 0:n,s=o.count,p=void 0===s?0:s,c=o.color,h=void 0===c?16777215:c,l=o.autoScale,u=void 0===l?void 0:l,d=o.transition,f=void 0===d?{}:d,y=e.call(this)||this;return y._usesNormalMaterial=!1,y.particles=[],y.appendedParticles=0,y.transition=f,y.autoScale=u,y.geometry=r,y.material=a,y.color=h,y.count=p,y}return p(r,e),Object.defineProperty(r.prototype,"normalMaterial",{get:function(){return new t.MeshNormalMaterial({morphTargets:!0,skinning:!0})},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"generated",{get:function(){return!!this.mesh},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"geometry",{get:function(){return this._geometry},set:function(e){this._geometry=e,this.updateGeometry()},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"material",{get:function(){return this._material},set:function(e){this._material=e,this.updateMaterial()},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"color",{get:function(){return this._color},set:function(e){this._color=e,this.material&&(Array.isArray(this.material)?this.material.forEach(function(t){return t.color.set(e)}):this.material.color.set(e))},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"usesNormalMaterial",{get:function(){return this._usesNormalMaterial},set:function(e){this._usesNormalMaterial=e,this.mesh&&(e||this.material)&&(this.mesh.material=e?this.normalMaterial:this.material)},enumerable:!0,configurable:!0}),r.prototype.updateGeometry=function(){if(this.geometry){if(void 0!==this.autoScale){this.geometry.boundingBox||this.geometry.computeBoundingBox();var e=this.geometry.boundingBox.getSize(new t.Vector3),o=this.autoScale/(e.x+e.y+e.z)*3;this.geometry.scale(o,o,o)}this.mesh&&(this.mesh.geometry=this.geometry)}},r.prototype.updateMaterial=function(){var e=this;this.mesh&&this.material&&(Array.isArray(this.material)?this.material.forEach(function(t){return t.color.set(e.color)}):this.material.color.set(this.color),this.usesNormalMaterial||(this.mesh.material=this.material))},r.prototype.createParticle=function(){return new a},r.prototype.prepareParticle=function(e,t){if(!this.mesh)throw new Error("The mesh and particles have not been generated, call generate() before calling appendParticle() or removeParticle()");var o;switch(e){case c.Append:if(this.appendedParticles>=this.mesh.count)throw new Error("All "+this.mesh.count+" particles have already been appended, increase count and call generate() to append more particles.");o=this.particles[this.appendedParticles++];break;case c.Remove:if(this.appendedParticles<=0)throw new Error("All "+this.mesh.count+" particles have already been removed, you cannot remove more particles.");o=this.particles[--this.appendedParticles]}return t&&t(o),o},r.prototype.useGLTF=function(e){var t=function(e){var t=[],o=[];if(e.scene.traverse(function(e){e.isMesh&&(e.updateMatrixWorld(!0),e.geometry.applyMatrix(e.matrixWorld),t.push(e.geometry),o.push(e.material))}),!t.length)throw new Error("Could not find any geometry in GLTF scene");return{geometry:1===t.length?t[0]:i.BufferGeometryUtils.mergeBufferGeometries(t,!0),material:1===o.length?o[0]:o}}(e),o=t.geometry,r=t.material;this.geometry=o,this.material=r},r.prototype.loadGLTF=function(e,t){var i=this;(new o.GLTFLoader).load(e,function(e){i.useGLTF(e),t&&t(e)})},r.prototype.generate=function(){if(!this.geometry||!this.material)throw new Error("geometry and material must be set before calling generate()");var e=this.particles,o=this.count;for(this.disposeMesh(),this.mesh=new t.InstancedMesh(this.geometry,this.material,o),this.mesh.frustumCulled=!1,this.appendedParticles=Math.min(this.appendedParticles,o);e.length<o;)e.push(this.createParticle());this.disposeParticles(o),this.add(this.mesh)},r.prototype.disposeMesh=function(){this.mesh&&(this.remove(this.mesh),this.mesh=void 0)},r.prototype.disposeParticles=function(e){void 0===e&&(e=0),this.particles.splice(e).forEach(function(e){return e.dispose()})},r.prototype.disposeGeometry=function(){this.geometry&&(this.geometry.dispose(),this.geometry=void 0)},r.prototype.disposeMaterial=function(){this.material&&(Array.isArray(this.material)?this.material.forEach(function(e){return e.dispose()}):this.material.dispose(),this.material=void 0)},r.prototype.update=function(){if(this.mesh){var e=this.mesh;this.particles.forEach(function(t,o){t.update()&&(e.setMatrixAt(o,t.matrix),e.instanceMatrix.needsUpdate=!0)})}},r.prototype.appendParticle=function(e){var t=void 0===e?{}:e,o=t.prepare,i=void 0===o?void 0:o,r=t.complete,n=void 0===r?void 0:r,a=t.transition,s=void 0===a?this.transition.append:a;this.prepareParticle(c.Append,i).append(s,n)},r.prototype.removeParticle=function(e){var t=void 0===e?{}:e,o=t.prepare,i=void 0===o?void 0:o,r=t.complete,n=void 0===r?void 0:r,a=t.transition,s=void 0===a?this.transition.remove:a;this.prepareParticle(c.Remove,i).remove(s,n)},r.prototype.appendParticles=function(e){void 0===e&&(e={});var t=e.amount,o=void 0===t?1/0:t,i=e.complete,r=void 0===i?void 0:i,n=e.completeAll,a=void 0===n?void 0:n,s=l(e,["amount","complete","completeAll"]),p=[];o=Math.min(o,this.count-this.appendedParticles);for(var c=0;c<o;c++)this.appendParticle(h({},s,{complete:function(e){p.push(e),r&&r(e),p.length===o&&a&&a(p)}}))},r.prototype.removeParticles=function(e){void 0===e&&(e={});var t=e.amount,o=void 0===t?1/0:t,i=e.complete,r=void 0===i?void 0:i,n=e.completeAll,a=void 0===n?void 0:n,s=l(e,["amount","complete","completeAll"]),p=[];o=Math.min(o,this.appendedParticles);for(var c=0;c<o;c++)this.removeParticle(h({},s,{complete:function(e){p.push(e),r&&r(e),p.length===o&&a&&a(p)}}))},function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);n>3&&a&&Object.defineProperty(t,o,a)}([u],r.prototype,"normalMaterial",null),r}(t.Object3D),f=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return p(t,e),t.prototype.removeShape=function(e){var t=this.shapes.indexOf(e);return-1!==t&&(this.shapes.splice(t,1),this.shapeOffsets.splice(t,1),this.shapeOrientations.splice(t,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0),this},t.prototype.clearShapes=function(e){return void 0===e&&(e=!0),this.shapes.length&&(this.shapes.splice(0),this.shapeOffsets.splice(0),this.shapeOrientations.splice(0),e&&(this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0)),this},t}(r.Body),y=function(e){function t(){var t=e.call(this)||this;return t.freezeDelay=1/0,t.freezeVelocityFactor=new r.Vec3(.9,1,.9),t.freezeAngularVelocityFactor=new r.Vec3(1,1,1),t.freezeThreshold=.001,t.freezing=!1,t.frozen=!1,t.body=new f(t.bodyParameters),t}return p(t,e),Object.defineProperty(t.prototype,"bodyParameters",{get:function(){return{mass:1,type:f.DYNAMIC}},enumerable:!0,configurable:!0}),t.prototype.freeze=function(){var e=this.body,t=e.velocity,o=e.angularVelocity;if(t.almostZero(this.freezeThreshold))return this.frozen=!0,this.freezing=!1,void(this.body.type=f.STATIC);var i=this.freezeVelocityFactor,r=this.freezeAngularVelocityFactor;t.x*=i.x,t.y*=i.y,t.z*=i.z,o.x*=r.x,o.y*=r.y,o.z*=r.z},t.prototype.requestFreeze=function(){var e=this;this.freezeDelay!==1/0&&(this.cancelFreeze(),this.freezeTimeout=window.setTimeout(function(){e.freezing=!0},this.freezeDelay))},t.prototype.cancelFreeze=function(){void 0!==this.freezeTimeout&&(clearTimeout(this.freezeTimeout),this.freezeTimeout=void 0)},t.prototype.append=function(t,o){var i=this;this.freezing=this.frozen=!1,this.body.type=f.DYNAMIC,e.prototype.append.call(this,t,function(e){i.requestFreeze(),o&&o(e)})},t.prototype.remove=function(t,o){this.cancelFreeze(),e.prototype.remove.call(this,t,o)},t.prototype.update=function(){return!!this.needsUpdate&&(this.freezing&&this.freeze(),this.frozen||this.synchronizeBody(),e.prototype.update.call(this))},t.prototype.clearBodyShape=function(){this.body.clearShapes()},t.prototype.setBodyShape=function(e){this.body.clearShapes(!1),this.body.addShape(e)},t.prototype.synchronizeBody=function(){this.position.copy(this.body.position),this.quaternion.copy(this.body.quaternion)},t.prototype.resetBodyPosition=function(){var e=this.position,t=e.x,o=e.y,i=e.z;this.body.position.set(t,o,i)},t.prototype.resetBodyQuaternion=function(){var e=this.quaternion,t=e.x,o=e.y,i=e.z,r=e.w;this.body.quaternion.set(t,o,i,r)},t.prototype.resetBodyVelocity=function(){this.body.velocity.set(0,0,0)},t.prototype.resetBodyAngularVelocity=function(){this.body.angularVelocity.set(0,0,0)},t}(a),m=function(e){function t(t){var o=t.world,i=l(t,["world"]),r=e.call(this,i)||this;return r.world=o,r}return p(t,e),t.prototype.updateGeometry=function(){if(e.prototype.updateGeometry.call(this),this.geometry){var t=this.shape=this.createShape();this.particles.forEach(function(e){return e.setBodyShape(t)})}else this.particles.forEach(function(e){return e.clearBodyShape()})},t.prototype.createShape=function(){this.geometry.boundingBox||this.geometry.computeBoundingBox();var e=this.geometry.boundingBox;return new r.Box(new r.Vec3((e.max.x-e.min.x)/2,(e.max.y-e.min.y)/2,(e.max.z-e.min.z)/2))},t.prototype.createParticle=function(){var e=new y;return this.shape&&e.setBodyShape(this.shape),e},t.prototype.appendParticle=function(t){var o=this;void 0===t&&(t={});var i=t.prepare,r=void 0===i?void 0:i,n=l(t,["prepare"]);e.prototype.appendParticle.call(this,h({},n,{prepare:function(e){e.resetBodyVelocity(),e.resetBodyAngularVelocity(),r&&r(e),e.resetBodyPosition(),e.resetBodyQuaternion(),o.world.addBody(e.body)}}))},t.prototype.removeParticle=function(t){var o=this;void 0===t&&(t={});var i=t.complete,r=void 0===i?void 0:i,n=l(t,["complete"]);e.prototype.removeParticle.call(this,h({},n,{complete:function(e){o.world.remove(e.body),r&&r(e)}}))},t}(d);e.Particle=a,e.ParticleSource=d,e.PhysicalParticle=y,e.PhysicalParticleSource=m,e.Transition=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=index.umd.js.map
