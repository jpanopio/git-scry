import request from 'supertest';
import app from '../src/app';

describe('GitHub Controller', () => {
  it('redirects the user to the GitHub login page', async () => {
    const { text: redirectLink } = await request(app).get('/github-login');

    expect(redirectLink).toMatchSnapshot();
  });
});
