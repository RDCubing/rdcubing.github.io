const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = Number(process.env.PORT) || 3003;
const HOST = process.env.HOST || "0.0.0.0";

const ROOT = __dirname;


/*
 * Static files
 *
 * CSS, JS, images, favicons, HTML files, etc.
 */

app.use(express.static(ROOT, {
    index: false
}));


/*
 * Page routing
 *
 * Supports:
 *
 * /
 * /services
 * /services/
 * /services/index.html
 *
 * /webstore
 * /webstore/
 * /webstore/index.html
 *
 * /webstore/apps
 * /webstore/apps/
 * /webstore/apps.html
 *
 * /webstore/app
 * /webstore/app/
 * /webstore/app.html
 */

app.use((req, res, next) => {

    if (req.method !== "GET" && req.method !== "HEAD") {
        return next();
    }

    let requestPath;

    try {
        requestPath = decodeURIComponent(req.path);
    }
    catch {
        return next();
    }


    // Remove leading/trailing slashes
    requestPath = requestPath.replace(/^\/+|\/+$/g, "");


    /*
     * Root
     */

    if (!requestPath) {
        return res.sendFile(
            path.join(ROOT, "index.html")
        );
    }


    /*
     * Prevent directory traversal
     */

    const safePath = path.normalize(requestPath);

    if (
        safePath === ".." ||
        safePath.startsWith(`..${path.sep}`) ||
        path.isAbsolute(safePath)
    ) {
        return next();
    }


    /*
     * Directory index
     *
     * /services/
     * -> /services/index.html
     *
     * /webstore/
     * -> /webstore/index.html
     */

    const directoryIndex = path.join(
        ROOT,
        safePath,
        "index.html"
    );

    if (
        fs.existsSync(directoryIndex) &&
        fs.statSync(directoryIndex).isFile()
    ) {
        return res.sendFile(directoryIndex);
    }


    /*
     * Extensionless HTML page
     *
     * /webstore/apps
     * -> /webstore/apps.html
     *
     * /webstore/app
     * -> /webstore/app.html
     */

    const htmlFile = path.join(
        ROOT,
        `${safePath}.html`
    );

    if (
        fs.existsSync(htmlFile) &&
        fs.statSync(htmlFile).isFile()
    ) {
        return res.sendFile(htmlFile);
    }


    next();

});


/*
 * Custom 404
 */

app.use((req, res) => {

    const errorPage = path.join(
        ROOT,
        "404.html"
    );

    if (
        fs.existsSync(errorPage) &&
        fs.statSync(errorPage).isFile()
    ) {
        return res
            .status(404)
            .sendFile(errorPage);
    }

    res
        .status(404)
        .type("text")
        .send("404 - Page Not Found");

});


/*
 * Start server
 */

app.listen(PORT, HOST, () => {

    console.log(
        `GDC server running on http://${HOST}:${PORT}`
    );

});