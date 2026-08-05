import {body,validationResult} from "express-validator";

async function validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg
    }));
    res.status(400).json({ errors: formattedErrors });
}
export const registerValidation = [
    body("name")
        .isString().withMessage("Name must be a string")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("username")
        .isString().withMessage("Username must be a string")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    body("email")
        .isEmail().withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain a number"),

    body("dateOfBirth")
        .isISO8601().withMessage("Please provide a valid date")
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 13) {
                throw new Error("You must be at least 13 years old to register");
            }
            return true;
        }),

    validate
];

export const loginValidation=[
    body("email")
        .isEmail().withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain a number")
        .notEmpty().withMessage("Password is required"),
    validate
]
export const emailValidation=[
    body("email")
        .isEmail().withMessage("Please enter a valid email")
        .normalizeEmail(),
    validate
]