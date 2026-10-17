// Theme bootstrap. Light is the default; dark only when the user picked it
// with the toggle (stored in localStorage). Runs inline in <head> before paint
// to avoid a theme flash. Keep in sync with THEME_INIT in the app layouts.
(function () {
  try {
    if (localStorage.getItem('woa-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();
