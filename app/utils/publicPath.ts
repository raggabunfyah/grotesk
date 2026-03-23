const BASE_PATH = process.env.NODE_ENV === "production" ? "/grotesk" : "";

export const publicPath = (path: string) => {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
};
