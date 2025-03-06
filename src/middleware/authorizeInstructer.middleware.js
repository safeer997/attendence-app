const authorizeInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only instructors can perform this action.',
    });
  }
  next();
};

export { authorizeInstructor };
