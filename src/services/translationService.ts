import axios from 'axios';

export interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

// Google Cloud Translation API configuration
const TRANSLATION_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const API_KEY = "AIzaSyAoKqopawAWSOLDwa66DzE2Z2lVkZE2CL4";

// Simple translation mappings for common responses
const translationMappings: { [key: string]: { [lang: string]: string } } = {
  "I've opened the market trends page for tomato. Please select your location to see current prices.": {
    te: "టొమాటో కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "टमाटर के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "தக்காளிக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಟೊಮೆಟೊಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "टोमॅटोसाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "തക്കാളിക്കായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "ٹماٹر کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  },
  "I've opened the market trends page for potato. Please select your location to see current prices.": {
    te: "బంగాళాదుంప కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "आलू के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "உருளைக்கிழங்குக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಆಲೂಗಡ್ಡೆಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "बटाट्यासाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "ഉരുളക്കിഴങ്ങിനായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "آلو کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  },
  "I've opened the market trends page for onion. Please select your location to see current prices.": {
    te: "ఉల్లిపాయ కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "प्याज के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "வெங்காயத்துக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಈರುಳ್ಳಿಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "कांद्यासाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "ഉള്ളിയ്ക്കായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "پیاز کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  },
  "I've opened the market trends page for wheat. Please select your location to see current prices.": {
    te: "గోధుమల కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "गेहूं के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "கோதுமைக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಗೋಧಿ ಬೀಜಕ್ಕಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "गव्हासाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "ഗോതമ്പിനായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "گندم کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  },
  "I've opened the market trends page for rice. Please select your location to see current prices.": {
    te: "వరిగా కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "चावल के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "அரிசிக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಅಕ್ಕಿಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "तांदळासाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "അരിയ്ക്കായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "چاول کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  },
  "I've opened the market trends page for beans. Please select your location to see current prices.": {
    te: "బీన్స్ కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "बीन के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "பீன்ஸுக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಹುರಳಿಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "शेंगदाण्यासाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "ബീൻസിനായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "بینز کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  },
  "I've opened the market trends page for cabbage. Please select your location to see current prices.": {
    te: "కోసు కోసం మార్కెట్ ట్రెండ్స్ పేజీని తెరిచాను. ప్రస్తుత ధరలను చూడటానికి దయచేసి మీ స్థానాన్ని ఎంచుకోండి.",
    hi: "पत्तागोभी के लिए बाजार प्रवृत्ति पृष्ठ खोला है। वर्तमान कीमतें देखने के लिए कृपया अपना स्थान चुनें।",
    ta: "முட்டைக்கோசுக்கு சந்தை போக்குகள் பக்கத்தை திறந்துள்ளேன். தற்போதைய விலைகளைப் பார்க்க உங்கள் இடத்தைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಕೋಸುಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಪುಟವನ್ನು ತೆರೆದಿದ್ದೇನೆ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
    mr: "कोबीसाठी बाजार ट्रेंड पृष्ठ उघडले आहे. सद्य किंमती पाहण्यासाठी कृपया आपले स्थान निवडा.",
    ml: "മുളങ്കൊല്ലിനായി മാർക്കറ്റ് ട്രെൻഡ്സ് പേജ് തുറന്നു. നിലവിലെ വിലകൾ കാണാൻ ദയവായി നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക.",
    ur: "پتہ گوبھی کے لیے مارکیٹ ٹرینڈز پیج کھولا ہے۔ موجودہ قیمتوں کو دیکھنے کے لیے براہ کرم اپنی جگہ منتخب کریں۔"
  }
};

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string> => {
  try {
    // Check if we have a pre-translated version for common responses
    if (translationMappings[text] && translationMappings[text][targetLanguage]) {
      console.log(`Using pre-translated text for: ${text} -> ${targetLanguage}`);
      return translationMappings[text][targetLanguage];
    }

    // For other texts, try to use Google Translate API
    console.log(`Translating via Google API: ${text} from ${sourceLanguage} to ${targetLanguage}`);
    const response = await axios.post(`${TRANSLATION_API_URL}?key=${API_KEY}`, {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text'
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation API error:', error);
    console.log('Falling back to original text:', text);
    // Fallback to original text if translation fails
    return text;
  }
};

export const translateMultipleTexts = async (
  texts: string[], 
  targetLanguage: string, 
  sourceLanguage: string = 'en'
): Promise<string[]> => {
  try {
  

    const response = await axios.post(`${TRANSLATION_API_URL}?key=${API_KEY}`, {
      q: texts,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text'
    });

    return response.data.data.translations.map((t: any) => t.translatedText);
  } catch (error) {
    console.error('Translation API error:', error);
    // Fallback to original texts if translation fails
    return texts;
  }
};

export const detectLanguage = async (text: string): Promise<string> => {
  // Always use client-side detection first to avoid CORS issues
  return detectLanguageClientSide(text);
};

// Client-side language detection fallback
const detectLanguageClientSide = (text: string): string => {
  const lowerText = text.toLowerCase();

  // Check for Telugu words and script
  const teluguWords = ['oka', 'cheppa', 'cheppu', 'nenu', 'meeru', 'em', 'ela', 'joke', 'baba', 'kshaminchandi', 'nen', 'mi', 'ai', 'vyavasaya', 'sahayakudu', 'neti', 'avsaralalo', 'ela', 'sahayam', 'cheyagalnu', 'entha', 'undi', 'eroju', 'inka', 'kani', 'kada', 'ledu', 'undi', 'emundi', 'elaundi'];
  const teluguScript = /[\u0C00-\u0C7F]/.test(text);
  const teluguWordCount = teluguWords.filter(word => lowerText.includes(word)).length;

  if (teluguScript || teluguWordCount > 0) {
    return 'te';
  }

  // Check for Devanagari script (Hindi, Marathi)
  if (/[\u0900-\u097F]/.test(text)) {
    // Distinguish between Hindi and Marathi based on common words
    const marathiWords = ['मी', 'तुम्ही', 'आहे', 'आहेत', 'करीन', 'केली', 'होती'];
    const hindiWords = ['मैं', 'तुम', 'हूँ', 'हो', 'करता', 'किया', 'थी'];

    const marathiCount = marathiWords.filter(word => lowerText.includes(word)).length;
    const hindiCount = hindiWords.filter(word => lowerText.includes(word)).length;

    return marathiCount > hindiCount ? 'mr' : 'hi';
  }

  // Check for Tamil script and words
  const tamilWords = ['nan', 'neenga', 'enna', 'epdi', 'sol', 'sollunga', 'kshaminch', 'ai', 'velanmai', 'sahayak', 'indru', 'enakku', 'theliva'];
  const tamilScript = /[\u0B80-\u0BFF]/.test(text);
  const tamilWordCount = tamilWords.filter(word => lowerText.includes(word)).length;

  if (tamilScript || tamilWordCount > 0) {
    return 'ta';
  }

  // Check for Kannada script and words
  const kannadaWords = ['nanu', 'ninu', 'enu', 'hege', 'heli', 'kshaminch', 'ai', 'krsi', 'sahayak', 'indu', 'nann', 'gottu'];
  const kannadaScript = /[\u0C80-\u0CFF]/.test(text);
  const kannadaWordCount = kannadaWords.filter(word => lowerText.includes(word)).length;

  if (kannadaScript || kannadaWordCount > 0) {
    return 'kn';
  }

  // Check for Malayalam script and words
  const malayalamWords = ['nan', 'ningal', 'enna', 'eppol', 'paray', 'parayuka', 'kshaminch', 'ai', 'krsi', 'sahayak', 'indhu', 'enn', 'ariya'];
  const malayalamScript = /[\u0D00-\u0D7F]/.test(text);
  const malayalamWordCount = malayalamWords.filter(word => lowerText.includes(word)).length;

  if (malayalamScript || malayalamWordCount > 0) {
    return 'ml';
  }

  // Check for Urdu script and words
  const urduWords = ['main', 'aap', 'kya', 'kaise', 'bol', 'kshaminch', 'ai', 'krsi', 'madad', 'aaj', 'meri', 'samajh'];
  const urduScript = /[\u0600-\u06FF]/.test(text);
  const urduWordCount = urduWords.filter(word => lowerText.includes(word)).length;

  if (urduScript || urduWordCount > 0) {
    return 'ur';
  }

  // Check for common English words
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'hello', 'hi', 'good', 'morning', 'afternoon', 'evening'];
  const englishCount = englishWords.filter(word => lowerText.includes(word)).length;

  if (englishCount > 0) {
    return 'en';
  }

  // Default to English if no specific language detected
  return 'en';
};
