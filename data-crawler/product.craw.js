const getProductDetail = () => {
  const formatPriceToNumber = (price) => {
    return Number.parseInt(price.replaceAll('.', ''));
  };

  const product = {};
  const productBlock = document.querySelector('.info-block');
  product.title = productBlock.querySelector(
    'h1[itemprop="name"]'
  )?.textContent;
  product.price = productBlock.querySelector('.price-old')?.textContent;
  product.discountPrice = productBlock.querySelector('.price-new')?.textContent;
  if (!product.price) {
    product.price = product.discountPrice;
    delete product.discountPrice;
  }
  product.price = formatPriceToNumber(product.price);
  if (product.discountPrice) {
    product.discountPrice = formatPriceToNumber(product.discountPrice);
  }

  const details = document.querySelector('.tab-content').querySelectorAll('p');

  product.imageLink = document.querySelector(
    '#main-body > div.product-view > div.product-view-top > div > div > div > div.col-lg-9.col-md-9.col-sm-12.col-xs-12 > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12 > div > div.product-image > a > img'
  ).src;
  product.brand = document.querySelector(
    '#main-body > div.product-view > div.product-view-top > div > div > div > div.col-lg-9.col-md-9.col-sm-12.col-xs-12 > div > div.col-lg-7.col-md-7.col-sm-7.col-xs-12 > div > div.info-block > ul > li:nth-child(3) > ul > li:nth-child(1) > span > strong'
  ).textContent;
  product.warrantyPeriodByDay = 120 + Math.ceil(Math.random() * 240);
  product.availableQuantity = Math.ceil(Math.random() * 100);

  product.mainImageName = product.title + '_image.jpg';

  product.detail = [...details]
    .filter((el) => el.querySelector('img') === null)
    .map((el) => el.textContent)
    .join('\r\n');
  return product;
};

const getProductLinks = () => {
  const result = [];
  const products = document.querySelectorAll('.product-block');
  [...products].forEach((product) => {
    const link = product
      .querySelector('.thumbnail-item')
      .querySelector('a').href;
    result.push(link);
  });
  return result;
};

exports.getAllProductLinkFromCategory = async (browser, categoryLink) => {
  const page = await browser.newPage();
  await page.goto(categoryLink);
  const allProductLink = await page.evaluate(getProductLinks);
  page.close();
  return allProductLink;
};

exports.crawProductDetail = async (browser, productLink) => {
  const page = await browser.newPage();
  await page.goto(productLink);
  const product = await page.evaluate(getProductDetail);
  page.close();
  return product;
};
