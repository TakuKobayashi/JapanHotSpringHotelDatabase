export function isURL(str: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
}

const addressableUrl = require('url');
const path = require('path');
export function normalizeURL(srcURLString: string, orgURLString: string): string {
  const aUrl = addressableUrl.parse(srcURLString);
  if (!aUrl.protocol) {
    const rootUrl = addressableUrl.parse(orgURLString);
    let fullUrl = '';
    if (aUrl.href.startsWith('/')) {
      fullUrl = rootUrl.protocol + '//' + rootUrl.host + aUrl.href;
    } else if (aUrl.href.startsWith('./')) {
      fullUrl = path.dirname(rootUrl.href) + '/' + path.basename(aUrl.href);
    } else if (aUrl.href.startsWith('../')) {
      fullUrl = path.dirname(path.dirname(rootUrl.href)) + '/' + path.basename(aUrl.href);
    } else {
      fullUrl = path.dirname(rootUrl.href) + '/' + aUrl.href;
    }
    return fullUrl;
  } else {
    return aUrl.href;
  }
}
