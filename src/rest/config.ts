import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';

convict.addFormat(convictFormatWithValidator.ipaddress);

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
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'DB_HOST'
  },
  salt: {
    doc: 'Salt string',
    format: String,
    default: '',
    env: 'SALT'
  }
});

config.validate({ allowed: 'strict' });

export default config;
