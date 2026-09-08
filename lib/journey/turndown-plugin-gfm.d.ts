// @joplin/turndown-plugin-gfm ships no types. Only `gfm` is used (tables / strikethrough /
// task lists). A TurndownService plugin is `(service) => void`.
declare module '@joplin/turndown-plugin-gfm' {
  import type TurndownService from 'turndown';
  type Plugin = (service: TurndownService) => void;
  export const gfm: Plugin;
  export const tables: Plugin;
  export const strikethrough: Plugin;
  export const taskListItems: Plugin;
  export const highlightedCodeBlock: Plugin;
}
