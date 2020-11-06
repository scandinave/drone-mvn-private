import { log } from "./deps.ts";
import { SettingsGenerator } from "./settings-generator.ts";

const username = Deno.env.get("PLUGIN_USERNAME");
const password = Deno.env.get("PLUGIN_PASSWORD");
const m2 = Deno.env.get("PLUGIN_M2_LOCATION") ?? Deno.env.get("PWD");
const url = Deno.env.get("PLUGIN_URL");
const url_snapshots = Deno.env.get("PLUGIN_URL_SNAPSHOTS");
const url_releases = Deno.env.get("PLUGIN_URL_RELEASES");
const debug = Deno.env.get("PLUGIN_URL_DEBUG") != "false" &&
  Deno.env.get("PLUGIN_URL_DEBUG") != undefined;

if (debug) {
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["console"],
      },
    },
  });
}

if (!username) {
  throw Error("You must set a username");
}
if (!password) {
  throw Error("You must set a password");
}
if (!url) {
  throw Error("You must set an url");
}

if (!url_snapshots) {
  throw Error("You must set a repository snapshots url");
}

if (!url_releases) {
  throw Error("You must set a repository releases url");
}

if(!m2) {
  throw new Error("Context path can not be determined. You must specified a m2 location");
}

log.info("Generating settings.xml...");
const generator = new SettingsGenerator(
  url,
  url_releases,
  url_snapshots,
  username,
  password,
  m2
);
const result = generator.generate();

await Deno.writeTextFile("settings.xml", result);

log.info("Done.");
log.debug(result);
