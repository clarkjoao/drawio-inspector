export class XmlUtils {
  static escapeString(str: string): string {
    if (!str) return "";

    if (!XmlUtils.needsEscaping(str)) {
      return str;
    }

    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  static unescapeString(value: string): string {
    if (!value) return "";

    const fixed = value
      .replace(/&amp;lt;/g, "&lt;")
      .replace(/&amp;gt;/g, "&gt;")
      .replace(/&amp;quot;/g, "&quot;")
      .replace(/&amp;apos;/g, "&apos;")
      .replace(/&amp;amp;/g, "&amp;");

    return fixed
      .replace(/&#xa;/g, "\n")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&");
  }

  static needsEscaping(value: string): boolean {
    if (!value) return false;

    const hasUnescapedSpecials = /[<>'"\n]/.test(value);
    const hasAlreadyEscaped = /&(?:amp|lt|gt|quot|apos|#\w+);/.test(value);

    return hasUnescapedSpecials && !hasAlreadyEscaped;
  }

  static autoFixEscapes(xml: string): string {
    if (!xml) return "";

    return xml
      .replace(/&amp;lt;/g, "&lt;")
      .replace(/&amp;gt;/g, "&gt;")
      .replace(/&amp;quot;/g, "&quot;")
      .replace(/&amp;apos;/g, "&apos;")
      .replace(/&amp;amp;/g, "&amp;");
  }
}
