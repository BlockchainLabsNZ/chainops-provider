import * as envVar from 'env-var';

const config = {
    NODE_ENV: envVar.get('NODE_ENV', 'development').asString(),
    hello: 'world'
};

export default config;
