// Pinterest tracking — counts visitors who arrive from Pinterest and taps on
// "Save to Pinterest". Both land on /stats. Plain script so the generated
// piece/range pages and the main site can all share it. Never blocks a page.
(function () {
  var send = function (data) {
    try {
      fetch("/api/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(function () {});
    } catch { /* tracking must never break the page */ }
  };

  // Arrived from Pinterest: the pinterest.* / pin.it address it came from, or
  // the ?utm_source=pinterest our own Save button puts on every pin's link
  // (the Pinterest app often sends no "came from" address at all).
  var fromPinterest = false;
  try {
    var ref = document.referrer ? new URL(document.referrer).hostname : "";
    var src = new URLSearchParams(location.search).get("utm_source") || "";
    fromPinterest = /(^|\.)pinterest\.[a-z.]+$/i.test(ref) || /(^|\.)pin\.it$/i.test(ref) || /^pinterest$/i.test(src);
  } catch { /* old browser */ }

  if (fromPinterest) {
    var page = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
    var key = "roj_pin_" + page;
    var seen = false;
    try { seen = !!sessionStorage.getItem(key); sessionStorage.setItem(key, "1"); } catch { /* private mode */ }
    if (!seen) send({ type: "pinterest", page: page });
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest(".btn-pin") : null;
    if (a) send({ type: "pin_saved", item: a.getAttribute("data-item") || "", page: location.pathname.replace(/\.html$/, "") });
  });
})();
