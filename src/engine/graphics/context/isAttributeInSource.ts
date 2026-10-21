/**
 * Checks if an attribute is present in vertex source
 */
export function isAttributeInSource(source: string, variable: string) {
    const attributeRegexTemplate = `(?<type>[a-z0-9]+)\\s+${variable};`;
    const regex = new RegExp(attributeRegexTemplate, 'g');
    const matches = regex.exec(source);
    return matches?.length! > 0;
}