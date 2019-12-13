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
        append(transition?: TransitionExecutor, complete?: () => void): void;
        remove(transition?: TransitionExecutor, complete?: () => void): void;
        update(): boolean;
        dispose(): void;
    }
}
declare module "utils" {
    import { BufferGeometry, Material, Object3D, Mesh, Color } from 'three';
    import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
    export type ColoredMaterial = Material & {
        color: Color;
    };
    export const lazy: (target: object, property: string, descriptor: PropertyDescriptor) => void;
    export const isMesh: (object: Object3D) => object is Mesh;
    export const mergeGLTF: (gltf: GLTF) => {
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
    interface ParticleSourceMutationExecutors {
        prepare?: (particle: Particle) => void;
        complete?: () => void;
        transition?: TransitionExecutor;
    }
    export class ParticleSource extends Object3D {
        private particles;
        private mesh?;
        private normalMesh?;
        private _geometry?;
        private _material?;
        private _color;
        private _usesNormalMaterial;
        appendedParticles: number;
        transition: ParticleSourceTransitionExecutors;
        count: number;
        constructor({ geometry, material, count, color, transition }?: {
            geometry?: Geometry | BufferGeometry;
            material?: ColoredMaterial | ColoredMaterial[];
            count?: number;
            color?: Color | number;
            transition?: ParticleSourceTransitionExecutors;
        });
        private readonly normalMaterial;
        readonly generated: boolean;
        geometry: Geometry | BufferGeometry | undefined;
        material: ColoredMaterial | ColoredMaterial[] | undefined;
        color: Color | number;
        usesNormalMaterial: boolean;
        protected createParticle(): Particle;
        protected prepareParticle(mutation: ParticleSourceMutation, prepare?: (particle: Particle) => void): Particle;
        useGLTF(gltf: GLTF): void;
        loadGLTF(url: string, complete?: (gltf: GLTF) => void): void;
        generate(): void;
        dispose(all?: boolean): void;
        update(): void;
        appendParticle({ prepare, complete, transition }?: ParticleSourceMutationExecutors): void;
        removeParticle({ prepare, complete, transition }?: ParticleSourceMutationExecutors): void;
        appendParticles({ amount, ...executors }?: ParticleSourceMutationExecutors & {
            amount?: number;
        }): void;
        removeParticles({ amount, ...executors }?: ParticleSourceMutationExecutors & {
            amount?: number;
        }): void;
    }
}
declare module "index" {
    export { Particle } from "particle";
    export { ParticleSource } from "particle-source";
    export { Transition } from "transition";
}
//# sourceMappingURL=index.d.ts.map