const $ = id => document.getElementById(id);

async function showCode() {
  const { secret } = await chrome.storage.local.get({ secret: "" });
  if (!secret) { $("code").textContent = "——————"; return; }
  try {
    const { code, left } = await totp(secret);
    $("code").textContent = `${code.slice(0, 3)} ${code.slice(3)}  (${left}s)`;
  } catch (e) {
    $("code").textContent = "Fehler";
  }
}

(async () => {
  const c = await chrome.storage.local.get({ username: "", password: "", secret: "", autoSubmit: true });
  $("username").value = c.username;
  $("password").value = c.password;
  $("secret").value = c.secret;
  $("auto").checked = c.autoSubmit;
  showCode();
  setInterval(showCode, 1000);
})();

$("save").addEventListener("click", async () => {
  const secret = $("secret").value.trim().replace(/\s+/g, "").toUpperCase();
  const username = $("username").value.trim();
  const password = $("password").value;
  if (!username || !password || !secret) {
    $("status").textContent = "Bitte alle drei Felder ausfüllen.";
    return;
  }
  try {
    await totp(secret); // validates Base32
  } catch (e) {
    $("status").textContent = e.message;
    return;
  }
  await chrome.storage.local.set({ username, password, secret, autoSubmit: $("auto").checked });
  $("status").textContent = "Gespeichert. Vergleiche den Code unten mit deiner App.";
  showCode();
});
