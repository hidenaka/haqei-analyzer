/**
 * SNSSharingManager.js - HAQEI Social Media Sharing System
 * 
 * Secure social sharing with privacy protection and custom hashtags
 * Supports Twitter, Facebook, LinkedIn, Instagram, and generic sharing
 * 
 * @version 1.0.0
 * @date 2025-08-04
 * @author extended-features-developer
 */

class SNSSharingManager {
    constructor(options = {}) {
        this.options = {
            appName: 'HAQEI',
            domain: 'haqei.com',
            defaultHashtags: ['HAQEI', 'SelfDiscovery', 'TripleOS', 'bunenjin'],
            privacyMode: true,
            imageGeneration: true,
            analytics: true,
            ...options
        };
        
        this.shareData = null;
        this.metadata = {
            title: 'HAQEI - 仮想人格対話型自己理解システム',
            description: 'あなたの内なる3つのOSとの対話を通じて深い自己理解を促進',
            image: '',
            url: window.location.href
        };
        
        console.log('📱 SNSSharingManager initialized with privacy protection');
    }
    
    /**
     * Initialize sharing manager with analysis data
     */
    async init(analysisResult, options = {}) {
        try {
            this.shareData = {
                analysisResult,
                timestamp: new Date().toISOString(),
                personaName: this.generatePersonaName(analysisResult),
                summary: this.generateSummary(analysisResult),
                ...options
            };
            
            // Generate share image if enabled
            if (this.options.imageGeneration) {
                await this.generateShareImage();
            }
            
            // Setup Open Graph meta tags
            this.setupOpenGraphTags();
            
            console.log('✅ SNSSharingManager initialized with analysis data');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize SNSSharingManager:', error);
            throw error;
        }
    }
    
    /**
     * Share to Twitter with custom content
     */
    async shareToTwitter(customContent = null) {
        try {
            const content = customContent || this.generateTwitterContent();
            const hashtags = this.options.defaultHashtags.join(',');
            
            const twitterUrl = new URL('https://twitter.com/intent/tweet');
            twitterUrl.searchParams.set('text', content);
            twitterUrl.searchParams.set('hashtags', hashtags);
            twitterUrl.searchParams.set('url', this.getShareUrl());
            
            this.openSharingWindow(twitterUrl.toString(), 'twitter');
            this.trackShare('twitter');
            
            console.log('🐦 Twitter sharing initiated');
            
        } catch (error) {
            console.error('❌ Twitter sharing failed:', error);
            throw error;
        }
    }
    
    /**
     * Share to Facebook
     */
    async shareToFacebook(customContent = null) {
        try {
            const content = customContent || this.generateFacebookContent();
            
            const facebookUrl = new URL('https://www.facebook.com/sharer/sharer.php');
            facebookUrl.searchParams.set('u', this.getShareUrl());
            facebookUrl.searchParams.set('quote', content);
            
            this.openSharingWindow(facebookUrl.toString(), 'facebook');
            this.trackShare('facebook');
            
            console.log('📘 Facebook sharing initiated');
            
        } catch (error) {
            console.error('❌ Facebook sharing failed:', error);
            throw error;
        }
    }
    
    /**
     * Share to LinkedIn
     */
    async shareToLinkedIn(customContent = null) {
        try {
            const content = customContent || this.generateLinkedInContent();
            
            const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
            linkedinUrl.searchParams.set('url', this.getShareUrl());
            linkedinUrl.searchParams.set('title', this.metadata.title);
            linkedinUrl.searchParams.set('summary', content);
            
            this.openSharingWindow(linkedinUrl.toString(), 'linkedin');
            this.trackShare('linkedin');
            
            console.log('💼 LinkedIn sharing initiated');
            
        } catch (error) {
            console.error('❌ LinkedIn sharing failed:', error);
            throw error;
        }
    }
    
