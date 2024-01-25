import child_process from "node:child_process";
import fs from "node:fs/promises";

function reqBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      resolve(body);
    });
  });
}

export async function init(router) {
  router.get("/restart", (req, res) => {
    res.send("Restarting");
    child_process.spawn("npx", ["pm2", "restart", "0"]);
  });

  router.post("/config", async (req, res) => {
    console.log(req);
    res.send("OK");
    let body = await reqBody(req);

    fs.writeFile("./config.yaml", body);
    console.log(body);
  });

  router.get("/config", async (req, res) => {
    res.send(await fs.readFile("./config.yaml", "utf-8"));
  });

  console.log("AdminPanel server plugin loaded!");
  return Promise.resolve();
}

export async function exit() {
  // Do some clean-up here...
  return Promise.resolve();
}

export const info = {
  id: "adminpanel",
  name: "AdminPanel",
  description: "Admin Panel for SillyTavern",
};
