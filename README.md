# StyleSchein Booking App - Deployment Anleitung

## Methode 1: Vercel via GitHub (empfohlen)

### Schritt 1: GitHub Repository erstellen
1. Geh auf https://github.com/new
2. Name: `styleschein-booking`
3. Klicke "Create repository"

### Schritt 2: Dateien hochladen
1. Klicke "uploading an existing file"
2. Entpacke die ZIP-Datei auf deinem Computer
3. Ziehe ALLE Dateien und Ordner in das GitHub-Upload-Fenster
4. Klicke "Commit changes"

### Schritt 3: Auf Vercel deployen
1. Geh auf https://vercel.com und melde dich mit GitHub an
2. Klicke "Add New Project"
3. Wähle dein "styleschein-booking" Repository
4. Framework: "Vite" (wird automatisch erkannt)
5. Klicke "Deploy"
6. In ca. 1 Minute ist die App live!

### Schritt 4: Fertig!
- Deine App-URL: `https://styleschein-booking.vercel.app`
- Diese URL kommt in den QR-Code

## Methode 2: Vercel CLI (für Entwickler)
```bash
npm install -g vercel
cd styleschein-vercel
npm install
vercel
```

## Wichtige URLs
- **App**: https://styleschein-booking.vercel.app (nach Deploy)
- **n8n Webhook**: https://banab007.app.n8n.cloud/webhook/styleschein-booking
- **n8n Dashboard**: https://banab007.app.n8n.cloud

## Checkliste vor Go-Live
- [ ] n8n Workflow "StyleSchein Booking API" ist auf Active
- [ ] Google Calendar Credentials in allen 4 Calendar-Nodes zugewiesen
- [ ] App auf Vercel deployed
- [ ] QR-Code mit App-URL generiert
- [ ] QR-Code im Laden ausgedruckt
