import * as fs from "fs";
import * as path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.join(__dirname, "../.env");
  if (!fs.existsSync(envPath)) {
    throw new Error(
      "playwright/.env not found. Copy playwright/.env.example to playwright/.env and fill in your credentials."
    );
  }
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key?.trim() && rest.length) env[key.trim()] = rest.join("=").trim();
  }
  return env;
}

const env = loadEnv();

export const BASE_URL = env.DEMO_URL ?? "https://react.sdk-demo.unidy.io";
export const EMAIL = env.DEMO_EMAIL ?? "";
export const PASSWORD = env.DEMO_PASSWORD ?? "";
export const BRAND = env.DEMO_BRAND ?? "";
export const brandSuffix = BRAND ? `?brand=${BRAND}` : "";
