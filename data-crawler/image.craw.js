const fs = require('fs');
const path = require('path');
const https = require('https');

exports.cleanImageFolder = async () => {
  const imageDir = path.join(__dirname, 'images');
  const files = await fs.promises.readdir(imageDir);
  await Promise.all(
    files.map((file) => fs.promises.unlink(path.join(imageDir, file)))
  );
  return;
};

exports.download = (imageUrl, imageName) => {
  return new Promise((resolve, reject) => {
    const destination = path.join(__dirname, 'images', imageName);
    const file = fs.createWriteStream(destination);

    https
      .get(imageUrl, (response) => {
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
};
