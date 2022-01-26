const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const getCategoriesLink = () => {
  let navCategories = [];
  const navBar = document.querySelector('.nav');
  [...navBar.querySelectorAll('li')].forEach((el) => {
    if (el.classList.contains('haschild')) return;

    const categoryLink = el.querySelector('a');
    navCategories.push({
      category: categoryLink.textContent,
      link: categoryLink.href,
    });
  });
  return navCategories;
};

const getProductLink = () => {
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

const getProductDetail = () => {
  const product = {};
  const productBlock = document.querySelector('.info-block');
  product.title = productBlock.querySelector(
    'h1[itemprop="name"]'
  )?.textContent;
  product.price = productBlock.querySelector('.price-old')?.textContent;

  const details = document.querySelector('.tab-content').querySelectorAll('p');

  const category =
    document.querySelector(
      '#main-body > div.breadcrumb > div > span:nth-child(5) > a > span'
    ) ||
    document.querySelector(
      '#main-body > div.breadcrumb > div > span:nth-child(3) > a > span'
    );
  product.category = category.textContent;

  product.imageLink = document.querySelector(
    '#main-body > div.product-view > div.product-view-top > div > div > div > div.col-lg-9.col-md-9.col-sm-12.col-xs-12 > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12 > div > div.product-image > a > img'
  ).src;
  product.discountPrice = productBlock.querySelector('.price-new')?.textContent;
  product.brand = document.querySelector(
    '#main-body > div.product-view > div.product-view-top > div > div > div > div.col-lg-9.col-md-9.col-sm-12.col-xs-12 > div > div.col-lg-7.col-md-7.col-sm-7.col-xs-12 > div > div.info-block > ul > li:nth-child(3) > ul > li:nth-child(1) > span > strong'
  ).textContent;
  product.warrantyPeriodByDay = 120 + Math.ceil(Math.random() * 240);
  product.availableQuantity = Math.ceil(Math.random() * 1000);

  product.detail = [...details]
    .filter((el) => el.querySelector('img') === null)
    .map((el) => el.textContent)
    .join('\r\n');
  return product;
};

const getAllProductLinkFromEachCategory = async (browser, categories) => {
  const productLinks = [];
  const tempCategories = categories.slice(0);
  console.log('getting category link');

  let async = [];
  while (tempCategories.length !== 0) {
    const category = tempCategories.pop();
    console.log('getting product link in category : ' + category.category);
    async.push(
      browser
        .newPage()
        .then(async (page) => {
          await page.goto(category.link);
          return page;
        })
        .then(async (page) => {
          let result = await page.evaluate(getProductLink);
          page.close();
          return result;
        })
    );

    if (async.length >= Math.min(5, tempCategories.length)) {
      const categoriesLinks = await Promise.all(async);
      categoriesLinks.forEach((categoryLinks) => {
        categoryLinks.forEach((link) => productLinks.push(link));
      });
      async = [];
    }
  }
  fs.writeFile(
    path.join(__dirname, 'product_links.json'),
    JSON.stringify(productLinks),
    (err) => {
      if (err) console.error(err);
    }
  );
  return productLinks;
};

const pageUrl = 'https://dungcutheduc.vn/';
const main = async () => {
  const writer = fs.createWriteStream(
    path.join(__dirname, 'data.json'),
    'utf8'
  );

  writer.write('[');
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(pageUrl);

    let categories = await page.evaluate(getCategoriesLink);
    page.close();
    // console.log(categories);

    categories.splice(0, 1);

    const productLinks = await getAllProductLinkFromEachCategory(
      browser,
      categories
    );
    console.log('getting product details');
    let async = [];
    for (const [index, productLink] of productLinks.entries()) {
      console.log(`getting product at ${index} : ${productLink} `);
      async.push(
        browser
          .newPage()
          .then(async (page) => {
            page.setDefaultNavigationTimeout(100000);
            await page.goto(productLink);
            return page;
          })
          .then(async (page) => {
            const result = await page.evaluate(getProductDetail);
            page.close();
            return result;
          })
      );
      // await page.goto(productLink);
      // const product = await page.evaluate(getProductDetail);

      if (async.length >= Math.min(8, productLinks.length - index)) {
        const products = await Promise.all(async);
        products.forEach((product) => {
          writer.write(JSON.stringify(product));
          writer.write(',');
        });
        async = [];
      }
    }

    console.log('done');
  } catch (e) {
    console.error(e);
  }
  
  await browser.close();
  writer.write(']');
  writer.end();
  writer.close();
};

const t0 = performance.now();
main().then(() => {
  const t1 = performance.now();
  console.log(
    `Time to finish ${Math.floor((t1 - t0) * 1000) / 1000} milliseconds.`
  );
});
