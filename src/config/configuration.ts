export default () => ({
  postgres: {
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  cache: {
    url:
      'redis://:' +
      process.env.REDIS_PASS +
      '@' +
      (process.env.REDIS_HOST || 'redis') +
      ':' +
      (process.env.REDIS_PORT || 6379),
  },
  api_key: process.env.API_KEY,
});
