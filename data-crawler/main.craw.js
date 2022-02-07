require('dotenv').config();

const productCrawler = require('./product.craw');
const categoryCrawler = require('./category.craw');

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const threadPool = async (tasks = [async () => {}], maxThread = 5) => {
  let async = [];
  while (tasks.length !== 0) {
    const task = tasks.pop();
    async.push(task());
    if (async.length >= Math.min(maxThread, tasks.length)) {
      await Promise.all(async);
      async = [];
    }
  }
};

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

  await fs.promises.writeFile(
    path.join(__dirname, 'products.json'),
    JSON.stringify(products)
  );
};

main();
