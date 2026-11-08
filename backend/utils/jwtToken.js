// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "PRODUCTION";

  // Security-hardened cookie configuration
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
