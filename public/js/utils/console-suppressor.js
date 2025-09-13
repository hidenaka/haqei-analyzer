/**
 * Console Suppressor
 * - Suppresses verbose console output in production-like environments.
 * - Keeps console.error and console.warn intact.
 *
 * Activation rules (any true activates suppression):
 * - window.HAQEI_CONFIG?.featureFlags?.production === true
 * - HAQEIConfigurationManager reports environment === 'production'
 * - Heuristic: not localhost/127.0.0.1 and no debug=true in URL
 */
(function () {
  try {
    var isLocalhost = (function () {
      try {
        var host = window.location.hostname || '';
        return host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
      } catch (_) { return false; }
    })();

    var url = new URL(window.location.href);
    var debugParam = url.searchParams.get('debug');
    var isDebug = debugParam === 'true' || url.hash.includes('debug');

    var flagProduction = !!(window.HAQEI_CONFIG && window.HAQEI_CONFIG.featureFlags && window.HAQEI_CONFIG.featureFlags.production === true);

    var cfgEnv = (function () {
      try {
        if (window.HAQEIConfigurationManager && typeof window.HAQEIConfigurationManager.get === 'function') {
          return window.HAQEIConfigurationManager.get('system.environment');
        }
      } catch (_) {}
      return null;
    })();

    var envIsProduction = cfgEnv === 'production';

    var heuristicProduction = !isLocalhost && !isDebug;

    var shouldSuppress = flagProduction || envIsProduction || heuristicProduction;

    // Allow opt-out via URL: ?forceLogs=true
    var forceLogs = url.searchParams.get('forceLogs') === 'true';
    if (forceLogs) shouldSuppress = false;

    if (!shouldSuppress) return;

    // Preserve originals
    var original = {
      log: console.log,
      info: console.info,
      debug: console.debug,
      trace: console.trace,
    };

    // Suppress non-critical logs
    console.log = function () {};
    console.info = function () {};
    console.debug = function () {};
    console.trace = function () {};

    // Keep warn and error as-is
    // Optionally, down-level warn in strict production
    try {
      var downlevelWarn = (window.HAQEI_CONFIG && window.HAQEI_CONFIG.featureFlags && window.HAQEI_CONFIG.featureFlags.downlevelWarn) === true;
      if (downlevelWarn) {
        console.warn = function () {};
      }
    } catch (_) { /* noop */ }

    // Expose ability to re-enable logs for debugging in-session
    window.__restoreConsole = function () {
      console.log = original.log;
      console.info = original.info;
      console.debug = original.debug;
      console.trace = original.trace;
    };
  } catch (_) {
    // Never block app if suppression fails
  }
})();

