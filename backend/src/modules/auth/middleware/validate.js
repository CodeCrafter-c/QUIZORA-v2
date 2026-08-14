import { ValidationError } from "../../../../shared/errors/app-error.js";

const validate = function (schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues
                .map(issue => `${issue.path.join(".")}: ${issue.message}`)
                .join(", ");

            return next(new ValidationError(message));
        }

        req.body = result.data;
        next();
    };
};

export default validate;