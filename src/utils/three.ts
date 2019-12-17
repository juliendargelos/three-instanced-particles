import {
  Object3D,
  Mesh,
  Material,
  Geometry,
  BufferGeometry,
  Color
} from 'three'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import {
  BufferGeometryUtils
} from 'three/examples/jsm/utils/BufferGeometryUtils'

export type ColoredMaterial = Material & { color: Color }

export function isMesh(object: Object3D): object is Mesh {
  return (object as unknown as Mesh).isMesh
}

export function isBufferGeometry(
  geometry: Geometry | BufferGeometry
): geometry is BufferGeometry {
  return (geometry as BufferGeometry).isBufferGeometry
}

export function mergeGLTF(gltf: GLTF): {
  geometry: BufferGeometry
  material: ColoredMaterial | ColoredMaterial[]
} {
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
