const Joi = require('@hapi/joi');

/**
 * Usage: pass an object with optional `body`, `query`, `params` Joi schemas.
 * Example: validate({ body: Joi.object({ name: Joi.string().required() }) })
 */
const validate = (schemas = {}) => (req, res, next) => {
  try {
    const toValidate = {};
    if (schemas.params) toValidate.params = { value: req.params, schema: schemas.params };
    if (schemas.query) toValidate.query = { value: req.query, schema: schemas.query };
    if (schemas.body) toValidate.body = { value: req.body, schema: schemas.body };

    for (const key of Object.keys(toValidate)) {
      const { value, schema } = toValidate[key];
      const { error, value: validated } = schema.validate(value, { abortEarly: false, stripUnknown: true });
      if (error) {
        const details = error.details.map(d => ({ message: d.message, path: d.path }));
        return res.status(400).json({ success: false, message: 'Validation failed', errors: details });
      }
      // replace sanitized values
      if (key === 'body') req.body = validated;
      if (key === 'query') req.query = validated;
      if (key === 'params') req.params = validated;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = validate;
