import React, { useState, useEffect } from 'react';
import { Smile, Frown, Angry, Meh, Space as Peace, Plus, Save, PieChart as ChartPie, History, PlusCircle, X, Trash2, FileText } from 'lucide-react';

type Emotion = {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

type Entry = {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  situation: string;
  thoughts: string;
  physical: string;
};

const emotions: Emotion[] = [
  { name: 'Alegría', icon: <Smile className="w-6 h-6" />, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { name: 'Tristeza', icon: <Frown className="w-6 h-6" />, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Enfado', icon: <Angry className="w-6 h-6" />, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  { name: 'Miedo', icon: <Meh className="w-6 h-6" />, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { name: 'Calma', icon: <Peace className="w-6 h-6" />, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { name: 'Otra', icon: <Plus className="w-6 h-6" />, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800/50' },
];

function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'insights'>('new');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [situation, setSituation] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [physical, setPhysical] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showCustomEmotionModal, setShowCustomEmotionModal] = useState(false);
  const [customEmotion, setCustomEmotion] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem('emotionEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntry = () => {
    if (!selectedEmotion) return;

    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      emotion: selectedEmotion.name,
      intensity,
      situation,
      thoughts,
      physical,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('emotionEntries', JSON.stringify(updatedEntries));

    // Reset form
    setSelectedEmotion(null);
    setIntensity(3);
    setSituation('');
    setThoughts('');
    setPhysical('');
    setActiveTab('history');
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    if (emotion.name === 'Otra') {
      setShowCustomEmotionModal(true);
    } else {
      setSelectedEmotion(emotion);
    }
  };

  const handleCustomEmotionSave = () => {
    if (customEmotion.trim()) {
      const newEmotion: Emotion = {
        name: customEmotion,
        icon: <Plus className="w-6 h-6" />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      };
      setSelectedEmotion(newEmotion);
      setShowCustomEmotionModal(false);
      setCustomEmotion('');
    }
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem('emotionEntries', JSON.stringify(updatedEntries));
      setSelectedEntry(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Taller Regulación Emocional. 3ª Edidicón - Juan Orta</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Registra y comprende tus emociones</p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex mb-6 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center justify-center py-2 px-4 flex-1 font-medium transition-colors ${
              activeTab === 'new'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Nuevo registro</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center py-2 px-4 flex-1 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <History className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Historial</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center justify-center py-2 px-4 flex-1 font-medium transition-colors ${
              activeTab === 'insights'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <ChartPie className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Insights</span>
          </button>
        </div>

        {/* New Entry Screen */}
        {activeTab === 'new' && (
          <div className="space-y-6">
            {/* Emotion Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-3">¿Cómo te sientes?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.name}
                    onClick={() => handleEmotionSelect(emotion)}
                    className={`p-4 rounded-xl transition-all ${emotion.bgColor} ${
                      selectedEmotion?.name === emotion.name ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${emotion.color}`}>
                      {emotion.icon}
                    </div>
                    <p className="font-medium text-sm sm:text-base">{emotion.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            {selectedEmotion && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Intensidad</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Apenas perceptible</span>
                    <span>Muy intensa</span>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-lg font-medium">{intensity}</span> / 5
                  </div>
                </div>
              </div>
            )}

            {/* Details */}
            {selectedEmotion && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-3">¿Qué situación provocó esta emoción?</h2>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Describe la situación..."
                    className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">¿Qué pensamientos tuviste?</h2>
                  <textarea
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    placeholder="Escribe tus pensamientos..."
                    className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Reacciones corporales <span className="text-sm font-normal text-gray-500">(opcional)</span>
                  </h2>
                  <textarea
                    value={physical}
                    onChange={(e) => setPhysical(e.target.value)}
                    placeholder="¿Qué sentiste en tu cuerpo?"
                    className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 min-h-[100px] resize-none"
                  />
                </div>

                <button
                  onClick={saveEntry}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Guardar registro
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Screen */}
        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Tus registros</h2>
              <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Exportar PDF</span>
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">Aún no tienes registros emocionales</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded-full font-medium transition"
                >
                  Crea tu primer registro
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 text-left hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-medium">{entry.emotion}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{entry.intensity}/5</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Insights Screen */}
        {activeTab === 'insights' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {entries.length < 3
                ? 'Necesitas al menos 3 registros para ver insights'
                : 'Análisis de emociones en desarrollo'}
            </p>
          </div>
        )}
      </div>

      {/* Custom Emotion Modal */}
      {showCustomEmotionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Especifica tu emoción</h3>
              <button onClick={() => setShowCustomEmotionModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={customEmotion}
              onChange={(e) => setCustomEmotion(e.target.value)}
              placeholder="Escribe la emoción..."
              className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4"
              maxLength={15}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCustomEmotionModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCustomEmotionSave}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {new Date(selectedEntry.date).toLocaleDateString()}
              </h3>
              <button onClick={() => setSelectedEntry(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Emoción: {selectedEntry.emotion}</h4>
                <p>Intensidad: {selectedEntry.intensity}/5</p>
              </div>
              <div>
                <h4 className="font-medium">Situación:</h4>
                <p className="text-gray-700 dark:text-gray-300">{selectedEntry.situation || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium">Pensamientos:</h4>
                <p className="text-gray-700 dark:text-gray-300">{selectedEntry.thoughts || '-'}</p>
              </div>
              {selectedEntry.physical && (
                <div>
                  <h4 className="font-medium">Reacciones corporales:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{selectedEntry.physical}</p>
                </div>
              )}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => deleteEntry(selectedEntry.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                >
                  <Trash2 className="w-5 h-5 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;