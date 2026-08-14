// @ts-nocheck
module.exports = async function (req, res) {
  try {
    const appModule = require("../src/app");
    const app = appModule.default || appModule;
    return app(req, res);
  } catch (err) {
    console.error("VERCEL CRASH ERROR:", err);
    res.status(500).json({
      error: "Runtime Crash",
      message: err?.message,
      stack: err?.stack
    });
  }
}
