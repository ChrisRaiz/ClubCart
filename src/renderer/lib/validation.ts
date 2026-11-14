/** True if `value` is an https Sam's Club product page URL. */
export const isValidUrl = (value: string) => {
  try {
    const url = new URL(value.trim());

    // Only allow HTTPS
    if (url.protocol !== 'https:') return false;

    // Only allow official Sam's Club domains
    if (!['samsclub.com', 'www.samsclub.com'].includes(url.hostname)) {
      return false;
    }

    // Don't allow credentials or custom ports
    if (url.username || url.password || url.port) return false;

    // Match Sam's Club product page URL formats
    const productPatterns = [
      /^\/ip\/[a-zA-Z0-9-]+\/[a-zA-Z0-9]+\/?$/,
      /^\/ip\/[a-zA-Z0-9]+\/?$/,
      /^\/p\/[a-zA-Z0-9-]+\/prod[a-zA-Z0-9]+\/?$/,
    ];

    return productPatterns.some((pattern) => pattern.test(url.pathname));
  } catch {
    return false;
  }
};

export default isValidUrl;
