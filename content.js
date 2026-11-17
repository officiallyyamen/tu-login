// Runs on idp.zid.tuwien.ac.at: fills username, password and 2FA code, then clicks "Anmelden".
(async () => {
  const totpField = document.querySelector("#totp, input[name='totp']");
  const userField = document.querySelector("#username, input[name='username']");
  const passField = document.querySelector("#password, input[name='password']");
  if (!totpField && !userField) return;

  const cfg = await chrome.storage.local.get({ username: "", password: "", secret: "", autoSubmit: true });
  if (!cfg.secret || !cfg.username || !cfg.password) {
    (totpField || userField).placeholder = "TU Login 2FA: Daten in den Erweiterungs-Optionen eintragen";
    return;
  }

  // Never loop: if the page came back with an error after our own submit, stop.
  const errorShown = document.querySelector(".alert-danger, .error, #error, .alert-error");
  const lastTry = Number(sessionStorage.getItem("tu2fa_submit") || 0);
  if (errorShown && Date.now() - lastTry < 60000) return;

  const set = (el, v) => {
    if (!el) return;
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  set(userField, cfg.username);
  set(passField, cfg.password);

  if (totpField) {
    let r;
    try {
      r = await totp(cfg.secret);
      if (r.left < 4) { // code about to expire: take the next one
        await new Promise(res => setTimeout(res, r.left * 1000 + 300));
        r = await totp(cfg.secret);
      }
    } catch (e) {
      totpField.placeholder = "TU Login 2FA: " + e.message;
      return;
    }
    set(totpField, r.code);
  }

  const button = document.querySelector("#samlloginbutton, button[type='submit'], input[type='submit']");
  if (!button) return;
  if (cfg.autoSubmit) {
    sessionStorage.setItem("tu2fa_submit", String(Date.now()));
    button.click();
  } else {
    button.focus();
  }
})();
