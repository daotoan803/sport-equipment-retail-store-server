require('dotenv').config();

const productCrawler = require('./product.craw');
const categoryCrawler = require('./category.craw');
const imageCrawler = require('./image.craw');

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const { threadPool } = require('./crawler.utils');

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });

  let categories = await categoryCrawler.crawCategories(browser);
  fs.promises.writeFile(
    path.join(__dirname, './category.json'),
    JSON.stringify(categories)
  );

  categories = categoryCrawler.mapCategoriesLink(categories);

  const productLinksOfCategory = {};
  await threadPool(
    categories.map((category) => {
      return async () => {
        console.log('getting product links from category ' + category.name);
        const productLinks = await productCrawler.getAllProductLinkFromCategory(
          browser,
          category.link
        );
        productLinksOfCategory[category.name] = productLinks;
      };
    }),
    7
  );

  const products = [];
  for (const [category, productLinks] of Object.entries(
    productLinksOfCategory
  )) {
    await threadPool(
      productLinks.map((productLink) => {
        return async () => {
          console.log(`getting product ${productLink} of category ${category}`);
          try {
            const product = await productCrawler.crawProductDetail(
              browser,
              productLink
            );
            product.category = category;
            products.push(product);
          } catch (e) {
            console.error(e);
          }
        };
      }),
      5
    );
  }

  fs.promises.writeFile(
    path.join(__dirname, 'products.json'),
    JSON.stringify(products)
  );

  //download product image
  await imageCrawler.cleanImageFolder();
  await threadPool(
    products.map((product) => {
      return async () => {
        console.log(`downloading ${product.mainImageName} image`);
        await imageCrawler.download(product.imageLink, product.mainImageName);
      };
    }),
    10
  );
};

main();
