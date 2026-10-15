import React, { useState } from 'react';
import { generateHandwritingContent } from '../services/aiService';
import { 
  Sparkles, 
  X, 
  PenTool, 
  BookHeart, 
  Lightbulb, 
  ListChecks, 
  Key, 
  Check, 
  ArrowRight,
  Loader2
} from 'lucide-react';

export function AiAssistantModal({
  isOpen,
  onClose,
  currentText,
  fontFamily,
  inkColor,
  onApplyText
}) {
  const [selectedAction, setSelectedAction] = useState('continue');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('scriptor_gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    localStorage.setItem('scriptor_gemini_key', apiKey.trim());
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2000);
  };

  const handleGenerate = async (actionType = selectedAction) => {
    setLoading(true);
    setGeneratedText('');
    try {
      const result = await generateHandwritingContent({
        action: actionType,
        currentText,
        apiKey,
        userPrompt: customPrompt
      });
      setGeneratedText(result);
    } catch (err) {
      setGeneratedText('Bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = (mode = 'append') => {
    if (!generatedText) return;
    if (mode === 'append') {
      const newContent = currentText ? `${currentText}\n\n${generatedText}` : generatedText;
      onApplyText(newContent);
    } else {
      onApplyText(generatedText);
    }
    onClose();
  };

  const actions = [
    {
      id: 'continue',
      title: 'Düşünceyi Devam Ettir',
      desc: 'Yazının ruhunu ve akışını bozmadan sonraki paragrafı el yazısıyla üretir',
      icon: PenTool,
      color: 'text-amber-700 bg-amber-100'
    },
    {
      id: 'journalize',
      title: 'Edebi Günlüğe Çevir',
      desc: 'Dağınık düşünceleri samimi, derinlikli bir günlük sayfasına dönüştürür',
      icon: BookHeart,
      color: 'text-rose-700 bg-rose-100'
    },
    {
      id: 'marginalia',
      title: 'Kenar Notu & İlham Ekle',
      desc: 'Sayfa kenarına el çizimi havasında zekice bir not veya alıntı düşer',
      icon: Lightbulb,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'summarize',
      title: 'Maddeleştir & Eylem Planı',
      desc: 'Yazılanları el yazısına yakışan vurucu maddelerle özetler',
      icon: ListChecks,
      color: 'text-indigo-700 bg-indigo-100'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FCFAF5] rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-amber-900 to-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif">Scriptor AI İlham & Edebi Asistan</h2>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {apiKey ? 'Gemini 1.5 Bağlı' : 'Yerleşik Yaratıcı Motor'}
                </span>
              </div>
              <p className="text-xs text-stone-300">Defterinizin ruhunu bozmadan düşünceleri zenginleştirin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          
          {/* Action Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {actions.map((act) => {
              const Icon = act.icon;
              const isSelected = selectedAction === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    setSelectedAction(act.id);
                    handleGenerate(act.id);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-amber-800 bg-amber-50/90 shadow-sm ring-1 ring-amber-800/40'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-800">{act.title}</h3>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{act.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Prompt (Optional) */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Özel talimatınız var mı? (Örn: 'Biraz daha melankolik yaz', 'Geleceğe yönelik bitir')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-1 h-9 px-3 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 text-stone-800"
            />
            <button
              onClick={() => handleGenerate(selectedAction)}
              disabled={loading}
              className="px-3.5 h-9 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Üretiliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Üret</span>
                </>
              )}
            </button>
          </div>

          {/* Handwriting Output Preview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>El Yazısı Çıktı Önizlemesi:</span>
              {generatedText && (
                <span className="text-[11px] text-stone-400 font-normal">
                  Defterinizin aktif fontu ve mürekkebiyle gösterilir
                </span>
              )}
            </div>

            <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-4 rounded-xl border border-stone-300 bg-[#FAF7F0] paper-ruled shadow-inner relative">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 py-8 text-stone-500">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
                  <span className="text-xs font-serif italic">Mürekkep kağıda işleniyor...</span>
                </div>
              ) : generatedText ? (
                <div
                  className="text-lg leading-relaxed whitespace-pre-wrap select-text"
                  style={{
                    fontFamily,
                    color: inkColor
                  }}
                >
                  {generatedText}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-8 text-stone-400 text-center">
                  <PenTool className="w-6 h-6 stroke-1 mb-1 text-stone-300" />
                  <span className="text-xs">Yukarıdaki seçeneklerden birine tıklayarak el yazısı içeriği üretin.</span>
                </div>
              )}
            </div>
          </div>

          {/* Gemini API Key Toggle */}
          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1.5"
            >
              <Key className="w-3 h-3 text-amber-800" />
              <span>{showKeyInput ? 'API Anahtarı Alanını Gizle' : 'Kendi Google Gemini API Anahtarınızı Kullanmak İster misiniz?'}</span>
            </button>

            {showKeyInput && (
              <div className="mt-2 p-3 bg-stone-100 rounded-lg flex flex-col sm:flex-row gap-2 items-center">
                <input
                  type="password"
                  placeholder="AIzaSy... (Gemini API Key)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 h-8 px-2.5 text-xs bg-white border border-stone-300 rounded font-mono"
                />
                <button
                  onClick={handleSaveKey}
                  className="h-8 px-3 text-xs bg-amber-900 text-white font-medium rounded hover:bg-amber-800 transition-all flex items-center gap-1"
                >
                  {savedKeySuccess ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{savedKeySuccess ? 'Kaydedildi' : 'Kaydet'}</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg transition-all"
          >
            Vazgeç
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleInsert('replace')}
              disabled={!generatedText}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-all disabled:opacity-40"
            >
              Tüm Sayfayı Değiştir
            </button>

            <button
              onClick={() => handleInsert('append')}
              disabled={!generatedText}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Sayfanın Sonuna Ekle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
