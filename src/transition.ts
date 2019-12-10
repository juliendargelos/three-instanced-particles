import { Vector3, Quaternion } from 'three'
import { ParticleState } from '~/particle'

export interface Pausable {
  pause(): void
}

export type TransitionExecutor = (
  transition: ParticleState,
  complete: () => void
) => Pausable | void | undefined

export class Transition implements ParticleState {
  private animation?: Pausable
  public readonly position: Vector3 = new Vector3()
  public readonly quaternion: Quaternion = new Quaternion()
  public readonly scale: Vector3 = new Vector3()

  public static show: TransitionExecutor = (transition, complete) => {
    transition.scale.set(1, 1, 1)
    complete()
  }

  public static hide: TransitionExecutor = (transition, complete) => {
    transition.scale.set(0, 0, 0)
    complete()
  }

  public static compose(
    ...executors: TransitionExecutor[]
  ): TransitionExecutor {
    return (transition: ParticleState, complete: () => void): Pausable => {
      let animationsToComplete = executors.length
      const animations = executors.map(executor => executor(transition, () => {
        --animationsToComplete || complete()
      }))

      return {
        pause: () => animations.forEach(animation => {
          animation && animation.pause()
        })
      }
    }
  }

  public start(executor: TransitionExecutor, complete: () => void): void {
    this.stop()
    this.animation = executor(this, () => {
      complete()
      this.animation = undefined
    }) as Pausable | undefined
  }

  public stop(): void {
    if (this.animation && !this.animation.pause) console.log(this.animation)
    this.animation && this.animation.pause()
  }

  public dispose(): void {
    this.animation && this.animation.pause()
    this.animation = undefined
  }
}
