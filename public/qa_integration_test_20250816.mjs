console.log("🚀 Starting QA Integration Test for OSAnalyzer");

import { promises as fs } from "fs";

async function testOSAnalyzer() {
    const results = {
        testDate: new Date().toISOString(),
        issues: {
            I1_navigation: { status: "pending", details: "" },
            I2_questionFlow: { status: "pending", details: "" },
            I3_jsErrors: { status: "pending", details: "" }
        }
    };

    console.log("🔍 Testing I3: JavaScript Syntax Errors...");
    
    try {
        const htmlContent = await fs.readFile("/Users/hideakimacbookair/Desktop/haqei-analyzer/public/os_analyzer.html", "utf8");
        
        const openBraces = (htmlContent.match(/{/g) || []).length;
        const closeBraces = (htmlContent.match(/}/g) || []).length;
        console.log(`Brace balance: Open=${openBraces}, Close=${closeBraces}`);
        
        const windowQuestionsUsage = htmlContent.includes("window.QUESTIONS");
        console.log(`window.QUESTIONS usage found: ${windowQuestionsUsage}`);
        
        results.issues.I3_jsErrors = {
            status: closeBraces <= openBraces ? "pass" : "fail",
            details: closeBraces <= openBraces ? "No extra closing braces detected" : `${closeBraces - openBraces} extra closing braces`
        };
        
        console.log("🔍 Testing I1: Navigation Flow...");
        const hasStartAnalysis = htmlContent.includes("startAnalysis");
        const hasScreenManagerSwitch = htmlContent.includes("ScreenManager.switchToAccessible");
        const hasQuestionTransition = htmlContent.includes("switchToAccessible(\"question\")");
        const hasAnalysisButton = htmlContent.includes("分析を始める");
        
        console.log(`startAnalysis: ${hasStartAnalysis}, ScreenManager: ${hasScreenManagerSwitch}, QuestionTransition: ${hasQuestionTransition}, Button: ${hasAnalysisButton}`);
        
        results.issues.I1_navigation = {
            status: (hasStartAnalysis && hasScreenManagerSwitch && hasQuestionTransition && hasAnalysisButton) ? "pass" : "partial",
            details: `Components found: startAnalysis=${hasStartAnalysis}, ScreenManager=${hasScreenManagerSwitch}, questionTransition=${hasQuestionTransition}, button=${hasAnalysisButton}`
        };
        
        console.log("🔍 Testing I2: Question Flow...");
        const hasWindowQuestions = htmlContent.includes("window.QUESTIONS");
        const hasShowQuestion = htmlContent.includes("showQuestion");
        const hasNextButton = htmlContent.includes("次の質問");
        
        console.log(`window.QUESTIONS: ${hasWindowQuestions}, showQuestion: ${hasShowQuestion}, nextButton: ${hasNextButton}`);
        
        results.issues.I2_questionFlow = {
            status: (hasWindowQuestions && hasShowQuestion && hasNextButton) ? "pass" : "partial", 
            details: `Components found: window.QUESTIONS=${hasWindowQuestions}, showQuestion=${hasShowQuestion}, nextButton=${hasNextButton}`
        };
        
        console.log("
📊 QA Test Results Summary:");
        Object.entries(results.issues).forEach(([issue, result]) => {
            const icon = result.status === "pass" ? "✅" : "⚠️";
            console.log(`${icon} ${issue}: ${result.status} - ${result.details}`);
        });
        
        await fs.writeFile("qa_test_results_20250816.json", JSON.stringify(results, null, 2));
        console.log("
📁 Results saved to qa_test_results_20250816.json");
        
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testOSAnalyzer();
