const request = require('supertest');
const path = require('path');
const app = require('../../../app');
const Brand = require('../../models/brand.model');
const database = require('../../models');
const fs = require('fs');

afterAll(() => {
  database.terminate();
});

describe('Get brand', () => {
  it('GET /api/brands', (done) => {
    request(app)
      .get('/api/brands')
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        const brands = res.body;
        if (brands.length > 0) {
          expect(brands).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
            ])
          );
        } else {
          expect(brands).toEqual(expect.any(Array));
        }
        done();
      })
      .catch((err) => done(err));
  });
});

describe('Create new brand', () => {
  const brandName = 'Sample test brand';
  let adminToken = null;

  beforeAll((done) => {
    const adminAcc = {
      email: 'vnsport@vnsport.com',
      password: 'admin',
    };
    request(app)
      .post('/api/user/signin')
      .send(adminAcc)
      .then((response) => {
        adminToken = response.body.token;
        done();
      });
  });

  afterAll(async () => {
    await Brand.destroy({
      where: {
        name: brandName,
      },
    });
  });

  it('Should create a new brand', (done) => {
    const filePath = path.join(
      __dirname,
      '..',
      'data',
      '0700b59b0a405697a65f09fb414e75fe.jpg'
    );
    const image = fs.readFileSync(filePath);
    request(app)
      .post('/api/admin/brands')
      .set('authorization', 'Bearer ' + adminToken)
      .field('name', brandName)
      .attach('image', image, {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg',
      })
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringMatching(brandName),
            logoUrl: expect.any(String),
          })
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should fail because brand's name already exists", (done) => {
    const imagePath = path.join(
      __dirname,
      '..',
      'data',
      '0700b59b0a405697a65f09fb414e75fe.jpg'
    );
    const image = fs.readFileSync(imagePath);
    request(app)
      .post('/api/admin/brands')
      .set('authorization', 'Bearer ' + adminToken)
      .field('name', brandName)
      .attach('image', image, {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg',
      })
      .expect('content-type', /json/)
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
          })
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
