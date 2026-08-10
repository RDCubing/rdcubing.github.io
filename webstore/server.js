const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";

const ROOT = __dirname;

// Serve static files
app.use(express.static(ROOT, {
    extensions: ["html"],
    index: "index.html"
}));

// Support directory-style URLs and extensionless HTML pages
app.use((req, res, next) => {
    // Ignore requests that are clearly for files
    if (path.extname(req.path)) {
        return next();
    }

    // Remove trailing slash
    const cleanPath = req.path.replace(/\/+$/, "");

    // Root
    if (!cleanPath || cleanPath === "/") {
        return res.sendFile(path.join(ROOT, "index.html"));
    }

    // Try /path/index.html
    const directoryIndex = path.join(
        ROOT,
        cleanPath,
        "index.html"
    );

    if (fs.existsSync(directoryIndex)) {
        return res.sendFile(directoryIndex);
    }

    // Try /path.html
    const htmlFile = path.join(
        ROOT,
        `${cleanPath}.html`
    );

    if (fs.existsSync(htmlFile)) {
        return res.sendFile(htmlFile);
    }

    next();
});

// 404
app.use((req, res) => {
    res.status(404).sendFile(
        path.join(ROOT, "404.html"),
        err => {
            if (err) {
                res.status(404).send("404 - Page Not Found");
            }
        }
    );
});

app.listen(PORT, HOST, () => {
    console.log(`GDC server running on http://${HOST}:${PORT}`);
});