import React, { useState, useRef, useEffect } from 'react';
import { 
  processHandwritingImage, 
  analyzeHandwritingWithAI 
} from '../services/handwritingCloner';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  Sliders, 
  HelpCircle,
  CheckCircle2,
  Cpu,
  ArrowRight
} from 'lucide-react';

export function HandwritingCloneModal({
  isOpen,
  onClose,
  onApplyClonedFont,
  existingClonedProfile
}) {
  const { t, langCode, currentLang } = useTranslation();
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [processingStage, setProcessingStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Calibration Metrics State
  const [metrics, setMetrics] = useState({
    slant: 3.5,
    strokeWidth: 2.2,
    letterSpacing: 0.04,
    baselineJitter: 0.85
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  // Test pad text based on current language
  const [testText, setTestText] = useState(() => t('pangram'));

  useEffect(() => {
    setTestText(t('pangram'));
  }, [langCode, t]);

  const fileInputRef = useRef(null);

  // Pre-calibrated demo samples adapted to active language
  const currentPangram = t('pangram');
  const SAMPLE_HANDWRITINGS = [
    {
      name: langCode === 'tr' ? 'Örnek 1: Samimi Günlük El Yazısı' : 'Sample 1: Warm Casual Handwriting',
      preview: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><rect width="100%" height="100%" fill="%23f7f4ec"/><text x="40" y="80" font-family="Caveat, cursive" font-size="30" fill="%231e3a8a">${encodeURIComponent(currentPangram.slice(0, 35))}</text><text x="40" y="140" font-family="Caveat, cursive" font-size="30" fill="%231e3a8a">Scriptor handwriting cloning pipeline active.</text></svg>`,
      slant: 4.0,
      strokeWidth: 2.3
    },
    {
      name: langCode === 'tr' ? 'Örnek 2: Mimar & Düzenli Not Yazısı' : 'Sample 2: Clean Architectural Script',
      preview: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><rect width="100%" height="100%" fill="%23ffffff"/><text x="40" y="80" font-family="Kalam, cursive" font-size="28" fill="%2318181b">${encodeURIComponent(currentPangram.slice(0, 35))}</text><text x="40" y="140" font-family="Kalam, cursive" font-size="28" fill="%2318181b">Plan 01: Geometric calibration completed.</text></svg>`,
      slant: 1.5,
      strokeWidth: 2.6
    }
  ];

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample) => {
    setImagePreview(sample.preview);
    setImageFile(null);
    setMetrics(prev => ({
      ...prev,
      slant: sample.slant,
      strokeWidth: sample.strokeWidth
    }));
  };

  const startAnalysis = async () => {
    if (!imagePreview) return;
    setStep(2);
    setProgressPercent(15);
    setProcessingStage('Vision preprocessing & paper background filtering...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setProgressPercent(40);
      setProcessingStage('Adaptive Otsu thresholding isolating ink strokes...');

      const processed = await processHandwritingImage(imagePreview);
      setProcessedPreview(processed.previewUrl);

      await new Promise(r => setTimeout(r, 600));
      setProgressPercent(75);
      setProcessingStage('Bézier curve mapping, slant calculation & baseline lock...');

      const apiKey = localStorage.getItem('scriptor_gemini_key') || '';
      const analysis = await analyzeHandwritingWithAI({
        imageBase64: processed.previewUrl,
        apiKey,
        basicMetrics: processed.metrics
      });

      setMetrics({
        slant: analysis.metrics.slant,
        strokeWidth: analysis.metrics.strokeWidth,
        letterSpacing: analysis.metrics.letterSpacing,
        baselineJitter: analysis.metrics.baselineJitter
      });
      setAnalysisResult(analysis);

      setProgressPercent(100);
      setProcessingStage('Calibration Complete!');

      await new Promise(r => setTimeout(r, 400));
      setStep(3);
    } catch (err) {
      alert('Error: ' + err.message);
      setStep(1);
    }
  };

  const handleSaveAndActivate = () => {
    const profile = {
      id: 'cloned-personal-font',
      name: t('clonedFontActive'),
      isCloned: true,
      fontFamily: (langCode === 'ar' ? "'Aref Ruqaa', serif" : (langCode === 'ja' ? "'Yomogi', cursive" : "'Caveat', cursive")),
      createdAt: new Date().toLocaleDateString(currentLang.locale),
      metrics,
      previewUrl: processedPreview
    };

    localStorage.setItem('scriptor_cloned_profile', JSON.stringify(profile));
    onApplyClonedFont(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-md animate-in fade-in duration-200" dir={currentLang.dir}>
      <div className="w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-[#2c1810] via-[#3a2010] to-[#1e1008] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif">{t('cloneTitle')}</h2>
                <span className="text-[10px] font-mono uppercase bg-amber-400/25 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/40">
                  {currentLang.flag} {t('cloneBadge')}
                </span>
              </div>
              <p className="text-xs text-amber-100/70">
                {t('cloneSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs font-medium text-stone-600">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-amber-900 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
            <span>{t('step1')}</span>
          </div>
          <span className="text-stone-300">───</span>
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-amber-900 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
            <span>{t('step2')}</span>
          </div>
          <span className="text-stone-300">───</span>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-amber-900 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-700'}`}>3</span>
            <span>{t('step3')}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* STEP 1: Upload / Select Photo */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              
              {/* Guidance Banner with active language Pangram */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>{t('clonePangramPrompt')}</strong>
                  <div className="mt-1 font-serif italic text-amber-950 bg-amber-100/70 px-2.5 py-1 rounded border border-amber-200/80">
                    "{t('pangram')}"
                  </div>
                </div>
              </div>

              {/* Upload Drag & Drop Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  imagePreview
                    ? 'border-amber-700 bg-amber-50/30'
                    : 'border-stone-300 hover:border-amber-800/60 bg-stone-50 hover:bg-stone-100/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Uploaded sample"
                      className="max-h-48 rounded-xl object-contain shadow-md border border-stone-300"
                    />
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('photoReady')}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-800">{t('dragDropText')}</h3>
                      <p className="text-xs text-stone-500 mt-1">{t('dragDropSubtext')}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Pre-calibrated Demo Samples */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {t('orTryDemoSamples')}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_HANDWRITINGS.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="p-3 bg-white border border-stone-200 hover:border-amber-700 rounded-xl text-left flex flex-col gap-1.5 transition-all group"
                    >
                      <span className="text-xs font-bold text-stone-800 group-hover:text-amber-900">
                        {sample.name}
                      </span>
                      <div className="w-full h-12 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center p-1">
                        <img src={sample.preview} alt="sample" className="w-full h-full object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Processing & Vision Animation */}
          {step === 2 && (
            <div className="py-12 flex flex-col items-center justify-center gap-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-900 to-amber-700 flex items-center justify-center text-white shadow-xl animate-pulse">
                  <Cpu className="w-10 h-10 stroke-[1.8]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <h3 className="text-base font-bold font-serif text-stone-800">
                  {t('processingTitle')}
                </h3>
                <p className="text-xs text-stone-500 min-h-[20px]">
                  {processingStage}
                </p>

                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-3 shadow-inner">
                  <div
                    className="h-full bg-amber-800 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Live Testing & Fine-Tuning */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              
              {/* Vision Calibration Summary */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{t('calibrationSuccess')}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-mono">{currentLang.name}</span>
              </div>

              {/* Live Interactive Test Notebook Pad */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                  <span>{t('liveTestPadTitle')}</span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    {t('liveTestPadSubtitle')}
                  </span>
                </div>

                <div className="relative rounded-2xl border border-stone-300 bg-[#FAF7F0] paper-ruled p-6 shadow-inner min-h-[140px]">
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    rows={3}
                    dir={currentLang.dir}
                    className="w-full bg-transparent resize-none border-none outline-none focus:ring-0 text-2xl pl-16 leading-relaxed ink-bleed"
                    style={{
                      fontFamily: langCode === 'ar' ? "'Aref Ruqaa', serif" : (langCode === 'ja' ? "'Yomogi', cursive" : "'Caveat', cursive"),
                      transform: currentLang.dir === 'rtl' ? undefined : `skewX(${-metrics.slant}deg)`,
                      letterSpacing: `${metrics.letterSpacing}em`,
                      fontWeight: metrics.strokeWidth > 2.8 ? '700' : '500',
                      color: '#1d4ed8'
                    }}
                  />
                  <div className="absolute top-2 right-4 text-[10px] font-mono text-stone-400 select-none">
                    Slant: {metrics.slant}° • Stroke: {metrics.strokeWidth}px
                  </div>
                </div>
              </div>

              {/* Sliders for User Customization */}
              <div className="p-4 bg-stone-100 rounded-xl border border-stone-200/80 flex flex-col gap-3.5">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-800" />
                  {t('settings')}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Slant Angle */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-stone-600">
                      <span>{t('sliderSlant')}</span>
                      <span className="font-mono font-bold text-amber-900">{metrics.slant}°</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="12"
                      step="0.5"
                      value={metrics.slant}
                      onChange={(e) => setMetrics({ ...metrics, slant: parseFloat(e.target.value) })}
                      className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Stroke Width */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-stone-600">
                      <span>{t('sliderStroke')}</span>
                      <span className="font-mono font-bold text-amber-900">{metrics.strokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="1.6"
                      max="3.6"
                      step="0.1"
                      value={metrics.strokeWidth}
                      onChange={(e) => setMetrics({ ...metrics, strokeWidth: parseFloat(e.target.value) })}
                      className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-stone-600">
                      <span>{t('sliderSpacing')}</span>
                      <span className="font-mono font-bold text-amber-900">{metrics.letterSpacing}em</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.08"
                      step="0.005"
                      value={metrics.letterSpacing}
                      onChange={(e) => setMetrics({ ...metrics, letterSpacing: parseFloat(e.target.value) })}
                      className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Baseline Jitter */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-stone-600">
                      <span>{t('sliderJitter')}</span>
                      <span className="font-mono font-bold text-amber-900">{metrics.baselineJitter}</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="1.5"
                      step="0.1"
                      value={metrics.baselineJitter}
                      onChange={(e) => setMetrics({ ...metrics, baselineJitter: parseFloat(e.target.value) })}
                      className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                    />
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg transition-all"
              >
                {t('cancel')}
              </button>
              <button
                onClick={startAnalysis}
                disabled={!imagePreview}
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>{t('btnAnalyze')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : step === 3 ? (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg transition-all"
              >
                {t('step1')}
              </button>
              <button
                onClick={handleSaveAndActivate}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-900 to-amber-700 hover:from-amber-800 hover:to-amber-600 rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{t('btnApplyClone')}</span>
              </button>
            </>
          ) : (
            <div className="w-full text-center text-xs text-stone-400">
              {processingStage}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
