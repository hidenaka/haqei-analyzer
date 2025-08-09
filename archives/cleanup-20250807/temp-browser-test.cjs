
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <div id="future-simulator"></div>
  <script>
    window.console = { log: () => {}, warn: () => {}, error: () => {} };
    window.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
  </script>
</body>
</html>
`, { 
  runScripts: 'dangerously',
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;

console.log('✅ ブラウザ環境シミュレーション成功');
