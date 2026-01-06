import jwt from "jsonwebtoken";

export async function getUser(req) {
     const refreshToken = req.cookies.get("jwt")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 401 }
      );
    }
     let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRATE);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }
    return decoded;
}