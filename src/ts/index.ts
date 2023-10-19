import { Editor } from "./Editor"; 
import { RichTextEditor } from './RichTextEditor';
import { fullFlatTextFieldConfig, fullMultiBlockTextFieldConfig, customMultiBlockTextConfig, customFlatTextConfig } from './richtext/config';
import "../css/index.css";
import { transformToLegacyMarkup } from "./richtext/utils/richTextHelpers";

export { Editor, RichTextEditor, fullFlatTextFieldConfig, fullMultiBlockTextFieldConfig, customMultiBlockTextConfig, customFlatTextConfig, transformToLegacyMarkup };
