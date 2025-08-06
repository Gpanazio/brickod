import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { registerRoutes } from './routes';

// Tests for project-related API routes

test('project routes', async (t) => {
  const app = express();
  app.use(express.json());

  await registerRoutes(app);

  await t.test('DELETE /api/projects/:id removes project', async () => {
    // create a project
    const createRes = await request(app)
      .post('/api/projects')
      .send({ name: 'Temp Project' })
      .expect(201);

    const id = createRes.body.id;
    assert.ok(id);

    // delete the project
    await request(app)
      .delete(`/api/projects/${id}`)
      .expect(204);

    // ensure it is gone
    await request(app)
      .get(`/api/projects/${id}`)
      .expect(404);
  });
});
