import { SettingsGenerator } from "./settings-generator.ts";

const username = Deno.env.get("PLUGIN_USERNAME");
const password = Deno.env.get("PLUGIN_PASSWORD");
const url = Deno.env.get("PLUGIN_URL");
const url_snapshots = Deno.env.get("PLUGIN_URL_SNAPSHOTS");
const url_releases = Deno.env.get("PLUGIN_URL_RELEASES");
const debug = Deno.env.get("PLUGIN_URL_DEBUG") ?? false;

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

console.log("Generating settings.xml...");
const generator = new SettingsGenerator(url, url_releases, url_snapshots, username, password);
const result = generator.generate();

await Deno.writeTextFile("settings.xml", result);

console.log("Done.");
if(debug) {
  console.debug(result);
}
