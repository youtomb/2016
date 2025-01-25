var _____WB$wombat$assign$function_____ = function(name) {
    return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name];
};
if (!self.__WB_pmw) {
    self.__WB_pmw = function(obj) {
        this.__WB_source = obj;
        return this;
    }
} {
    let window = _____WB$wombat$assign$function_____("window");
    let self = _____WB$wombat$assign$function_____("self");
    let document = _____WB$wombat$assign$function_____("document");
    let location = _____WB$wombat$assign$function_____("location");
    let top = _____WB$wombat$assign$function_____("top");
    let parent = _____WB$wombat$assign$function_____("parent");
    let frames = _____WB$wombat$assign$function_____("frames");
    let opener = _____WB$wombat$assign$function_____("opener");

    window.labels = {
        'default': '8adac3f2'
    };
    (function() {
        var b = window.labels;
        window.jstiming && window.jstiming.load && window.jstiming.load.tick("ld_s");
        var c = window.devjs,
            e = /[?&]debugjs=1/.exec(window.location.href),
            f = /[?&]localPlayer=1/.exec(window.location.href),
            g = /[?&]mediaDiagnostics=1/.exec(window.location.href),
            h = window.local_label,
            k = /[?&]reversePairingCode=/.exec(window.location.href),
            l = /[?&]launch=preload/.exec(window.location.href),
            m = /[?&]v=[\w\+\/\-_=]+/.exec(window.location.href),
            n = "Cobalt" == window.environment.browser,
            p = ("Steel" == window.environment.browser || n) && !e && !c,
            q = window.csp_nonce;
        window.label = h ? h : b && b["default"] ? b["default"] : "unknown";
        var r = window.appRoot + window.label,
            t, u = !1,
            v = [];
        window.resetTimeout = function() {
            window.clearTimeout(t);
            u || (t = window.setTimeout(function() {
                var a = "local:///web.archive.org/web/20160303220919/https://network_failure.html";
                n && (a = "h5vcc://network-failure?retry-url=" + encodeURIComponent(window.location.href.split("#")[0]));
                window.location.replace(a)
            }, 4E4))
        };
        p && (window.resetTimeout(), window.applicationLoaded = function() {
            u = !0;
            window.clearTimeout(t)
        });

        function w(a) {
            if (n) {
                var d = document.createElement("script");
                d.setAttribute("src", a);
                q && d.setAttribute("nonce", q);
                document.body.appendChild(d)
            } else q ? document.write('<script src="' + a + '" nonce="' + q + '">\x3c/script>') : document.write('<script src="' + a + '">\x3c/script>');
            p && x("resetTimeout();")
        }

        function x(a) {
            if (n) {
                var d = document.createElement("script");
                q && d.setAttribute("nonce", q);
                d.innerHTML = a;
                v.push(d)
            } else q ? document.write('<script nonce="' + q + '">' + a + "\x3c/script>") : document.write("<script>" + a + "\x3c/script>")
        }

        function y(a) {
            var d = document.createElement("link");
            d.setAttribute("rel", "stylesheet");
            d.setAttribute("type", "text/css");
            d.setAttribute("href", a);
            document.head.appendChild(d)
        }
        window.initializeOrRedirect = function(a) {
            window.jstiming.load.tick("js_r");
            yt && yt.tv && yt.tv.initializer ? yt.tv.initializer(a) : window.location = "https://web.archive.org/web/20160303220919/http://www.youtube.com/error?src=404"
        };
        f && (window.environment.player_url = "http://localhost:8090/assets/tv-player.js" || c ? "http://localhost:8090/assets/tv-player.js" : "http://localhost:8090/assets/tv-player.js");
        window.load_steel_api && w(r + "/api-compiled.js");
        if (c || e) {
            var z = "Google" == window.environment.brand && "Eureka" == window.environment.model;
            if (c) window.CLOSURE_BASE_PATH = "/javascript/closure/", window.loadStylesheets = function() {
                window.h5CssList.forEach(y)
            }, w(r + "/lasagna-parse.js"), w(CLOSURE_BASE_PATH + "base.js"), w(r + "/deps.js"), w(r + "/js/base_initializer.js"), z ? w(r + "/js/chromecast_initializer.js") : w(r + "/js/initializer.js"), w(r + "/css-list.js"), x("loadStylesheets()");
            else if (e) {
                window.CLOSURE_NO_DEPS = !0;
                var A = window.environment.tv_css || "";
                y(r +
                    A);
                z ? w(r + "/chromecast-concat-bundle.js") : w(r + "/app-concat-bundle.js")
            }
        } else A = window.environment.tv_css || "/app-prod.css", y(r + A), w(r + window.environment.tv_binary), (k || l || m) && w("http://localhost:8090/assets/tv-player.js");
        window.checkBrokenLabel = function() {
            "" == typeof yt && h && (window.location.href = window.location.href.replace(/([?&])label=[^&]+&?/, "$1stick=0&"))
        };
        x("checkBrokenLabel()");
        g && (e || c ? w(r + "/modules/media-diagnostics-debug.js") : w(r + "/modules/media-diagnostics.js"));
        x("initializeOrRedirect('" + r + "');");
        n && (window.onload = function() {
            for (var a = 0, d = v.length; a < d; ++a) document.body.appendChild(v[a])
        });
    })();


}
/*
     FILE ARCHIVED ON 22:09:19 Mar 03, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:01:41 Jan 24, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 7.144
  exclusion.robots: 0.031
  exclusion.robots.policy: 0.014
  esindex: 0.013
  cdx.remote: 23.266
  LoadShardBlock: 322.026 (3)
  PetaboxLoader3.datanode: 349.782 (4)
  load_resource: 393.281
  PetaboxLoader3.resolve: 351.692
*/