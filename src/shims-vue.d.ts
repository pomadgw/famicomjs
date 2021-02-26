declare module '*.vue' {
  // eslint-disable-next-line
  import { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    any
  >
  export default component
}
