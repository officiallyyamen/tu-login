// Runs on the TUWEL login page: clicks "TU Wien Login" so the IdP page (content.js) takes over.
(async () => {
  const { autoSubmit } = await chrome.storage.local.get({ autoSubmit: true });
  if (!autoSubmit) return;

  const link = [...document.querySelectorAll("a, button")].find(el =>
    (el.getAttribute("href") || "").includes("auth/saml2/login.php") ||
    /TU Wien Login/i.test(el.textContent || ""));
  if (!link) return;

  // Guard against a redirect loop if the login keeps failing.
  const last = Number(sessionStorage.getItem("tu2fa_tuwel") || 0);
  if (Date.now() - last < 30000) return;
  sessionStorage.setItem("tu2fa_tuwel", String(Date.now()));
  link.click();
})();
