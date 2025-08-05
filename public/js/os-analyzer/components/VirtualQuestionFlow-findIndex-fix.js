/**
 * VirtualQuestionFlow findIndex Error Fix
 * 
 * This fix ensures that this.answers is always an array to prevent
 * "this.answers.findIndex is not a function" errors.
 */

(function() {
  'use strict';
  
  console.log('🔧 Applying VirtualQuestionFlow findIndex fix...');
  
  // Wait for VirtualQuestionFlow to be defined
  const waitForVirtualQuestionFlow = setInterval(() => {
    if (typeof VirtualQuestionFlow !== 'undefined') {
      clearInterval(waitForVirtualQuestionFlow);
      
      // Override the findAnswerIndex method with safety checks
      const originalFindAnswerIndex = VirtualQuestionFlow.prototype.findAnswerIndex;
      VirtualQuestionFlow.prototype.findAnswerIndex = function(questionId) {
        // Ensure this.answers is always an array
        if (!Array.isArray(this.answers)) {
          console.warn('⚠️ this.answers was not an array, resetting to empty array');
          this.answers = [];
        }
        
        // Call the original method
        return originalFindAnswerIndex.call(this, questionId);
      };
      
      // Override the findAnswerByQuestionId method with safety checks
      const originalFindAnswerByQuestionId = VirtualQuestionFlow.prototype.findAnswerByQuestionId;
      VirtualQuestionFlow.prototype.findAnswerByQuestionId = function(questionId) {
        // Ensure this.answers is always an array
        if (!Array.isArray(this.answers)) {
          console.warn('⚠️ this.answers was not an array, resetting to empty array');
          this.answers = [];
        }
        
        // Call the original method
        return originalFindAnswerByQuestionId.call(this, questionId);
      };
      
      // Override getCompletedCount to ensure safe array handling
      const originalGetCompletedCount = VirtualQuestionFlow.prototype.getCompletedCount;
      VirtualQuestionFlow.prototype.getCompletedCount = function() {
        try {
          const savedAnswers = localStorage.getItem('haqei_answers');
          if (savedAnswers) {
            const parsedAnswers = JSON.parse(savedAnswers);
            
            // CRITICAL: Only update this.answers if parsedAnswers is a valid array
            if (Array.isArray(parsedAnswers)) {
              this.answers = parsedAnswers;
            } else {
              console.error('❌ Parsed answers is not an array:', parsedAnswers);
              // Don't overwrite this.answers with invalid data
            }
          }
        } catch (error) {
          console.error('❌ Error in getCompletedCount:', error);
          // Don't modify this.answers on error
        }
        
        // Call original method
        return originalGetCompletedCount.call(this);
      };
      
      // Override constructor to ensure answers is initialized
      const OriginalVirtualQuestionFlow = VirtualQuestionFlow;
      window.VirtualQuestionFlow = class extends OriginalVirtualQuestionFlow {
        constructor(...args) {
          super(...args);
          
          // Double-check that answers is an array
          if (!Array.isArray(this.answers)) {
            console.warn('⚠️ Fixing answers array in constructor');
            this.answers = [];
          }
        }
      };
      
      console.log('✅ VirtualQuestionFlow findIndex fix applied successfully');
    }
  }, 100);
  
  // Emergency fix: If error still occurs, apply global patch
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && event.error.message.includes('findIndex is not a function')) {
      console.error('🚨 findIndex error detected, applying emergency fix');
      
      // Find all VirtualQuestionFlow instances and fix their answers array
      if (window.questionFlow && window.questionFlow.answers && !Array.isArray(window.questionFlow.answers)) {
        console.log('🔧 Fixing questionFlow.answers');
        window.questionFlow.answers = [];
      }
      
      // Prevent default error handling
      event.preventDefault();
      
      // Log what was in answers
      console.log('📊 Current answers state:', window.questionFlow?.answers);
    }
  });
})();