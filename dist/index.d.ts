/// <reference types="cannon" />
declare module "body" {
    import { Body as BaseBody, Shape } from 'cannon';
    export class Body extends BaseBody {
        removeShape(shape: Shape): this;
        clearShapes(update?: boolean): this;
    }
}
declare module "transition" {
    import { Vector3, Quaternion } from 'three';
    import { ParticleState } from "particle";
    export interface Pausable {
        pause(): void;
    }
    export type TransitionExecutor = (transition: ParticleState, complete: () => void) => Pausable | void | undefined;
    export class Transition implements ParticleState {
        private animation?;
        readonly position: Vector3;
        readonly quaternion: Quaternion;
        readonly scale: Vector3;
        static show: TransitionExecutor;
        static hide: TransitionExecutor;
        static compose(...executors: TransitionExecutor[]): TransitionExecutor;
        start(executor: TransitionExecutor, complete: () => void): void;
        stop(): void;
        dispose(): void;
    }
}
declare module "particle" {
    import { Vector3, Quaternion, Matrix4 } from 'three';
    import { Transition, TransitionExecutor } from "transition";
    export interface ParticleState {
        position: Vector3;
        quaternion: Quaternion;
        scale: Vector3;
    }
    export class Particle implements ParticleState {
        readonly position: Vector3;
        readonly quaternion: Quaternion;
        readonly scale: Vector3;
        readonly matrix: Matrix4;
        readonly transition: Transition;
        appended: boolean;
        removed: boolean;
        readonly needsUpdate: boolean;
        append(transition?: TransitionExecutor, complete?: (particle: this) => void): void;
        remove(transition?: TransitionExecutor, complete?: (particle: this) => void): void;
        update(): boolean;
        dispose(): void;
    }
}
declare module "utils" {
    import { Object3D, Mesh, Line, Points, InstancedMesh, Material, Geometry, BufferGeometry, InstancedBufferGeometry, Color } from 'three';
    import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
    export type ColoredMaterial = Material & {
        color: Color;
    };
    export function isMesh(object: Object3D): object is Mesh;
    export function isLine(object: Object3D): object is Line;
    export function isPoints(object: Object3D): object is Points;
    export function isInstancedMesh(object: Object3D): object is InstancedMesh;
    export function isBufferGeometry(geometry: Geometry | BufferGeometry): geometry is BufferGeometry;
    export function isInstancedBufferGeometry(geometry: Geometry | BufferGeometry | InstancedBufferGeometry): geometry is InstancedBufferGeometry;
    export function mergeGLTF(gltf: GLTF): {
        geometry: BufferGeometry;
        material: ColoredMaterial | ColoredMaterial[];
    };
}
declare module "particle-source" {
    import { Color, Object3D, Geometry, BufferGeometry } from 'three';
    import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
    import { Particle } from "particle";
    import { TransitionExecutor } from "transition";
    import { ColoredMaterial } from "utils";
    enum ParticleSourceMutation {
        Append = 1,
        Remove = -1
    }
    interface ParticleSourceTransitionExecutors {
        append?: TransitionExecutor;
        remove?: TransitionExecutor;
    }
    export interface ParticleSourceMutationExecutors<P extends Particle = Particle> {
        prepare?: (particle: P) => void;
        complete?: (particle: P) => void;
        transition?: TransitionExecutor;
    }
    export interface ParticleSourceParameters {
        geometry?: Geometry | BufferGeometry;
        material?: ColoredMaterial | ColoredMaterial[];
        count?: number;
        color?: Color | number;
        autoScale?: number;
        autoScaleAxis?: 'x' | 'y' | 'z' | 'average';
        transition?: ParticleSourceTransitionExecutors;
    }
    export class ParticleSource<P extends Particle = Particle> extends Object3D {
        private mesh?;
        private _geometry?;
        private _material?;
        private _color;
        protected autoScale?: number;
        protected autoScaleAxis: 'x' | 'y' | 'z' | 'average';
        particles: P[];
        appendedParticles: number;
        transition: ParticleSourceTransitionExecutors;
        count: number;
        constructor({ geometry, material, count, color, autoScale, autoScaleAxis, transition }?: ParticleSourceParameters);
        readonly generated: boolean;
        geometry: Geometry | BufferGeometry | undefined;
        material: ColoredMaterial | ColoredMaterial[] | undefined;
        color: Color | number;
        protected updateGeometry(): void;
        protected updateMaterial(): void;
        protected createParticle(): P;
        protected prepareParticle(mutation: ParticleSourceMutation, prepare?: (particle: P) => void): P;
        useGLTF(gltf: GLTF): void;
        loadGLTF(url: string, complete?: (gltf: GLTF) => void): void;
        generate(): void;
        disposeMesh(): void;
        disposeParticles(index?: number): void;
        disposeGeometry(): void;
        disposeMaterial(): void;
        update(): void;
        appendParticle({ prepare, complete, transition }?: ParticleSourceMutationExecutors<P>): void;
        removeParticle({ prepare, complete, transition }?: ParticleSourceMutationExecutors<P>): void;
        appendParticles({ amount, complete, completeAll, ...executors }?: ParticleSourceMutationExecutors<P> & {
            amount?: number;
            completeAll?: (particles: P[]) => void;
        }): void;
        removeParticles({ amount, complete, completeAll, ...executors }?: ParticleSourceMutationExecutors<P> & {
            amount?: number;
            completeAll?: (particles: P[]) => void;
        }): void;
    }
}
declare module "physical-particle" {
    import { Shape, Vec3 } from 'cannon';
    import { Particle } from "particle";
    import { Body } from "body";
    import { TransitionExecutor } from "transition";
    export class PhysicalParticle extends Particle {
        protected readonly freezeDelay: number;
        protected readonly freezeVelocityFactor: Vec3;
        protected readonly freezeAngularVelocityFactor: Vec3;
        protected readonly freezeThreshold: number;
        protected freezeTimeout?: number;
        protected freezing: boolean;
        protected frozen: boolean;
        readonly body: Body;
        constructor();
        protected readonly bodyParameters: {
            [parameter: string]: unknown;
        };
        protected freeze(): void;
        protected requestFreeze(): void;
        protected cancelFreeze(): void;
        append(transition?: TransitionExecutor, complete?: (particle: this) => void): void;
        remove(transition?: TransitionExecutor, complete?: (particle: this) => void): void;
        update(): boolean;
        clearBodyShape(): void;
        setBodyShape(shape: Shape): void;
        synchronizeBody(): void;
        resetBodyPosition(): void;
        resetBodyQuaternion(): void;
        resetBodyVelocity(): void;
        resetBodyAngularVelocity(): void;
    }
}
declare module "physical-particle-source" {
    import { World, Shape } from 'cannon';
    import { PhysicalParticle } from "physical-particle";
    import { ParticleSource, ParticleSourceParameters, ParticleSourceMutationExecutors } from "particle-source";
    export interface PhysicalParticleSourceParameters extends ParticleSourceParameters {
        world: World;
    }
    export class PhysicalParticleSource extends ParticleSource<PhysicalParticle> {
        readonly world: World;
        protected shape?: Shape;
        constructor({ world, ...parameters }: PhysicalParticleSourceParameters);
        protected updateGeometry(): void;
        protected createShape(): Shape;
        protected createParticle(): PhysicalParticle;
        appendParticle({ prepare, ...executors }?: ParticleSourceMutationExecutors<PhysicalParticle>): void;
        removeParticle({ complete, ...executors }?: ParticleSourceMutationExecutors<PhysicalParticle>): void;
    }
}
declare module "scene" {
    import { Scene as BaseScene, Material, Mesh, WebGLRenderer, Camera, Geometry, BufferGeometry, Group, Line, Points, InstancedMesh } from 'three';
    type RenderCallback = (renderer: WebGLRenderer, scene: BaseScene, camera: Camera, geometry: Geometry | BufferGeometry, material: Material, group: Group) => void;
    export class Scene extends BaseScene {
        private _onBeforeRender;
        private _onAfterRender;
        private _overrideMaterial?;
        private objectMaterials?;
        private drawableObjects?;
        private instancedOverrideMaterials;
        drawableObjectsNeedUpdate: boolean;
        handleInstancedOverrideMaterials: boolean;
        onBeforeRender: RenderCallback;
        onAfterRender: RenderCallback;
        private setOverrideMaterial;
        private unsetOverrideMaterial;
        traverseDrawableObjects(callback: (object: Mesh | Line | Points | InstancedMesh) => void): void;
        dispose(): void;
    }
}
declare module "index" {
    export { Particle } from "particle";
    export { ParticleSource } from "particle-source";
    export { PhysicalParticle } from "physical-particle";
    export { PhysicalParticleSource } from "physical-particle-source";
    export { Transition } from "transition";
    export { Scene } from "scene";
}
//# sourceMappingURL=index.d.ts.map