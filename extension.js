import { getRequestHeaders } from "../../../../script.js";
import {
  extension_settings,
  renderExtensionTemplate,
} from "../../../extensions.js";

if (extension_settings["adminpanel"] === undefined) {
  extension_settings["adminpanel"] = {};
}

async function loadSettingsHTML() {
  const settingsHtml = renderExtensionTemplate(
    "third-party/SillyTavern-AdminPanel",
    "dropdown"
  );
  extension_settings.adminpanel = extension_settings.adminpanel ?? {
    config: "",
  };
  extension_settings.adminpanel.config = await fetch(
    "/api/plugins/adminpanel/config"
  ).then((res) => res.text());
  console.log(extension_settings.adminpanel.config);
  $("#extensions_settings2").append(settingsHtml);
  $("#adminpanel_config").val(extension_settings.adminpanel.config);
  $("#adminpanel_updateconfig").on("click", async () => {
    await fetch("/api/plugins/adminpanel/config", {
      method: "POST",
      // @ts-expect-error
      body: $("#adminpanel_config").val(),
      headers: getRequestHeaders(),
      credentials: "same-origin",
    });
    await fetch("/api/plugins/adminpanel/restart", {
      method: "GET",
      headers: getRequestHeaders(),
      credentials: "same-origin",
    });
  });
}

jQuery(async () => {
  extension_settings["adminpanel"].config = fetch(
    "/api/plugins/adminpanel/config"
  ).then();
  await loadSettingsHTML();
});
