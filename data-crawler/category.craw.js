const getAllCategoriesLink = () => {
  const categories = { others: [] };
  const parentCategories = [];

  // eslint-disable-next-line no-unused-vars
  const [_, ...topCategories] = document.querySelector(
    '#mainnav > div > nav > ul'
  ).children;
  topCategories.push(...topCategories.pop().querySelector('ul').children);

  topCategories.forEach((category) => {
    if (category.classList.contains('haschild'))
      return parentCategories.push(category);
    else
      categories.others.push({
        name: category.textContent,
        link: category.querySelector('a').href,
      });
  });

  parentCategories.forEach((parentCategory) => {
    const childCategory = [];
    [...parentCategory.querySelectorAll('li')].forEach((category) => {
      childCategory.push({
        name: category.textContent,
        link: category.querySelector('a').href,
      });
    });
    categories[parentCategory.querySelector('.parent').textContent] =
      childCategory;
  });

  return categories;
};

exports.crawCategories = async (browser) => {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://dungcutheduc.vn/');

  const categories = await page.evaluate(getAllCategoriesLink);
  page.close();
  return categories;
};

exports.mapCategoriesLink = (categories) => {
  return Object.values(categories).flat().flat();
};
