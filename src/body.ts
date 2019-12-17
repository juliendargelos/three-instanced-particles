import { Body as BaseBody, Shape } from 'cannon'

export class Body extends BaseBody {
  public removeShape(shape: Shape): this {
    const index = this.shapes.indexOf(shape)

    if (index !== -1) {
      this.shapes.splice(index, 1)
      this.shapeOffsets.splice(index, 1)
      this.shapeOrientations.splice(index, 1)

      this.updateMassProperties()
      this.updateBoundingRadius()

      this.aabbNeedsUpdate = true
    }

    return this
  }

  public clearShapes(update: boolean = true): this {
    if (this.shapes.length) {
      this.shapes.splice(0)
      this.shapeOffsets.splice(0)
      this.shapeOrientations.splice(0)

      if (update) {
        this.updateMassProperties()
        this.updateBoundingRadius()

        this.aabbNeedsUpdate = true
      }
    }

    return this
  }
}
