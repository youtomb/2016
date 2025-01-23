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
      'default': ''
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
      window.label = h ? h : b && b["default"] ? b["default"] : "";
      var r = window.appRoot + window.label,
          t, u = !1,
          v = [];
      window.resetTimeout = function() {
          window.clearTimeout(t);
          u || (t = window.setTimeout(function() {
              var a = "local:///web.archive.org/web/20160228021432/https://network_failure.html";
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
        yt.tv.initializer(a);
      };
      f && (window.environment.player_url = e || c ? "/video/youtube/src/web/javascript/debug-tv-player-en_US.js" : "/video/youtube/src/web/javascript/tv-player-en_US.js");
      window.load_steel_api && w(r + "/api-compiled.js");
      if (c || e) {
          var z = "Google" == window.environment.brand && "Eureka" == window.environment.model;
          if (c) window.CLOSURE_BASE_PATH = "/javascript/closure/", window.loadStylesheets = function() {
              window.h5CssList.forEach(y)
          }, w(r + "/lasagna-parse.js"), w(CLOSURE_BASE_PATH + "base.js"), w(r + "/deps.js"), w(r + "/js/base_initializer.js"), z ? w(r + "/js/chromecast_initializer.js") : w(r + "/js/initializer.js"), w(r + "/css-list.js"), x("loadStylesheets()");
          else if (e) {
              window.CLOSURE_NO_DEPS = !0;
              var A = "http://localhost:8090/assets/app-prod.css";
              y(r +
                  A);
              z ? w(r + "/chromecast-concat-bundle.js") : w(r + "/app-concat-bundle.js")
          }
      } else A = "http://localhost:8090/assets/app-prod.css", y(A), w("http://localhost:8090/assets/app-prod.js"), (k || l || m) && w(window.environment.player_url);
      window.checkBrokenLabel = function() {
          "undefined" == typeof yt && h && (window.location.href = window.location.href.replace(/([?&])label=[^&]+&?/, "$1stick=0&"))
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
   FILE ARCHIVED ON 02:14:32 Feb 28, 2016 AND RETRIEVED FROM THE
   INTERNET ARCHIVE ON 17:05:15 Jan 22, 2025.
   JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

   ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
   SECTION 108(a)(3)).
*/
/*
playback timings (ms):
captures_list: 0.672
exclusion.robots: 0.024
exclusion.robots.policy: 0.01
esindex: 0.014
cdx.remote: 81.435
LoadShardBlock: 612.389 (3)
PetaboxLoader3.datanode: 757.179 (4)
load_resource: 465.931
PetaboxLoader3.resolve: 280.628
*/