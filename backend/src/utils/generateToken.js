import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  return await jwt.sign(
    { userId: user?._id, role: user?.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const generateRefreshToken = async (user) => {
  return await jwt.sign({ userId: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { generateAccessToken, generateRefreshToken };
