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
