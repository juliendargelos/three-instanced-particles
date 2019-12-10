import {
  Color,
  Object3D,
  Geometry,
  Material,
  InstancedMesh,
  MeshNormalMaterial
} from 'three'

import { Particle } from '~/particle'
import { TransitionExecutor } from '~/transition'
import { lazy } from '~/utils'

type ColoredMaterial = Material & { color: Color }

enum ParticleSourceMutation {
  Append = 1,
  Remove = -1
}

interface ParticleSourceTransitionExecutors {
  append?: TransitionExecutor
  remove?: TransitionExecutor
}

interface ParticleSourceMutationExecutors {
  prepare?: (particle: Particle) => void
  complete?: () => void
  transition?: TransitionExecutor
}

export class ParticleSource extends Object3D {
  private particles: Particle[] = []
  private appendedParticles: number = 0
  private mesh?: InstancedMesh
  private normalMesh?: InstancedMesh
  private _geometry?: Geometry
  private _material?: ColoredMaterial
  private _color!: Color | number
  private _usesNormalMaterial: boolean = false

  public transition: ParticleSourceTransitionExecutors
  public count: number

  public constructor({
    geometry = undefined,
    material = undefined,
    count = 0,
    color = 0xffffff,
    transition = {}
  }: {
    geometry?: Geometry
    material?: ColoredMaterial
    count?: number
    color?: Color | number
    transition?: ParticleSourceTransitionExecutors
  } = {}) {
    super()

    this.transition = transition
    this.geometry = geometry
    this.material = material
    this.color = color
    this.count = count
  }

  @lazy private get normalMaterial(): MeshNormalMaterial {
    return new MeshNormalMaterial({
      morphTargets: true,
      skinning: true
    })
  }

  public get generated(): boolean {
    return !!this.mesh
  }

  public get geometry(): Geometry | undefined {
    return this._geometry
  }

  public set geometry(v: Geometry | undefined) {
    this._geometry = v
    if (!this.mesh || !v) return
    this.mesh.geometry = v
  }

  public get material(): ColoredMaterial | undefined {
    return this._material
  }

  public set material(v: ColoredMaterial | undefined) {
    this._material = v
    if (!this.mesh || !v) return
    v.color.set(this.color as Color)
    if (!this.usesNormalMaterial) this.mesh.material = v
  }

  public get color(): Color | number {
    return this._color
  }

  public set color(v: Color | number) {
    this._color = v
    this.material && this.material.color.set(v as Color)
  }

  public get usesNormalMaterial(): boolean {
    return this._usesNormalMaterial
  }

  public set usesNormalMaterial(v: boolean) {
    this._usesNormalMaterial = v
    if (!this.mesh || (!v && !this.material)) return
    this.mesh.material = v ? this.normalMaterial : this.material!
  }

  protected createParticle(): Particle {
    return new Particle()
  }

  protected prepareParticle(
    mutation: ParticleSourceMutation,
    prepare?: (particle: Particle) => void
  ): Particle {
    if (!this.mesh) throw new Error(
      'The mesh and particles have not been generated, ' +
      'call generate() before calling appendParticle() or removeParticle()'
    )

    let particle!: Particle

    switch (mutation) {
      case ParticleSourceMutation.Append:
        if (this.appendedParticles >= this.mesh.count) throw new Error(
          `All ${this.mesh.count} particles have already been appended, ` +
          'increase count and call generate() to append more particles.'
        )

        particle = this.particles[this.appendedParticles++]

        break

      case ParticleSourceMutation.Remove:
        if (this.appendedParticles <= 0) throw new Error(
          `All ${this.mesh.count} particles have already been removed, ` +
          'you cannot remove more particles.'
        )

        particle = this.particles[--this.appendedParticles]

        break
    }

    prepare && prepare(particle)

    return particle
  }

  public generate(): void {
    if (!this.geometry || !this.material) throw new Error(
      'geometry and material must be set before calling generate()'
    )

    const {
      particles,
      count
    } = this

    this.dispose()

    this.mesh = new InstancedMesh(this.geometry, this.material, count)
    this.mesh.frustumCulled = false

    this.appendedParticles = Math.min(this.appendedParticles, count)
    while (particles.length < count) particles.push(this.createParticle())
    particles.splice(count).forEach(particle => particle.dispose())

    this.add(this.mesh)
  }

  public dispose(all: boolean = false): void {
    if (this.mesh) {
      this.remove(this.mesh)
      this.mesh = undefined
    }

    if (all) {
      this.particles.splice(0).forEach(particle => particle.dispose())
    }
  }

  public update(): void {
    if (!this.mesh) return

    const mesh = this.mesh

    this.particles.forEach((particle, index) => {
      if (!particle.update()) return
      mesh.setMatrixAt(index, particle.matrix)
      mesh.instanceMatrix.needsUpdate = true
    })
  }

  public appendParticle({
    prepare = undefined,
    complete = undefined,
    transition = this.transition.append
  }: ParticleSourceMutationExecutors = {}): void {
    this
      .prepareParticle(ParticleSourceMutation.Append, prepare)
      .append(transition, complete)
  }

  public removeParticle({
    prepare = undefined,
    complete = undefined,
    transition = this.transition.remove
  }: ParticleSourceMutationExecutors = {}): void {
    this
      .prepareParticle(ParticleSourceMutation.Remove, prepare)
      .append(transition, complete)
  }
}
