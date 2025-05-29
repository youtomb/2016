var _____WB$wombat$assign$function_____ = function (name) {
    return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name];
};

if (!self.__WB_pmw) {
    self.__WB_pmw = function (obj) {
        this.__WB_source = obj;
        return this;
    };
}

{
    let window = _____WB$wombat$assign$function_____("window");
    let self = _____WB$wombat$assign$function_____("self");
    let document = _____WB$wombat$assign$function_____("document");
    let location = _____WB$wombat$assign$function_____("location");
    let top = _____WB$wombat$assign$function_____("top");
    let parent = _____WB$wombat$assign$function_____("parent");
    let frames = _____WB$wombat$assign$function_____("frames");
    let opener = _____WB$wombat$assign$function_____("opener");

    window.labels = { 'default': '' };

    (function () {
        var b = window.labels;
        window.jstiming?.load?.tick("ld_s");

        var c = window.devjs,
            e = /[?&]debugjs=1/.exec(window.location.href),
            f = /[?&]localPlayer=1/.exec(window.location.href),
            g = /[?&]mediaDiagnostics=1/.exec(window.location.href),
            h = window.local_label,
            k = /[?&]reversePairingCode=/.exec(window.location.href),
            l = /[?&]launch=preload/.exec(window.location.href),
            m = /[?&]v=[\w+\/\-_=]+/.exec(window.location.href),
            n = "Cobalt" === window.environment.browser,
            p = ("Steel" === window.environment.browser || n) && !e && !c,
            q = window.csp_nonce;

        window.label = h || b?.["default"] || "unknown";
        var r = "/2016/" + window.label,
            t,
            u = false,
            v = [];

        window.resetTimeout = function () {
            window.clearTimeout(t);
            if (!u) {
                t = window.setTimeout(function () {
                    var a = "local:///web.archive.org/web/20160303220919/https://network_failure.html";
                    if (n) {
                        a = "h5vcc://network-failure?retry-url=" + encodeURIComponent(window.location.href.split("#")[0]);
                    }
                    window.location.replace(a);
                }, 40000);
            }
        };

        if (p) {
            window.resetTimeout();
            window.applicationLoaded = function () {
                u = true;
                window.clearTimeout(t);
            };
        }

        function loadScript(url) {
            if (n) {
                var script = document.createElement("script");
                script.setAttribute("src", url);
                if (q) script.setAttribute("nonce", q);
                document.body.appendChild(script);
            } else {
                document.write(q ? `<script src="${url}" nonce="${q}"></script>` : `<script src="${url}"></script>`);
            }
            if (p) injectScript("resetTimeout();");
        }

        function injectScript(content) {
            if (n) {
                var script = document.createElement("script");
                if (q) script.setAttribute("nonce", q);
                script.innerHTML = content;
                v.push(script);
            } else {
                document.write(q ? `<script nonce="${q}">${content}</script>` : `<script>${content}</script>`);
            }
        }

        function loadStylesheet(url) {
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", "https://youtomb.github.io/2016/assets/2016.css");
            document.head.appendChild(link);
        }

        window.initializeOrRedirect = function (url) {
            window.jstiming.load.tick("js_r");
            if (yt?.tv?.initializer) {
                yt.tv.initializer(url);
            } else {
                window.location = "https://youtomb.github.io/#/browse?yt2016fail=true";
            }
        };

        if (f) {
            window.environment.player_url = e || c
                ? "/video/youtube/src/web/javascript/debug-tv-player-en_US.js"
                : "/video/youtube/src/web/javascript/tv-player-en_US.js";
        }

        if (c || e) {
            var z = "Google" === window.environment.brand && "Eureka" === window.environment.model;
            if (c) {
                window.CLOSURE_BASE_PATH = "/javascript/closure/";
                window.loadStylesheets = function () {
                    window.h5CssList.forEach(loadStylesheet);
                };
                loadScript(r + "/lasagna-parse.js");
                loadScript(window.CLOSURE_BASE_PATH + "base.js");
                loadScript(r + "/deps.js");
                loadScript(r + "/js/base_initializer.js");
                loadScript(z ? r + "/js/chromecast_initializer.js" : r + "/js/initializer.js");
                loadScript(r + "/css-list.js");
                injectScript("loadStylesheets();");
            } else {
                window.CLOSURE_NO_DEPS = true;
                var cssPath = window.environment.tv_css || "/app-prod.css";
                loadStylesheet(r + cssPath);
                loadScript(z ? r + "/chromecast-concat-bundle.js" : r + "/app-concat-bundle.js");
            }
        } else {
            var cssPath = window.environment.tv_css || "/app-prod.css";
            loadStylesheet(r + cssPath);
            loadScript(r + window.environment.tv_binary);
            if (k || l || m) loadScript(window.environment.player_url);
        }

        window.checkBrokenLabel = function () {
            if (typeof yt === "undefined" && h) {
                window.location.href = window.location.href.replace(/([?&])label=[^&]+&?/, "$1stick=0&");
            }
        };

        injectScript("checkBrokenLabel();");

        if (g) {
            loadScript(e || c ? r + "/modules/media-diagnostics-debug.js" : r + "/modules/media-diagnostics.js");
        }

        injectScript(`initializeOrRedirect('${r}');`);

        if (n) {
            window.onload = function () {
                for (var i = 0; i < v.length; i++) {
                    document.body.appendChild(v[i]);
                }
            };
        }
    })();
}
