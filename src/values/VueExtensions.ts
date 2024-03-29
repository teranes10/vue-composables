import { nextTick, ref, watch, type Ref } from "vue";
import { useCoalesceTruthy } from "./Object";

export function useVModel<
  P extends object,
  K extends keyof P,
  Name extends string
>(
  props: P,
  key: K,
  emit?: (name: Name, ...args: any[]) => void,
  defaultValue?: P[K]
) {
  const isDef = <T = any>(val?: T): val is T => typeof val !== "undefined";
  const getInitialValue = () => {
    if (isDef(props[key]) && typeof props[key] === 'boolean') {
      return useCoalesceTruthy(props[key], defaultValue)
    }

    return (isDef(props[key]) ? props[key] : defaultValue)
  };


  const event = `update:${key!.toString()}` as Name;
  const triggerEmit = (value: P[K]) => {
    if (emit) {
      emit(event, value);
    }
  };

  const initialValue = getInitialValue();
  const proxy = ref<P[K]>(initialValue!) as Ref<NonNullable<P[K]>>;
  const deep = typeof proxy.value === "object";

  let isUpdating = false;

  watch(
    () => props[key],
    (v) => {
      if (!isUpdating) {
        isUpdating = true;
        (proxy as any).value = v;
        nextTick(() => (isUpdating = false));
      }
    },
    { deep }
  );

  watch(
    proxy,
    (v) => {
      if (!isUpdating && v !== props[key!]) triggerEmit(v as P[K]);
    },
    { deep }
  );

  return proxy;
}
