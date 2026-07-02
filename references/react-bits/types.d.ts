declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'three/examples/jsm/loaders/OBJLoader' {
  import { Group, Loader, LoadingManager } from 'three'
  export class OBJLoader extends Loader<Group> {
    constructor(manager?: LoadingManager)
    parse(data: string): Group
  }
}
