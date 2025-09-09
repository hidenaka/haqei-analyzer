class FeedbackCollector {
    constructor() {
        this.feedbackQueue = [];
    }

    collectFeedback(feedback) {
        this.feedbackQueue.push(feedback);
        if (this.feedbackQueue.length >= 10) {
            this.flushFeedback();
        }
    }

    flushFeedback() {
        console.log('Flushing feedback:', this.feedbackQueue);
        // Here, implement actual sending to backend or storage
        this.feedbackQueue = [];
    }
}

export const feedbackCollector = new FeedbackCollector();