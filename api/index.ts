// @ts-expect-error - built server output, no types
import server from "../dist/server/server.js";

export const config = { runtime: "edge" };
export default server;
