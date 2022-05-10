import { InstanceManager } from '@src/instance-manager'

describe('InstanceManager', () => {
  test('defualt', () => {
    const construct = jest.fn()
    const destruct = jest.fn()

    const manager = new InstanceManager(construct, destruct)
    const currentQuantity = manager.getCurrentQuantity()
    const targetQuantity = manager.getTargetQuantity()
    const instances = manager.getInstances()

    expect(currentQuantity).toBe(0)
    expect(targetQuantity).toBe(0)
    expect(instances).toStrictEqual([])
  })

  test('removeInstance', async () => {
    let count = 0
    const construct = jest.fn(() => ++count)
    const destruct = jest.fn()
    const manager = new InstanceManager(construct, destruct)
    manager.setTargetQuantity(2)
    await manager.scale()

    manager.removeInstance(manager.getInstances()[0])
    const currentQuantity1 = manager.getCurrentQuantity()
    await manager.scale()
    const currentQuantity2 = manager.getCurrentQuantity()
    const instances = manager.getInstances()

    expect(currentQuantity1).toBe(1)
    expect(currentQuantity2).toBe(2)
    expect(instances).toStrictEqual([2, 3])
    expect(destruct).toBeCalledTimes(1)
    expect(destruct).toBeCalledWith(1)
  })

  test('scale(up)', async () => {
    let count = 0
    const construct = jest.fn(() => ++count)
    const destruct = jest.fn()

    const manager = new InstanceManager(construct, destruct)
    manager.setTargetQuantity(2)
    const currentQuantityBeforeScaling = manager.getCurrentQuantity()
    const targetQuantityBeforeScaling = manager.getTargetQuantity()
    await manager.scale()
    const currentQuantityAfterScaling = manager.getCurrentQuantity()
    const targetQuantityAfterScaling = manager.getTargetQuantity()
    const instances = manager.getInstances()

    expect(currentQuantityBeforeScaling).toBe(0)
    expect(targetQuantityBeforeScaling).toBe(2)
    expect(currentQuantityAfterScaling).toBe(2)
    expect(targetQuantityAfterScaling).toBe(2)
    expect(instances).toStrictEqual([1, 2])
    expect(construct).toBeCalledTimes(2)
    expect(destruct).not.toBeCalled()
  })

  test('scale(down)', async () => {
    let count = 0
    const construct = jest.fn(() => ++count)
    const destruct = jest.fn()

    const manager = new InstanceManager(construct, destruct)
    manager.setTargetQuantity(2)
    await manager.scale()
    manager.setTargetQuantity(0)
    const currentQuantityBeforeScaling = manager.getCurrentQuantity()
    const targetQuantityBeforeScaling = manager.getTargetQuantity()
    await manager.scale()
    const currentQuantityAfterScaling = manager.getCurrentQuantity()
    const targetQuantityAfterScaling = manager.getTargetQuantity()
    const instances = manager.getInstances()

    expect(currentQuantityBeforeScaling).toBe(2)
    expect(targetQuantityBeforeScaling).toBe(0)
    expect(currentQuantityAfterScaling).toBe(0)
    expect(targetQuantityAfterScaling).toBe(0)
    expect(instances).toStrictEqual([])
    expect(construct).toBeCalledTimes(2)
    expect(destruct).toBeCalledTimes(2)
    expect(destruct).toHaveBeenNthCalledWith(1, 2)
    expect(destruct).toHaveBeenNthCalledWith(2, 1)
  })
})
