let initialized = false;
let observerStarted = false;

function killBanner() {
    // Remove any Google translate banner iframe, by class OR by src
    document.querySelectorAll(
        'iframe.goog-te-banner-frame, iframe[src*="translate.google"]'
    ).forEach((el) => el.remove());

    // Remove floating tooltip
    document.querySelectorAll(".goog-tooltip").forEach((el) => el.remove());

    // Reset the offset Google's script pushes onto <body>/<html>
    document.body.style.top = "0px";
    document.documentElement.style.top = "0px";
    document.body.style.position = "static";
}

function startObserver() {
    if (observerStarted) return;
    observerStarted = true;

    const observer = new MutationObserver(() => killBanner());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
    });

    let ticks = 0;
    const interval = setInterval(() => {
        killBanner();
        ticks++;
        if (ticks > 30) clearInterval(interval);
    }, 500);
}

export function initGoogleTranslate() {
    if (initialized || window.google?.translate) return;
    initialized = true;

    window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                includedLanguages: "en,bn",
                autoDisplay: false,
            },
            "google_translate_element"
        );
        startObserver();
    };

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    startObserver();
}

export function switchLanguage(lang) {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        [50, 150, 300, 600, 1000, 1500, 2500].forEach((delay) =>
            setTimeout(killBanner, delay)
        );
    } else {
        setTimeout(() => switchLanguage(lang), 300);
    }
}