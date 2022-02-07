const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const categoryCrawler = require('./category.craw');
const productCrawler = require('./product.craw');
const upload = require('./upload');

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

const getAllProductLinkFromEachCategory = async (browser, categories) => {
  const productLinks = [];
  const tempCategories = categories.slice(0);
  console.log('getting category link');

  let async = [];
  while (tempCategories.length !== 0) {
    const category = tempCategories.pop();
    console.log('getting product link in category : ' + category);
    async.push(
      browser
        .newPage()
        .then(async (page) => {
          await page.goto(category);
          return page;
        })
        .then(async (page) => {
          let result = await page.evaluate(getProductLink);
          page.close();
          return result;
        })
    );

    if (async.length >= Math.min(8, tempCategories.length)) {
      const categoriesLinks = await Promise.all(async);
      categoriesLinks.forEach((categoryLinks) => {
        categoryLinks.forEach((link) => productLinks.push(link));
      });
      async = [];
    }
  }

  return productLinks;
};

const pageUrl = 'https://dungcutheduc.vn/';
const main = async () => {
  let async = [];
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

    const categories = await page.evaluate(categoryCrawler.getCategoriesLink);
    page.close();

    const categoryLinks = [];
    Object.keys(categories).forEach((parentCategory) => {
      upload
        .addCategoryGroup(parentCategory)
        .then((group) =>
          categories[parentCategory].map((category) =>
            group.createCategory(category.name)
          )
        );
      categories[parentCategory].forEach((childCategory) => {
        categoryLinks.push(childCategory.link);
      });
    });

    const productLinks = await getAllProductLinkFromEachCategory(
      browser,
      categoryLinks
    );
    console.log('getting product details');
    async = [];
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
            const result = await page.evaluate(productCrawler.getProductDetail);
            page.close();
            return result;
          })
      );

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
