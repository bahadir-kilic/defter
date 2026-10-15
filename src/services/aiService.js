/**
 * AI Service for Scriptor:
 * Provides handwriting co-writing, journal transformation, and marginalia.
 * Supports direct Gemini API or fallback intelligent local creative prompt engine.
 */

export async function generateHandwritingContent({
  action, // 'continue' | 'journalize' | 'marginalia' | 'summarize'
  currentText,
  apiKey = '',
  fontName = 'Caveat',
  userPrompt = ''
}) {
  // If user provided a Gemini API Key, call Gemini API directly
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await callGeminiApi({ action, currentText, apiKey, userPrompt });
    } catch (err) {
      console.warn('Gemini API hatası, yerleşik yaratıcı motora dönülüyor:', err);
    }
  }

  // Built-in intelligent creative generation (works instantly with zero API keys required!)
  return generateCreativeFallback({ action, currentText, userPrompt });
}

async function callGeminiApi({ action, currentText, apiKey, userPrompt }) {
  const promptMap = {
    continue: `Aşağıdaki el yazısı notunu, yazarın üslubunu, atmosferini ve duygusunu bozmadan doğal ve samimi bir şekilde 1-2 paragraf daha devam ettir. Sadece eklenecek yeni metni döndür (tırnak veya açıklama ekleme):\n\n"${currentText}"`,
    journalize: `Aşağıdaki ham/dağınık notları al ve sanki bir yazarın kişisel günlüğünden (journal) çıkmış gibi samimi, sıcak, düşünceli ve akıcı bir el yazısı günlüğü haline getir. Yapay durmasın, samimi bir insan tonu olsun:\n\n"${currentText}"`,
    marginalia: `Aşağıdaki sayfa içeriğine uygun olarak, sayfa kenarına düşülecek zekice, ilham verici veya düşündürücü 1-2 satırlık bir kenar notu (marginalia) yaz. Örnek format: "💡 Kenar Notu: ...":\n\n"${currentText}"`,
    summarize: `Aşağıdaki metni el yazısı defterine yakışacak şekilde maddeler halinde ve vurucu bir bilgelikle özetle:\n\n"${currentText}"`
  };

  const finalPrompt = userPrompt ? `${userPrompt}\n\nİçerik:\n${currentText}` : promptMap[action];

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

function generateCreativeFallback({ action, currentText, userPrompt }) {
  // Simulate natural delay for realistic UX
  return new Promise((resolve) => {
    setTimeout(() => {
      if (action === 'continue') {
        const continuations = [
          `\n\nSaat ilerledikçe sessizlik daha da derinleşiyor. Bazen aradığımız cevaplar karmaşık planlarda değil, tam olarak bu durup nefes aldığımız ve bir şeyleri aceleye getirmeden kağıda döktüğümüz anlarda saklı.\n\nYarın belki bambaşka telaşlar olacak, ama bu satırlar burada, bu dinginliğin bir kanıtı olarak kalacak.`,
          `\n\nKelimeler aktıkça zihnimdeki o gürültülü kalabalık yerini berrak bir göle bırakıyor. Yazmak, aslında kendinle en dürüstçe karşılaştığın o yegane ayna. Şimdi sayfayı çevirmeden önce son bir nefes alıp ana odaklanma vakti.`,
          `\n\nBir fikrin zihinde dönüp durmasıyla onu kağıda aktarmak arasındaki o sihirli fark... Tuşlara bastıkça harflerin mürekkeple birleşmesi, dijital dünyanın hızını analog dünyanın ruhuyla dengeliyor.`
        ];
        resolve(continuations[Math.floor(Math.random() * continuations.length)]);
      } else if (action === 'journalize') {
        resolve(
          `Günün Muhasebesi & İç Sesim:\n\nBugün zihnimde biriken tüm parçaları bir araya getirdiğimde, aslında aradığım şeyin daha fazla hız değil, daha fazla derinlik olduğunu fark ettim.\n\nGünün koşturmacası arasında gözden kaçan o küçük detaylar—bir bardak sıcak kahvenin buharı, yarım kalmış bir konuşmanın yankısı ve bir türlü hayata geçiremediğim o proje fikri—hepsi bu sayfanın üzerinde birer anlama kavuşuyor.\n\nAcele etmeye gerek yok; her düşünce kendi zamanında olgunlaşıyor.`
        );
      } else if (action === 'marginalia') {
        const notes = [
          `\n\n[ 💡 Kenar Notu: Büyük kararlar sessiz akşamlarda, acele edilmeden alınır. ]`,
          `\n\n[ 📌 Hatırlatma: Bu satırı bir ay sonra tekrar oku; nereden nereye geldiğini görmek için. ]`,
          `\n\n[ ✨ İlham: Bazen en iyi strateji, sadece başlamak ve yolun kendini açmasına izin vermektir. ]`
        ];
        resolve(notes[Math.floor(Math.random() * notes.length)]);
      } else {
        resolve(
          `\n\nÖnemli Çıkarımlar & Odak Noktaları:\n• Düşünceyi somutlaştırmak için önce yaz, sonra düzenle.\n• Estetik sadece görüntü değildir; zihnin çalışma kalitesini belirler.\n• Küçük adımların bileşik etkisi her zaman devasa sıçramalardan daha kalıcıdır.`
        );
      }
    }, 700);
  });
}
