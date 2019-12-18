'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var three = require('three');
var GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader');
var BufferGeometryUtils = require('three/examples/jsm/utils/BufferGeometryUtils');
var cannon = require('cannon');

var Transition = /** @class */ (function () {
    function Transition() {
        this.position = new three.Vector3();
        this.quaternion = new three.Quaternion();
        this.scale = new three.Vector3();
    }
    Transition.compose = function () {
        var executors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            executors[_i] = arguments[_i];
        }
        return function (transition, complete) {
            var animationsToComplete = executors.length;
            var animations = executors.map(function (executor) { return executor(transition, function () {
                --animationsToComplete || complete();
            }); });
            return {
                pause: function () { return animations.forEach(function (animation) {
                    animation && animation.pause();
                }); }
            };
        };
    };
    Transition.prototype.start = function (executor, complete) {
        var _this = this;
        this.stop();
        this.animation = executor(this, function () {
            complete();
            _this.animation = undefined;
        });
    };
    Transition.prototype.stop = function () {
        if (this.animation && !this.animation.pause)
            console.log(this.animation);
        this.animation && this.animation.pause();
    };
    Transition.prototype.dispose = function () {
        this.animation && this.animation.pause();
        this.animation = undefined;
    };
    Transition.show = function (transition, complete) {
        transition.scale.set(1, 1, 1);
        complete();
    };
    Transition.hide = function (transition, complete) {
        transition.scale.set(0, 0, 0);
        complete();
    };
    return Transition;
}());

