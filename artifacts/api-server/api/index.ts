export default async function (req: any, res: any) {
  try {
    const app = (await import("../src/app")).default;
    return app(req, res);
  } catch (err: any) {
    console.error("VERCEL CRASH ERROR:", err);
    res.status(500).json({
      error: "Runtime Crash",
      message: err?.message,
      stack: err?.stack
    });
  }
}
