import { authMiddleware } from "@clerk/nextjs";

// This function checks if a user is authenticated or not
export function checkAuth(req) {
  return req.user !== null;
}

// This is an example of a protected route
export async function POST(req, res) {
  if (!checkAuth(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Your protected route logic here
}

// This is an example of a public route
export async function GET(req, res) {
  // Your public route logic here
}

export default authMiddleware({
  // Protect all routes except for the ones listed below
  publicRoutes: ["/", "/about", "/contact", "/api/:path*"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
