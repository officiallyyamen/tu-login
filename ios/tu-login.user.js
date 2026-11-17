// ==UserScript==
// @name         TU Login automatisch
// @description  TUWEL: klickt "TU Wien Login", füllt Matrikelnummer, Passwort und 2FA-Code aus und meldet an.
// @version      1.0
// @match        https://tuwel.tuwien.ac.at/login/*
// @match        https://idp.zid.tuwien.ac.at/*
// @run-at       document-end
// ==/UserScript==

// ---- HIER DEINE DATEN EINTRAGEN ----
const USERNAME = "";      // Matrikelnummer / Benutzername
const PASSWORD = "";      // Passwort
const SECRET   = "";      // 2FA-Schlüssel (Base32)
// ------------------------------------

(async () => {
  function base32Decode(input) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = 0, value = 0;
    const out = [];
    for (const ch of input.toUpperCase().replace(/[\s=-]/g, "")) {
      value = (value << 5) | alphabet.indexOf(ch);
      bits += 5;
      if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
    }
    return new Uint8Array(out);
  }

  async function totp(secret, time = Date.now()) {
    const key = await crypto.subtle.importKey("raw", base32Decode(secret),
      { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
    const counter = Math.floor(time / 30000);
    const msg = new ArrayBuffer(8);
    const v = new DataView(msg);
    v.setUint32(0, Math.floor(counter / 2 ** 32));
    v.setUint32(4, counter >>> 0);
    const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
    const o = h[h.length - 1] & 0x0f;
    const bin = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
    return { code: String(bin % 1e6).padStart(6, "0"), left: 30 - (Math.floor(time / 1000) % 30) };
  }

  const recently = (key, ms) => {
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < ms) return true;
    sessionStorage.setItem(key, String(Date.now()));
    return false;
  };

  // TUWEL start page: click "TU Wien Login"
  if (location.hostname === "tuwel.tuwien.ac.at") {
    const link = [...document.querySelectorAll("a, button")].find(el =>
      (el.getAttribute("href") || "").includes("auth/saml2/login.php") ||
      /TU Wien Login/i.test(el.textContent || ""));
    if (link && !recently("tu_tuwel", 30000)) link.click();
    return;
  }

  // IdP login page
  const user = document.querySelector("#username, input[name='username']");
  const pass = document.querySelector("#password, input[name='password']");
  const otp = document.querySelector("#totp, input[name='totp']");
  if (!user && !otp) return;
  if (!USERNAME || !PASSWORD || !SECRET) return;

  const set = (el, val) => {
    if (!el) return;
    el.value = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  set(user, USERNAME);
  set(pass, PASSWORD);
  if (otp) {
    let r = await totp(SECRET);
    if (r.left < 4) {
      await new Promise(res => setTimeout(res, r.left * 1000 + 300));
      r = await totp(SECRET);
    }
    set(otp, r.code);
  }
  const btn = document.querySelector("#samlloginbutton, button[type='submit'], input[type='submit']");
  if (btn && !recently("tu_idp", 60000)) btn.click();
})();
