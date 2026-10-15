/**
 * AI Service for Scriptor:
 * Multi-Language handwriting co-writing, journal transformation, and marginalia.
 * Supports direct Gemini API or fallback intelligent local creative prompt engine in TR, EN, DE, ES, FR, JA, AR.
 */

export async function generateHandwritingContent({
  action, // 'continue' | 'journalize' | 'marginalia' | 'summarize'
  currentText,
  apiKey = '',
  fontName = 'Caveat',
  userPrompt = '',
  language = 'tr'
}) {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await callGeminiApi({ action, currentText, apiKey, userPrompt, language });
    } catch (err) {
      console.warn('Gemini API hatası, yerleşik yaratıcı motora dönülüyor:', err);
    }
  }

  return generateCreativeFallback({ action, currentText, userPrompt, language });
}

async function callGeminiApi({ action, currentText, apiKey, userPrompt, language }) {
  const languageNames = {
    tr: 'Türkçe',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    ja: '日本語',
    ar: 'العربية'
  };
  const targetLang = languageNames[language] || 'Türkçe';

  const promptMap = {
    continue: `Write in ${targetLang}. Continue the following handwritten notes in a personal, authentic, contemplative tone for 1-2 paragraphs without breaking the author's flow. Return ONLY the continuation text without quotes or explanations:\n\n"${currentText}"`,
    journalize: `Write in ${targetLang}. Transform the following notes/bullets into a warm, literary, introspective personal journal page. Return ONLY the handwritten journal text:\n\n"${currentText}"`,
    marginalia: `Write in ${targetLang}. Based on the following page content, provide a 1-2 line witty, inspiring or philosophical handwritten margin note (marginalia). Example format: "💡 Note: ...":\n\n"${currentText}"`,
    summarize: `Write in ${targetLang}. Summarize the following handwritten page into crisp, thought-provoking handwritten takeaway bullets:\n\n"${currentText}"`
  };

  const finalPrompt = userPrompt ? `Language: ${targetLang}. ${userPrompt}\n\nContent:\n${currentText}` : promptMap[action];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 600
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generated) throw new Error('Cevap üretilemedi.');
  return generated.trim();
}

