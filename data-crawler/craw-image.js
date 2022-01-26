const fs = require('fs');
const path = require('path');
const https = require('https');

const cleanImageFolder = async () => {
  const imageDir = path.join(__dirname, 'images');
  const files = await fs.promises.readdir(imageDir);
  const async = [];
  files.forEach((file) =>
    async.push(fs.promises.unlink(path.join(imageDir, file)))
  );
  return Promise.all(async);
};

const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close(resolve(true));
        });
      })
      .on('error', (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });

const main = async () => {
  await cleanImageFolder();
  const products = JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'data.json'))
  );

  const writer = fs.createWriteStream(
    path.join(__dirname, 'final_data.json'),
    'utf-8'
  );
  writer.write('[');

  let async = [];
  for (const [index, product] of products.entries()) {
    console.log(`getting image ${index} of product: ${product.title}`);
    //https://dungcutheduc.vn/images/may-chay-bo-sakura-s33.jpg
    let imageName = product.imageLink.split('/');
    imageName = imageName.pop();
    const dest = path.join(__dirname, 'images', imageName);
    product.imageName = imageName;
    async.push(download(product.imageLink, dest));
    if (async.length === 20) {
      await Promise.all(async);
      async = [];
    }
    writer.write(JSON.stringify(product));
    writer.write(',');
  }
  writer.write(']');
  writer.end();
  writer.close();
};

const t0 = performance.now();
main();
const t1 = performance.now();
console.log(
  `Time to finish ${Math.floor((t1 - t0) * 1000) / 1000} milliseconds.`
);