    /**
     * Generate Instagram-ready image and copy text
     */
    async shareToInstagram() {
        try {
            const content = this.generateInstagramContent();
            const imageBlob = await this.generateInstagramImage();
            
            // Create downloadable image
            const url = URL.createObjectURL(imageBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `HAQEI-Share-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Copy text to clipboard
            await navigator.clipboard.writeText(content);
            
            this.showNotification('Instagram用の画像をダウンロードし、テキストをクリップボードにコピーしました！');
            this.trackShare('instagram');
            
            console.log('📷 Instagram content prepared');
            
        } catch (error) {
            console.error('❌ Instagram sharing failed:', error);
            throw error;
        }
    }
    
    /**
     * Generic Web Share API
     */
    async shareGeneric(customData = null) {
        try {
            if (!navigator.share) {
                throw new Error('Web Share API not supported');
            }
            
            const shareData = customData || {
                title: this.metadata.title,
                text: this.generateGenericContent(),
                url: this.getShareUrl()
            };
            
            await navigator.share(shareData);
            this.trackShare('generic');
            
            console.log('🌐 Generic sharing completed');
            
        } catch (error) {
            console.error('❌ Generic sharing failed:', error);
            
            // Fallback to clipboard
            await this.copyToClipboard();
        }
    }
    
    /**
     * Copy share content to clipboard
     */
    async copyToClipboard() {
        try {
            const content = `${this.generateGenericContent()}\n\n${this.getShareUrl()}`;
            await navigator.clipboard.writeText(content);
            
            this.showNotification('シェア用テキストをクリップボードにコピーしました！');
            this.trackShare('clipboard');
            
            console.log('📋 Content copied to clipboard');
            
        } catch (error) {
            console.error('❌ Clipboard copy failed:', error);
            throw error;
        }
    }
    
    /**
     * Content generation methods
     */
    
    generatePersonaName(analysisResult) {
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        const engineName = engineOS?.hexagramInfo?.name || '創造';
        const interfaceName = interfaceOS?.hexagramInfo?.name || '調和';
        
        return `${engineName}の${interfaceName}者`;
    }
    
    generateSummary(analysisResult) {
        const integrationLevel = this.calculateIntegrationLevel(analysisResult);
        return `Triple OS統合レベル${integrationLevel}%の仮想人格が構築されました`;
    }
    
    generateTwitterContent() {
        if (this.options.privacyMode) {
            return `HAQEIで自分の内なる3つのOSを発見しました！\n\nTriple OS分析により、新しい自己理解を得ることができます。\n\n#自己理解 #心理分析`;
        } else {
            return `HAQEIで「${this.shareData.personaName}」という仮想人格を発見！\n\n${this.shareData.summary}\n\n#自己理解 #HAQEI`;
        }
    }
    
    generateFacebookContent() {
        if (this.options.privacyMode) {
            return `HAQEIで深い自己理解を体験しました。\n\nTriple OS分析により、自分の中にある3つの異なる側面を客観的に観察することができます。bunenjin哲学に基づく革新的なアプローチで、新しい自分を発見してみませんか？`;
        } else {
            return `HAQEIで「${this.shareData.personaName}」という仮想人格を発見しました。\n\n${this.shareData.summary}\n\nbunenjin哲学に基づく深い自己理解を体験できる素晴らしいシステムです。`;
        }
    }
    
    generateLinkedInContent() {
        return `専門的な自己理解ツールHAQEIを体験しました。\n\nTriple OS理論に基づく分析により、ビジネスシーンでの自己表現や意思決定パターンを客観的に把握することができます。\n\nリーダーシップ開発や組織での役割理解に活用できる貴重なインサイトを得られました。\n\n#SelfDevelopment #Leadership #Psychology`;
    }
    
    generateInstagramContent() {
        const hashtags = [
            '#HAQEI',
            '#自己理解',
            '#心理分析',
            '#bunenjin',
            '#TripleOS',
            '#SelfDiscovery',
            '#マインドフルネス',
            '#成長',
            '#自己啓発',
            '#内省'
        ].join(' ');
        
        return `✨ 新しい自分を発見 ✨\n\nHAQEIで内なる3つのOSとの対話を体験💭\n\nTriple OS分析で深い自己理解を🧠\n\n${hashtags}`;
    }
    
    generateGenericContent() {
        return `HAQEIで深い自己理解を体験しました。\n\nTriple OS分析により、自分の中にある3つの異なる側面を発見。bunenjin哲学に基づく革新的なアプローチで新しい自分を発見できます。`;
    }
    
    /**
     * Image generation methods
     */
    
    async generateShareImage() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 630; // Twitter/Facebook optimal size
            const ctx = canvas.getContext('2d');
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#6366F1');
            gradient.addColorStop(1, '#8B5CF6');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // HAQEI logo/title
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 72px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('HAQEI', canvas.width / 2, 150);
            
            // Subtitle
            ctx.font = '36px Arial, sans-serif';
            ctx.fillText('仮想人格対話型自己理解システム', canvas.width / 2, 220);
            
            // Triple OS visualization
            if (!this.options.privacyMode && this.shareData) {
                ctx.font = '28px Arial, sans-serif';
                ctx.fillText(`仮想人格: "${this.shareData.personaName}"`, canvas.width / 2, 320);
                
                ctx.font = '24px Arial, sans-serif';
                ctx.fillText(this.shareData.summary, canvas.width / 2, 380);
            }
            
            // Footer
            ctx.font = '20px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText('bunenjin 哲学に基づく深い自己理解', canvas.width / 2, 550);
            
            // Convert to blob
            return new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });
            
        } catch (error) {
            console.error('❌ Failed to generate share image:', error);
            return null;
        }
    }
    
    async generateInstagramImage() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1080; // Instagram square
            const ctx = canvas.getContext('2d');
            
            // Background with pattern
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width / 2
            );
            gradient.addColorStop(0, '#6366F1');
            gradient.addColorStop(1, '#1E1B4B');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Decorative elements
            this.drawDecoративеElements(ctx, canvas.width, canvas.height);
            
            // Main content
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 80px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('HAQEI', canvas.width / 2, 300);
            
            ctx.font = '32px Arial, sans-serif';
            ctx.fillText('Triple OS 分析', canvas.width / 2, 400);
            
            if (!this.options.privacyMode && this.shareData) {
                ctx.font = 'bold 36px Arial, sans-serif';
                ctx.fillText(`"${this.shareData.personaName}"`, canvas.width / 2, 500);
            }
            
            ctx.font = '28px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('内なる3つのOSとの対話', canvas.width / 2, 600);
            
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText('深い自己理解への扉', canvas.width / 2, 700);
            
            // Hashtags
            ctx.font = '20px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('#HAQEI #自己理解 #bunenjin', canvas.width / 2, 900);
            
            return new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });
            
        } catch (error) {
            console.error('❌ Failed to generate Instagram image:', error);
            return null;
        }
    }
    
    drawDecoративеElements(ctx, width, height) {
        // I Ching symbols
        const symbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = '40px Arial, sans-serif';
        
        symbols.forEach((symbol, index) => {
            const angle = (index / symbols.length) * 2 * Math.PI;
            const radius = 400;
            const x = width / 2 + Math.cos(angle) * radius;
            const y = height / 2 + Math.sin(angle) * radius;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillText(symbol, 0, 0);
            ctx.restore();
        });
        
        // Geometric patterns
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, 150 + i * 100, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    
    /**
     * Utility methods
     */
    
    setupOpenGraphTags() {
        const meta = [
            { property: 'og:title', content: this.metadata.title },
            { property: 'og:description', content: this.metadata.description },
            { property: 'og:image', content: this.metadata.image },
            { property: 'og:url', content: this.metadata.url },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'HAQEI' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: this.metadata.title },
            { name: 'twitter:description', content: this.metadata.description },
            { name: 'twitter:image', content: this.metadata.image }
        ];
        
        meta.forEach(({ property, name, content }) => {
            let tag = document.querySelector(
                property ? `meta[property="${property}"]` : `meta[name="${name}"]`
            );
            
            if (!tag) {
                tag = document.createElement('meta');
                if (property) tag.setAttribute('property', property);
                if (name) tag.setAttribute('name', name);
                document.head.appendChild(tag);
            }
            
            tag.setAttribute('content', content);
        });
    }
    
    getShareUrl() {
        const url = new URL(window.location.href);
        
        // Add tracking parameters if analytics enabled
        if (this.options.analytics) {
            url.searchParams.set('utm_source', 'social_share');
            url.searchParams.set('utm_medium', 'social');
            url.searchParams.set('utm_campaign', 'haqei_analysis');
        }
        
        return url.toString();
    }
    
    openSharingWindow(url, platform) {
        const features = 'width=600,height=600,scrollbars=yes,resizable=yes';
        const popup = window.open(url, `share_${platform}`, features);
        
        // Focus the popup
        if (popup) popup.focus();
        
        return popup;
    }
    
    trackShare(platform) {
        if (!this.options.analytics) return;
        
        // Basic tracking (can be extended with analytics service)
        console.log(`📊 Share tracked: ${platform} at ${new Date().toISOString()}`);
        
        // Store in localStorage for analytics
        const shares = JSON.parse(localStorage.getItem('haqei_shares') || '[]');
        shares.push({
            platform,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
        
        // Keep only last 100 shares
        if (shares.length > 100) {
            shares.splice(0, shares.length - 100);
        }
        
        localStorage.setItem('haqei_shares', JSON.stringify(shares));
    }
    
    calculateIntegrationLevel(analysisResult) {
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        const scores = [
            engineOS?.matchPercentage || 0,
            interfaceOS?.matchPercentage || 0,
            safeModeOS?.matchPercentage || 0
        ];
        
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
        return Math.round(Math.max(0, 100 - variance));
    }
    
    showNotification(message, duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'sns-sharing-notification';
        notification.textContent = message;
        
        // Styling
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#10B981',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
    
    /**
     * Privacy control methods
     */
    
    setPrivacyMode(enabled) {
        this.options.privacyMode = enabled;
        console.log(`🔒 Privacy mode ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    getShareStatistics() {
        const shares = JSON.parse(localStorage.getItem('haqei_shares') || '[]');
        const stats = {};
        
        shares.forEach(share => {
            stats[share.platform] = (stats[share.platform] || 0) + 1;
        });
        
        return {
            total: shares.length,
            platforms: stats,
            lastShare: shares[shares.length - 1]?.timestamp || null
        };
    }
}

// Export for global use
window.SNSSharingManager = SNSSharingManager;

console.log('✅ SNSSharingManager loaded successfully with privacy protection');