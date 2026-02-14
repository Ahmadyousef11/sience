
import React, { useState } from 'react';
import { Specialty, Gender, AppState } from './types';
import { SPECIALTIES } from './constants';
import { CameraView } from './components/CameraView';
import { transformToScholar } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'setup',
    gender: 'ذكر',
    specialty: null,
    capturedImage: null,
    resultImage: null,
    error: null,
  });

  const handleStart = () => {
    if (!state.specialty) {
      setState(prev => ({ ...prev, error: 'يرجى اختيار التخصص أولاً' }));
      return;
    }
    setState(prev => ({ ...prev, step: 'camera', error: null }));
  };

  const handleCapture = async (imageData: string) => {
    setState(prev => ({ ...prev, step: 'processing', capturedImage: imageData }));
    
    try {
      if (!state.specialty) return;
      
      const transformedUrl = await transformToScholar(
        imageData,
        state.gender,
        state.specialty.name,
        state.specialty.tools
      );
      
      setState(prev => ({
        ...prev,
        step: 'result',
        resultImage: transformedUrl
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        step: 'setup',
        error: 'حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.'
      }));
    }
  };

  const reset = () => {
    setState({
      step: 'setup',
      gender: 'ذكر',
      specialty: null,
      capturedImage: null,
      resultImage: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen islamic-pattern bg-stone-50 text-stone-900 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-8 px-4 shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-2">أثر العلماء</h1>
        <p className="text-emerald-100 text-lg">حول صورتك إلى شخصية من العصر الذهبي للإسلام</p>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {state.step === 'setup' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-emerald-800 text-center">حدد هويتك العلمية</h2>
            
            {state.error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center">
                {state.error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-3">الجنس</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['ذكر', 'أنثى'] as Gender[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setState(prev => ({ ...prev, gender: g }))}
                      className={`py-4 rounded-2xl border-2 transition-all font-bold ${
                        state.gender === g 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                        : 'border-stone-200 hover:border-emerald-300 text-stone-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty Selection */}
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-3">تخصص العلم</label>
                <div className="grid grid-cols-2 gap-3">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setState(prev => ({ ...prev, specialty: s }))}
                      className={`p-3 text-sm rounded-xl border-2 transition-all flex flex-col items-center text-center ${
                        state.specialty?.id === s.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                        : 'border-stone-200 hover:border-emerald-300 text-stone-500'
                      }`}
                    >
                      <span className="text-2xl mb-1">{s.icon}</span>
                      <span className="font-bold">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleStart}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                ابدأ التحول الآن 🚀
              </button>
            </div>
          </div>
        )}

        {state.step === 'camera' && (
          <div className="animate-fadeIn">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-800">خذ وضعية عالم متميز</h2>
                <p className="text-stone-600">التخصص المختار: {state.specialty?.name}</p>
             </div>
             <CameraView onCapture={handleCapture} onCancel={reset} />
          </div>
        )}

        {state.step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-24 h-24 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">جاري بعث التاريخ...</h2>
            <p className="text-stone-600 text-center max-w-md">
              يقوم الذكاء الاصطناعي الآن برسم صورتك بأسلوب العلماء في العصر الذهبي، وتجهيز أدوات {state.specialty?.name} الخاصة بك.
            </p>
          </div>
        )}

        {state.step === 'result' && state.resultImage && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn max-w-2xl mx-auto">
            <div className="p-8">
               <h2 className="text-3xl font-bold text-emerald-800 text-center mb-6">أهلاً بك في مجمع العلماء!</h2>
               <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner border-8 border-stone-100 mb-6">
                 <img 
                    src={state.resultImage} 
                    alt="Scholar Result" 
                    className="w-full h-full object-cover"
                 />
               </div>
               <div className="text-center bg-emerald-50 p-6 rounded-2xl mb-8">
                 <p className="text-emerald-900 font-medium leading-relaxed">
                   لقد تم تصويرك كـ {state.gender === 'ذكر' ? 'عالم' : 'عالمة'} بارز في مجال <strong>{state.specialty?.name}</strong>.
                   تحمل في يدك <strong>{state.specialty?.tools}</strong> لتساهم في تنوير العالم بعلمك.
                 </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = state.resultImage!;
                      link.download = 'scholar-me.png';
                      link.click();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition"
                  >
                    حفظ الصورة 💾
                  </button>
                  <button
                    onClick={reset}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-8 py-3 rounded-full font-bold transition"
                  >
                    تجربة تخصص آخر 🔄
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-stone-500 text-sm">
        <p>تكريم لعلماء المسلمين الذين أناروا العالم بعلمهم</p>
      </footer>
    </div>
  );
};

export default App;
