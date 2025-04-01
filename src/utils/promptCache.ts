
/**
 * Cache of pre-generated AI responses for common questions
 */
export const promptCache: Record<string, string> = {
  // Common questions and pre-generated answers in Icelandic
  "Af hverju er himininn blár?": "Himininn er blár vegna þess að ljós frá sólinni dreifist í lofthjúpnum. Þetta kallast Rayleigh-dreifing. Blátt ljós dreifist meira en aðrir litir vegna þess að það hefur styttri bylgjulengd. Þess vegna sjáum við himininn bláan á daginn.",
  
  "Hvernig virkar rafmagn?": "Rafmagn virkar þannig að litlar agnir sem kallast rafeindir ferðast um víra. Rafeindirnar eru með neikvæða hleðslu og þegar þær hreyfast mynda þær rafstraum. Þessi rafstraumur getur gefið tækjum og ljósum orku til að virka.",
  
  "Af hverju sofum við?": "Við sofum til að líkaminn og heilinn geti hvílst og endurnærst. Á meðan við sofum er heilinn að vinna úr upplýsingum frá deginum, gera við vöðva og styrkja ónæmiskerfið. Þess vegna líður okkur betur eftir góðan svefn.",
  
  "Hvers vegna er sjórinn saltur?": "Sjórinn er saltur vegna þess að rigning og árvatn bera steinefni og sölt úr jörðinni út í sjó. Með tímanum safnast sölt fyrir í sjónum. Vatnið gufar upp en söltín verða eftir, þannig verður sjórinn sífellt saltari.",
  
  "Hvernig virkar internetið?": "Internetið er risastórt net af tölvum sem eru tengdar saman. Þegar þú sendir skilaboð eða skoðar vefsíðu, ferðast upplýsingarnar í gegnum þetta net í litlum pökkum. Þessir pakkar fara frá þinni tölvu, í gegnum marga staði, og loks til lokaáfangastaðar.",
  
  "Hvernig verður rigning til?": "Rigning verður til þegar vatn gufar upp frá sjó, vötnum og ám og myndar ský. Í skýjunum kólnar vatnið og myndar litla dropa. Þegar droparnir verða nógu þungir, falla þeir til jarðar sem regn.",
  
  "Af hverju er blóð rautt?": "Blóð er rautt vegna efnis sem kallast hemóglóbín sem er í rauðum blóðkornum. Hemóglóbín inniheldur járn sem binst súrefni og gefur blóðinu þennan sterka rauða lit. Þetta efni hjálpar líkamanum að flytja súrefni til allra frumna.",
  
  "Hvernig sjá dýr heiminn?": "Dýr sjá heiminn á mjög mismunandi hátt. Sum dýr eins og hundar sjá færri liti en við. Flugur sjá heiminn hægar, eins og hægspilað myndband. Bæði uglur og kettir sjá vel í myrkri. Býflugur geta séð útfjólublátt ljós sem við sjáum ekki.",
  
  "Hvernig virka tölvur?": "Tölvur virka með því að fylgja mjög nákvæmum leiðbeiningum sem kallast forrit. Inni í tölvunni eru milljónir af litlum rafeindarofum sem geta verið kveikt eða slökkt á. Þessir rofar vinna með tölurnar 1 og 0 til að reikna, geyma upplýsingar og birta allt á skjánum.",
  
  "Hvers vegna getum við ekki lifað á Mars?": "Við getum ekki lifað á Mars án sérstaks búnaðar vegna þess að þar er nánast ekkert súrefni til að anda að okkur. Það er líka mjög kalt á Mars, oftast um -63°C. Auk þess er þar mjög þunnt andrúmsloft sem verndar ekki gegn hættulegri geislun frá sólinni."
};

/**
 * Checks if a question matches a cached prompt
 * Uses similarity matching to find close matches
 */
export const findCachedPrompt = (question: string): string | null => {
  // Convert to lowercase for better matching
  const normalizedQuestion = question.toLowerCase().trim();
  
  // First try for exact matches
  for (const [cachedQuestion, answer] of Object.entries(promptCache)) {
    if (cachedQuestion.toLowerCase() === normalizedQuestion) {
      return answer;
    }
  }
  
  // Then look for questions that contain the same keywords
  for (const [cachedQuestion, answer] of Object.entries(promptCache)) {
    const cachedWords = new Set(
      cachedQuestion.toLowerCase().split(/\s+/).filter(word => word.length > 3)
    );
    const questionWords = new Set(
      normalizedQuestion.split(/\s+/).filter(word => word.length > 3)
    );
    
    let matchCount = 0;
    for (const word of questionWords) {
      if (cachedWords.has(word)) matchCount++;
    }
    
    // If enough keywords match, return the cached answer
    if (matchCount >= 2 && questionWords.size >= 2 && matchCount / questionWords.size > 0.5) {
      return answer;
    }
  }
  
  return null;
};
