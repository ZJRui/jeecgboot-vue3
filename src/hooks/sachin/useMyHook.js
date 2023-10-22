export default function useMyHook(props, emits) {
  function onInput(event) {
    emits('input', event.target.value);
    console.log('event', event);
  }
  return { onInput };
}
