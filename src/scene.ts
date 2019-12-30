import {
  Scene as BaseScene,
  Material,
  Mesh,
  WebGLRenderer,
  Camera,
  Geometry,
  BufferGeometry,
  Group,
  Line,
  Points,
  InstancedMesh
} from 'three'

import {
  isMesh,
  isLine,
  isPoints,
  isInstancedMesh,
  isInstancedBufferGeometry
} from '~/utils'

type RenderCallback = (
  renderer: WebGLRenderer,
  scene: BaseScene,
  camera: Camera,
  geometry: Geometry | BufferGeometry,
  material: Material,
  group: Group
) => void

export class Scene extends BaseScene {
  private _onBeforeRender: RenderCallback = this.setOverrideMaterial
  private _onAfterRender: RenderCallback = this.unsetOverrideMaterial
  private _overrideMaterial?: Material
  private objectMaterials?: { [id: number]: Material | Material[] }
  private drawableObjects?: (Mesh | Line | Points | InstancedMesh)[]
  private instancedOverrideMaterials: {
    [id: number]: { version: number, material: Material }
  } = {}

  public drawableObjectsNeedUpdate: boolean = false
  public handleInstancedOverrideMaterials: boolean = true

  public get onBeforeRender(): RenderCallback {
    return this._onBeforeRender
  }

  public set onBeforeRender(v: RenderCallback) {
    if (v) {
      this._onBeforeRender = (...parameters) => {
        this.setOverrideMaterial()
        v(...parameters)
      }
    } else {
      this._onBeforeRender = this.setOverrideMaterial
    }
  }

  public get onAfterRender(): RenderCallback {
    return this._onAfterRender
  }

  public set onAfterRender(v: RenderCallback) {
    if (v) {
      this._onAfterRender = (...parameters) => {
        this.unsetOverrideMaterial()
        v(...parameters)
      }
    } else {
      this._onAfterRender = this.unsetOverrideMaterial
    }
  }

  private setOverrideMaterial(): void {
    if (!this.handleInstancedOverrideMaterials) return

    const overrideMaterial = this.overrideMaterial

    if (!overrideMaterial) return

    this._overrideMaterial = overrideMaterial
    this.overrideMaterial = null

    const id = overrideMaterial.id
    const version = (overrideMaterial as unknown as { version: number }).version

    this.objectMaterials = {}

    this.traverseDrawableObjects((object) => {
      let material: Material = overrideMaterial

      if (
        isInstancedMesh(object) ||
        isInstancedBufferGeometry(object.geometry)
      ) {
        let instancedMaterial = this.instancedOverrideMaterials[id]

        if (instancedMaterial && instancedMaterial.version === version) {
          material = instancedMaterial.material
        } else {
          material = overrideMaterial.clone()

          if (instancedMaterial) {
            instancedMaterial.material.dispose()
            instancedMaterial.material = material
            instancedMaterial.version = version
          } else {
            instancedMaterial = { version, material }
          }

          this.instancedOverrideMaterials[id] = instancedMaterial
        }
      }

      this.objectMaterials![object.id] = object.material
      object.material = material
    })
  }

  private unsetOverrideMaterial(): void {
    if (
      !this.handleInstancedOverrideMaterials ||
      !this._overrideMaterial
    ) return

    this.traverseDrawableObjects((object) => {
      object.material = this.objectMaterials![object.id]
    })

    this.overrideMaterial = this._overrideMaterial
    this._overrideMaterial = undefined
    this.objectMaterials = undefined
  }

  public traverseDrawableObjects(
    callback: (object: Mesh | Line | Points | InstancedMesh) => void
  ): void {
    if (!this.drawableObjects || this.drawableObjectsNeedUpdate) {
      this.drawableObjectsNeedUpdate = false
      this.drawableObjects = []

      this.traverse((object) => {
        if (
          !isMesh(object) &&
          !isLine(object) &&
          !isPoints(object) &&
          !isInstancedMesh(object)
        ) return

        object.visible && callback(object)
        this.drawableObjects!.push(object)
      })
    } else {
      this.drawableObjects.forEach(object => object.visible && callback(object))
    }
  }

  public dispose(): void {
    super.dispose()

    this.drawableObjects = undefined

    for (var id in this.instancedOverrideMaterials) {
      const material = this.instancedOverrideMaterials[id].material
      material.dispose()
      delete this.instancedOverrideMaterials[id]
    }
  }
}
