// const events = require('events');

// const addingBrandToCategoryEvent = new events.EventEmitter();
// addingBrandToCategoryEvent.setMaxListeners(0);

// let isAdding = false;

// addingBrandToCategoryEvent.on('start', () => {
//   isAdding = true;
// });

// const anotherAddBrandToCategoryRequestFinish = () => {
//   return new Promise((resolve) => {
//     addingBrandToCategoryEvent.on('finish', () => {
//       isAdding = false;
//       resolve();
//     });
//   });
// };

module.exports = {
  async addBrandToCategory(req) {
    console.log('waiting for previous request done');

    const { brand, category } = req;

    // if (isAdding) await anotherAddBrandToCategoryRequestFinish();
    // addingBrandToCategoryEvent.emit('start');

    try {
      const brandIsExisted = await category.hasBrand(brand, {
        logging: console.log,
      });
      if (!brandIsExisted) {
        await category.addBrand(brand, { logging: console.log });
      }
    } catch (e) {
      console.error(e);
    }
    // addingBrandToCategoryEvent.emit('finish');
    // console.log('previous request done');
  },
};
