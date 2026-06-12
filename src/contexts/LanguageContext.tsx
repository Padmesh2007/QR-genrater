import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    welcome: "Welcome to Document Verification Portal",
    uploadCertificate: "Upload Certificate",
    dragDrop: "Drag & drop your certificate here, or click to browse",
    supportedFormats: "Supported formats: PDF, JPG, PNG (Max 10MB)",
    verifyDocument: "Verify Document",
    enterUniqueId: "Enter Unique ID",
    scanQrCode: "Scan QR/Barcode",
    uniqueIdPlaceholder: "Enter document unique ID",
    verify: "Verify",
    startScanning: "Start Scanning",
    aiAssistant: "AI Assistant",
    askQuestion: "Ask me anything about document verification...",
    send: "Send",
    citizen: "Citizen",
    lawyer: "Lawyer", 
    government: "Government",
    business: "Business",
    citizenDesc: "Verify certificates and documents easily",
    lawyerDesc: "Professional document verification tools",
    governmentDesc: "Official document validation portal",
    businessDesc: "Enterprise verification solutions",
    howItWorks: "How It Works",
    step1: "Upload",
    step1Desc: "Upload your document",
    step2: "Scan/Enter", 
    step2Desc: "Scan QR code or enter ID",
    step3: "Verify",
    step3Desc: "Get verification result",
    step4: "Result",
    step4Desc: "View authentic/fake status",
    verified: "Verified",
    fake: "Fake",
    documentVerified: "Document is authentic and verified",
    documentFake: "Document appears to be fake or invalid",
    uniqueFeatures: "Unique Features",
    feature1: "AI-Powered Verification",
    feature1Desc: "Advanced AI algorithms for accurate document verification",
    feature2: "Multi-Language Support", 
    feature2Desc: "Support for English and Hindi languages",
    feature3: "Secure Processing",
    feature3Desc: "End-to-end encryption for document security",
    feature4: "Real-time Results",
    feature4Desc: "Instant verification results with detailed analysis"
  },
  hi: {
    welcome: "दस्तावेज़ सत्यापन पोर्टल में आपका स्वागत है",
    uploadCertificate: "प्रमाणपत्र अपलोड करें",
    dragDrop: "अपना प्रमाणपत्र यहाँ ड्रैग करें, या ब्राउज़ करने के लिए क्लिक करें",
    supportedFormats: "समर्थित प्रारूप: PDF, JPG, PNG (अधिकतम 10MB)",
    verifyDocument: "दस्तावेज़ सत्यापित करें",
    enterUniqueId: "विशिष्ट आईडी दर्ज करें",
    scanQrCode: "QR/बारकोड स्कैन करें",
    uniqueIdPlaceholder: "दस्तावेज़ विशिष्ट आईडी दर्ज करें",
    verify: "सत्यापित करें",
    startScanning: "स्कैनिंग शुरू करें",
    aiAssistant: "AI सहायक",
    askQuestion: "दस्तावेज़ सत्यापन के बारे में कुछ भी पूछें...",
    send: "भेजें",
    citizen: "नागरिक",
    lawyer: "वकील",
    government: "सरकार", 
    business: "व्यापार",
    citizenDesc: "आसानी से प्रमाणपत्रों को सत्यापित करें",
    lawyerDesc: "पेशेवर दस्तावेज़ सत्यापन उपकरण",
    governmentDesc: "आधिकारिक दस्तावेज़ सत्यापन पोर्टल",
    businessDesc: "उद्यम सत्यापन समाधान",
    howItWorks: "यह कैसे काम करता है",
    step1: "अपलोड",
    step1Desc: "अपना दस्तावेज़ अपलोड करें",
    step2: "स्कैन/दर्ज",
    step2Desc: "QR कोड स्कैन करें या ID दर्ज करें", 
    step3: "सत्यापित",
    step3Desc: "सत्यापन परिणाम प्राप्त करें",
    step4: "परिणाम",
    step4Desc: "प्रामाणिक/नकली स्थिति देखें",
    verified: "सत्यापित",
    fake: "नकली",
    documentVerified: "दस्तावेज़ प्रामाणिक और सत्यापित है",
    documentFake: "दस्तावेज़ नकली या अमान्य प्रतीत होता है",
    uniqueFeatures: "विशिष्ट सुविधाएं",
    feature1: "AI-संचालित सत्यापन",
    feature1Desc: "सटीक दस्तावेज़ सत्यापन के लिए उन्नत AI एल्गोरिदम",
    feature2: "बहु-भाषा समर्थन",
    feature2Desc: "अंग्रेजी और हिंदी भाषाओं के लिए समर्थन",
    feature3: "सुरक्षित प्रसंस्करण", 
    feature3Desc: "दस्तावेज़ सुरक्षा के लिए एंड-टू-एंड एन्क्रिप्शन",
    feature4: "वास्तविक समय परिणाम",
    feature4Desc: "विस्तृत विश्लेषण के साथ तत्काल सत्यापन परिणाम"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};