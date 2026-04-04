# prosemirror-editor
[View package on npm](https://www.npmjs.com/package/@guardian/prosemirror-typerighter).

This project is intended to provide a re-usable ProseMirror editor for use across our tools. Up front, it aims to replace Scribe-based rich text editors with a React-based prosemirror editor in:
  - [tagmanager](https://github.com/guardian/tagmanager/blob/c751b1f0da6d61a6e7bd3c6cb43ceddcd743fd9c/public/components/utils/ReactScribe.react.js#L8)
  - [atom-workshop](https://github.com/guardian/atom-workshop/blob/811f99c5ea04d6b55cbddb5dc5c08d0165f23fa8/public/js/components/FormFields/FormFieldScribeEditor.js#L11)
  - [targeting](https://github.com/guardian/targeting/blob/main/public/components/utils/ReactScribe.js)

It is also designed to meet the features required by the rich text editor in [media-atom-maker](https://github.com/guardian/media-atom-maker/blob/3391bfd82ad27848dc9e06a08628320ce481006e/public/video-ui/src/components/FormFields/RichTextEditor.tsx#L2).

It aims to provide:
- A `RichTextEditor` serialising to one-to-many `<p>` tags containing the markup below - supporting only the requirements of the above editors, at least until we have further use cases. Specifically, from the first three editors:
  - bold (strong) markup
  - italic (em) markup
  - links
  - unlinking
  - strikethrough
  - superscript and subscript
- `media-atom-maker` adds some more requirements:
  - bullet-list
  - a 'flat' text editor used for trail text, serialising text as a single paragraph with <br> tags providing line breaks.
  - an editor that can be 'copied into' from another editor, e.g. duplicating standfirst to trail text in `media-atom-maker`
- A means of specifying a subset of the supported features per editor instance, via the `config` exports
- A `transformToLegacyMarkup` method, for transforming the serialised html output by the library. Some of our tools expect `<b>` and `<i>` tags instead of the [semantically preferred](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong) `<em>` and `<strong>` tags. Rather than serialised as `<b>` and `<i>` internally, within ProseMirror, we provide a transformer to replace `<strong>` and `<em>` to `<b>` and `<i>` after the editor updates text.

The interface of `RichTextEditor` currently expects:
```ts
{
  value: string; // Serialised html to initialise the editor with, i.e. a previous saved value for a rich text field
  onUpdate: (str: string) => void; // A function to call with updated text on update
  config: EditorConfig; // The config for the editor, specifying supported markup, and whether the editor is multi-paragraph or 'flat'
  label?: string; // A label for the editor
  shouldAcceptCopiedText: boolean; // Whether the editor should accept programmatic text replacmement from another rich text field
}
```

## Things this repo doesn't have, that we will want to add in future PRs:

- A means of testing changes from this package itself, for example a demo-app that includes the React editor component. Currently this package only builds a component to be used by other packages.

Currently, vanilla css styles are included in the built dist and need to be imported in the target package.

## How to run
- Publish this package locally using yarn yalc from the root of the project
- Import into another project using `yalc`

## Deploying
Package releases are managed via [changesets](https://www.npmjs.com/package/changeset).

To release:
1. Run `yarn changesets` in the project root locally.
2. Create a changeset, and include it in a PR.
3. Merge the PR.
4. The changesets bot will create a new 'release' PR. Merging that will release the project to NPM.

Continuous deployment is managed by a GitHub Action defined in `.github/workflows`
