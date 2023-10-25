export const paragraphToWhitespace = (string: string): string => {
  // Only the first paragraph tag
  string = string.replace("<p>","");
  // Replace subsequent paragraph tags with hard breaks
  string = string.replace(/<p>/g,"<br>");
  // Remove all paragraph closing tags
  string = string.replace(/<\/p>/g,"");
  return string;
};

export const transformToLegacyMarkup = (str: string): string => {
  const replacements = [
    { from: "<strong>", to: "<b>"},
    { from: "</strong>", to: "</b>"},
    { from: "<em>", to: "<i>"},
    { from: "</em>", to: "</i>"}
  ]
  let newString = str;
  replacements.forEach(replacement => newString = newString.replaceAll(replacement.from, replacement.to))
  return newString
}