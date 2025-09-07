import React, { useState, useEffect } from 'react';
import { Calculator, Target, DollarSign, Calendar, Plus, Trash2, CheckCircle } from 'lucide-react';

const DreamlineCalculator = () => {
  const [timeframe, setTimeframe] = useState('6');
  const [dreams, setDreams] = useState({
    having: [],
    being: [],
    doing: []
  });
  const [selectedDreams, setSelectedDreams] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [newDream, setNewDream] = useState({ category: 'having', text: '', cost: '' });
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [dreamSteps, setDreamSteps] = useState({});
  const [newStep, setNewStep] = useState({ dreamId: '', step: '' });
  
  const addDream = () => {
    if (!newDream.text.trim()) return;
    
    const dreamId = Date.now();
    
    setDreams(prev => ({
      ...prev,
      [newDream.category]: [...prev[newDream.category], {
        id: dreamId,
        text: newDream.text,
        cost: parseFloat(newDream.cost) || 0,
        category: newDream.category
      }]
    }));
    
    setNewDream({ category: 'having', text: '', cost: '' });
  };

  const addStep = () => {
    if (!newStep.dreamId || !newStep.step.trim()) return;
    
    setDreamSteps(prev => ({
      ...prev,
      [newStep.dreamId]: [...(prev[newStep.dreamId] || []), {
        id: Date.now(),
        step: newStep.step
      }]
    }));
    
    setNewStep({ dreamId: '', step: '' });
  };

  const addExpense = () => {
    if (!newExpense.name.trim() || !newExpense.amount) return;
    
    setMonthlyExpenses(prev => [...prev, {
      id: Date.now(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount)
    }]);
    
    setNewExpense({ name: '', amount: '' });
  };

  const removeDream = (category, id) => {
    setDreams(prev => ({
      ...prev,
      [category]: prev[category].filter(dream => dream.id !== id)
    }));
    setSelectedDreams(prev => prev.filter(dream => dream.id !== id));
    // Remove associated steps when dream is removed
    setDreamSteps(prev => {
      const newSteps = { ...prev };
      delete newSteps[id];
      return newSteps;
    });
  };

  const removeStep = (dreamId, stepId) => {
    setDreamSteps(prev => ({
      ...prev,
      [dreamId]: prev[dreamId].filter(step => step.id !== stepId)
    }));
  };

  const removeExpense = (id) => {
    setMonthlyExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const toggleSelectedDream = (dream) => {
    setSelectedDreams(prev => {
      const exists = prev.find(d => d.id === dream.id);
      if (exists) {
        return prev.filter(d => d.id !== dream.id);
      } else if (prev.length < 4) {
        return [...prev, dream];
      }
      return prev;
    });
  };

  const allDreams = [...dreams.having, ...dreams.being, ...dreams.doing];
  
  const calculateResults = () => {
    const dreamsCost = selectedDreams.reduce((sum, dream) => sum + dream.cost, 0);
    const monthlyExpensesTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const months = parseInt(timeframe);
    
    const totalDreamsCost = dreamsCost;
    const totalMonthlyExpenses = monthlyExpensesTotal * months;
    const totalNeeded = totalDreamsCost + totalMonthlyExpenses;
    
    const monthlyIncome = totalNeeded / months;
    const dailyIncome = monthlyIncome / 30;
    
    return {
      dreamsCost: totalDreamsCost,
      monthlyExpenses: totalMonthlyExpenses,
      totalNeeded,
      monthlyIncome,
      dailyIncome
    };
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Dreamline Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vypočítej si potřebný target income pro dosažení svých snů podle metodiky Tim Ferrisse
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeframe Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Časový rámec
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="6"
                    checked={timeframe === '6'}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="text-indigo-600"
                  />
                  <span>6 měsíců</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="12"
                    checked={timeframe === '12'}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="text-indigo-600"
                  />
                  <span>12 měsíců</span>
                </label>
              </div>
            </div>

            {/* Dreams and Steps Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Sny a kroky k jejich dosažení</h2>
              
              {/* Add Dream Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-4">Přidej nový sen</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <select
                    value={newDream.category}
                    onChange={(e) => setNewDream(prev => ({ ...prev, category: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="having">HAVING</option>
                    <option value="being">BEING</option>
                    <option value="doing">DOING</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Popis snu..."
                    value={newDream.text}
                    onChange={(e) => setNewDream(prev => ({ ...prev, text: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  
                  <input
                    type="number"
                    placeholder="Cena (Kč)"
                    value={newDream.cost}
                    onChange={(e) => setNewDream(prev => ({ ...prev, cost: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={addDream}
                  className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Přidat sen
                </button>
              </div>

              {/* Dreams organized by category */}
              <div className="space-y-6">
                {['having', 'being', 'doing'].map(category => (
                  dreams[category].length > 0 && (
                    <div key={category} className="space-y-4">
                      <h3 className="font-bold text-lg text-gray-800 uppercase border-b-2 pb-2">
                        {category === 'having' ? 'HAVING - Co chci mít' : 
                         category === 'being' ? 'BEING - Čím chci být' : 
                         'DOING - Co chci dělat/zažít'}
                      </h3>
                      
                      {dreams[category].map(dream => (
                        <div key={dream.id} className="border-2 border-gray-200 rounded-lg p-4">
                          {/* Dream and Steps side by side */}
                          <div className="grid grid-cols-2 gap-4 h-full">
                            {/* LEFT: Dream Box */}
                            <div 
                              className={`cursor-pointer p-4 rounded-lg border-2 transition-all h-full ${
                                selectedDreams.find(d => d.id === dream.id)
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-300 hover:border-gray-400 bg-white'
                              }`}
                              onClick={() => toggleSelectedDream(dream)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {selectedDreams.find(d => d.id === dream.id) && (
                                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                                    )}
                                    <h4 className="font-semibold text-gray-800">{dream.text}</h4>
                                  </div>
                                  <div className="text-lg font-bold text-green-600">
                                    💰 {dream.cost.toLocaleString()} Kč
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeDream(category, dream.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-xs text-gray-500">
                                Klikni pro výběr do top 4 snů
                              </div>
                            </div>

                            {/* RIGHT: Steps Box */}
                            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 h-full flex flex-col">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-purple-800">Kroky k dosažení</h4>
                                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">
                                  {dreamSteps[dream.id]?.length || 0} kroků
                                </span>
                              </div>
                              
                              {/* Add Step Form */}
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="text"
                                  placeholder="Přidat krok..."
                                  value={newStep.dreamId === dream.id.toString() ? newStep.step : ''}
                                  onChange={(e) => setNewStep({ dreamId: dream.id.toString(), step: e.target.value })}
                                  className="flex-1 p-2 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newStep.step.trim() && newStep.dreamId === dream.id.toString()) {
                                      addStep();
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    if (newStep.dreamId === dream.id.toString() && newStep.step.trim()) {
                                      addStep();
                                    }
                                  }}
                                  disabled={!newStep.step.trim() || newStep.dreamId !== dream.id.toString()}
                                  className="px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:bg-gray-300"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Steps List */}
                              <div className="space-y-2 flex-1 overflow-y-auto">
                                {dreamSteps[dream.id]?.map((step, index) => (
                                  <div key={step.id} className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold min-w-[24px] text-center">
                                        {index + 1}
                                      </span>
                                      <span className="text-gray-700">{step.step}</span>
                                    </div>
                                    <button
                                      onClick={() => removeStep(dream.id, step.id)}
                                      className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                )) || (
                                  <div className="text-xs text-purple-600 italic text-center py-4 flex-1 flex items-center justify-center">
                                    Zatím žádné kroky - přidej první!
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </div>

              {allDreams.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ✨ Vybraných snů: {selectedDreams.length}/4 - klikni na sen pro výběr do top 4
                  </p>
                </div>
              )}

              {allDreams.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-xl">Začni přidáním svého prvního snu!</p>
                </div>
              )}
            </div>

            {/* Monthly Expenses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Měsíční výdaje</h2>
              
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  placeholder="Název výdaje (telefon, internet, nájem...)"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                
                <input
                  type="number"
                  placeholder="Částka (Kč)"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                
                <button
                  onClick={addExpense}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Přidat výdaj
                </button>
              </div>

              <div className="space-y-2">
                {monthlyExpenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="font-medium">{expense.name}</span>
                      <span className="text-gray-600 ml-2">{expense.amount.toLocaleString()} Kč</span>
                    </div>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Výsledky kalkulace
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Celkové náklady na sny</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {results.dreamsCost.toLocaleString()} Kč
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">
                    Životní náklady za {timeframe} měsíců
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {results.monthlyExpenses.toLocaleString()} Kč
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Celkem potřebuji</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {results.totalNeeded.toLocaleString()} Kč
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
                    <div>
                      <div className="text-sm text-indigo-600 font-medium">Měsíční příjem</div>
                      <div className="text-xl font-bold text-indigo-700 flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        {results.monthlyIncome.toLocaleString()} Kč
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                    <div>
                      <div className="text-sm text-orange-600 font-medium">Denní příjem</div>
                      <div className="text-xl font-bold text-orange-700 flex items-center gap-1">
                        <Target className="h-5 w-5" />
                        {results.dailyIncome.toLocaleString()} Kč
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDreams.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Tvoje vybrané sny:</h3>
                    <div className="space-y-2">
                      {selectedDreams.map(dream => (
                        <div key={dream.id} className="text-sm p-3 bg-gray-50 rounded">
                          <div className="font-medium flex items-center gap-2">
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded uppercase">
                              {dream.category}
                            </span>
                            {dream.text}
                          </div>
                          <div className="text-gray-600 mt-1">{dream.cost.toLocaleString()} Kč</div>
                          {dreamSteps[dream.id] && dreamSteps[dream.id].length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-medium text-gray-700 mb-1">Definované kroky:</div>
                              {dreamSteps[dream.id].map((step, index) => (
                                <div key={step.id} className="text-xs text-gray-600 ml-2">
                                  {index + 1}. {step.step}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Co dál?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-3 border-l-4 border-indigo-500 bg-indigo-50">
                  <strong>Tvůj TARGET:</strong> Vydělávat {Math.ceil(results.dailyIncome).toLocaleString()} Kč denně
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <strong>Krok 1:</strong> Identifikuj způsoby, jak dosáhnout denního příjmu
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <strong>Krok 2:</strong> Rozděl velké sny na menší, dosažitelné cíle
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                  <strong>Krok 3:</strong> Začni s prvními kroky, které jsi definoval u svých snů
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamlineCalculator;