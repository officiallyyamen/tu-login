# TU Login automatisch

Nie wieder Matrikelnummer, Passwort und 2FA-Code bei TUWEL eintippen. Beim Öffnen von TUWEL wird automatisch auf „TU Wien Login“ gedrückt, alles ausgefüllt und angemeldet.

- **Laptop:** Chrome-/Edge-/Brave-/Helium-Erweiterung
- **iPhone/iPad:** Userscript für die App „Userscripts“ in Safari

Deine Daten bleiben nur auf deinem Gerät. Nichts wird irgendwohin geschickt, der 2FA-Code wird lokal berechnet (TOTP, wie in deiner Authenticator-App).

## Was du brauchst

1. Deine Matrikelnummer und dein TU-Passwort.
2. Deinen **2FA-Schlüssel** (Base32-Text, z. B. `JBSWY3DPEHPK3PXP…`). Den bekommst du, wenn du MFA einrichtest: Unter dem QR-Code gibt es meist „Schlüssel anzeigen“ / „Code kann nicht gescannt werden“. Hast du ihn nicht mehr, kannst du MFA im TU-Account neu einrichten und dir den Schlüssel diesmal notieren. Die Authenticator-App muss dann auch neu eingerichtet werden.

## Laptop (Chrome, Edge, Brave, Helium …)

1. Dieses Repo als ZIP herunterladen (grüner Button **Code → Download ZIP**) und entpacken.
2. `chrome://extensions` öffnen, oben rechts **Entwicklermodus** einschalten.
3. **Entpackte Erweiterung laden** und den entpackten Ordner wählen (der mit `manifest.json`).
4. Auf das „T“-Symbol in der Leiste klicken: Matrikelnummer, Passwort und 2FA-Schlüssel eintragen, **Speichern**.
5. Der Code unten auf der Seite muss mit deiner Authenticator-App übereinstimmen. Fertig.

## iPhone / iPad (Safari)

1. Die App **Userscripts** aus dem App Store installieren, öffnen und **Set Userscripts Directory** wählen, z. B. einen Ordner „Scripts“ in iCloud Drive.
2. In Safari: **⋯ → Erweiterungen verwalten → Userscripts** einschalten und für alle Websites (oder `tuwien.ac.at`) erlauben.
3. `ios/tu-login.user.js` öffnen und oben die drei Zeilen `USERNAME`, `PASSWORD`, `SECRET` ausfüllen.
4. Die Datei in den Userscripts-Ordner legen. Wichtig: In der Dateien-App lange drücken → **Laden**, sodass kein Wolken-Symbol mehr daneben ist.
5. TUWEL in Safari öffnen. Im Userscripts-Menü auf ⟳ tippen, falls das Skript nicht gleich erscheint.

## Sicherheit

Wer an dein entsperrtes Gerät kommt, kann sich damit ohne zweiten Faktor bei deinem TU-Account anmelden. Die Daten liegen unverschlüsselt im Browser-Profil bzw. in der Skript-Datei. Nutze es nur auf deinen eigenen Geräten und gib deine ausgefüllte Datei niemandem.

Wenn der Login fehlschlägt (z. B. falsches Passwort), versucht es die Erweiterung eine Minute lang nicht erneut, damit dein Account nicht gesperrt wird.
