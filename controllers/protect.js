exports.getProtectedRoute = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "Only candidate who is authorized can see this: ",
  });
};
