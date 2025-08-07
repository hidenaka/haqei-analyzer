// HAQEI JavaScript Error Detection Script
console.log("🔍 HAQEI JavaScript Error Testing Started");

// Track await errors
const originalError = console.error;
const awaitErrors = [];

console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('await is only valid in async functions')) {
    awaitErrors.push(message);
  }
  originalError.apply(console, args);
};

// Check page elements
function checkElements() {
  const situationInput = document.querySelector('#situationInput');
  const analyzeButton = document.querySelector('#analyzeButton');
  const resultArea = document.querySelector('#resultArea');
  
  console.log('Element Status:');
  console.log('- Situation Input:', situationInput ? '✅' : '❌');
  console.log('- Analyze Button:', analyzeButton ? '✅' : '❌');
  console.log('- Result Area:', resultArea ? '✅' : '❌');
  
  return { situationInput, analyzeButton, resultArea };
}

// Check I Ching systems
function checkIChing() {
  console.log('I Ching System Status:');
  console.log('- ichingSimulator:', typeof window.ichingSimulator);
  console.log('- H384_DATA:', window.H384_DATA ? 'Available' : 'Missing');
  console.log('- Database size:', window.H384_DATA?.length || 0);
}

// Run tests
setTimeout(() => {
  checkElements();
  checkIChing();
  
  setTimeout(() => {
    console.log('📊 Final Results:');
    console.log('- Await Errors:', awaitErrors.length);
    if (awaitErrors.length === 0) {
      console.log('✅ SUCCESS: No await errors detected\!');
    } else {
      console.log('❌ FAILURE: Await errors found:', awaitErrors);
    }
  }, 3000);
}, 1000);
EOF < /dev/null