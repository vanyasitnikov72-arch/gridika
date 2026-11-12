/**
 * Script that removes the "Gridika" mark only on the licensed domain.
 *
 * Works for code pasted straight into a page (Tilda, WordPress, Webflow, plain HTML) and for
 * builders that render custom HTML inside their own iframe (Wix and the like): there the code
 * runs on a service domain, so the page that hosts the iframe is checked instead
 * (location.ancestorOrigins, falling back to document.referrer). The Tilda editor preview
 * (tilda.cc) counts as the licensed site so people can see the result before publishing.
 */
export function domainLockJs(badgeId: string, domain: string): string {
  return `
(function () {
  var d = ${JSON.stringify(domain)};
  var clean = function (h) { h = String(h || "").toLowerCase(); return h.indexOf("www.") === 0 ? h.slice(4) : h; };
  var on = function (h, x) { h = clean(h); return h === x || h.slice(-(x.length + 1)) === "." + x; };
  var hosts = [location.hostname];
  if (window.top !== window) {
    try { var a = location.ancestorOrigins; if (a) for (var i = 0; i < a.length; i++) hosts.push(new URL(a[i]).hostname); } catch (e) {}
    try { if (document.referrer) hosts.push(new URL(document.referrer).hostname); } catch (e) {}
  }
  for (var j = 0; j < hosts.length; j++) {
    if (on(hosts[j], d) || on(hosts[j], "tilda.cc")) { var b = document.getElementById(${JSON.stringify(badgeId)}); if (b && b.parentNode) b.parentNode.removeChild(b); return; }
  }
})();`;
}
