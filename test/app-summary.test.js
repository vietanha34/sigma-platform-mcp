const test = require('node:test');
const assert = require('node:assert/strict');

const { summarizeApp, summarizeAppsResponse } = require('../dist/tools/auth/app-summary.js');

test('summarizeApp exposes uuid id and keeps slug separately', () => {
  const app = {
    id: '759101f1-f0ec-419b-ab5a-a635590e9ce1',
    appId: 'testmedialive',
    name: 'test-media-live',
    status: 'active',
    products: ['transcode'],
  };

  assert.deepEqual(summarizeApp(app), {
    id: '759101f1-f0ec-419b-ab5a-a635590e9ce1',
    slug: 'testmedialive',
    name: 'test-media-live',
    status: 'active',
    products: ['transcode'],
  });
});

test('summarizeAppsResponse maps list payload into uuid-first summaries', () => {
  const payload = {
    data: [
      {
        id: '759101f1-f0ec-419b-ab5a-a635590e9ce1',
        appId: 'testmedialive',
        name: 'test-media-live',
        status: 'active',
        products: ['transcode', 'livestream'],
      },
    ],
    total: 1,
    count: 1,
    page: 1,
    perPage: 10,
  };

  assert.deepEqual(summarizeAppsResponse(payload), {
    data: [
      {
        id: '759101f1-f0ec-419b-ab5a-a635590e9ce1',
        slug: 'testmedialive',
        name: 'test-media-live',
        status: 'active',
        products: ['transcode', 'livestream'],
      },
    ],
    total: 1,
    count: 1,
    page: 1,
    perPage: 10,
  });
});
