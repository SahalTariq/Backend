export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// For Production
// httpOnly : true
// secure : true
// sameSite : none

// For Local Development

// httpOnly : true
// secure : false
// sameSite : lax