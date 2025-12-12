declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'test' | 'production';
    PORT?: string;
    PG_DB?: string;
    PG_HOST?: string;
    PG_PORT?: string;
    PG_USER?: string;
    PG_PASSWORD?: string;
  }
}
