import axios from 'axios';
import { isURL, normalizeURL } from './util';
import cheerio, { CheerioStatic } from 'cheerio';
import { uniq } from 'lodash';
import { phoneNumberRegExp, japanAddressRegExp } from './regexp-components';
const addressableUrl = require('url');

export async function analize(urlString: string) {
  const rootUrl = addressableUrl.parse(urlString);
  const $ = await loadAndParseHTMLfromCheerio(rootUrl.href);
  const trimedText = $.text().trim();
  const phoneNumbers = trimedText.match(phoneNumberRegExp('g'));
  const linkUrls = [];
  const mailAddresses = [];
  $('a').each((i, elem) => {
    const aTag = $(elem).attr() || {};
    if (aTag.href) {
      const aUrl = addressableUrl.parse(normalizeURL(aTag.href, rootUrl.href));
      // 普通のリンク
      if (aUrl.protocol === 'http:' || aUrl.protocol === 'https:') {
        linkUrls.push(aUrl.href);
        // mailリンク
      } else if (aUrl.protocol === 'mailto:') {
        mailAddresses.push(aUrl.href.replace('mailto:', ''));
        // 電話番号のリンク
      } else if (aUrl.protocol === 'tel:') {
        phoneNumbers.push(aUrl.href.replace('tel:', ''));
        // link先が省略されている場合
      } else {
        const fullUrl = rootUrl.href + aUrl.href;
        linkUrls.push(fullUrl);
      }
    }
  });
  const addresses: string = [];
  const texts = trimedText.split(/\s/);
  for (const text of texts) {
    if (text.length > 0) {
      const regexp = japanAddressRegExp('g');
      const matchedAddresses = text.match(regexp);
      if (matchedAddresses && matchedAddresses.length > 0) {
        for (const matchedAddress of matchedAddresses) {
          addresses.push(matchedAddress);
        }
      }
    }
  }
  const imageUrls = $.html().match(/https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+(jpg|jpeg|gif|png)/g) || [];
  $('img').each((i, elem) => {
    const imgSrc = $(elem).attr() || {};
    if (imgSrc.src) {
      imageUrls.push(normalizeURL(imgSrc.src, rootUrl.href));
    }
  });
  const bgUrls = $.html().match(/background[-image]*:[\s]*url\(["|\']+(.*)["|\']+\)/g);
  return {
    phoneNumbers: uniq(phoneNumbers),
    addresses: uniq(addresses),
    linkUrls: uniq(linkUrls),
    imageUrls: uniq(imageUrls),
    mailAddresses: uniq(mailAddresses),
  };
}

async function loadAndParseHTMLfromCheerio(url: string): CheerioStatic {
  const response = await axios.get(url);
  return cheerio.load(response.data.normalize('NFKC'));
}