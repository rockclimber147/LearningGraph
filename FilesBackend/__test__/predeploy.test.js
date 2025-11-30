import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js'; // ESM import

describe.only('post_deploy', () => {
  it('should return 200 and "healthy"', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('healthy');
  });
});
