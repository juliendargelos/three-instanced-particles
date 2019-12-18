import { Shape, Vec3 } from 'cannon'
import { Vector3, Quaternion } from 'three'
import { Particle } from '~/particle'
import { Body } from '~/body'
import { TransitionExecutor } from '~/transition'

export class PhysicalParticle extends Particle {
  protected readonly freezeDelay: number = Infinity
  protected readonly freezeVelocityFactor: Vec3 = new Vec3(0.9, 1, 0.9)
  protected readonly freezeAngularVelocityFactor: Vec3 = new Vec3(1, 1, 1)
  protected readonly freezeThreshold: number = 0.001
  protected freezeTimeout?: number
  protected freezing: boolean = false
  protected frozen: boolean = false

  public readonly body: Body

  public constructor() {
    super()
    this.body = new Body(this.bodyParameters)
  }

  protected get bodyParameters(): { [parameter: string]: unknown } {
    return {
      mass: 1,
      type: Body.DYNAMIC
    }
  }

  protected freeze(): void {
    const { velocity,  angularVelocity } = this.body

    if (velocity.almostZero(this.freezeThreshold)) {
      this.frozen = true
      this.freezing = false

      this.body.type = Body.STATIC

      return
    }

    const { freezeVelocityFactor, freezeAngularVelocityFactor } = this

    velocity.x *= freezeVelocityFactor.x
    velocity.y *= freezeVelocityFactor.y
    velocity.z *= freezeVelocityFactor.z

    angularVelocity.x *= freezeAngularVelocityFactor.x
    angularVelocity.y *= freezeAngularVelocityFactor.y
    angularVelocity.z *= freezeAngularVelocityFactor.z
  }

  protected requestFreeze(): void {
    if (this.freezeDelay === Infinity) return
    this.cancelFreeze()
    this.freezeTimeout = window.setTimeout(() => {
      this.freezing = true
    }, this.freezeDelay)
  }

  protected cancelFreeze(): void {
    if (this.freezeTimeout === undefined) return
    clearTimeout(this.freezeTimeout)
    this.freezeTimeout = undefined
  }

  public append(
    transition?: TransitionExecutor,
    complete?: (particle: this) => void
  ): void {
    this.freezing = this.frozen = false
    this.body.type = Body.DYNAMIC
    super.append(transition, (particle) => {
      this.requestFreeze()
      complete && complete(particle)
    })
  }

  public remove(
    transition?: TransitionExecutor,
    complete?: (particle: this) => void
  ): void {
    this.cancelFreeze()
    super.remove(transition, complete)
  }

  public update(): boolean {
    if (!this.appended) return false
    this.freezing && this.freeze()
    this.frozen || this.synchronizeBody()
    return super.update()
  }

  public clearBodyShape(): void {
    this.body.clearShapes()
  }

  public setBodyShape(shape: Shape): void {
    this.body.clearShapes(false)
    this.body.addShape(shape)
  }

  public synchronizeBody(): void {
    this.position.copy(this.body.position as unknown as Vector3)
    this.quaternion.copy(this.body.quaternion as unknown as Quaternion)
  }

  public resetBodyPosition(): void {
    const { x, y, z } = this.position
    this.body.position.set(x, y, z)
  }

  public resetBodyQuaternion(): void {
    const { x, y, z, w } = this.quaternion
    this.body.quaternion.set(x, y, z, w)
  }

  public resetBodyVelocity(): void {
    this.body.velocity.set(0, 0, 0)
  }

  public resetBodyAngularVelocity(): void {
    this.body.angularVelocity.set(0, 0, 0)
  }
}
