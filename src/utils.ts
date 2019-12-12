import { BufferGeometry, Material, Object3D, Mesh, Color } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import {
  BufferGeometryUtils
} from 'three/examples/jsm/utils/BufferGeometryUtils'

export type ColoredMaterial = Material & { color: Color }

export const lazy = (
  target: object,
  property: string,
  descriptor: PropertyDescriptor
): void => {
  const get = descriptor.get!

  descriptor.get = () => Object.defineProperty(target, property, {
    value: get.call(target)
  })[property]
}

export const isMesh = (object: Object3D): object is Mesh => (
  (object as unknown as Mesh).isMesh
)

export const mergeGLTF = (gltf: GLTF): {
  geometry: BufferGeometry
  material: ColoredMaterial | ColoredMaterial[]
} => {
  const geometries: BufferGeometry[] = []
  const materials: ColoredMaterial[] = []

  gltf.scene.traverse((mesh) => {
    if (!isMesh(mesh)) return

    mesh.updateMatrixWorld(true)
    mesh.geometry.applyMatrix(mesh.matrixWorld)

    geometries.push(mesh.geometry as BufferGeometry)
    materials.push(mesh.material as ColoredMaterial)
  })

  if (!geometries.length) throw new Error(
    'Could not find any geometry in GLTF scene'
  )

  return {
    geometry: geometries.length === 1
      ? geometries[0]
      : BufferGeometryUtils.mergeBufferGeometries(geometries, true),

    material: materials.length === 1
      ? materials[0]
      : materials
  }
}
