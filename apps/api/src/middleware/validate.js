import { z } from "zod";
export function validate(schema, where = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[where]);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation error",
                issues: z.treeifyError(result.error),
            });
        }
        res.locals[`validated_${where}`] = result.data; // Ponerle la version limpia
        next();
    };
}
