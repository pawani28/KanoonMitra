import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TemplateCatalog from './components/TemplateCatalog';
import DocumentWizard from './components/DocumentWizard';
import DualDocumentStudio from './components/DualDocumentStudio';
import RiskAnalyzer from './components/RiskAnalyzer';
import StampDutyCalculator from './components/StampDutyCalculator';
import IndianActsGuide from './components/IndianActsGuide';
import LawyerConnectModal from './components/LawyerConnectModal';
import PitchDeckModal from './components/PitchDeckModal';
import ApiKeyModal from './components/ApiKeyModal';
import Footer from './components/Footer';
import { DOCUMENT_TEMPLATES } from './constants/templates';
import { generateDocument, draftCustomFromPrompt, getStoredApiKey } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'wizard' | 'studio' | 'audit' | 'stamp' | 'laws'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);

  useEffect(() => {
    setApiKeySet(!!getStoredApiKey());
  }, []);

  // Handle template selection from catalog or hero
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setActiveTab('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle generating document from wizard form
  const handleGenerateDocument = async (templateId, formData, customInstructions) => {
    setIsGenerating(true);
    try {
      const result = await generateDocument(templateId, formData, customInstructions);
      if (result) {
        setDocumentData(result);
        setActiveTab('studio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Failed to draft document:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Natural Language Prompt from Hero
  const handlePromptSubmit = async (promptText) => {
    setIsGenerating(true);
    try {
      const result = await draftCustomFromPrompt(promptText);
      if (result) {
        setDocumentData(result);
        setActiveTab('studio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Failed to draft from prompt:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Get current document text for risk auditor
  const getCurrentDocText = () => {
    if (!documentData) return '';
    return `${documentData.title}\n\n${documentData.preamble}\n\n` +
      documentData.clauses.map(c => `Clause ${c.number}: ${c.heading}\n${c.legalText}`).join('\n\n');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        apiKeySet={apiKeySet}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: Template Catalog & Hero */}
        {activeTab === 'templates' && (
          <div>
            <HeroSection
              onPromptSubmit={handlePromptSubmit}
              onSelectTemplate={handleSelectTemplate}
            />
            <TemplateCatalog
              onSelectTemplate={handleSelectTemplate}
            />
          </div>
        )}

        {/* TAB 2: Guided Wizard Intake */}
        {activeTab === 'wizard' && selectedTemplate && (
          <DocumentWizard
            template={selectedTemplate}
            onBack={() => setActiveTab('templates')}
            onGenerate={handleGenerateDocument}
            isGenerating={isGenerating}
          />
        )}

        {/* TAB 3: Flagship Dual-Pane Studio */}
        {activeTab === 'studio' && documentData && (
          <DualDocumentStudio
            documentData={documentData}
            setDocumentData={setDocumentData}
            onBackToWizard={() => setActiveTab('wizard')}
            onOpenAudit={() => setActiveTab('audit')}
            onOpenLawyerModal={() => setIsLawyerModalOpen(true)}
          />
        )}

        {/* TAB 4: Red-Flag Risk Auditor */}
        {activeTab === 'audit' && (
          <RiskAnalyzer
            currentDocText={getCurrentDocText()}
            onApplyFix={(fixedText) => {
              console.log("Fix applied:", fixedText);
            }}
          />
        )}

        {/* TAB 5: State Stamp Duty Calculator */}
        {activeTab === 'stamp' && (
          <StampDutyCalculator />
        )}

        {/* TAB 6: Indian Legal Acts Guide */}
        {activeTab === 'laws' && (
          <IndianActsGuide />
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
      />

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={(isSet) => setApiKeySet(isSet)}
      />

      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      <LawyerConnectModal
        isOpen={isLawyerModalOpen}
        onClose={() => setIsLawyerModalOpen(false)}
        docHash={documentData ? `KM-IN-2026-${documentData.title.slice(0, 4)}` : 'KM-IN-2026-DOC'}
      />

    </div>
  );
}
