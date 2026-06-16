import Ajv from 'ajv';

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  removeAdditional: false,
});

function getValidationMessage(validate) {
  return ajv.errorsText(validate.errors, { separator: '; ' });
}

export { ajv, getValidationMessage };
