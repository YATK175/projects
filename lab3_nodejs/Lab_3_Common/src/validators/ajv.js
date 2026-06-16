const Ajv = require('ajv');

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  removeAdditional: false,
});

function getValidationMessage(validate) {
  return ajv.errorsText(validate.errors, { separator: '; ' });
}

module.exports = {
  ajv,
  getValidationMessage,
};
