# Three instanced particles

This library provides a wrapper for managing particle instances.

## Usage

#### Initializing a particle source

Start by creating a `ParticleSource`:

```typescript
import { ParticleSource } from 'three-instanced-particles'

const particleSource = new ParticleSource()
```

Then you can set some attributes and generate the mesh. The `count`, `geometry` and `material` attributes are required before generating the mesh (or an error will be thrown), and each time you change them, you must call `generate()` again:

```typescript
import { BoxBufferGeometry, MeshStandardMaterial } from 'three'

// These parameters can also be set at instantiation by providing an object to the constructor.
particleSource.count = 500 // Number of instances
particleSource.geometry = new BoxBufferGeometry()
particleSource.material = new MeshStandardMaterial()

particleSource.generate()
```

### Appending and removing particles

Now you can append and remove particles from the `particleSource` (appending or removing particles before calling `generate()` will throw an error):

```typescript
particleSource.appendParticle()
particleSource.removeParticle()
```

Note that you cannot append more particles than defined in the `count` attribute, and you cannot remove particles when none of them has already been appended. Doing that will throw an error.

By default appending a particle will just scale the instance to `1, 1, 1`, and removing it will set its scale to `0, 0, 0`. But you can define a transition to customize this behaviour (the following also works with `removeParticle()`):

```typescript
import gsap from 'gsap'

particleSource.appendParticle({
  transition: (transition, complete) => {
    return gsap.to(transition.scale, 0.4, {
      x: 1, y: 1, z: 1, onComplete: complete
    })
  }
})
```

The `transition` parameter implements the [`ParticleState`](src/particle.ts#L4-8) interface, it is composed with the actual particle instance when calling `particle.update()`. No matter how you do your transition (synchronous or not), you must call `complete` when it's finished. If your transition is asynchronous, you should also return a [`Pausable`](src/transition.ts#L4-6) object which implements a `pause()` method (gsap does that itself) so the transition can be paused when another is triggered from the same particle instance.

Transitions can be defined for all particles from the `particleSource`, moreover you can always track the transition completion by passing a `complete` method:

```typescript
particleSource.transition = {
  append: (transition, complete) => { ... },
  remove: (transition, complete) => { ... },
}

particleSource.appendParticle({
  complete: () => console.log('transition completed')
}) // Automatically uses the append transition from particleSource, but can still be overwritten if needed
```

You can also (and will probably want to) set some particle attributes before appending or removing it. Access the particle by providing a synchronous `prepare` method:

```typescript
particleSource.appendParticle({
  prepare: particle => particle.position.setY(Math.random() * 2 - 1)
})
```

#### Updating the instanced mesh

To make all of this work in you render loop, you should call `particleSource.update()` before rendering (and obviously, add `particleSource` to your scene at initialization).

#### Implementing custom behaviours

The [`Particle`](src/particle.ts#L10) and [`ParticleSource`](src/particle-source.ts#L31) classes are meant to be extended so you can implement custom behaviours:

```typescript
import { Particle, ParticleSource } from 'three-instanced-particles'
import { Vector3 } from 'three'

const yAxis = new Vector3(0, 1, 0)

class SpinningParticle extends Particle {
  public update(): boolean {
    if (!this.appended) return false // Only update when the particle is visible

    this.quaternion.setFromAxisAngle(yAxis, performance.now() / 5000)

    return super.update() // Always call super.update() after your modifications so the particle matrix is updated taking them in account.
  }
}

class SpinningParticleSource extends ParticleSource {
  protected createParticle(): Particle {
    return new SpinningParticle() // Here you could also give custom parameters to the particle constructor
  }
}
```

#### Specific features

If your rendering flow includes post processing, you may want to use the three scene [`overrideMaterial`](https://threejs.org/docs/#api/en/scenes/Scene.overrideMaterial) attribute. For some reason, this seems not to work with instanced meshes. `ParticleSource` let you choose to override its material with the [`MeshNormalMaterial`](https://threejs.org/docs/#api/en/materials/MeshNormalMaterial) by setting `particleSource.usesNormalMaterial` to `true` (set to `false` to stop overriding). So you may have to change this attribute during a normal rendering pass. Since there are other useful materials for post processing (like [`MeshDepthMaterial`](https://threejs.org/docs/#api/en/materials/MeshDepthMaterial)), this attribute will probably change in the future.

If you want to use `ParticleSource` with GLTF, you can use `particleSource.useGLTF()` which takes a GLTF object as parameter (like the one created by the [`load()`](https://threejs.org/docs/#examples/en/loaders/GLTFLoader.load) and [`parse()`](https://threejs.org/docs/#examples/en/loaders/GLTFLoader.parse) methods of the three [`GLTFLoader`](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)). `useGLTF()` will [automatically merge](src/utils.ts#L26-56) the geometries of all meshes found in the GLTF scene (using the three [BufferGeometryUtils.mergeBufferGeometries()](https://threejs.org/docs/#examples/en/utils/BufferGeometryUtils.mergeBufferGeometries) method), and retrieve the appropriate materials to make your GLTF instanciable. The merged geometry will by stored as a single BufferGeometry in `particleSource.geometry`, and the material(s) will be stored as a single or an array of materials in `particleSource.material` (depending on the structure of your GLTF). Calling `useGLTF()` is [exactly the same](src/particle-source.ts#L172-177) as giving a value to both `particleSource.geometry` and `particleSource.material`.

Some features aren't mentionned here (like disposing or coloring things), but the [source code](src) is quite obvious, even more if you are using TypeScript.
