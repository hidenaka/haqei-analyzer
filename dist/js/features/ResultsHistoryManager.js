/**
 * ResultsHistoryManager.js - HAQEI Results History & Comparison System
 * 
 * Manages historical analysis results with comparison functionality
 * Provides bookmarks, favorites, and multiple export formats
 * 
 * @version 1.0.0
 * @date 2025-08-04
 * @author extended-features-developer
 */

class ResultsHistoryManager {
    constructor(options = {}) {
        this.options = {
            maxHistorySize: 50,
            enableCompression: true,
            enableBookmarks: true,
            enableFavorites: true,
            enableComparison: true,
            storagePrefix: 'haqei_',
            ...options
        };
        
        this.history = [];
        this.bookmarks = [];
        this.favorites = [];
        this.currentResult = null;
        
        console.log('📚 ResultsHistoryManager initialized');
    }
    
    /**
     * Initialize the history manager
     */
    async init() {
        try {
            await this.loadFromStorage();
            this.setupStorageListener();
            
            console.log('✅ ResultsHistoryManager initialized successfully');
            console.log(`📊 Loaded ${this.history.length} historical results`);
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize ResultsHistoryManager:', error);
            throw error;
        }
    }
    
    /**
     * Add new analysis result to history
     */
    async addResult(analysisResult, metadata = {}) {
        try {
            const historyEntry = {
                id: this.generateUniqueId(),
                timestamp: new Date().toISOString(),
                analysisResult: this.options.enableCompression ? 
                    this.compressData(analysisResult) : analysisResult,
                metadata: {
                    userAgent: navigator.userAgent,
                    screenResolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    sessionId: this.getSessionId(),
                    ...metadata
                },
                version: '1.0.0',
                isBookmarked: false,
                isFavorite: false,
                tags: [],
                notes: ''
            };
            
            // Add to beginning of history
            this.history.unshift(historyEntry);
            
            // Maintain max size
            if (this.history.length > this.options.maxHistorySize) {
                this.history = this.history.slice(0, this.options.maxHistorySize);
            }
            
            // Set as current result
            this.currentResult = historyEntry;
            
            // Save to storage
            await this.saveToStorage();
            
            console.log(`✅ Added new result to history: ${historyEntry.id}`);
            return historyEntry;
            
        } catch (error) {
            console.error('❌ Failed to add result to history:', error);
            throw error;
        }
    }
    
    /**
     * Get historical results with filtering
     */
    getHistory(options = {}) {
        const {
            limit = null,
            offset = 0,
            sortBy = 'timestamp',
            sortOrder = 'desc',
            filterBy = null,
            searchTerm = null
        } = options;
        
        let results = [...this.history];
        
        // Apply filters
        if (filterBy) {
            results = results.filter(result => {
                switch (filterBy) {
                    case 'bookmarks':
                        return result.isBookmarked;
                    case 'favorites':
                        return result.isFavorite;
                    case 'last7days':
                        return new Date(result.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    case 'last30days':
                        return new Date(result.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    default:
                        return true;
                }
            });
        }
        
        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(result => {
                const analysisData = this.options.enableCompression ? 
                    this.decompressData(result.analysisResult) : result.analysisResult;
                
                return (
                    result.notes.toLowerCase().includes(term) ||
                    result.tags.some(tag => tag.toLowerCase().includes(term)) ||
                    analysisData.engineOS?.hexagramInfo?.name?.toLowerCase().includes(term) ||
                    analysisData.interfaceOS?.hexagramInfo?.name?.toLowerCase().includes(term) ||
                    analysisData.safeModeOS?.hexagramInfo?.name?.toLowerCase().includes(term)
                );
            });
        }
        
        // Sort results
        results.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'timestamp':
                    aValue = new Date(a.timestamp);
                    bValue = new Date(b.timestamp);
                    break;
                case 'integration':
                    aValue = this.calculateIntegrationLevel(
                        this.options.enableCompression ? this.decompressData(a.analysisResult) : a.analysisResult
                    );
                    bValue = this.calculateIntegrationLevel(
                        this.options.enableCompression ? this.decompressData(b.analysisResult) : b.analysisResult
                    );
                    break;
                default:
                    aValue = a[sortBy];
                    bValue = b[sortBy];
            }
            
            if (sortOrder === 'desc') {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            } else {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        });
        
        // Apply pagination
        if (limit) {
            results = results.slice(offset, offset + limit);
        }
        
