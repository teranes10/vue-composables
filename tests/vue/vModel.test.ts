import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { vModel } from '../../src/vue/vModel'

describe('vModel function', () => {
  it('should initialize with the prop value', () => {
    const props = { modelValue: true }
    const model = vModel(props, 'modelValue')
    expect(model.value).toBe(true)
  })

  it('should initialize with the default value if the prop is undefined', () => {
    const props = { modelValue: undefined } as { modelValue?: boolean }
    const model = vModel(props, 'modelValue', undefined, true)
    expect(model.value).toBe(true)
  })

  it('should emit an event when the ref changes', async () => {
    const props = { modelValue: false }
    const emit = vi.fn()
    const model = vModel(props, 'modelValue', emit)

    model.value = true
    await nextTick()

    expect(emit).toHaveBeenCalledWith('update:modelValue', true)
  })

  it('should update the ref when the prop changes', async () => {
    const props = ref({ modelValue: false })
    const model = vModel(props.value, 'modelValue')

    props.value.modelValue = true
    await nextTick()

    expect(model.value).toBe(true)
  })

  it('should not emit an event if the value did not change', async () => {
    const props = { modelValue: false }
    const emit = vi.fn()
    const model = vModel(props, 'modelValue', emit)

    model.value = false
    await nextTick()

    expect(emit).not.toHaveBeenCalled()
  })

  it('should handle deep watching for nested objects', async () => {
    const props = { modelValue: { a: { b: false } } }
    const model = vModel(props, 'modelValue')

    model.value.a.b = true
    await nextTick()

    expect(props.modelValue.a.b).toBe(true)
  })
})
