import jwt from "jsonwebtoken";

export const genrateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRATE, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 100,
    sameSite: "strict",
    secure: false,
  });
  return token;
};