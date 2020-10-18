const path = require('path');

const thread = require('./thread');

function removeWebpackProtocolAndPackageName(requestUrl) {
  return requestUrl.replace(/^webpack:\/\/[^/]+\//, '');
}

function removeContext(context) {
  return (requestUrl) => path.relative(context, requestUrl);
}

function removeLoaders(requestUrl) {
  const segments = requestUrl.split('!');
  return segments[segments.length - 1];
}

function removeMultiChunk(requestUrl) {
  return requestUrl
    .replace(/^multi /, '')
    .replace(/ [a-z0-9]{32}$/, '')
    .replace(/ [0-9]$/, '');
}

/**
 * @param {string} requestUrl
 * @param {string} context
 *
 * @returns {string}
 */
function getParsedIdentifer(requestUrl, context) {
  return thread(
    requestUrl,
    removeLoaders,
    removeWebpackProtocolAndPackageName,
    removeMultiChunk,
    removeContext(context),
  );
}

/**
 * @param {string} requestUrl
 * @param {string} context
 *
 * @returns {string}
 */
function getStatIdentifier(requestUrl, context) {
  return thread(
    requestUrl,
    removeLoaders,
    removeMultiChunk,
    removeContext(context),
  );
}

module.exports = { getStatIdentifier, getParsedIdentifer };
