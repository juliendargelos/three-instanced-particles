import { World, Box, Vec3, Shape } from 'cannon'
import { PhysicalParticle } from '~/physical-particle'

import {
  ParticleSource,
  ParticleSourceParameters,
  ParticleSourceMutationExecutors
} from '~/particle-source'

export interface PhysicalParticleSourceParameters
  extends ParticleSourceParameters {
  world: World
}

export class PhysicalParticleSource extends ParticleSource<PhysicalParticle> {
  public readonly world: World
  protected shape?: Shape

  public constructor({
    world,
    ...parameters
  }: PhysicalParticleSourceParameters) {
    super(parameters)
    this.world = world
  }

  protected updateGeometry(): void {
    if (this.geometry) {
      const shape = this.shape = this.createShape()
      this.particles.forEach(particle => particle.setBodyShape(shape))
    } else {
      this.particles.forEach(particle => particle.clearBodyShape())
    }
  }

  protected createShape(): Shape {
    this.geometry!.boundingBox || this.geometry!.computeBoundingBox()

    const box = this.geometry!.boundingBox

    return new Box(new Vec3(
      (box.max.x - box.min.x) / 2,
      (box.max.y - box.min.y) / 2,
      (box.max.z - box.min.z) / 2
    ))
  }

  protected createParticle(): PhysicalParticle {
    const particle = new PhysicalParticle()
    this.shape && particle.setBodyShape(this.shape)
    return particle
  }

  public appendParticle({
    prepare = undefined,
    ...executors
  }: ParticleSourceMutationExecutors<PhysicalParticle> = {}): void {
    super.appendParticle({
      ...executors,
      prepare: (particle) => {
        particle.resetBodyVelocity()
        particle.resetBodyAngularVelocity()

        prepare && prepare(particle)

        particle.resetBodyPosition()
        particle.resetBodyQuaternion()

        this.world.addBody(particle.body)
      }
    })
  }

  public removeParticle({
    complete = undefined,
    ...executors
  }: ParticleSourceMutationExecutors<PhysicalParticle> = {}): void {
    super.removeParticle({
      ...executors,
      complete: (particle) => {
        this.world.remove(particle.body)
        complete && complete(particle)
      }
    })
  }
}
