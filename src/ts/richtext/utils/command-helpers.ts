import { parseURL, linkValidator } from './linkValidator';
import { MarkType } from 'prosemirror-model';
import { Command, EditorState, Transaction } from 'prosemirror-state';

// These prosemirror-helper functions are a simplified version of what we use in Composer, and have been lifted and shifted from that repo

export const unlinkItemCommand = (mark: MarkType) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void
) => {
  if (!markEnabled(state, mark)) {
    return false;
  }

  if (!dispatch) {
    return true;
  }

  const { from, to } = state.selection
    ? getExpandedSelectionForMark(state, mark)
    : state.selection;

  dispatch(state.tr.removeMark(from, to, mark));
};

export const markActive = (state: EditorState, markType: MarkType) => {
  const {from, $from, to, empty} = state.selection;
  if (empty) return markType.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, markType);
};

export const linkItemCommand = (markType: MarkType, customPrompt?: string, defaultValue?: string): Command => (
  state: EditorState,
  dispatch?: (tr: Transaction) => void 
) => {
  const maybeUrlResult = promptForLink(state, markType, customPrompt, defaultValue);

  if (maybeUrlResult && maybeUrlResult.from !== undefined && maybeUrlResult.to !== undefined) {
    const { from, to, url } = maybeUrlResult;
    const { valid, message, link } = linkValidator(url);
    if (valid) {
      const parsedUrl = parseURL(url);
      if (dispatch){ dispatch(
        state.tr.addMark(from, to, markType.create({ href: parsedUrl }))
      );
      }
    } else {
      return linkItemCommand(markType, `${message} - please check your link and try again.`, link)(state, dispatch);
    }
  }

  return false;
};

const promptForLink = (state: EditorState, markType: MarkType, customPrompt?: string, defaultValue?: string): {from: number, to: number, url: string} | undefined => {
  const { from, to, href } = getCurrentHrefAndEditRange(state, markType);

  if (from === to && !href) {
    return undefined;
  }

  const url = window.prompt(customPrompt || 'Enter a link', href || defaultValue || '') || '';
  return {
    from,
    to,
    url
  };
};

/**
 * Expand the given selection to include all contiguous characters with the
 * given mark.
 *
 * NB: This function looks from the start of the selection leftwards, and the
 * end of the selection rightwards - it doesn't check for contiguous marks within
 * the selection. It will behave oddly if this isn't the case.
 */
const getExpandedSelectionForMark = (state: EditorState, currentMark: any) => {
  if (!currentMark) {
    return { from: state.selection.from, to: state.selection.to, href: null };
  }
  const { $from, $to } = state.selection;
  let startIndex = $from.index();
  let endIndex = $to.indexAfter();
  while (
    startIndex > 0 &&
    currentMark.isInSet($from.parent.child(startIndex - 1).marks)
  ) {
    startIndex--;
  }
  while (
    endIndex < $from.parent.childCount &&
    currentMark.isInSet($from.parent.child(endIndex).marks)
  ) {
    endIndex++;
  }
  let startPos = $from.start();
  let endPos = startPos;
  for (let i = 0; i < endIndex; i++) {
    const size = $from.parent.child(i).nodeSize;
    if (i < startIndex) {
      startPos += size;
    }

    endPos += size;
  }

  const href = currentMark.attrs ? currentMark.attrs.href : null;

  return { from: startPos, to: endPos, href };
};

// if not in a link this will return the selection on `from` and `to` and a null
// on `href` on the return object, otherwise it will return the href and the
// max extent to which this link is applied in the document in `from` and `to`
const getCurrentHrefAndEditRange = (state: EditorState, markType: MarkType) => {
  const currentMark = areMarksEqualForSelection(state, markType);
  return getExpandedSelectionForMark(state, currentMark);
};

const markEnabled = (state: EditorState, type: MarkType) => {
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, type);
  }
};

const areMarksEqualForSelection = (state: EditorState, type: MarkType) => {
  const { from, to, empty } = state.selection;
  const mark = type.isInSet(
    state.storedMarks || state.doc.resolve(from + 1).marks()
  );
  if (empty || !mark) {
    return mark;
  }
  for (let i = from + 2; i < to; i++) {
    const currentMark = type.isInSet(state.doc.resolve(i).marks());
    if (!currentMark || !currentMark.eq(mark)) {
      return false;
    }
  }
  return mark;
};
