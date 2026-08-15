import { ValidationError } from "../../../../shared/errors/app-error.js";

const validate = function (schema, source = "body") {
    return function (req, res, next) {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const message = result.error.issues
                .map(issue => `${issue.path.join(".")}: ${issue.message}`)
                .join(", ");

            return next(new ValidationError(message));
        }

        res.locals.validated = res.locals.validated || {};
        res.locals.validated[source] = result.data;

        next();
    };
};

export default validate;