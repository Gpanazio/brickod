import express from 'express';
import request from 'supertest';
import { registerRoutes } from './routes';

// Integration tests for project routes

describe('project routes', () => {
  const app = express();
  app.use(express.json());

  beforeAll(async () => {
    await registerRoutes(app);
  });

  it('creates and retrieves a project', async () => {
    const createRes = await request(app)
      .post('/api/projects')
      .send({ name: 'Test Project' })
      .expect(201);

    expect(createRes.body.name).toBe('Test Project');
    const id = createRes.body.id;

    const getRes = await request(app).get(`/api/projects/${id}`).expect(200);
    expect(getRes.body.id).toBe(id);
  });

  it('lists projects', async () => {
    const res = await request(app).get('/api/projects').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
