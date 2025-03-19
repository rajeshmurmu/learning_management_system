export const authorization = (roles = []) => {
  return (req, res, next) => {
    const role = req.user?.role || "";
    if (!roles.includes(role)) {
      return next(
        new Error(`Role: ${role} is not allowed to access this resource`, {
          status: 403,
        })
      );
    }

    next();
  };
};
