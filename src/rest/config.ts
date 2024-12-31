import convict from 'convict';

convict.addFormat({
  name: 'mongodb-uri',
  validate: function(val: string) {
    if (typeof val !== 'string') {
      throw new Error('must be a string');
    }
    if (!val.startsWith('mongodb://') && !val.startsWith('mongodb+srv://')) {
      throw new Error('must start with mongodb:// or mongodb+srv://');
    }
    try {
      new URL(val); // Проверка валидности URL
    } catch (e) {
      throw new Error('must be a valid URL');
    }
  }
});

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  dbHost: {
    doc: 'Database host',
    format: 'mongodb-uri',
    default: 'mongodb://127.0.0.1:27017/',
    env: 'DB_HOST'
  },
  salt: {
    doc: 'Salt string',
    format: String,
    default: '',
    env: 'SALT'
  },
  jwtSecret: {
    doc: 'JWT Secret Key',
    format: String,
    default: '',
    env: 'JWT_SECRET'
  }
});

config.validate({ allowed: 'strict' });

export default config;
