import { ajv, getValidationMessage } from '#validators/ajv';

function validateData(schema, data) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (!isValid) {
    return getValidationMessage(validate);
  }

  return null;
}

export default validateData;