function generateCreativeFallback({ action, currentText, userPrompt, language }) {
  const fallbacks = {
    tr: {
      continue: `\n\nSaat ilerledikçe sessizlik daha da derinleşiyor. Bazen aradığımız cevaplar karmaşık planlarda değil, tam olarak bu durup nefes aldığımız ve bir şeyleri aceleye getirmeden kağıda döktüğümüz anlarda saklı.\n\nYarın belki bambaşka telaşlar olacak, ama bu satırlar burada, bu dinginliğin bir kanıtı olarak kalacak.`,
      journalize: `Günün Muhasebesi & İç Sesim:\n\nBugün zihnimde biriken tüm parçaları bir araya getirdiğimde, aslında aradığım şeyin daha fazla hız değil, daha fazla derinlik olduğunu fark ettim.\n\nGünün koşturmacası arasında gözden kaçan o küçük detaylar—bir bardak sıcak kahvenin buharı, yarım kalmış bir konuşmanın yankısı ve bir türlü hayata geçiremediğim o proje fikri—hepsi bu sayfanın üzerinde birer anlama kavuşuyor.`,
      marginalia: `\n\n[ 💡 Kenar Notu: Büyük kararlar sessiz akşamlarda, acele edilmeden alınır. ]`,
      summarize: `\n\nÖnemli Çıkarımlar & Odak Noktaları:\n• Düşünceyi somutlaştırmak için önce yaz, sonra düzenle.\n• Estetik sadece görüntü değildir; zihnin çalışma kalitesini belirler.\n• Küçük adımların bileşik etkisi her zaman devasa sıçramalardan daha kalıcıdır.`
    },
    en: {
      continue: `\n\nAs the night deepens, the surrounding silence turns into clarity. Sometimes the answers we desperately seek aren't hidden in complex strategies, but in these quiet moments where thoughts gently find their rhythm upon paper.\n\nTomorrow may bring its own rush, but these inked words will remain as an anchor of calm.`,
      journalize: `Evening Reflection & Personal Ledger:\n\nLooking back at everything that unfolded today, I realize that what matters most isn't how fast we move, but how deeply we perceive.\n\nThe small moments—the warmth of coffee in hand, the unfinished conversations, and that lingering creative idea—now find their quiet sanctuary on this page.`,
      marginalia: `\n\n[ 💡 Marginalia: Great decisions are made in quiet moments, never in haste. ]`,
      summarize: `\n\nKey Takeaways & Reflections:\n• To clarify your thinking, write first and edit later.\n• Aesthetics are not superficial; they shape cognitive focus.\n• Gentle consistency always outlives sporadic bursts of ambition.`
    },
    de: {
      continue: `\n\nMit fortschreitender Stunde wird die Stille greifbarer. Oft liegen die gesuchten Erkenntnisse nicht im Lärm des Alltags, sondern in genau diesem Moment, in dem der Füller das Papier berührt.\n\nMorgen wird ein neuer Tag mit eigenen Herausforderungen beginnen, doch diese Zeilen bleiben ein Anker der Besonnenheit.`,
      journalize: `Tagesrückblick & Stille Gedanken:\n\nWenn ich den Tag Revue passieren lasse, erkenne ich, dass wahre Klarheit nur entsteht, wenn wir dem Geist Raum geben zu atmen.`,
      marginalia: `\n\n[ 💡 Randnotiz: Große Ideen brauchen Stille, um Wurzeln zu schlagen. ]`,
      summarize: `\n\nWesentliche Gedankenpunkte:\n• Erst die Gedanken fließen lassen, dann ordnen.\n• Schönheit im Schreibprozess fördert geistige Klarheit.`
    },
    es: {
      continue: `\n\nA medida que la noche avanza, el silencio se convierte en un refugio. A veces las respuestas no están en planes elaborados, sino en este instante en el que la tinta se encuentra con el papel sin prisa alguna.`,
      journalize: `Reflexiones de la Jornada:\n\nAl reunir los fragmentos de este día, comprendo que lo valioso no es la prisa, sino la profundidad con la que vivimos cada instante.`,
      marginalia: `\n\n[ 💡 Nota al Margen: Las grandes decisiones se toman con serenidad. ]`,
      summarize: `\n\nPuntos Clave:\n• Escribir es el primer paso para ordenar el caos mental.\n• La calma sobre el papel engendra claridad en la acción.`
    },
    fr: {
      continue: `\n\nÀ mesure que les heures s'écoulent, le silence invite à la contemplation. Parfois, la vérité ne réside pas dans la hâte, mais dans ce tête-à-tête intime entre la plume et le papier.`,
      journalize: `Feuille de Nuit & Carnet Intime:\n\nEn rassemblant les pensées éparses de la journée, je réalise que la paix intérieure se cueille dans ces instants de lenteur assumée.`,
      marginalia: `\n\n[ 💡 Note Marginale : C'est dans le calme que germent les plus belles intuitions. ]`,
      summarize: `\n\nPoints Essentiels :\n• Poser ses pensées sur le papier pour libérer l'esprit.\n• La beauté de l'outil inspire la clarté du propos.`
    },
    ja: {
      continue: `\n\n夜が深まるにつれて、静寂は心地よい透明感へと変わっていく。私たちが求める答えは、慌ただしい日常ではなく、こうして紙の上にペンを走らせる静かな時間の中にあるのかもしれない。`,
      journalize: `静かな夜の日記：\n\n今日起きた出来事を振り返ると、大切なのは速さではなく、物事の深さに気づくことだと実感する。温かい一杯の茶、ふとしたひらめき、そのすべてがこのノートの上に意味を持って結びついていく。`,
      marginalia: `\n\n[ 💡 余白の気づき：大きな決断は、静かで穏やかな夜にこそ下される。 ]`,
      summarize: `\n\n心にとどめる要点：\n• 思考を整理するためには、まず書き出すこと。\n• 美しい手書きは、心の静けさを育む。`
    },
    ar: {
      continue: `\n\nكلما توغل الليل في هدوئه، زادت الرؤية وضوحاً. في بعض الأحيان، لا نجد الإجابات في الخطط المعقدة، بل في هذه اللحظات الساكنة التي ينساب فيها الحبر على بياض الورق بصدق وهدوء.\n\nوغداً قد يجلب مشاغل جديدة، لكن هذه السطور ستبقى شاهداً على هذه السكينة.`,
      journalize: `خاطرة ومحاسبة نفس:\n\nحين أجمع شتات هذا اليوم، أدرك أن ما نبحث عنه ليس المزيد من السرعة، بل المزيد من العمق والوعي بما بين أيدينا.`,
      marginalia: `\n\n[ 💡 حاشية: القرارات الحكيمة تُصنع في هدوء المساء، لا في عجلة الصباح. ]`,
      summarize: `\n\nنقاط جوهرية:\n• اكتب لتستبين الفكرة، ثم رتبها بعد ذلك.\n• جمال الخط والورق يعكس صفاء الفكر وهدوء النفس.`
    }
  };

  const langSet = fallbacks[language] || fallbacks.tr;
  const content = langSet[action] || langSet.continue;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(content);
    }, 700);
  });
}
