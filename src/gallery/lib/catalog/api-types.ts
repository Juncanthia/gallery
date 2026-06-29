export type GalleryApiProp = {
  name: string
  type: string
  description: string
  defaultValue?: string
  required?: boolean
}

export type GalleryApiDoc = {
  props: GalleryApiProp[]
  compoundComponents?: Array<{
    name: string
    purpose: string
  }>
  accessibility?: string[]
}
