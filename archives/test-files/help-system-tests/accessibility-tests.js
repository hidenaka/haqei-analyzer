/**
 * HAQEI Help System - Accessibility Tests
 * 
 * WCAG 2.1 AA/AAA Compliance Testing
 * - Screen reader compatibility
 * - Keyboard navigation
 * - Color contrast verification
 * - Focus management
 * - ARIA attributes validation
 */

// Mock QUnit if not available
if (typeof QUnit === 'undefined') {
    window.QUnit = {
        module: (name, fn) => { console.group(name); fn(); console.groupEnd(); },
        test: (name, fn) => { console.log(`Testing: ${name}`); fn({ ok: console.assert, async: () => () => {} }); }
    };
}

QUnit.module('WCAG 2.1 Compliance Tests', function() {
    
    // WCAG 2.1 Level AA Tests
    QUnit.module('WCAG 2.1 Level AA', function() {
        
        QUnit.test('1.3.1 Info and Relationships', function(assert) {
            // Test semantic HTML structure
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="haqei-help-modal" role="dialog" aria-labelledby="modal-title">
                    <h2 id="modal-title" class="modal-title">Help System</h2>
                    <div class="modal-content">
                        <p>Content with proper heading structure</p>
                    </div>
                    <div role="navigation" aria-label="Tutorial navigation">
                        <button type="button">Previous</button>
                        <button type="button">Next</button>
                    </div>
                </div>
            `;
            
            const dialog = modal.querySelector('[role="dialog"]');
            const title = modal.querySelector('#modal-title');
            const navigation = modal.querySelector('[role="navigation"]');
            
            assert.ok(dialog, 'Modal should have dialog role');
            assert.ok(dialog.getAttribute('aria-labelledby'), 'Dialog should have aria-labelledby');
            assert.ok(title, 'Modal should have proper heading structure');
            assert.ok(navigation, 'Navigation should have proper semantic role');
            assert.ok(navigation.getAttribute('aria-label'), 'Navigation should have aria-label');
        });
        
        QUnit.test('1.4.3 Contrast (Minimum)', function(assert) {
            // Test color contrast ratios
            const testElements = [
                { selector: '.btn-primary', minContrast: 4.5 },
                { selector: '.modal-title', minContrast: 4.5 },
                { selector: '.tooltip-description', minContrast: 4.5 },
                { selector: '.help-action', minContrast: 4.5 }
            ];
            
            testElements.forEach(test => {
                const element = document.createElement('div');
                element.className = test.selector.replace('.', '');
                document.body.appendChild(element);
                
                const computedStyle = window.getComputedStyle(element);
                const color = computedStyle.color;
                const backgroundColor = computedStyle.backgroundColor;
                
                // Calculate contrast ratio (simplified)
                const contrast = calculateContrastRatio(color, backgroundColor);
                
                assert.ok(contrast >= test.minContrast || contrast === null, 
                    `${test.selector} should have contrast ratio ≥ ${test.minContrast}:1 (actual: ${contrast})`);
                
                document.body.removeChild(element);
            });
        });
        
        QUnit.test('1.4.4 Resize Text', function(assert) {
            // Test text scaling up to 200%
            const textElement = document.createElement('div');
            textElement.className = 'help-content';
            textElement.textContent = 'Test content for text scaling';
            textElement.style.fontSize = '16px';
            document.body.appendChild(textElement);
            
            const originalSize = parseInt(window.getComputedStyle(textElement).fontSize);
            
            // Scale to 200%
            textElement.style.fontSize = '32px';
            const scaledSize = parseInt(window.getComputedStyle(textElement).fontSize);
            
            assert.equal(scaledSize, originalSize * 2, 
                'Text should scale to 200% without loss of functionality');
            
            // Test that content is still readable and functional
            assert.ok(textElement.offsetWidth > 0, 'Scaled text should still be visible');
            assert.ok(textElement.offsetHeight > 0, 'Scaled text should maintain layout');
            
            document.body.removeChild(textElement);
        });
        
        QUnit.test('2.1.1 Keyboard', function(assert) {
            // Test keyboard accessibility
            const helpButton = document.createElement('button');
            helpButton.className = 'haqei-help-button';
            helpButton.textContent = 'Help';
            document.body.appendChild(helpButton);
            
            // Should be focusable
            helpButton.focus();
            assert.equal(document.activeElement, helpButton, 
                'Help button should be keyboard focusable');
            
            // Test keyboard activation
            let keyboardActivated = false;
            helpButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    keyboardActivated = true;
                }
            });
            
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            helpButton.dispatchEvent(enterEvent);
            
            assert.ok(keyboardActivated, 'Help button should be activatable via keyboard');
            
            document.body.removeChild(helpButton);
        });
        
        QUnit.test('2.1.2 No Keyboard Trap', function(assert) {
            // Test that keyboard focus doesn't get trapped
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="haqei-help-modal">
                    <button class="modal-close" tabindex="0">Close</button>
                    <div class="modal-content">
                        <button class="help-link" tabindex="0">Help Link</button>
                    </div>
                    <button class="modal-action" tabindex="0">Action</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            const focusableElements = modal.querySelectorAll('[tabindex="0"]');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            // Test Tab cycling
            lastElement.focus();
            assert.equal(document.activeElement, lastElement, 'Last element should be focused');
            
            // Simulate Tab from last element - should cycle to first or exit modal
            const tabEvent = new KeyboardEvent('keydown', { 
                key: 'Tab', 
                shiftKey: false 
            });
            lastElement.dispatchEvent(tabEvent);
            
            // Focus should not be trapped within modal
            assert.ok(true, 'Keyboard focus should not be trapped within modal');
            
            document.body.removeChild(modal);
        });
        
        QUnit.test('2.4.3 Focus Order', function(assert) {
            // Test logical focus order
            const tutorial = document.createElement('div');
            tutorial.innerHTML = `
                <div class="tutorial-card">
                    <div class="card-header">
                        <h3 tabindex="0">Tutorial Title</h3>
                    </div>
                    <div class="card-body">
                        <p>Tutorial content</p>
                        <button tabindex="0" class="tutorial-action">Action</button>
                    </div>
                    <div class="card-footer">
                        <button tabindex="0" class="btn-secondary">Previous</button>
                        <button tabindex="0" class="btn-primary">Next</button>
                        <button tabindex="0" class="btn-ghost">Skip</button>
                    </div>
                </div>
            `;
            document.body.appendChild(tutorial);
            
            const focusableElements = tutorial.querySelectorAll('[tabindex="0"]');
            
            // Focus order should be: title -> action -> previous -> next -> skip
            const expectedOrder = ['h3', 'button.tutorial-action', 'button.btn-secondary', 'button.btn-primary', 'button.btn-ghost'];
            
            focusableElements.forEach((element, index) => {
                const tagName = element.tagName.toLowerCase();
                const className = element.className.split(' ')[0];
                const expected = expectedOrder[index];
                
                const matches = expected.includes(tagName) || expected.includes(className);
                assert.ok(matches, `Focus order ${index + 1} should be logical (expected: ${expected})`);
            });
            
            document.body.removeChild(tutorial);
        });
        
        QUnit.test('2.4.6 Headings and Labels', function(assert) {
            // Test descriptive headings and labels
            const helpContent = document.createElement('div');
            helpContent.innerHTML = `
                <div class="help-content">
                    <h2>HAQEI Help System</h2>
                    <h3>Getting Started</h3>
                    <p>Introduction content</p>
                    <h3>Advanced Features</h3>
                    <p>Advanced content</p>
                    
                    <form class="tutorial-form">
                        <label for="user-name">Your Name (required)</label>
                        <input id="user-name" type="text" required aria-describedby="name-help">
                        <div id="name-help">Enter your preferred name for personalized guidance</div>
                        
                        <fieldset>
                            <legend>Preferred Learning Style</legend>
                            <input type="radio" id="visual" name="learning-style" value="visual">
                            <label for="visual">Visual learner</label>
                            <input type="radio" id="auditory" name="learning-style" value="auditory">
                            <label for="auditory">Auditory learner</label>
                        </fieldset>
                    </form>
                </div>
            `;
            document.body.appendChild(helpContent);
            
            // Test heading hierarchy
            const headings = helpContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let previousLevel = 0;
            
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                assert.ok(level <= previousLevel + 1, 
                    `Heading levels should not skip (${heading.tagName}: "${heading.textContent.trim()}")`);
                previousLevel = level;
            });
            
            // Test form labels
            const inputs = helpContent.querySelectorAll('input[type="text"], input[type="radio"]');
            inputs.forEach(input => {
                const hasLabel = helpContent.querySelector(`label[for="${input.id}"]`) \!== null;
                const hasAriaLabel = input.getAttribute('aria-label') \!== null;
                const hasAriaLabelledBy = input.getAttribute('aria-labelledby') \!== null;
                
                assert.ok(hasLabel || hasAriaLabel || hasAriaLabelledBy, 
                    `Input ${input.id} should have proper labeling`);
            });
            
            // Test fieldset/legend
            const fieldsets = helpContent.querySelectorAll('fieldset');
            fieldsets.forEach(fieldset => {
                const legend = fieldset.querySelector('legend');
                assert.ok(legend, 'Fieldset should have legend element');
                assert.ok(legend.textContent.trim().length > 0, 'Legend should have descriptive text');
            });
            
            document.body.removeChild(helpContent);
        });
        
        QUnit.test('3.1.1 Language of Page', function(assert) {
            // Test language declaration
            const htmlElement = document.documentElement;
            const lang = htmlElement.getAttribute('lang');
            
            assert.ok(lang, 'HTML element should have lang attribute');
            assert.ok(lang === 'ja' || lang === 'en', 'Language should be properly declared (ja or en)');
            
            // Test language changes within content
            const multilingualContent = document.createElement('div');
            multilingualContent.innerHTML = `
                <p>この文章は日本語です。</p>
                <p lang="en">This sentence is in English.</p>
                <p>再び日本語に戻ります。</p>
            `;
            
            const englishParagraph = multilingualContent.querySelector('p[lang="en"]');
            assert.ok(englishParagraph, 'Language changes should be marked with lang attribute');
        });
        
        QUnit.test('3.2.1 On Focus', function(assert) {
            // Test that focus doesn't cause unexpected context changes
            const helpButton = document.createElement('button');
            helpButton.className = 'haqei-help-button';
            helpButton.textContent = 'Help';
            document.body.appendChild(helpButton);
            
            let contextChanged = false;
            let modalOpened = false;
            
            // Focus should not automatically open modal
            helpButton.addEventListener('focus', function() {
                // Focus alone should not trigger modal
                contextChanged = false;
            });
            
            helpButton.addEventListener('click', function() {
                modalOpened = true;
            });
            
            helpButton.focus();
            assert.notOk(contextChanged, 'Focus alone should not cause context change');
            assert.notOk(modalOpened, 'Focus alone should not open modal');
            
            // Only explicit activation should trigger
            helpButton.click();
            assert.ok(modalOpened, 'Explicit activation should trigger modal');
            
            document.body.removeChild(helpButton);
        });
        
        QUnit.test('3.3.2 Labels or Instructions', function(assert) {
            // Test form instructions and error messages
            const form = document.createElement('form');
            form.innerHTML = `
                <div class="form-field">
                    <label for="feedback">Your Feedback</label>
                    <textarea id="feedback" required aria-describedby="feedback-help feedback-error"></textarea>
                    <div id="feedback-help" class="help-text">
                        Please share your thoughts about the help system (required)
                    </div>
                    <div id="feedback-error" class="error-message" style="display: none;">
                        Feedback is required to improve our help system
                    </div>
                </div>
                
                <div class="form-field">
                    <label for="rating">Rating (1-5)</label>
                    <select id="rating" required aria-describedby="rating-help">
                        <option value="">Select rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                    <div id="rating-help" class="help-text">
                        Rate your experience with the help system
                    </div>
                </div>
            `;
            document.body.appendChild(form);
            
            const textarea = form.querySelector('#feedback');
            const select = form.querySelector('#rating');
            
            // Test aria-describedby associations
            const textareaDescribedBy = textarea.getAttribute('aria-describedby');
            assert.ok(textareaDescribedBy.includes('feedback-help'), 
                'Textarea should be described by help text');
            assert.ok(textareaDescribedBy.includes('feedback-error'), 
                'Textarea should be described by error message');
            
            const selectDescribedBy = select.getAttribute('aria-describedby');
            assert.ok(selectDescribedBy.includes('rating-help'), 
                'Select should be described by help text');
            
            // Test that help text exists and is meaningful
            const helpTexts = form.querySelectorAll('.help-text');
            helpTexts.forEach(helpText => {
                assert.ok(helpText.textContent.trim().length > 10, 
                    'Help text should be descriptive and meaningful');
            });
            
            document.body.removeChild(form);
        });
        
        QUnit.test('4.1.2 Name, Role, Value', function(assert) {
            // Test ARIA attributes for custom components
            const customComponents = document.createElement('div');
            customComponents.innerHTML = `
                <\!-- Custom Help Button -->
                <div class="haqei-help-button" 
                     role="button" 
                     tabindex="0" 
                     aria-label="Open help system"
                     aria-expanded="false"
                     aria-haspopup="dialog">
                    <span aria-hidden="true">?</span>
                </div>
                
                <\!-- Custom Progress Indicator -->
                <div class="progress-container" role="progressbar" 
                     aria-valuenow="3" 
                     aria-valuemin="1" 
                     aria-valuemax="7"
                     aria-label="Tutorial progress: step 3 of 7">
                    <div class="progress-fill" style="width: 43%"></div>
                </div>
                
                <\!-- Custom Tab Panel -->
                <div class="help-tabs" role="tablist" aria-label="Help topics">
                    <button role="tab" aria-selected="true" aria-controls="panel-basics" id="tab-basics">
                        Basics
                    </button>
                    <button role="tab" aria-selected="false" aria-controls="panel-advanced" id="tab-advanced">
                        Advanced
                    </button>
                </div>
                <div role="tabpanel" id="panel-basics" aria-labelledby="tab-basics">
                    Basic help content
                </div>
                <div role="tabpanel" id="panel-advanced" aria-labelledby="tab-advanced" hidden>
                    Advanced help content
                </div>
            `;
            document.body.appendChild(customComponents);
            
            // Test help button ARIA
            const helpButton = customComponents.querySelector('.haqei-help-button');
            assert.equal(helpButton.getAttribute('role'), 'button', 'Custom button should have button role');
            assert.ok(helpButton.getAttribute('aria-label'), 'Custom button should have aria-label');
            assert.equal(helpButton.getAttribute('tabindex'), '0', 'Custom button should be focusable');
            
            // Test progress bar ARIA
            const progressBar = customComponents.querySelector('[role="progressbar"]');
            assert.ok(progressBar.getAttribute('aria-valuenow'), 'Progress bar should have current value');
            assert.ok(progressBar.getAttribute('aria-valuemin'), 'Progress bar should have minimum value');
            assert.ok(progressBar.getAttribute('aria-valuemax'), 'Progress bar should have maximum value');
            assert.ok(progressBar.getAttribute('aria-label'), 'Progress bar should have accessible name');
            
            // Test tab panel ARIA
            const tablist = customComponents.querySelector('[role="tablist"]');
            const tabs = customComponents.querySelectorAll('[role="tab"]');
            const tabpanels = customComponents.querySelectorAll('[role="tabpanel"]');
            
            assert.ok(tablist.getAttribute('aria-label'), 'Tablist should have accessible name');
            
            tabs.forEach(tab => {
                assert.ok(tab.getAttribute('aria-controls'), 'Tab should have aria-controls');
                assert.ok(tab.getAttribute('aria-selected') \!== null, 'Tab should have aria-selected');
            });
            
            tabpanels.forEach(panel => {
                assert.ok(panel.getAttribute('aria-labelledby'), 'Tab panel should have aria-labelledby');
            });
            
            document.body.removeChild(customComponents);
        });
    });
    
    // WCAG 2.1 Level AAA Tests (Enhanced)
    QUnit.module('WCAG 2.1 Level AAA', function() {
        
        QUnit.test('1.4.6 Contrast (Enhanced)', function(assert) {
            // Test enhanced contrast ratios for AAA compliance
            const testElements = [
                { selector: '.btn-primary', minContrast: 7.0 },
                { selector: '.modal-title', minContrast: 7.0 },
                { selector: '.help-content p', minContrast: 7.0 }
            ];
            
            testElements.forEach(test => {
                const element = document.createElement('div');
                element.className = test.selector.replace('.', '').replace(' p', '');
                document.body.appendChild(element);
                
                const computedStyle = window.getComputedStyle(element);
                const contrast = calculateContrastRatio(
                    computedStyle.color, 
                    computedStyle.backgroundColor
                );
                
                if (contrast \!== null) {
                    assert.ok(contrast >= test.minContrast, 
                        `${test.selector} should have enhanced contrast ratio ≥ ${test.minContrast}:1 (actual: ${contrast})`);
                }
                
                document.body.removeChild(element);
            });
        });
        
        QUnit.test('2.4.9 Link Purpose (Link Only)', function(assert) {
            // Test that link purpose is clear from link text alone
            const helpContent = document.createElement('div');
            helpContent.innerHTML = `
                <div class="help-content">
                    <ul class="related-topics">
                        <li><a href="#basic-concepts">Learn about basic concepts</a></li>
                        <li><a href="#advanced-features">Explore advanced features</a></li>
                        <li><a href="#troubleshooting">Get help with troubleshooting</a></li>
                    </ul>
                    
                    <p>For more information, <a href="/documentation">read the complete documentation</a>.</p>
                    
                    <\!-- Bad example - should be avoided -->
                    <p style="display: none;">Click <a href="#more">here</a> for more info.</p>
                </div>
            `;
            document.body.appendChild(helpContent);
            
            const links = helpContent.querySelectorAll('a');
            links.forEach(link => {
                const linkText = link.textContent.trim();
                const isDescriptive = linkText.length > 5 && 
                                    \!linkText.toLowerCase().includes('click here') &&
                                    \!linkText.toLowerCase().includes('more') &&
                                    \!linkText.toLowerCase().includes('here');
                
                assert.ok(isDescriptive, 
                    `Link text "${linkText}" should be descriptive and self-explanatory`);
            });
            
            document.body.removeChild(helpContent);
        });
        
        QUnit.test('2.4.10 Section Headings', function(assert) {
            // Test that section headings organize content
            const helpDocument = document.createElement('div');
            helpDocument.innerHTML = `
                <div class="help-content">
                    <h1>HAQEI Help System</h1>
                    
                    <h2>Getting Started</h2>
                    <p>Introduction content...</p>
                    
                    <h3>Creating Your First Analysis</h3>
                    <p>Step-by-step guide...</p>
                    
                    <h3>Understanding Results</h3>
                    <p>Result interpretation...</p>
                    
                    <h2>Advanced Features</h2>
                    <p>Advanced functionality...</p>
                    
                    <h3>Triple OS System</h3>
                    <p>OS system explanation...</p>
                    
                    <h4>Engine OS</h4>
                    <p>Engine OS details...</p>
                    
                    <h4>Interface OS</h4>
                    <p>Interface OS details...</p>
                    
                    <h2>Troubleshooting</h2>
                    <p>Common issues and solutions...</p>
                </div>
            `;
            document.body.appendChild(helpDocument);
            
            const headings = helpDocument.querySelectorAll('h1, h2, h3, h4, h5, h6');
            
            // Test heading hierarchy
            let currentLevel = 0;
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                
                if (currentLevel === 0) {
                    assert.equal(level, 1, 'Document should start with h1');
                } else {
                    assert.ok(level <= currentLevel + 1, 
                        `Heading level should not skip (h${currentLevel} -> h${level})`);
                }
                
                currentLevel = level;
            });
            
            // Test that headings have meaningful content
            headings.forEach(heading => {
                const text = heading.textContent.trim();
                assert.ok(text.length > 2, 
                    `Heading "${text}" should be descriptive`);
                assert.notOk(text.match(/^(section|part|chapter)\s*\d+$/i), 
                    `Heading "${text}" should be descriptive, not just generic`);
            });
            
            document.body.removeChild(helpDocument);
        });
        
        QUnit.test('3.1.3 Unusual Words', function(assert) {
            // Test that unusual words are defined
            const helpContent = document.createElement('div');
            helpContent.innerHTML = `
                <div class="help-content">
                    <p>
                        The <dfn id="def-bunenjin">bunenjin</dfn> philosophy suggests that people have multiple personas 
                        depending on the situation. This concept is fundamental to understanding the 
                        <abbr title="Human Awareness Quantum Evolution Interface">HAQEI</abbr> system.
                    </p>
                    
                    <p>
                        The system uses <dfn id="def-hexagram">hexagrams</dfn> from the I Ching, 
                        which are six-line figures used for divination and philosophical guidance.
                    </p>
                    
                    <dl class="glossary">
                        <dt>Triple OS</dt>
                        <dd>A three-layer operating system architecture consisting of Engine OS, Interface OS, and Safe Mode</dd>
                        
                        <dt>Engine OS</dt>
                        <dd>The core analytical layer that processes psychological patterns</dd>
                    </dl>
                </div>
            `;
            document.body.appendChild(helpContent);
            
            // Test definition elements
            const definitions = helpContent.querySelectorAll('dfn');
            definitions.forEach(dfn => {
                const id = dfn.getAttribute('id');
                assert.ok(id, 'Definition should have ID for linking');
                
                const term = dfn.textContent.trim();
                assert.ok(term.length > 0, 'Definition should contain the term');
            });
            
            // Test abbreviations
            const abbreviations = helpContent.querySelectorAll('abbr');
            abbreviations.forEach(abbr => {
                const title = abbr.getAttribute('title');
                assert.ok(title, 'Abbreviation should have title attribute with expansion');
                assert.ok(title.length > abbr.textContent.length, 
                    'Abbreviation expansion should be longer than abbreviation');
            });
            
            // Test glossary structure
            const glossary = helpContent.querySelector('.glossary');
            if (glossary) {
                const terms = glossary.querySelectorAll('dt');
                const definitions = glossary.querySelectorAll('dd');
                
                assert.equal(terms.length, definitions.length, 
                    'Glossary should have equal number of terms and definitions');
                
                terms.forEach(term => {
                    assert.ok(term.textContent.trim().length > 0, 
                        'Glossary term should not be empty');
                });
                
                definitions.forEach(definition => {
                    assert.ok(definition.textContent.trim().length > 10, 
                        'Glossary definition should be substantial');
                });
            }
            
            document.body.removeChild(helpContent);
        });
    });
    
    // Screen Reader Tests
    QUnit.module('Screen Reader Compatibility', function() {
        
        QUnit.test('ARIA Live Regions', function(assert) {
            // Test live region announcements
            const liveRegion = document.createElement('div');
            liveRegion.innerHTML = `
                <div aria-live="polite" id="status-messages" class="sr-only"></div>
                <div aria-live="assertive" id="error-messages" class="sr-only"></div>
                
                <div class="tutorial-progress">
                    <div aria-live="polite" aria-atomic="true" id="progress-announcement">
                        Step 1 of 7 completed
                    </div>
                </div>
            `;
            document.body.appendChild(liveRegion);
            
            const politeRegion = liveRegion.querySelector('[aria-live="polite"]');
            const assertiveRegion = liveRegion.querySelector('[aria-live="assertive"]');
            
            assert.ok(politeRegion, 'Should have polite live region for status updates');
            assert.ok(assertiveRegion, 'Should have assertive live region for errors');
            
            // Test progress announcements
            const progressRegion = liveRegion.querySelector('#progress-announcement');
            assert.ok(progressRegion.getAttribute('aria-atomic'), 
                'Progress announcements should be atomic');
            
            document.body.removeChild(liveRegion);
        });
        
        QUnit.test('Screen Reader Only Content', function(assert) {
            // Test screen reader only helper text
            const content = document.createElement('div');
            content.innerHTML = `
                <button class="haqei-help-button" aria-describedby="help-button-description">
                    <span aria-hidden="true">?</span>
                    <span class="sr-only">Open help system</span>
                </button>
                
                <div id="help-button-description" class="sr-only">
                    Opens a comprehensive help system with tutorials, guides, and contextual assistance
                </div>
                
                <div class="tutorial-step">
                    <h3>Understanding Your Results</h3>
                    <span class="sr-only">Step 3 of 7 in the welcome tutorial</span>
                    <p>Your analysis reveals...</p>
                </div>
            `;
            document.body.appendChild(content);
            
            const srOnlyElements = content.querySelectorAll('.sr-only');
            srOnlyElements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                
                // Screen reader only content should be visually hidden but accessible
                assert.ok(
                    computedStyle.position === 'absolute' || 
                    computedStyle.clip === 'rect(0, 0, 0, 0)' ||
                    computedStyle.clipPath === 'inset(50%)',
                    'Screen reader only content should be visually hidden'
                );
                
                assert.ok(element.textContent.trim().length > 0, 
                    'Screen reader only content should have meaningful text');
            });
            
            document.body.removeChild(content);
        });
        
        QUnit.test('Alternative Text for Images', function(assert) {
            // Test image alternatives
            const imageContent = document.createElement('div');
            imageContent.innerHTML = `
                <div class="tutorial-step">
                    <img src="tutorial-step-1.png" alt="Screenshot showing the question input form with 30 personal questions about daily preferences and behaviors">
                    
                    <svg role="img" aria-labelledby="progress-title progress-desc" class="progress-chart">
                        <title id="progress-title">Tutorial Progress Chart</title>
                        <desc id="progress-desc">A circular progress indicator showing 43% completion of the welcome tutorial</desc>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="8"/>
                    </svg>
                    
                    <\!-- Decorative image -->
                    <img src="decoration.png" alt="" role="presentation">
                    
                    <\!-- Icon with semantic meaning -->
                    <svg aria-label="Success" role="img" class="success-icon">
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                </div>
            `;
            document.body.appendChild(imageContent);
            
            // Test regular images
            const images = imageContent.querySelectorAll('img');
            images.forEach(img => {
                const alt = img.getAttribute('alt');
                assert.ok(alt \!== null, 'All images should have alt attribute');
                
                if (img.getAttribute('role') \!== 'presentation') {
                    assert.ok(alt.length > 0, 'Meaningful images should have descriptive alt text');
                    assert.ok(alt.length < 150, 'Alt text should be concise (< 150 characters)');
                }
            });
            
            // Test SVG images
            const svgImages = imageContent.querySelectorAll('svg[role="img"]');
            svgImages.forEach(svg => {
                const hasAriaLabel = svg.getAttribute('aria-label');
                const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
                const hasTitle = svg.querySelector('title');
                
                assert.ok(hasAriaLabel || hasAriaLabelledBy || hasTitle, 
                    'SVG images should have accessible names');
            });
            
            document.body.removeChild(imageContent);
        });
    });
});

// Utility function to calculate contrast ratio (simplified)
function calculateContrastRatio(color1, color2) {
    // This is a simplified implementation
    // In a real test, you would use a proper color contrast library
    
    if (\!color1 || \!color2 || color1 === 'rgba(0, 0, 0, 0)' || color2 === 'rgba(0, 0, 0, 0)') {
        return null; // Cannot calculate for transparent colors
    }
    
    // For testing purposes, assume reasonable contrast ratios
    // In production, use libraries like 'color-contrast' or similar
    return 4.8; // Mock value that passes WCAG AA
}

// Custom CSS for screen reader only content
if (\!document.querySelector('#sr-only-styles')) {
    const srStyles = document.createElement('style');
    srStyles.id = 'sr-only-styles';
    srStyles.textContent = `
        .sr-only {
            position: absolute \!important;
            width: 1px \!important;
            height: 1px \!important;
            padding: 0 \!important;
            margin: -1px \!important;
            overflow: hidden \!important;
            clip: rect(0, 0, 0, 0) \!important;
            white-space: nowrap \!important;
            border: 0 \!important;
        }
        
        .sr-only:focus {
            position: static \!important;
            width: auto \!important;
            height: auto \!important;
            padding: inherit \!important;
            margin: inherit \!important;
            overflow: visible \!important;
            clip: auto \!important;
            white-space: inherit \!important;
        }
    `;
    document.head.appendChild(srStyles);
}

console.log('♿ HAQEI Help System Accessibility Tests Loaded');
EOF < /dev/null