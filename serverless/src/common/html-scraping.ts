import axios from 'axios';
import { isURL } from './util';
import cheerio, { CheerioStatic } from 'cheerio';
import { uniq } from 'lodash'
const addressableUrl = require('url');

export async function analize(urlString: string) {
  const rootUrl = addressableUrl.parse(urlString);
  const $ = await loadAndParseHTMLfromCheerio(rootUrl.href);
  const trimedText = $.text().trim();
  const phoneNumbers = trimedText.match(/0\d{2,3}-\d{1,4}-\d{4}/g);
  const linkUrls = [];
  const mailAddresses = [];
  $('a').each((i, elem) => {
    const aTag = $(elem).attr() || {};
    if (aTag.href) {
      const aUrl = addressableUrl.parse(aTag.href);
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
      const matchedAddresses = text.match(
        /(北海道|青森県|岩手県|秋田県|山形県|宮城県|福島県|群馬県|栃木県|茨城県|埼玉県|東京都|千葉県|神奈川県|新潟県|長野県|富山県|石川県|福井県|静岡県|山梨県|愛知県|岐阜県|滋賀県|三重県|奈良県|和歌山県|京都府|大阪府|兵庫県|岡山県|広島県|鳥取県|島根県|山口県|香川県|徳島県|高知県|愛媛県|福岡県|佐賀県|長崎県|大分県|熊本県|宮崎県|鹿児島県|沖縄県)((?:旭川|伊達|石狩|盛岡|奥州|田村|南相馬|那須塩原|東村山|武蔵村山|羽村|十日町|上越|富山|野々市|大町|蒲郡|四日市|姫路|大和郡山|廿日市|下松|岩国|田川|大村|宮古|富良野|別府|佐伯|黒部|小諸|塩尻|玉野|周南)市|(?:余市|高市|[^市]{2,3}?)郡(?:玉村|大町|.{1,5}?)[町村]|(?:.{1,4}市)?[^町]{1,4}?区|.{1,7}?[市町村])(.+)/g,
      );
      if (matchedAddresses && matchedAddresses.length > 0) {
        for (const matchedAddress of matchedAddresses) {
          addresses.push(matchedAddress);
        }
      }
    }
  }
  const imageUrls = $.html().match(/https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+(jpg|jpeg|gif|png)/g) || []
  $('img').each((i, elem) => {
    const imgSrc = $(elem).attr() || {};
    if (imgSrc.src) {
      const aUrl = addressableUrl.parse(imgSrc.src);
      // 普通のリンク
      if (aUrl.protocol === 'http:' || aUrl.protocol === 'https:') {
        imageUrls.push(aUrl.href);
      } else {
        let fullUrl = rootUrl.protocol + "//" + rootUrl.host;
        if(aUrl.href.startsWith("/")){
          fullUrl = fullUrl + aUrl.href;
        }else{
          fullUrl = fullUrl + "/" + aUrl.href;
        }
        imageUrls.push(fullUrl);
      }
    }
  });
  const bgUrls = $.html().match(/background[-image]*:[\s]*url\(["|\']+(.*)["|\']+\)/g)
  console.log($.html());
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
