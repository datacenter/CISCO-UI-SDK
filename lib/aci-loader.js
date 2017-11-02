
// export const compConfigLoader = require.context("../config", true, /^\.\//);
const _compConfigLoader = require.context("../config", true, /^\.\//);
const _queryConfigLoader = require.context("../queries", true, /^\.\//);
const _userComponentsLoader = require.context("../components", true, /^\.\//);

export const compConfigLoader = (path) => _compConfigLoader("./"+path).default

export const queryConfigLoader = (path) => _queryConfigLoader("./"+path).default

export const userComponentsLoader = (path) => _userComponentsLoader("./"+path).default
