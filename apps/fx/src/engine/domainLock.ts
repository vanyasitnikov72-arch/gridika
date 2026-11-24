/**
 * Script that removes the "Gridika" mark only on the licensed domain.
 *
 * Works for code pasted straight into a page (Tilda, WordPress, Webflow, plain HTML) and for
 * builders that render custom HTML inside their own iframe (Wix and the like): there the code
 * runs on a service domain, so the page that hosts the iframe is checked instead
 * (location.ancestorOrigins, falling back to document.referrer). The Tilda editor preview
 * (tilda.cc) counts as the licensed site so people can see the result before publishing.
 */
export function widgetBadgeHtml(productId: string, badgeId: string): string {
  const url = `https://gridika.ru/?utm_source=widget&utm_medium=embed&utm_campaign=${encodeURIComponent(productId)}`;
  return `<a id="${badgeId}" href="${url}" target="_blank" rel="noopener" style="position:absolute;bottom:8px;right:10px;z-index:9;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);padding:3px 8px;border-radius:12px;text-decoration:none;transition:opacity 0.2s;line-height:1.2;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">3D Gridika</a>`;
}

export function domainLockJs(badgeId: string, domain: string): string {
  return `
(function () {
  var d = ${JSON.stringify(domain)};
  // a bought code ("*") is clean on any site
  if (d === "*") { var b0 = document.getElementById(${JSON.stringify(badgeId)}); if (b0 && b0.parentNode) b0.parentNode.removeChild(b0); return; }
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
