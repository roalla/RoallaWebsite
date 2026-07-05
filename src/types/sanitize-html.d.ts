declare module 'sanitize-html' {
  export interface IOptions {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
    transformTags?: Record<
      string,
      (
        tagName: string,
        attribs: Record<string, string>,
      ) => { tagName: string; attribs: Record<string, string> }
    >
  }

  function sanitizeHtml(dirty: string, options?: IOptions): string
  export default sanitizeHtml
}
