import { Vector3, Quaternion, Matrix4 } from 'three'
import { Transition, TransitionExecutor } from '~/transition'

export interface ParticleState {
  position: Vector3
  quaternion: Quaternion
  scale: Vector3
}

export class Particle implements ParticleState {
  public readonly position: Vector3 = new Vector3()
  public readonly quaternion: Quaternion = new Quaternion()
  public readonly scale: Vector3 = new Vector3(1, 1, 1)
  public readonly matrix: Matrix4 = new Matrix4()
  public readonly transition: Transition = new Transition()
  public appended: boolean = false
  public removed: boolean = false

  public append(
    transition?: TransitionExecutor,
    complete?: (particle: this) => void
  ): void {
    this.appended = true
    this.transition.start(transition || Transition.show, () => {
      complete && complete(this)
    })
  }

  public remove(
    transition?: TransitionExecutor,
    complete?: (particle: this) => void
  ): void {
    this.transition.start(transition || Transition.hide, () => {
      this.removed = true
      complete && complete(this)
    })
  }

  public update(): boolean {
    if (!this.appended) return false

    this.matrix.compose(
      this.position.clone().add(this.transition.position),
      this.quaternion.clone().multiply(this.transition.quaternion),
      this.scale.clone().multiply(this.transition.scale)
    )

    if (this.removed) {
      this.appended = false
      this.removed = false
    }

    return true
  }

  public dispose(): void {
    this.transition.dispose()
  }
}
