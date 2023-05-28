export const errorOccurred = async (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    return res
        .status(error.code || 500)
        .json({ message: error.message || "An unknown error occurred!" });
};
//# sourceMappingURL=../../maps/controllers/error-controllers.js.map