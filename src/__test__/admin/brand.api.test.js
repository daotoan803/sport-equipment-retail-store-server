const path = require('path');
const Brand = require('../../models/brand.model');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const testUtils = require('../../utils/test.utils');
const TestServer = require('../../utils/test-server');

describe('Test admin functionality with brand', () => {
  let adminToken = null;
  let uploadedImage = [];
  let proxy = '';
  const testServer = new TestServer();

  beforeAll(async () => {
    await testServer.startServer();
    proxy = testServer.proxy;
    adminToken = await testUtils.getAdminToken(proxy);
    return;
  });

  afterAll(() => {
    testUtils.deleteUploadedTestImage(...uploadedImage);
    testServer.shutDownServer();
  });

  describe('Create new brand', () => {
    const brandName = 'Sample test brand';
    const imagePath = path.join(
      __dirname,
      '..',
      'data',
      '__test__2__test__.jpg'
    );

    afterAll((done) => {
      Brand.destroy({
        where: {
          name: brandName,
        },
      }).then(() => done());
    });

    it('Should create a new brand', (done) => {
      const brandData = new FormData();
      brandData.append('name', brandName);
      brandData.append('image', fs.createReadStream(imagePath));
      axios
        .post(`${proxy}/api/admin/brands/`, brandData, {
          headers: {
            ...brandData.getHeaders(),
            authorization: 'Bearer ' + adminToken,
          },
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.data).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: expect.stringMatching(brandName),
              logoUrl: expect.any(String),
            })
          );
          uploadedImage.push(res.data.logoUrl);
          done();
        })
        .catch(done);
    });

    it("Should fail because brand's name already exists", (done) => {
      const brandData = new FormData();
      brandData.append('name', brandName);
      brandData.append('image', fs.createReadStream(imagePath));

      axios
        .post(`${proxy}/api/admin/brands`, brandData, {
          headers: {
            ...brandData.getHeaders(),
            authorization: 'Bearer ' + adminToken,
          },
        })
        .then((res) => {
          expect(res.status).toBe(409);
          done();
        })
        .catch((err) => {
          if (err.response) {
            const res = err.response;
            try {
              expect(res.status).toBe(409);
              expect(res.data).toEqual(
                expect.objectContaining({
                  error: expect.any(String),
                })
              );
              done();
            } catch (error) {
              done(error);
            }
          } else {
            throw err;
          }
        });
    });
  });
});
