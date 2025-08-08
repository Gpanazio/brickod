import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { registerRoutes } from './routes';
import { errorHandler } from './error-handler';

async function setupApp() {
  const app = express();
  app.use(express.json());
  await registerRoutes(app);
  app.use(errorHandler);
  return app;
}

test('call sheet routes', async (t) => {
  const app = await setupApp();
  const data = {
    productionTitle: 'Test Call Sheet',
    shootingDate: '2024-01-01',
    locations: [],
    scenes: [],
    contacts: [],
    crewCallTimes: [],
    castCallTimes: [],
    generalNotes: '',
  };
  let id: string;

  await t.test('POST /api/call-sheets validation error', async () => {
    await request(app).post('/api/call-sheets').send({}).expect(400);
  });

  await t.test('POST /api/call-sheets creates call sheet', async () => {
    const res = await request(app).post('/api/call-sheets').send(data).expect(201);
    id = res.body.id;
    assert.ok(id);
  });

  await t.test('GET /api/call-sheets returns list', async () => {
    const res = await request(app).get('/api/call-sheets').expect(200);
    assert.ok(Array.isArray(res.body));
  });

  await t.test('GET /api/call-sheets/:id returns call sheet', async () => {
    const res = await request(app).get(`/api/call-sheets/${id}`).expect(200);
    assert.equal(res.body.id, id);
  });

  await t.test('PUT /api/call-sheets/:id validation error', async () => {
    await request(app)
      .put(`/api/call-sheets/${id}`)
      .send({ shootingDate: 123 })
      .expect(400);
  });

  await t.test('PUT /api/call-sheets/:id updates call sheet', async () => {
    const res = await request(app)
      .put(`/api/call-sheets/${id}`)
      .send({ productionTitle: 'Updated' })
      .expect(200);
    assert.equal(res.body.productionTitle, 'Updated');
  });

  await t.test('GET unknown call sheet returns 404', async () => {
    await request(app).get('/api/call-sheets/unknown').expect(404);
  });

  await t.test('PUT unknown call sheet returns 404', async () => {
    await request(app)
      .put('/api/call-sheets/unknown')
      .send({ productionTitle: 'X' })
      .expect(404);
  });

  await t.test('DELETE unknown call sheet returns 404', async () => {
    await request(app).delete('/api/call-sheets/unknown').expect(404);
  });

  await t.test('DELETE /api/call-sheets/:id removes call sheet', async () => {
    await request(app).delete(`/api/call-sheets/${id}`).expect(204);
    await request(app).get(`/api/call-sheets/${id}`).expect(404);
  });
});

test('template routes', async (t) => {
  const app = await setupApp();
  const data = {
    name: 'Temp',
    description: 'Desc',
    category: 'general',
    isDefault: false,
    templateData: {
      locations: [],
      scenes: [],
      contacts: [],
      crewCallTimes: [],
      castCallTimes: [],
      generalNotes: '',
    },
  };
  let id: string;

  await t.test('POST /api/templates validation error', async () => {
    await request(app).post('/api/templates').send({}).expect(400);
  });

  await t.test('POST /api/templates creates template', async () => {
    const res = await request(app).post('/api/templates').send(data).expect(201);
    id = res.body.id;
    assert.ok(id);
  });

  await t.test('GET /api/templates returns list', async () => {
    const res = await request(app).get('/api/templates').expect(200);
    assert.ok(Array.isArray(res.body));
  });

  await t.test('GET /api/templates/:id returns template', async () => {
    const res = await request(app).get(`/api/templates/${id}`).expect(200);
    assert.equal(res.body.id, id);
  });

  await t.test('PUT /api/templates/:id validation error', async () => {
    await request(app)
      .put(`/api/templates/${id}`)
      .send({ isDefault: 'yes' })
      .expect(400);
  });

  await t.test('PUT /api/templates/:id updates template', async () => {
    const res = await request(app)
      .put(`/api/templates/${id}`)
      .send({ description: 'Updated' })
      .expect(200);
    assert.equal(res.body.description, 'Updated');
  });

  await t.test('GET unknown template returns 404', async () => {
    await request(app).get('/api/templates/unknown').expect(404);
  });

  await t.test('PUT unknown template returns 404', async () => {
    await request(app)
      .put('/api/templates/unknown')
      .send({ description: 'X' })
      .expect(404);
  });

  await t.test('DELETE unknown template returns 404', async () => {
    await request(app).delete('/api/templates/unknown').expect(404);
  });

  await t.test('DELETE /api/templates/:id removes template', async () => {
    await request(app).delete(`/api/templates/${id}`).expect(204);
    await request(app).get(`/api/templates/${id}`).expect(404);
  });
});

test('team member routes', async (t) => {
  const app = await setupApp();
  const data = { name: 'Member', role: 'Role' };
  let id: string;

  await t.test('POST /api/team-members validation error', async () => {
    await request(app).post('/api/team-members').send({}).expect(400);
  });

  await t.test('POST /api/team-members creates member', async () => {
    const res = await request(app).post('/api/team-members').send(data).expect(201);
    id = res.body.id;
    assert.ok(id);
  });

  await t.test('GET /api/team-members returns list', async () => {
    const res = await request(app).get('/api/team-members').expect(200);
    assert.ok(Array.isArray(res.body));
  });

  await t.test('PUT /api/team-members/:id validation error', async () => {
    await request(app)
      .put(`/api/team-members/${id}`)
      .send({ name: 123 })
      .expect(400);
  });

  await t.test('PUT /api/team-members/:id updates member', async () => {
    const res = await request(app)
      .put(`/api/team-members/${id}`)
      .send({ role: 'Updated' })
      .expect(200);
    assert.equal(res.body.role, 'Updated');
  });

  await t.test('PUT unknown member returns 404', async () => {
    await request(app)
      .put('/api/team-members/unknown')
      .send({ role: 'X' })
      .expect(404);
  });

  await t.test('DELETE unknown member returns 404', async () => {
    await request(app).delete('/api/team-members/unknown').expect(404);
  });

  await t.test('DELETE /api/team-members/:id removes member', async () => {
    await request(app).delete(`/api/team-members/${id}`).expect(204);
    await request(app).delete(`/api/team-members/${id}`).expect(404);
  });
});
