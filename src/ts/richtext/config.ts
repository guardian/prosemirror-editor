export type EditorConfig = {
  inlineOnly: boolean;
  // The names of all the basic node types permitted in the schema.
  allowedNodes: string[];
  // The names of all the mark types permitted in the schema.
  allowedMarks: string[];
};

type FlatTextNode = "text" | "hard_break";
type FlatTextMark = "strong" | "strike" | "em";
type FlatTextConfig = {
  allowedNodes: FlatTextNode[];
  allowedMarks: FlatTextMark[];
  inlineOnly: true
}

type MultiBlockNode = "text" | "paragraph" | "hard_break" | "bullet_list" | "list_item";
type MultiBlockMark = "strong" | "strike" | "em" | "link";
type MultiBlockConfig = {
  allowedNodes: MultiBlockNode[];
  allowedMarks: MultiBlockMark[];
  inlineOnly: false;
}

export const fullFlatTextFieldConfig: FlatTextConfig = {
  allowedNodes: [ "text", "hard_break"],
  allowedMarks: [
      "strong",
      "strike",
      "em"
  ],
  inlineOnly: true
};

export const fullMultiBlockTextFieldConfig: MultiBlockConfig = {
  allowedNodes: [ "text", "paragraph", "hard_break", "bullet_list", "list_item"] as MultiBlockNode[],
  allowedMarks: [
      "strong",
      "strike",
      "subscript",
      "superscript",
      "em",
      "link"
  ] as MultiBlockMark[],
  inlineOnly: false
};

export const customMultiBlockTextConfig = ({allowedNodes, allowedMarks}: {allowedNodes: MultiBlockNode[], allowedMarks: MultiBlockMark[]}): MultiBlockConfig => {
  return {
    allowedNodes,
    allowedMarks,
    inlineOnly: false
  }
}

export const customFlatTextConfig = ({allowedMarks}: {allowedMarks: FlatTextMark[]}): FlatTextConfig => {
  return {
    allowedNodes: ["text", "hard_break"],
    allowedMarks,
    inlineOnly: true
  }
}