var Particle = /** @class */ (function () {
    function Particle() {
        this.position = new three.Vector3();
        this.quaternion = new three.Quaternion();
        this.scale = new three.Vector3(1, 1, 1);
        this.matrix = new three.Matrix4();
        this.transition = new Transition();
        this.appended = false;
        this.removed = false;
    }
    Particle.prototype.append = function (transition, complete) {
        var _this = this;
        this.appended = true;
        this.transition.start(transition || Transition.show, function () {
            complete && complete(_this);
        });
    };
    Particle.prototype.remove = function (transition, complete) {
        var _this = this;
        this.transition.start(transition || Transition.hide, function () {
            _this.removed = true;
            complete && complete(_this);
        });
    };
    Particle.prototype.update = function () {
        if (!this.appended)
            return false;
        this.matrix.compose(this.position.clone().add(this.transition.position), this.quaternion.clone().multiply(this.transition.quaternion), this.scale.clone().multiply(this.transition.scale));
        if (this.removed) {
            this.appended = false;
            this.removed = false;
        }
        return true;
    };
    Particle.prototype.dispose = function () {
        this.transition.dispose();
    };
    return Particle;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function lazy(target, property, descriptor) {
    var get = descriptor.get;
    descriptor.get = function () { return Object.defineProperty(target, property, {
        value: get.call(target)
    })[property]; };
}

function isMesh(object) {
    return object.isMesh;
}
function mergeGLTF(gltf) {
    var geometries = [];
    var materials = [];
    gltf.scene.traverse(function (mesh) {
        if (!isMesh(mesh))
            return;
        mesh.updateMatrixWorld(true);
        mesh.geometry.applyMatrix(mesh.matrixWorld);
        geometries.push(mesh.geometry);
        materials.push(mesh.material);
    });
    if (!geometries.length)
        throw new Error('Could not find any geometry in GLTF scene');
    return {
        geometry: geometries.length === 1
            ? geometries[0]
            : BufferGeometryUtils.BufferGeometryUtils.mergeBufferGeometries(geometries, true),
        material: materials.length === 1
            ? materials[0]
            : materials
    };
}

var ParticleSourceMutation;
(function (ParticleSourceMutation) {
    ParticleSourceMutation[ParticleSourceMutation["Append"] = 1] = "Append";
    ParticleSourceMutation[ParticleSourceMutation["Remove"] = -1] = "Remove";
})(ParticleSourceMutation || (ParticleSourceMutation = {}));
var ParticleSource = /** @class */ (function (_super) {
    __extends(ParticleSource, _super);
    function ParticleSource(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.geometry, geometry = _c === void 0 ? undefined : _c, _d = _b.material, material = _d === void 0 ? undefined : _d, _e = _b.count, count = _e === void 0 ? 0 : _e, _f = _b.color, color = _f === void 0 ? 0xffffff : _f, _g = _b.autoScale, autoScale = _g === void 0 ? undefined : _g, _h = _b.transition, transition = _h === void 0 ? {} : _h;
        var _this = _super.call(this) || this;
        _this._usesNormalMaterial = false;
        _this.particles = [];
        _this.appendedParticles = 0;
        _this.transition = transition;
        _this.autoScale = autoScale;
        _this.geometry = geometry;
        _this.material = material;
        _this.color = color;
        _this.count = count;
        return _this;
    }
    Object.defineProperty(ParticleSource.prototype, "normalMaterial", {
        get: function () {
            return new three.MeshNormalMaterial({
                morphTargets: true,
                skinning: true
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSource.prototype, "generated", {
        get: function () {
            return !!this.mesh;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSource.prototype, "geometry", {
        get: function () {
            return this._geometry;
        },
        set: function (v) {
            this._geometry = v;
            this.updateGeometry();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSource.prototype, "material", {
        get: function () {
            return this._material;
        },
        set: function (v) {
            this._material = v;
            this.updateMaterial();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSource.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            this._color = v;
            if (!this.material)
                return;
            if (Array.isArray(this.material)) {
                this.material.forEach(function (material) { return material.color.set(v); });
            }
            else {
                this.material.color.set(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSource.prototype, "usesNormalMaterial", {
        get: function () {
            return this._usesNormalMaterial;
        },
        set: function (v) {
            this._usesNormalMaterial = v;
            if (!this.mesh || (!v && !this.material))
                return;
            this.mesh.material = v ? this.normalMaterial : this.material;
        },
        enumerable: true,
        configurable: true
    });
    ParticleSource.prototype.updateGeometry = function () {
        if (!this.geometry)
            return;
        if (this.autoScale !== undefined) {
            this.geometry.boundingBox || this.geometry.computeBoundingBox();
            var size = this.geometry.boundingBox.getSize(new three.Vector3());
            var scale = void 0;
            if (size.x > size.y && size.x < size.z ||
                size.x < size.y && size.x > size.z) {
                scale = size.x;
                console.log('x');
            }
            else if (size.y > size.x && size.y < size.z ||
                size.y < size.x && size.y > size.z) {
                scale = size.y;
                console.log('y');
            }
            else {
                scale = size.z;
                console.log('z');
            }
            scale = this.autoScale / scale;
            this.geometry.scale(scale, scale, scale);
        }
        if (this.mesh) {
            this.mesh.geometry = this.geometry;
        }
    };
    ParticleSource.prototype.updateMaterial = function () {
        var _this = this;
        if (!this.mesh || !this.material)
            return;
        if (Array.isArray(this.material)) {
            this.material.forEach(function (material) { return material.color.set(_this.color); });
        }
        else {
            this.material.color.set(this.color);
        }
        if (!this.usesNormalMaterial)
            this.mesh.material = this.material;
    };
    ParticleSource.prototype.createParticle = function () {
        return new Particle();
    };
    ParticleSource.prototype.prepareParticle = function (mutation, prepare) {
        if (!this.mesh)
            throw new Error('The mesh and particles have not been generated, ' +
                'call generate() before calling appendParticle() or removeParticle()');
        var particle;
        switch (mutation) {
            case ParticleSourceMutation.Append:
                if (this.appendedParticles >= this.mesh.count)
                    throw new Error("All " + this.mesh.count + " particles have already been appended, " +
                        'increase count and call generate() to append more particles.');
                particle = this.particles[this.appendedParticles++];
                break;
            case ParticleSourceMutation.Remove:
                if (this.appendedParticles <= 0)
                    throw new Error("All " + this.mesh.count + " particles have already been removed, " +
                        'you cannot remove more particles.');
                particle = this.particles[--this.appendedParticles];
                break;
        }
        prepare && prepare(particle);
        return particle;
    };
    ParticleSource.prototype.useGLTF = function (gltf) {
        var _a = mergeGLTF(gltf), geometry = _a.geometry, material = _a.material;
        this.geometry = geometry;
        this.material = material;
    };
    ParticleSource.prototype.loadGLTF = function (url, complete) {
        var _this = this;
        new GLTFLoader.GLTFLoader().load(url, function (gltf) {
            _this.useGLTF(gltf);
            complete && complete(gltf);
        });
    };
    ParticleSource.prototype.generate = function () {
        if (!this.geometry || !this.material)
            throw new Error('geometry and material must be set before calling generate()');
        var _a = this, particles = _a.particles, count = _a.count;
        this.disposeMesh();
        this.mesh = new three.InstancedMesh(this.geometry, this.material, count);
        this.mesh.frustumCulled = false;
        this.appendedParticles = Math.min(this.appendedParticles, count);
        while (particles.length < count)
            particles.push(this.createParticle());
        this.disposeParticles(count);
        this.add(this.mesh);
    };
    ParticleSource.prototype.disposeMesh = function () {
        if (!this.mesh)
            return;
        this.remove(this.mesh);
        this.mesh = undefined;
    };
    ParticleSource.prototype.disposeParticles = function (index) {
        if (index === void 0) { index = 0; }
        this.particles.splice(index).forEach(function (particle) { return particle.dispose(); });
    };
    ParticleSource.prototype.disposeGeometry = function () {
        if (!this.geometry)
            return;
        this.geometry.dispose();
        this.geometry = undefined;
    };
    ParticleSource.prototype.disposeMaterial = function () {
        if (!this.material)
            return;
        Array.isArray(this.material)
            ? this.material.forEach(function (material) { return material.dispose(); })
            : this.material.dispose();
        this.material = undefined;
    };
    ParticleSource.prototype.update = function () {
        if (!this.mesh)
            return;
        var mesh = this.mesh;
        this.particles.forEach(function (particle, index) {
            if (!particle.update())
                return;
            mesh.setMatrixAt(index, particle.matrix);
            mesh.instanceMatrix.needsUpdate = true;
        });
    };
    ParticleSource.prototype.appendParticle = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.prepare, prepare = _c === void 0 ? undefined : _c, _d = _b.complete, complete = _d === void 0 ? undefined : _d, _e = _b.transition, transition = _e === void 0 ? this.transition.append : _e;
        this
            .prepareParticle(ParticleSourceMutation.Append, prepare)
            .append(transition, complete);
    };
    ParticleSource.prototype.removeParticle = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.prepare, prepare = _c === void 0 ? undefined : _c, _d = _b.complete, complete = _d === void 0 ? undefined : _d, _e = _b.transition, transition = _e === void 0 ? this.transition.remove : _e;
        this
            .prepareParticle(ParticleSourceMutation.Remove, prepare)
            .remove(transition, complete);
    };
    ParticleSource.prototype.appendParticles = function (_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.amount, amount = _b === void 0 ? Infinity : _b, _c = _a.complete, complete = _c === void 0 ? undefined : _c, _d = _a.completeAll, completeAll = _d === void 0 ? undefined : _d, executors = __rest(_a, ["amount", "complete", "completeAll"]);
        var particles = [];
        amount = Math.min(amount, this.count - this.appendedParticles);
        for (var i = 0; i < amount; i++)
            this.appendParticle(__assign({}, executors, { complete: function (particle) {
                    particles.push(particle);
                    complete && complete(particle);
                    particles.length === amount && completeAll && completeAll(particles);
                } }));
    };
    ParticleSource.prototype.removeParticles = function (_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.amount, amount = _b === void 0 ? Infinity : _b, _c = _a.complete, complete = _c === void 0 ? undefined : _c, _d = _a.completeAll, completeAll = _d === void 0 ? undefined : _d, executors = __rest(_a, ["amount", "complete", "completeAll"]);
        var particles = [];
        amount = Math.min(amount, this.appendedParticles);
        for (var i = 0; i < amount; i++)
            this.removeParticle(__assign({}, executors, { complete: function (particle) {
                    particles.push(particle);
                    complete && complete(particle);
                    particles.length === amount && completeAll && completeAll(particles);
                } }));
    };
    __decorate([
        lazy
    ], ParticleSource.prototype, "normalMaterial", null);
    return ParticleSource;
}(three.Object3D));

var Body = /** @class */ (function (_super) {
    __extends(Body, _super);
    function Body() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Body.prototype.removeShape = function (shape) {
        var index = this.shapes.indexOf(shape);
        if (index !== -1) {
            this.shapes.splice(index, 1);
            this.shapeOffsets.splice(index, 1);
            this.shapeOrientations.splice(index, 1);
            this.updateMassProperties();
            this.updateBoundingRadius();
            this.aabbNeedsUpdate = true;
        }
        return this;
    };
    Body.prototype.clearShapes = function (update) {
        if (update === void 0) { update = true; }
        if (this.shapes.length) {
            this.shapes.splice(0);
            this.shapeOffsets.splice(0);
            this.shapeOrientations.splice(0);
            if (update) {
                this.updateMassProperties();
                this.updateBoundingRadius();
                this.aabbNeedsUpdate = true;
            }
        }
        return this;
    };
    return Body;
}(cannon.Body));

var PhysicalParticle = /** @class */ (function (_super) {
    __extends(PhysicalParticle, _super);
    function PhysicalParticle() {
        var _this = _super.call(this) || this;
        _this.freezeDelay = Infinity;
        _this.freezeFactor = new cannon.Vec3(0.9, 1, 0.9);
        _this.freezeThreshold = 0.001;
        _this.freezing = false;
        _this.frozen = false;
        _this.body = new Body(_this.bodyParameters);
        return _this;
    }
    Object.defineProperty(PhysicalParticle.prototype, "bodyParameters", {
        get: function () {
            return {
                mass: 1,
                type: Body.DYNAMIC
            };
        },
        enumerable: true,
        configurable: true
    });
    PhysicalParticle.prototype.freeze = function () {
        var velocity = this.body.velocity;
        if (velocity.almostZero(this.freezeThreshold)) {
            this.frozen = true;
            this.freezing = false;
            this.body.type = Body.STATIC;
            return;
        }
        var freezeFactor = this.freezeFactor;
        velocity.x *= freezeFactor.x;
        velocity.y *= freezeFactor.y;
        velocity.z *= freezeFactor.z;
    };
    PhysicalParticle.prototype.requestFreeze = function () {
        var _this = this;
        if (this.freezeDelay === Infinity)
            return;
        this.cancelFreeze();
        this.freezeTimeout = window.setTimeout(function () {
            _this.freezing = true;
        }, this.freezeDelay);
    };
    PhysicalParticle.prototype.cancelFreeze = function () {
        if (this.freezeTimeout === undefined)
            return;
        clearTimeout(this.freezeTimeout);
        this.freezeTimeout = undefined;
    };
    PhysicalParticle.prototype.append = function (transition, complete) {
        var _this = this;
        this.freezing = this.frozen = false;
        this.body.type = Body.DYNAMIC;
        _super.prototype.append.call(this, transition, function (particle) {
            _this.requestFreeze();
            complete && complete(particle);
        });
    };
    PhysicalParticle.prototype.remove = function (transition, complete) {
        this.cancelFreeze();
        _super.prototype.remove.call(this, transition, complete);
    };
    PhysicalParticle.prototype.update = function () {
        if (!this.appended)
            return false;
        this.freezing && this.freeze();
        this.frozen || this.synchronizeBody();
        return _super.prototype.update.call(this);
    };
    PhysicalParticle.prototype.clearBodyShape = function () {
        this.body.clearShapes();
    };
    PhysicalParticle.prototype.setBodyShape = function (shape) {
        this.body.clearShapes(false);
        this.body.addShape(shape);
    };
    PhysicalParticle.prototype.synchronizeBody = function () {
        this.position.copy(this.body.position);
        this.quaternion.copy(this.body.quaternion);
    };
    PhysicalParticle.prototype.resetBodyPosition = function () {
        var _a = this.position, x = _a.x, y = _a.y, z = _a.z;
        this.body.position.set(x, y, z);
    };
    PhysicalParticle.prototype.resetBodyQuaternion = function () {
        var _a = this.quaternion, x = _a.x, y = _a.y, z = _a.z, w = _a.w;
        this.body.quaternion.set(x, y, z, w);
    };
    PhysicalParticle.prototype.resetBodyVelocity = function () {
        this.body.velocity.set(0, 0, 0);
    };
    PhysicalParticle.prototype.resetBodyAngularVelocity = function () {
        this.body.angularVelocity.set(0, 0, 0);
    };
    return PhysicalParticle;
}(Particle));

var PhysicalParticleSource = /** @class */ (function (_super) {
    __extends(PhysicalParticleSource, _super);
    function PhysicalParticleSource(_a) {
        var world = _a.world, parameters = __rest(_a, ["world"]);
        var _this = _super.call(this, parameters) || this;
        _this.world = world;
        return _this;
    }
    PhysicalParticleSource.prototype.updateGeometry = function () {
        _super.prototype.updateGeometry.call(this);
        if (this.geometry) {
            var shape_1 = this.shape = this.createShape();
            this.particles.forEach(function (particle) { return particle.setBodyShape(shape_1); });
        }
        else {
            this.particles.forEach(function (particle) { return particle.clearBodyShape(); });
        }
    };
    PhysicalParticleSource.prototype.createShape = function () {
        this.geometry.boundingBox || this.geometry.computeBoundingBox();
        var box = this.geometry.boundingBox;
        return new cannon.Box(new cannon.Vec3((box.max.x - box.min.x) / 2, (box.max.y - box.min.y) / 2, (box.max.z - box.min.z) / 2));
    };
    PhysicalParticleSource.prototype.createParticle = function () {
        var particle = new PhysicalParticle();
        this.shape && particle.setBodyShape(this.shape);
        return particle;
    };
    PhysicalParticleSource.prototype.appendParticle = function (_a) {
        var _this = this;
        if (_a === void 0) { _a = {}; }
        var _b = _a.prepare, prepare = _b === void 0 ? undefined : _b, executors = __rest(_a, ["prepare"]);
        _super.prototype.appendParticle.call(this, __assign({}, executors, { prepare: function (particle) {
                particle.resetBodyVelocity();
                particle.resetBodyAngularVelocity();
                prepare && prepare(particle);
                particle.resetBodyPosition();
                particle.resetBodyQuaternion();
                _this.world.addBody(particle.body);
            } }));
    };
    PhysicalParticleSource.prototype.removeParticle = function (_a) {
        var _this = this;
        if (_a === void 0) { _a = {}; }
        var _b = _a.complete, complete = _b === void 0 ? undefined : _b, executors = __rest(_a, ["complete"]);
        _super.prototype.removeParticle.call(this, __assign({}, executors, { complete: function (particle) {
                _this.world.remove(particle.body);
                complete && complete(particle);
            } }));
    };
    return PhysicalParticleSource;
}(ParticleSource));

exports.Particle = Particle;
exports.ParticleSource = ParticleSource;
exports.PhysicalParticle = PhysicalParticle;
exports.PhysicalParticleSource = PhysicalParticleSource;
exports.Transition = Transition;
//# sourceMappingURL=index.cjs.js.map
