// نظام الثيم: يدوي (localStorage) + تلقائي (prefers-color-scheme)
// يُستدعى في <head> قبل الرسم لتفادي وميض الثيم
(function () {
  try {
    var saved = localStorage.getItem('woa-theme');
    var dark = saved ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
})();
