(function () {
  const languageNames = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };
  const messages = {
    en: {
      label: 'Voice assistant',
      help: 'Help me',
      stop: 'Stop',
      language: 'Voice language',
      unsupported: 'Voice assistance is not supported on this device.',
      home: 'You are on the KisanSetu home page. Explore market intelligence, learn how it works, or log in to open your dashboard.',
      login: 'You are on the login page. Choose Farmer or Buyer, enter your credentials, or use OTP login. Keep me logged in keeps your session active.',
      farmer: 'You are on the farmer sell center. Review market prices, filter buyer offers, add produce, open price chat, and track payments or disputes.',
      buyer: 'You are on the buyer match center. Review active demands, compare farmer and company listings, place offers, and open Orders to track delivery.',
      tracking: 'You are viewing live order tracking. Review the map, follow the route arrows, and check the current live location and tracking history.',
      account: 'You are viewing account details. Review your name, role, email, and phone number. Use Back to return to your dashboard.',
    },
    hi: {
      label: 'वॉइस सहायक', help: 'मेरी मदद करें', stop: 'रोकें', language: 'वॉइस भाषा', unsupported: 'इस डिवाइस पर वॉइस सहायता उपलब्ध नहीं है।',
      home: 'आप KisanSetu के होम पेज पर हैं। बाजार जानकारी देखें, तरीका समझें या लॉग इन करके डैशबोर्ड खोलें।',
      login: 'आप लॉगिन पेज पर हैं। किसान या खरीदार चुनें, जानकारी भरें या OTP लॉगिन करें। लॉग इन रखें विकल्प सत्र चालू रखता है।',
      farmer: 'आप किसान बिक्री केंद्र पर हैं। बाजार भाव देखें, खरीदार ऑफर छांटें, उपज जोड़ें और भुगतान या विवाद देखें।',
      buyer: 'आप खरीदार मैच केंद्र पर हैं। मांग देखें, किसान और कंपनियों की सूची की तुलना करें, ऑफर दें और ऑर्डर ट्रैक करें।',
      tracking: 'आप लाइव ऑर्डर ट्रैकिंग देख रहे हैं। नक्शा, मार्ग के तीर और लाइव लोकेशन देखें।',
      account: 'आप अकाउंट विवरण देख रहे हैं। नाम, भूमिका, ईमेल और फोन की जानकारी देखें। डैशबोर्ड पर लौटने के लिए वापस जाएं।',
    },
    mr: {
      label: 'व्हॉइस सहाय्यक', help: 'मदत करा', stop: 'थांबवा', language: 'व्हॉइस भाषा', unsupported: 'या उपकरणावर व्हॉइस सहाय्य उपलब्ध नाही.',
      home: 'तुम्ही KisanSetu होम पेजवर आहात. बाजार माहिती पाहा, प्रक्रिया समजून घ्या किंवा लॉग इन करून डॅशबोर्ड उघडा.',
      login: 'तुम्ही लॉगिन पेजवर आहात. शेतकरी किंवा खरेदीदार निवडा, माहिती भरा किंवा OTP लॉगिन करा. लॉग इन ठेवा पर्याय सत्र सुरू ठेवतो.',
      farmer: 'तुम्ही शेतकरी विक्री केंद्रावर आहात. बाजारभाव पाहा, खरेदीदार ऑफर फिल्टर करा, पीक जोडा आणि पेमेंट किंवा विवाद पाहा.',
      buyer: 'तुम्ही खरेदीदार मॅच केंद्रावर आहात. मागण्या, शेतकरी आणि कंपन्यांच्या सूची पाहा, ऑफर द्या आणि ऑर्डर ट्रॅक करा.',
      tracking: 'तुम्ही लाइव्ह ऑर्डर ट्रॅकिंग पाहत आहात. नकाशा, मार्गाचे बाण आणि लाइव्ह लोकेशन तपासा.',
      account: 'तुम्ही अकाउंट तपशील पाहत आहात. नाव, भूमिका, ईमेल आणि फोन तपशील तपासा. डॅशबोर्डवर परत जा.',
    },
  };

  function pageType() {
    const page = window.location.pathname.split('/').pop();
    if (page === 'login.html') return 'login';
    if (page === 'farmer-dashboard.html') return 'farmer';
    if (page === 'buyer-dashboard.html') return 'buyer';
    if (page === 'tracking.html') return 'tracking';
    if (page === 'account.html') return 'account';
    return 'home';
  }

  function currentLanguage() {
    return localStorage.getItem('kisansetu_lang') || 'en';
  }

  function speak(text, language) {
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
    return true;
  }

  const root = document.createElement('aside');
  root.className = 'voice-assistant';
  root.innerHTML = '<div class="voice-assistant-title">Voice assistant</div><select class="voice-assistant-language" aria-label="Voice language"></select><div class="voice-assistant-actions"><button type="button" data-voice-help>Help me</button><button type="button" data-voice-stop>Stop</button></div>';
  document.body.appendChild(root);

  const selector = root.querySelector('select');
  Object.entries(languageNames).forEach(([value, label]) => selector.add(new Option(label, value)));
  selector.value = currentLanguage();

  function updateLabels() {
    const lang = currentLanguage();
    const copy = messages[lang] || messages.en;
    root.querySelector('.voice-assistant-title').textContent = copy.label;
    root.querySelector('[data-voice-help]').textContent = copy.help;
    root.querySelector('[data-voice-stop]').textContent = copy.stop;
    selector.setAttribute('aria-label', copy.language);
  }

  root.querySelector('[data-voice-help]').addEventListener('click', () => {
    const lang = selector.value;
    if (!speak(messages[lang][pageType()], lang)) alert(messages[lang].unsupported);
  });
  root.querySelector('[data-voice-stop]').addEventListener('click', () => window.speechSynthesis?.cancel());
  selector.addEventListener('change', () => {
    localStorage.setItem('kisansetu_lang', selector.value);
    document.dispatchEvent(new CustomEvent('kisansetu:languagechange'));
    updateLabels();
    speak(messages[selector.value][pageType()], selector.value);
  });
  document.addEventListener('kisansetu:languagechange', () => {
    selector.value = currentLanguage();
    updateLabels();
  });
  updateLabels();
}());
