document.addEventListener("DOMContentLoaded", () => {

    const selector = document.getElementById("themeSelector");
    const stylesheet = document.getElementById("theme-style");

    console.log("theme.js loaded");
    console.log("selector:", selector);
    console.log("stylesheet:", stylesheet);

    if (!selector || !stylesheet)
        return;


    function getCssPath() {

        const path = window.location.pathname;

        if (path.includes("/404"))
        return "/css/index/";
	if (path.includes("/account"))
        return "/css/index/";
		
		if (path.includes("/downloads"))
            return "/css/downloads/index/";

        if (path.includes("/services"))
            return "/css/services/index/";

        if (path.includes("/webstore/apps"))
            return "/css/webstore/apps/";

        if (path.includes("/webstore/app"))
            return "/css/webstore/app/";

        if (path.includes("/webstore"))
            return "/css/webstore/index/";

        return "css/index/";
    }


    function applyTheme(theme) {

        const option = selector.querySelector(
            `option[value="${theme}"]`
        );

        if (!option)
            theme = "default";


        const cssPath = getCssPath();

        const cssFile = cssPath + theme + ".css";


        console.log("Loading theme:", cssFile);


        stylesheet.setAttribute(
            "href",
            cssFile
        );


        selector.value = theme;


        try {
            localStorage.setItem("theme", theme);

            console.log(
                "Saved theme:",
                localStorage.getItem("theme")
            );
        }
        catch (e) {
            console.log(
                "localStorage unavailable:",
                e
            );
        }
    }


    let savedTheme = "default";

    try {
        savedTheme = localStorage.getItem("theme") || "default";
    }
    catch (e) {
        console.log("Cannot read localStorage");
    }


    applyTheme(savedTheme);


    selector.addEventListener("change", () => {

        console.log(
            "Theme selected:",
            selector.value
        );

        applyTheme(selector.value);

    });

});