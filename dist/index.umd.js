!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("three"),require("three/examples/jsm/loaders/GLTFLoader"),require("three/examples/jsm/utils/BufferGeometryUtils"),require("cannon")):"function"==typeof define&&define.amd?define(["exports","three","three/examples/jsm/loaders/GLTFLoader","three/examples/jsm/utils/BufferGeometryUtils","cannon"],t):t((e=e||self).THREEInstancedParticles={},e.THREE,e.THREE.GLTFLoader,e.THREE.BufferGeometryUtils,e.CANNON)}(this,function(e,t,i,r,o){"use strict";var n=function(){function e(){this.position=new t.Vector3,this.quaternion=new t.Quaternion,this.scale=new t.Vector3}return e.compose=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return function(t,i){var r=e.length,o=e.map(function(e){return e(t,function(){--r||i()})});return{pause:function(){return o.forEach(function(e){e&&e.pause()})}}}},e.prototype.start=function(e,t){var i=this;this.stop(),this.animation=e(this,function(){t(),i.animation=void 0})},e.prototype.stop=function(){this.animation&&!this.animation.pause&&console.log(this.animation),this.animation&&this.animation.pause()},e.prototype.dispose=function(){this.animation&&this.animation.pause(),this.animation=void 0},e.show=function(e,t){e.scale.set(1,1,1),t()},e.hide=function(e,t){e.scale.set(0,0,0),t()},e}(),a=function(){function e(){this.position=new t.Vector3,this.quaternion=new t.Quaternion,this.scale=new t.Vector3(1,1,1),this.matrix=new t.Matrix4,this.transition=new n,this.appended=!1,this.removed=!1}return Object.defineProperty(e.prototype,"needsUpdate",{get:function(){return this.appended||this.removed},enumerable:!0,configurable:!0}),e.prototype.append=function(e,t){var i=this;this.appended=!0,this.transition.start(e||n.show,function(){t&&t(i)})},e.prototype.remove=function(e,t){var i=this;this.transition.start(e||n.hide,function(){i.removed=!0,i.appended=!1,t&&t(i)})},e.prototype.update=function(){return!!this.needsUpdate&&(this.matrix.compose(this.position.clone().add(this.transition.position),this.quaternion.clone().multiply(this.transition.quaternion),this.scale.clone().multiply(this.transition.scale)),this.removed&&(this.removed=!1),!0)},e.prototype.dispose=function(){this.transition.dispose()},e}(),s=function(e,t){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(e,t)};function p(e,t){function i(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}var c,h=function(){return(h=Object.assign||function(e){for(var t,i=1,r=arguments.length;i<r;i++)for(var o in t=arguments[i])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function l(e,t){var i={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(i[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&(i[r[o]]=e[r[o]])}return i}function d(e){return e.isMesh}function u(e){return e.isInstancedMesh}!function(e){e[e.Append=1]="Append",e[e.Remove=-1]="Remove"}(c||(c={}));var f=function(e){function o(t){var i=void 0===t?{}:t,r=i.geometry,o=void 0===r?void 0:r,n=i.material,a=void 0===n?void 0:n,s=i.count,p=void 0===s?0:s,c=i.color,h=void 0===c?16777215:c,l=i.autoScale,d=void 0===l?void 0:l,u=i.autoScaleAxis,f=void 0===u?"average":u,y=i.transition,m=void 0===y?{}:y,v=e.call(this)||this;return v.particles=[],v.appendedParticles=0,v.transition=m,v.autoScale=d,v.autoScaleAxis=f,v.geometry=o,v.material=a,v.color=h,v.count=p,v}return p(o,e),Object.defineProperty(o.prototype,"generated",{get:function(){return!!this.mesh},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"geometry",{get:function(){return this._geometry},set:function(e){this._geometry=e,this.updateGeometry()},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"material",{get:function(){return this._material},set:function(e){this._material=e,this.updateMaterial()},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"color",{get:function(){return this._color},set:function(e){this._color=e,this.material&&(Array.isArray(this.material)?this.material.forEach(function(t){return t.color.set(e)}):this.material.color.set(e))},enumerable:!0,configurable:!0}),o.prototype.updateGeometry=function(){if(this.geometry){if(void 0!==this.autoScale){this.geometry.boundingBox||this.geometry.computeBoundingBox();var e=this.geometry.boundingBox.getSize(new t.Vector3),i="average"===this.autoScaleAxis?this.autoScale/(e.x+e.y+e.z)*3:this.autoScale/e[this.autoScaleAxis];this.geometry.scale(i,i,i)}this.mesh&&(this.mesh.geometry=this.geometry)}},o.prototype.updateMaterial=function(){var e=this;this.mesh&&this.material&&(Array.isArray(this.material)?this.material.forEach(function(t){return t.color.set(e.color)}):this.material.color.set(this.color),this.mesh.material=this.material)},o.prototype.createParticle=function(){return new a},o.prototype.prepareParticle=function(e,t){if(!this.mesh)throw new Error("The mesh and particles have not been generated, call generate() before calling appendParticle() or removeParticle()");var i;switch(e){case c.Append:if(this.appendedParticles>=this.mesh.count)throw new Error("All "+this.mesh.count+" particles have already been appended, increase count and call generate() to append more particles.");i=this.particles[this.appendedParticles++];break;case c.Remove:if(this.appendedParticles<=0)throw new Error("All "+this.mesh.count+" particles have already been removed, you cannot remove more particles.");i=this.particles[--this.appendedParticles]}return t&&t(i),i},o.prototype.useGLTF=function(e){var t=function(e){var t=[],i=[];if(e.scene.traverse(function(e){d(e)&&(e.updateMatrixWorld(!0),e.geometry.applyMatrix(e.matrixWorld),t.push(e.geometry),i.push(e.material))}),!t.length)throw new Error("Could not find any geometry in GLTF scene");return{geometry:1===t.length?t[0]:r.BufferGeometryUtils.mergeBufferGeometries(t,!0),material:1===i.length?i[0]:i}}(e),i=t.geometry,o=t.material;this.geometry=i,this.material=o},o.prototype.loadGLTF=function(e,t){var r=this;(new i.GLTFLoader).load(e,function(e){r.useGLTF(e),t&&t(e)})},o.prototype.generate=function(){if(!this.geometry||!this.material)throw new Error("geometry and material must be set before calling generate()");var e=this.particles,i=this.count;for(this.disposeMesh(),this.mesh=new t.InstancedMesh(this.geometry,this.material,i),this.mesh.frustumCulled=!1,this.appendedParticles=Math.min(this.appendedParticles,i);e.length<i;)e.push(this.createParticle());this.disposeParticles(i),this.add(this.mesh)},o.prototype.disposeMesh=function(){this.mesh&&(this.remove(this.mesh),this.mesh=void 0)},o.prototype.disposeParticles=function(e){void 0===e&&(e=0),this.particles.splice(e).forEach(function(e){return e.dispose()})},o.prototype.disposeGeometry=function(){this.geometry&&(this.geometry.dispose(),this.geometry=void 0)},o.prototype.disposeMaterial=function(){this.material&&(Array.isArray(this.material)?this.material.forEach(function(e){return e.dispose()}):this.material.dispose(),this.material=void 0)},o.prototype.update=function(){if(this.mesh){var e=this.mesh;this.particles.forEach(function(t,i){t.update()&&(e.setMatrixAt(i,t.matrix),e.instanceMatrix.needsUpdate=!0)})}},o.prototype.appendParticle=function(e){var t=void 0===e?{}:e,i=t.prepare,r=void 0===i?void 0:i,o=t.complete,n=void 0===o?void 0:o,a=t.transition,s=void 0===a?this.transition.append:a;this.prepareParticle(c.Append,r).append(s,n)},o.prototype.removeParticle=function(e){var t=void 0===e?{}:e,i=t.prepare,r=void 0===i?void 0:i,o=t.complete,n=void 0===o?void 0:o,a=t.transition,s=void 0===a?this.transition.remove:a;this.prepareParticle(c.Remove,r).remove(s,n)},o.prototype.appendParticles=function(e){void 0===e&&(e={});var t=e.amount,i=void 0===t?1/0:t,r=e.complete,o=void 0===r?void 0:r,n=e.completeAll,a=void 0===n?void 0:n,s=l(e,["amount","complete","completeAll"]),p=[];i=Math.min(i,this.count-this.appendedParticles);for(var c=0;c<i;c++)this.appendParticle(h({},s,{complete:function(e){p.push(e),o&&o(e),p.length===i&&a&&a(p)}}))},o.prototype.removeParticles=function(e){void 0===e&&(e={});var t=e.amount,i=void 0===t?1/0:t,r=e.complete,o=void 0===r?void 0:r,n=e.completeAll,a=void 0===n?void 0:n,s=l(e,["amount","complete","completeAll"]),p=[];i=Math.min(i,this.appendedParticles);for(var c=0;c<i;c++)this.removeParticle(h({},s,{complete:function(e){p.push(e),o&&o(e),p.length===i&&a&&a(p)}}))},o}(t.Object3D),y=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return p(t,e),t.prototype.removeShape=function(e){var t=this.shapes.indexOf(e);return-1!==t&&(this.shapes.splice(t,1),this.shapeOffsets.splice(t,1),this.shapeOrientations.splice(t,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0),this},t.prototype.clearShapes=function(e){return void 0===e&&(e=!0),this.shapes.length&&(this.shapes.splice(0),this.shapeOffsets.splice(0),this.shapeOrientations.splice(0),e&&(this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0)),this},t}(o.Body),m=function(e){function t(){var t=e.call(this)||this;return t.freezeDelay=1/0,t.freezeVelocityFactor=new o.Vec3(.9,1,.9),t.freezeAngularVelocityFactor=new o.Vec3(1,1,1),t.freezeThreshold=.001,t.freezing=!1,t.frozen=!1,t.body=new y(t.bodyParameters),t}return p(t,e),Object.defineProperty(t.prototype,"bodyParameters",{get:function(){return{mass:1,type:y.DYNAMIC}},enumerable:!0,configurable:!0}),t.prototype.freeze=function(){var e=this.body,t=e.velocity,i=e.angularVelocity;if(t.almostZero(this.freezeThreshold))return this.frozen=!0,this.freezing=!1,void(this.body.type=y.STATIC);var r=this.freezeVelocityFactor,o=this.freezeAngularVelocityFactor;t.x*=r.x,t.y*=r.y,t.z*=r.z,i.x*=o.x,i.y*=o.y,i.z*=o.z},t.prototype.requestFreeze=function(){var e=this;this.freezeDelay!==1/0&&(this.cancelFreeze(),this.freezeTimeout=window.setTimeout(function(){e.freezing=!0},this.freezeDelay))},t.prototype.cancelFreeze=function(){void 0!==this.freezeTimeout&&(clearTimeout(this.freezeTimeout),this.freezeTimeout=void 0)},t.prototype.append=function(t,i){var r=this;this.freezing=this.frozen=!1,this.body.type=y.DYNAMIC,e.prototype.append.call(this,t,function(e){r.requestFreeze(),i&&i(e)})},t.prototype.remove=function(t,i){this.cancelFreeze(),e.prototype.remove.call(this,t,i)},t.prototype.update=function(){return!!this.needsUpdate&&(this.freezing&&this.freeze(),this.frozen||this.synchronizeBody(),e.prototype.update.call(this))},t.prototype.clearBodyShape=function(){this.body.clearShapes()},t.prototype.setBodyShape=function(e){this.body.clearShapes(!1),this.body.addShape(e)},t.prototype.synchronizeBody=function(){this.position.copy(this.body.position),this.quaternion.copy(this.body.quaternion)},t.prototype.resetBodyPosition=function(){var e=this.position,t=e.x,i=e.y,r=e.z;this.body.position.set(t,i,r)},t.prototype.resetBodyQuaternion=function(){var e=this.quaternion,t=e.x,i=e.y,r=e.z,o=e.w;this.body.quaternion.set(t,i,r,o)},t.prototype.resetBodyVelocity=function(){this.body.velocity.set(0,0,0)},t.prototype.resetBodyAngularVelocity=function(){this.body.angularVelocity.set(0,0,0)},t}(a),v=function(e){function t(t){var i=t.world,r=l(t,["world"]),o=e.call(this,r)||this;return o.world=i,o}return p(t,e),t.prototype.updateGeometry=function(){if(e.prototype.updateGeometry.call(this),this.geometry){var t=this.shape=this.createShape();this.particles.forEach(function(e){return e.setBodyShape(t)})}else this.particles.forEach(function(e){return e.clearBodyShape()})},t.prototype.createShape=function(){this.geometry.boundingBox||this.geometry.computeBoundingBox();var e=this.geometry.boundingBox;return new o.Box(new o.Vec3((e.max.x-e.min.x)/2,(e.max.y-e.min.y)/2,(e.max.z-e.min.z)/2))},t.prototype.createParticle=function(){var e=new m;return this.shape&&e.setBodyShape(this.shape),e},t.prototype.appendParticle=function(t){var i=this;void 0===t&&(t={});var r=t.prepare,o=void 0===r?void 0:r,n=l(t,["prepare"]);e.prototype.appendParticle.call(this,h({},n,{prepare:function(e){e.resetBodyVelocity(),e.resetBodyAngularVelocity(),o&&o(e),e.resetBodyPosition(),e.resetBodyQuaternion(),i.world.addBody(e.body)}}))},t.prototype.removeParticle=function(t){var i=this;void 0===t&&(t={});var r=t.complete,o=void 0===r?void 0:r,n=l(t,["complete"]);e.prototype.removeParticle.call(this,h({},n,{complete:function(e){i.world.remove(e.body),o&&o(e)}}))},t}(f),b=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._onBeforeRender=t.setOverrideMaterial,t._onAfterRender=t.unsetOverrideMaterial,t.instancedOverrideMaterials={},t.drawableObjectsNeedUpdate=!1,t.handleInstancedOverrideMaterials=!0,t}return p(t,e),Object.defineProperty(t.prototype,"onBeforeRender",{get:function(){return this._onBeforeRender},set:function(e){var t=this;this._onBeforeRender=e?function(){for(var i=[],r=0;r<arguments.length;r++)i[r]=arguments[r];t.setOverrideMaterial(),e.apply(void 0,i)}:this.setOverrideMaterial},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"onAfterRender",{get:function(){return this._onAfterRender},set:function(e){var t=this;this._onAfterRender=e?function(){for(var i=[],r=0;r<arguments.length;r++)i[r]=arguments[r];t.unsetOverrideMaterial(),e.apply(void 0,i)}:this.unsetOverrideMaterial},enumerable:!0,configurable:!0}),t.prototype.setOverrideMaterial=function(){var e=this;if(this.handleInstancedOverrideMaterials){var t=this.overrideMaterial;if(t){this._overrideMaterial=t,this.overrideMaterial=null;var i=t.id,r=t.version;this.objectMaterials={},this.traverseDrawableObjects(function(o){var n=t;if(u(o)||o.geometry.isInstancedBufferGeometry){var a=e.instancedOverrideMaterials[i];a&&a.version===r?n=a.material:(n=t.clone(),a?(a.material.dispose(),a.material=n,a.version=r):a={version:r,material:n},e.instancedOverrideMaterials[i]=a)}e.objectMaterials[o.id]=o.material,o.material=n})}}},t.prototype.unsetOverrideMaterial=function(){var e=this;this.handleInstancedOverrideMaterials&&this._overrideMaterial&&(this.traverseDrawableObjects(function(t){t.material=e.objectMaterials[t.id]}),this.overrideMaterial=this._overrideMaterial,this._overrideMaterial=void 0,this.objectMaterials=void 0)},t.prototype.traverseDrawableObjects=function(e){var t=this;!this.drawableObjects||this.drawableObjectsNeedUpdate?(this.drawableObjectsNeedUpdate=!1,this.drawableObjects=[],this.traverse(function(i){(d(i)||function(e){return e.isLine}(i)||function(e){return e.isPoints}(i)||u(i))&&(i.visible&&e(i),t.drawableObjects.push(i))})):this.drawableObjects.forEach(function(t){return t.visible&&e(t)})},t.prototype.dispose=function(){for(var t in e.prototype.dispose.call(this),this.drawableObjects=void 0,this.instancedOverrideMaterials){this.instancedOverrideMaterials[t].material.dispose(),delete this.instancedOverrideMaterials[t]}},t}(t.Scene);e.Particle=a,e.ParticleSource=f,e.PhysicalParticle=m,e.PhysicalParticleSource=v,e.Scene=b,e.Transition=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=index.umd.js.map
