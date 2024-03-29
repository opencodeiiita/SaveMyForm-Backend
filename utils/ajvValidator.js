import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
export const validateSchema = (schema, data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
    return false;
  }
  console.log('valid');
  return true;
};
