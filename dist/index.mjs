import { Vector3, Quaternion, Matrix4, MeshNormalMaterial, InstancedMesh, Object3D } from 'three';

var Transition = /** @class */ (function () {
    function Transition() {
        this.position = new Vector3();
        this.quaternion = new Quaternion();
        this.scale = new Vector3();
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
        this.position = new Vector3();
        this.quaternion = new Quaternion();
        this.scale = new Vector3(1, 1, 1);
        this.matrix = new Matrix4();
        this.transition = new Transition();
        this.appended = false;
    }
    Particle.prototype.append = function (transition, complete) {
        this.appended = true;
        this.transition.start(transition || Transition.show, function () {
            complete && complete();
        });
    };
    Particle.prototype.remove = function (transition, complete) {
        var _this = this;
        this.transition.start(transition || Transition.hide, function () {
            _this.appended = false;
            complete && complete();
        });
    };
    Particle.prototype.update = function () {
        if (!this.appended)
            return false;
        this.matrix.compose(this.position.clone().add(this.transition.position), this.quaternion.clone().multiply(this.transition.quaternion), this.scale.clone().multiply(this.transition.scale));
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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var lazy = function (target, property, descriptor) {
    var get = descriptor.get;
    descriptor.get = function () { return Object.defineProperty(target, property, {
        value: get.call(target)
    })[property]; };
};

var ParticleSourceMutation;
(function (ParticleSourceMutation) {
    ParticleSourceMutation[ParticleSourceMutation["Append"] = 1] = "Append";
    ParticleSourceMutation[ParticleSourceMutation["Remove"] = -1] = "Remove";
})(ParticleSourceMutation || (ParticleSourceMutation = {}));
var ParticleSource = /** @class */ (function (_super) {
    __extends(ParticleSource, _super);
    function ParticleSource(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.geometry, geometry = _c === void 0 ? undefined : _c, _d = _b.material, material = _d === void 0 ? undefined : _d, _e = _b.count, count = _e === void 0 ? 0 : _e, _f = _b.color, color = _f === void 0 ? 0xffffff : _f, _g = _b.transition, transition = _g === void 0 ? {} : _g;
        var _this = _super.call(this) || this;
        _this.particles = [];
        _this._usesNormalMaterial = false;
        _this.appendedParticles = 0;
        _this.transition = transition;
        _this.geometry = geometry;
        _this.material = material;
        _this.color = color;
        _this.count = count;
        return _this;
    }
    Object.defineProperty(ParticleSource.prototype, "normalMaterial", {
        get: function () {
            return new MeshNormalMaterial({
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
            if (!this.mesh || !v)
                return;
            this.mesh.geometry = v;
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
            if (!this.mesh || !v)
                return;
            v.color.set(this.color);
            if (!this.usesNormalMaterial)
                this.mesh.material = v;
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
            this.material && this.material.color.set(v);
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
    ParticleSource.prototype.generate = function () {
        if (!this.geometry || !this.material)
            throw new Error('geometry and material must be set before calling generate()');
        var _a = this, particles = _a.particles, count = _a.count;
        this.dispose();
        this.mesh = new InstancedMesh(this.geometry, this.material, count);
        this.mesh.frustumCulled = false;
        this.appendedParticles = Math.min(this.appendedParticles, count);
        while (particles.length < count)
            particles.push(this.createParticle());
        particles.splice(count).forEach(function (particle) { return particle.dispose(); });
        this.add(this.mesh);
    };
    ParticleSource.prototype.dispose = function (all) {
        if (all === void 0) { all = false; }
        if (this.mesh) {
            this.remove(this.mesh);
            this.mesh = undefined;
        }
        if (all) {
            this.particles.splice(0).forEach(function (particle) { return particle.dispose(); });
        }
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
            .append(transition, complete);
    };
    __decorate([
        lazy
    ], ParticleSource.prototype, "normalMaterial", null);
    return ParticleSource;
}(Object3D));

export { Particle, ParticleSource, Transition };
//# sourceMappingURL=index.mjs.map