        return results;
    }
    
    /**
     * Get specific result by ID
     */
    getResult(id) {
        const result = this.history.find(r => r.id === id);
        if (!result) return null;
        
        return {
            ...result,
            analysisResult: this.options.enableCompression ? 
                this.decompressData(result.analysisResult) : result.analysisResult
        };
    }
    
    /**
     * Compare two analysis results
     */
    compareResults(id1, id2) {
        const result1 = this.getResult(id1);
        const result2 = this.getResult(id2);
        
        if (!result1 || !result2) {
            throw new Error('One or both results not found');
        }
        
        const analysis1 = result1.analysisResult;
        const analysis2 = result2.analysisResult;
        
        return {
            timeframe: {
                from: result2.timestamp,
                to: result1.timestamp,
                daysDifference: Math.ceil(
                    (new Date(result1.timestamp) - new Date(result2.timestamp)) / (1000 * 60 * 60 * 24)
                )
            },
            engineOS: this.compareOS(analysis1.engineOS, analysis2.engineOS),
            interfaceOS: this.compareOS(analysis1.interfaceOS, analysis2.interfaceOS),
            safeModeOS: this.compareOS(analysis1.safeModeOS, analysis2.safeModeOS),
            integrationLevel: {
                current: this.calculateIntegrationLevel(analysis1),
                previous: this.calculateIntegrationLevel(analysis2),
                change: this.calculateIntegrationLevel(analysis1) - this.calculateIntegrationLevel(analysis2)
            },
            overallTrend: this.calculateOverallTrend(analysis1, analysis2),
            insights: this.generateComparisonInsights(analysis1, analysis2)
        };
    }
    
    /**
     * Bookmark management
     */
    async toggleBookmark(id) {
        const result = this.history.find(r => r.id === id);
        if (!result) throw new Error('Result not found');
        
        result.isBookmarked = !result.isBookmarked;
        
        if (result.isBookmarked) {
            this.bookmarks.push(id);
        } else {
            this.bookmarks = this.bookmarks.filter(bookmarkId => bookmarkId !== id);
        }
        
        await this.saveToStorage();
        console.log(`📌 ${result.isBookmarked ? 'Added' : 'Removed'} bookmark: ${id}`);
        
        return result.isBookmarked;
    }
    
    /**
     * Favorites management
     */
    async toggleFavorite(id) {
        const result = this.history.find(r => r.id === id);
        if (!result) throw new Error('Result not found');
        
        result.isFavorite = !result.isFavorite;
        
        if (result.isFavorite) {
            this.favorites.push(id);
        } else {
            this.favorites = this.favorites.filter(favoriteId => favoriteId !== id);
        }
        
        await this.saveToStorage();
        console.log(`⭐ ${result.isFavorite ? 'Added' : 'Removed'} favorite: ${id}`);
        
        return result.isFavorite;
    }
    
    /**
     * Tags management
     */
    async addTag(id, tag) {
        const result = this.history.find(r => r.id === id);
        if (!result) throw new Error('Result not found');
        
        if (!result.tags.includes(tag)) {
            result.tags.push(tag);
            await this.saveToStorage();
            console.log(`🏷️ Added tag "${tag}" to result ${id}`);
        }
        
        return result.tags;
    }
    
    async removeTag(id, tag) {
        const result = this.history.find(r => r.id === id);
        if (!result) throw new Error('Result not found');
        
        result.tags = result.tags.filter(t => t !== tag);
        await this.saveToStorage();
        console.log(`🏷️ Removed tag "${tag}" from result ${id}`);
        
        return result.tags;
    }
    
    /**
     * Notes management
     */
    async addNote(id, note) {
        const result = this.history.find(r => r.id === id);
        if (!result) throw new Error('Result not found');
        
        result.notes = note;
        await this.saveToStorage();
        console.log(`📝 Added note to result ${id}`);
        
        return result.notes;
    }
    
    /**
     * Export functionality
     */
    
    async exportToJSON(ids = null, options = {}) {
        const results = ids ? 
            ids.map(id => this.getResult(id)).filter(Boolean) : 
            this.getHistory();
        
        const exportData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            totalResults: results.length,
            includeMetadata: options.includeMetadata !== false,
            results: results.map(result => ({
                ...result,
                analysisResult: this.options.enableCompression ? 
                    this.decompressData(result.analysisResult) : result.analysisResult
            }))
        };
        
        if (!options.includeMetadata) {
            exportData.results.forEach(result => {
                delete result.metadata;
            });
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        this.downloadBlob(blob, `haqei-history-${new Date().toISOString().split('T')[0]}.json`);
        console.log(`📁 Exported ${results.length} results to JSON`);
    }
    
    async exportToCSV(ids = null) {
        const results = ids ? 
            ids.map(id => this.getResult(id)).filter(Boolean) : 
            this.getHistory();
        
        const csvData = this.convertToCSV(results);
        const blob = new Blob([csvData], { type: 'text/csv' });
        
        this.downloadBlob(blob, `haqei-history-${new Date().toISOString().split('T')[0]}.csv`);
        console.log(`📊 Exported ${results.length} results to CSV`);
    }
    
    async exportSummaryReport(ids = null) {
        const results = ids ? 
            ids.map(id => this.getResult(id)).filter(Boolean) : 
            this.getHistory();
        
        const reportData = this.generateSummaryReport(results);
        const blob = new Blob([reportData], { type: 'text/plain' });
        
        this.downloadBlob(blob, `haqei-summary-${new Date().toISOString().split('T')[0]}.txt`);
        console.log(`📋 Exported summary report for ${results.length} results`);
    }
    
    /**
     * Import functionality
     */
    async importFromJSON(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            if (!importData.results || !Array.isArray(importData.results)) {
                throw new Error('Invalid import format');
            }
            
            let importedCount = 0;
            
            for (const result of importData.results) {
                // Check if result already exists
                if (!this.history.find(r => r.id === result.id)) {
                    // Compress if needed
                    if (this.options.enableCompression && result.analysisResult) {
                        result.analysisResult = this.compressData(result.analysisResult);
                    }
                    
                    this.history.push(result);
                    importedCount++;
                }
            }
            
            // Sort by timestamp
            this.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Maintain max size
            if (this.history.length > this.options.maxHistorySize) {
                this.history = this.history.slice(0, this.options.maxHistorySize);
            }
            
            await this.saveToStorage();
            
            console.log(`📥 Imported ${importedCount} new results`);
            return { imported: importedCount, total: importData.results.length };
            
        } catch (error) {
            console.error('❌ Failed to import data:', error);
            throw error;
        }
    }
    
    /**
     * Utility methods
     */
    
    generateUniqueId() {
        return `haqei_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('haqei_session_id');
        if (!sessionId) {
            sessionId = this.generateUniqueId();
            sessionStorage.setItem('haqei_session_id', sessionId);
        }
        return sessionId;
    }
    
    compressData(data) {
        // Simple compression by removing unnecessary fields and converting to string
        const simplified = {
            eOS: {
                n: data.engineOS?.hexagramInfo?.name,
                id: data.engineOS?.hexagramId,
                mp: data.engineOS?.matchPercentage
            },
            iOS: {
                n: data.interfaceOS?.hexagramInfo?.name,
                id: data.interfaceOS?.hexagramId,
                mp: data.interfaceOS?.matchPercentage
            },
            sOS: {
                n: data.safeModeOS?.hexagramInfo?.name,
                id: data.safeModeOS?.hexagramId,
                mp: data.safeModeOS?.matchPercentage
            },
            cs: data.consistencyScore
        };
        
        return JSON.stringify(simplified);
    }
    
    decompressData(compressedData) {
        if (typeof compressedData === 'string') {
            const simplified = JSON.parse(compressedData);
            return {
                engineOS: {
                    hexagramInfo: { name: simplified.eOS?.n },
                    hexagramId: simplified.eOS?.id,
                    matchPercentage: simplified.eOS?.mp
                },
                interfaceOS: {
                    hexagramInfo: { name: simplified.iOS?.n },
                    hexagramId: simplified.iOS?.id,
                    matchPercentage: simplified.iOS?.mp
                },
                safeModeOS: {
                    hexagramInfo: { name: simplified.sOS?.n },
                    hexagramId: simplified.sOS?.id,
                    matchPercentage: simplified.sOS?.mp
                },
                consistencyScore: simplified.cs
            };
        }
        
        return compressedData; // Already decompressed
    }
    
    compareOS(current, previous) {
        return {
            hexagramChange: {
                from: previous?.hexagramInfo?.name || 'Unknown',
                to: current?.hexagramInfo?.name || 'Unknown',
                changed: current?.hexagramId !== previous?.hexagramId
            },
            matchPercentageChange: {
                from: previous?.matchPercentage || 0,
                to: current?.matchPercentage || 0,
                difference: (current?.matchPercentage || 0) - (previous?.matchPercentage || 0)
            }
        };
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
    
    calculateOverallTrend(current, previous) {
        const currentIntegration = this.calculateIntegrationLevel(current);
        const previousIntegration = this.calculateIntegrationLevel(previous);
        const difference = currentIntegration - previousIntegration;
        
        if (Math.abs(difference) < 5) return 'stable';
        if (difference > 0) return 'improving';
        return 'declining';
    }
    
    generateComparisonInsights(current, previous) {
        const insights = [];
        
        // Integration level insight
        const integrationDiff = this.calculateIntegrationLevel(current) - this.calculateIntegrationLevel(previous);
        if (integrationDiff > 10) {
            insights.push('統合レベルが大幅に改善しています。三つのOSがより調和して働いています。');
        } else if (integrationDiff < -10) {
            insights.push('統合レベルが低下しています。OSの連携を意識した実践をお勧めします。');
        }
        
        // Hexagram changes
        if (current.engineOS?.hexagramId !== previous.engineOS?.hexagramId) {
            insights.push(`Engine OSの卦が「${previous.engineOS?.hexagramInfo?.name}」から「${current.engineOS?.hexagramInfo?.name}」に変化しました。`);
        }
        
        return insights;
    }
    
    convertToCSV(results) {
        const headers = [
            'Date',
            'Time',
            'Engine OS',
            'Engine %',
            'Interface OS', 
            'Interface %',
            'Safe Mode OS',
            'Safe Mode %',
            'Integration Level',
            'Is Bookmarked',
            'Is Favorite',
            'Tags',
            'Notes'
        ];
        
        const rows = results.map(result => {
            const analysis = this.options.enableCompression ? 
                this.decompressData(result.analysisResult) : result.analysisResult;
            const date = new Date(result.timestamp);
            
            return [
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                analysis.engineOS?.hexagramInfo?.name || '',
                analysis.engineOS?.matchPercentage || 0,
                analysis.interfaceOS?.hexagramInfo?.name || '',
                analysis.interfaceOS?.matchPercentage || 0,
                analysis.safeModeOS?.hexagramInfo?.name || '',
                analysis.safeModeOS?.matchPercentage || 0,
                this.calculateIntegrationLevel(analysis),
                result.isBookmarked ? 'Yes' : 'No',
                result.isFavorite ? 'Yes' : 'No',
                result.tags.join('; '),
                result.notes.replace(/"/g, '""') // Escape quotes
            ];
        });
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        return csvContent;
    }
    
    generateSummaryReport(results) {
        const report = [];
        
        report.push('HAQEI Analysis Results Summary Report');
        report.push('=' .repeat(50));
        report.push(`Generated: ${new Date().toLocaleString()}`);
        report.push(`Total Results: ${results.length}`);
        report.push('');
        
        if (results.length === 0) {
            report.push('No results to summarize.');
            return report.join('\n');
        }
        
        // Time range
        const dates = results.map(r => new Date(r.timestamp)).sort();
        report.push(`Time Range: ${dates[0].toLocaleDateString()} - ${dates[dates.length - 1].toLocaleDateString()}`);
        report.push('');
        
        // Integration levels
        const integrationLevels = results.map(r => {
            const analysis = this.options.enableCompression ? 
                this.decompressData(r.analysisResult) : r.analysisResult;
            return this.calculateIntegrationLevel(analysis);
        });
        
        const avgIntegration = integrationLevels.reduce((a, b) => a + b, 0) / integrationLevels.length;
        const maxIntegration = Math.max(...integrationLevels);
        const minIntegration = Math.min(...integrationLevels);
        
        report.push('Integration Level Statistics:');
        report.push(`  Average: ${avgIntegration.toFixed(1)}%`);
        report.push(`  Highest: ${maxIntegration}%`);
        report.push(`  Lowest: ${minIntegration}%`);
        report.push('');
        
        // Most common hexagrams
        const hexagramCounts = {};
        results.forEach(result => {
            const analysis = this.options.enableCompression ? 
                this.decompressData(result.analysisResult) : result.analysisResult;
            
            [analysis.engineOS, analysis.interfaceOS, analysis.safeModeOS].forEach(os => {
                if (os?.hexagramInfo?.name) {
                    hexagramCounts[os.hexagramInfo.name] = (hexagramCounts[os.hexagramInfo.name] || 0) + 1;
                }
            });
        });
        
        const sortedHexagrams = Object.entries(hexagramCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        report.push('Most Common Hexagrams:');
        sortedHexagrams.forEach(([name, count]) => {
            report.push(`  ${name}: ${count} times`);
        });
        
        return report.join('\n');
    }
    
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Storage methods
     */
    
    async saveToStorage() {
        try {
            const data = {
                history: this.history,
                bookmarks: this.bookmarks,
                favorites: this.favorites,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem(`${this.options.storagePrefix}history`, JSON.stringify(data));
            console.log('💾 History saved to storage');
            
        } catch (error) {
            console.error('❌ Failed to save history to storage:', error);
            throw error;
        }
    }
    
    async loadFromStorage() {
        try {
            const stored = localStorage.getItem(`${this.options.storagePrefix}history`);
            
            if (stored) {
                const data = JSON.parse(stored);
                this.history = data.history || [];
                this.bookmarks = data.bookmarks || [];
                this.favorites = data.favorites || [];
                
                console.log('💾 History loaded from storage');
            }
            
        } catch (error) {
            console.error('❌ Failed to load history from storage:', error);
            // Don't throw - continue with empty history
        }
    }
    
    setupStorageListener() {
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }
    
    /**
     * Clear data methods
     */
    
    async clearHistory() {
        this.history = [];
        this.currentResult = null;
        await this.saveToStorage();
        console.log('🗑️ History cleared');
    }
    
    async clearBookmarks() {
        this.bookmarks = [];
        this.history.forEach(result => {
            result.isBookmarked = false;
        });
        await this.saveToStorage();
        console.log('🗑️ Bookmarks cleared');
    }
    
    async clearFavorites() {
        this.favorites = [];
        this.history.forEach(result => {
            result.isFavorite = false;
        });
        await this.saveToStorage();
        console.log('🗑️ Favorites cleared');
    }
    
    async deleteResult(id) {
        this.history = this.history.filter(r => r.id !== id);
        this.bookmarks = this.bookmarks.filter(bookmarkId => bookmarkId !== id);
        this.favorites = this.favorites.filter(favoriteId => favoriteId !== id);
        
        if (this.currentResult?.id === id) {
            this.currentResult = null;
        }
        
        await this.saveToStorage();
        console.log(`🗑️ Deleted result: ${id}`);
    }
    
    /**
     * Statistics and analytics
     */
    
    getStatistics() {
        const stats = {
            totalResults: this.history.length,
            bookmarkedResults: this.bookmarks.length,
            favoriteResults: this.favorites.length,
            averageIntegrationLevel: 0,
            oldestResult: null,
            newestResult: null,
            mostCommonHexagrams: {},
            resultsPerMonth: {}
        };
        
        if (this.history.length === 0) return stats;
        
        // Calculate average integration level
        let totalIntegration = 0;
        this.history.forEach(result => {
            const analysis = this.options.enableCompression ? 
                this.decompressData(result.analysisResult) : result.analysisResult;
            totalIntegration += this.calculateIntegrationLevel(analysis);
        });
        stats.averageIntegrationLevel = totalIntegration / this.history.length;
        
        // Find oldest and newest
        const sortedByDate = [...this.history].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
        stats.oldestResult = sortedByDate[0];
        stats.newestResult = sortedByDate[sortedByDate.length - 1];
        
        // Count hexagrams and results per month
        this.history.forEach(result => {
            const analysis = this.options.enableCompression ? 
                this.decompressData(result.analysisResult) : result.analysisResult;
            
            // Count hexagrams
            [analysis.engineOS, analysis.interfaceOS, analysis.safeModeOS].forEach(os => {
                if (os?.hexagramInfo?.name) {
                    const name = os.hexagramInfo.name;
                    stats.mostCommonHexagrams[name] = (stats.mostCommonHexagrams[name] || 0) + 1;
                }
            });
            
            // Count results per month
            const monthKey = new Date(result.timestamp).toISOString().substring(0, 7); // YYYY-MM
            stats.resultsPerMonth[monthKey] = (stats.resultsPerMonth[monthKey] || 0) + 1;
        });
        
        return stats;
    }
}

// Export for global use
window.ResultsHistoryManager = ResultsHistoryManager;

console.log('✅ ResultsHistoryManager loaded successfully');