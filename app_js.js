import React, { useState } from 'react';
import { Calculator, Lightbulb, Fan, Package, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import './App.css';

const GrowkitCalculator = () => {
  const [selectedTent, setSelectedTent] = useState('');
  const [selectedLamp, setSelectedLamp] = useState('');
  const [selectedFan, setSelectedFan] = useState('');
  const [lampHeight, setLampHeight] = useState(60);

  // Growzelt-Daten
  const tents = {
    '60x60': { name: 'Growzelt 60x60x160cm', width: 60, height: 60, depth: 160, price: 89, area: 0.36 },
    '80x80': { name: 'Growzelt 80x80x160cm', width: 80, height: 80, depth: 160, price: 129, area: 0.64 },
    '100x100': { name: 'Growzelt 100x100x200cm', width: 100, height: 100, depth: 200, price: 169, area: 1.0 },
    '120x60': { name: 'Growzelt 120x60x180cm', width: 120, height: 60, depth: 180, price: 149, area: 0.72 },
    '150x150': { name: 'Growzelt 150x150x200cm', width: 150, height: 150, depth: 200, price: 249, area: 2.25 }
  };

  // LED-Lampen mit Herstellerdaten
  const lamps = {
    'mars100': { 
      name: 'Mars Hydro TS 1000', 
      power: 150, 
      ppfd: 845, 
      coverage: '60x60', 
      price: 169, 
      manufacturer: 'Mars Hydro',
      spectrum: 'Full Spectrum',
      efficacy: 2.15
    },
    'mars600': { 
      name: 'Mars Hydro TS 600', 
      power: 100, 
      ppfd: 540, 
      coverage: '50x50', 
      price: 89, 
      manufacturer: 'Mars Hydro',
      spectrum: 'Full Spectrum',
      efficacy: 2.05
    },
    'spider200': { 
      name: 'Spider Farmer SF-2000', 
      power: 200, 
      ppfd: 1120, 
      coverage: '80x80', 
      price: 199, 
      manufacturer: 'Spider Farmer',
      spectrum: 'Samsung LM301B',
      efficacy: 2.7
    },
    'spider400': { 
      name: 'Spider Farmer SF-4000', 
      power: 450, 
      ppfd: 1525, 
      coverage: '120x120', 
      price: 449, 
      manufacturer: 'Spider Farmer',
      spectrum: 'Samsung LM301H',
      efficacy: 2.9
    },
    'quantum120': { 
      name: 'Quantum Board 120W', 
      power: 120, 
      ppfd: 780, 
      coverage: '60x60', 
      price: 129, 
      manufacturer: 'HLG',
      spectrum: 'Samsung LM301H',
      efficacy: 2.8
    }
  };

  // Lüfter-Daten
  const fans = {
    'inline4': { name: 'Inline Lüfter 4"', diameter: 4, airflow: 190, price: 45, noise: 35 },
    'inline6': { name: 'Inline Lüfter 6"', diameter: 6, airflow: 440, price: 89, noise: 42 },
    'inline8': { name: 'Inline Lüfter 8"', diameter: 8, airflow: 720, price: 149, noise: 48 },
    'carbon4': { name: 'Carbon Filter Set 4"', diameter: 4, airflow: 160, price: 79, noise: 38 },
    'carbon6': { name: 'Carbon Filter Set 6"', diameter: 6, airflow: 380, price: 129, noise: 45 }
  };

  // Berechnungen
  const calculateResults = () => {
    if (!selectedTent || !selectedLamp || !selectedFan) return null;

    const tent = tents[selectedTent];
    const lamp = lamps[selectedLamp];
    const fan = fans[selectedFan];

    // PPFD Berechnung basierend auf Abstand und Zeltgröße
    const heightFactor = Math.max(0.5, Math.min(1.5, 80 / lampHeight));
    const areaCoverage = tent.area;
    const actualPPFD = (lamp.ppfd * heightFactor) / (areaCoverage / 0.36);

    // Empfohlene Werte
    const recommendedPPFD = { min: 400, max: 800, optimal: 600 };
    const recommendedAirflow = tent.area * 200; // m³/h pro m²

    // Bewertungen
    const ppfdRating = actualPPFD >= recommendedPPFD.min && actualPPFD <= recommendedPPFD.max ? 'optimal' : 
                      actualPPFD < recommendedPPFD.min ? 'zu_niedrig' : 'zu_hoch';
    
    const airflowRating = fan.airflow >= recommendedAirflow * 0.8 ? 'optimal' : 'zu_schwach';
    
    const lampSizeRating = lamp.coverage === `${tent.width}x${tent.height}` ? 'perfekt' : 
                          lamp.coverage.includes('50x50') && tent.width <= 60 ? 'ausreichend' : 
                          'prüfen';

    // Preis-Leistung
    const totalPrice = tent.price + lamp.price + fan.price;
    const pricePerWatt = totalPrice / lamp.power;
    const efficiencyScore = (lamp.efficacy * actualPPFD) / totalPrice;

    return {
      tent,
      lamp,
      fan,
      actualPPFD: Math.round(actualPPFD),
      recommendedPPFD,
      ppfdRating,
      airflowRating,
      lampSizeRating,
      totalPrice,
      pricePerWatt: Math.round(pricePerWatt * 100) / 100,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      recommendedAirflow: Math.round(recommendedAirflow),
      lampHeight
    };
  };

  const results = calculateResults();

  const getRatingColor = (rating) => {
    switch(rating) {
      case 'optimal': case 'perfekt': return 'text-green-600 bg-green-100';
      case 'ausreichend': return 'text-yellow-600 bg-yellow-100';
      case 'zu_niedrig': case 'zu_schwach': case 'zu_hoch': case 'prüfen': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingIcon = (rating) => {
    switch(rating) {
      case 'optimal': case 'perfekt': return <CheckCircle className="w-4 h-4" />;
      case 'ausreichend': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-green-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Growkit Kalkulator</h1>
          </div>
          <p className="text-gray-600">Optimiere dein Setup mit präzisen Berechnungen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Growzelt Auswahl */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Growzelt</h2>
            </div>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedTent}
              onChange={(e) => setSelectedTent(e.target.value)}
            >
              <option value="">Growzelt auswählen</option>
              {Object.entries(tents).map(([key, tent]) => (
                <option key={key} value={key}>
                  {tent.name} - {tent.price}€
                </option>
              ))}
            </select>
          </div>

          {/* LED-Lampe Auswahl */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-semibold">LED-Lampe</h2>
            </div>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={selectedLamp}
              onChange={(e) => setSelectedLamp(e.target.value)}
            >
              <option value="">LED-Lampe auswählen</option>
              {Object.entries(lamps).map(([key, lamp]) => (
                <option key={key} value={key}>
                  {lamp.name} - {lamp.power}W - {lamp.price}€
                </option>
              ))}
            </select>
          </div>

          {/* Lüfter Auswahl */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Fan className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Lüfter</h2>
            </div>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedFan}
              onChange={(e) => setSelectedFan(e.target.value)}
            >
              <option value="">Lüfter auswählen</option>
              {Object.entries(fans).map(([key, fan]) => (
                <option key={key} value={key}>
                  {fan.name} - {fan.airflow}m³/h - {fan.price}€
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lampenhöhe Einstellung */}
        {selectedLamp && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Lampenhöhe einstellen</h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Höhe: {lampHeight}cm</label>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={lampHeight}
                onChange={(e) => setLampHeight(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">30-100cm</span>
            </div>
          </div>
        )}

        {/* Ergebnisse */}
        {results && (
          <div className="space-y-6">
            {/* Hauptergebnisse */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-semibold">Berechnungsergebnisse</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">PPFD</h3>
                  <p className="text-2xl font-bold text-green-600">{results.actualPPFD}</p>
                  <p className="text-sm text-gray-500">µmol/m²/s</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRatingColor(results.ppfdRating)}`}>
                    {getRatingIcon(results.ppfdRating)}
                    <span className="ml-1">{results.ppfdRating}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Luftstrom</h3>
                  <p className="text-2xl font-bold text-blue-600">{results.fan.airflow}</p>
                  <p className="text-sm text-gray-500">m³/h</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRatingColor(results.airflowRating)}`}>
                    {getRatingIcon(results.airflowRating)}
                    <span className="ml-1">{results.airflowRating}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Gesamtpreis</h3>
                  <p className="text-2xl font-bold text-purple-600">{results.totalPrice}€</p>
                  <p className="text-sm text-gray-500">{results.pricePerWatt}€/W</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Effizienz</h3>
                  <p className="text-2xl font-bold text-orange-600">{results.efficiencyScore}</p>
                  <p className="text-sm text-gray-500">Score</p>
                </div>
              </div>
            </div>

            {/* Detailierte Produktinfos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Zelt Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Growzelt Details
                </h3>
                <div className="space-y-2">
                  <p><strong>Modell:</strong> {results.tent.name}</p>
                  <p><strong>Abmessungen:</strong> {results.tent.width}x{results.tent.height}x{results.tent.depth}cm</p>
                  <p><strong>Grundfläche:</strong> {results.tent.area}m²</p>
                  <p><strong>Preis:</strong> {results.tent.price}€</p>
                </div>
              </div>

              {/* Lampe Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  LED-Lampe Details
                </h3>
                <div className="space-y-2">
                  <p><strong>Modell:</strong> {results.lamp.name}</p>
                  <p><strong>Hersteller:</strong> {results.lamp.manufacturer}</p>
                  <p><strong>Leistung:</strong> {results.lamp.power}W</p>
                  <p><strong>PPFD:</strong> {results.lamp.ppfd} µmol/m²/s</p>
                  <p><strong>Spektrum:</strong> {results.lamp.spectrum}</p>
                  <p><strong>Effizienz:</strong> {results.lamp.efficacy} µmol/J</p>
                  <p><strong>Empfohlene Fläche:</strong> {results.lamp.coverage}cm</p>
                  <p><strong>Preis:</strong> {results.lamp.price}€</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRatingColor(results.lampSizeRating)}`}>
                    {getRatingIcon(results.lampSizeRating)}
                    <span className="ml-1">Zeltgröße: {results.lampSizeRating}</span>
                  </div>
                </div>
              </div>

              {/* Lüfter Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Fan className="w-5 h-5 mr-2 text-blue-600" />
                  Lüfter Details
                </h3>
                <div className="space-y-2">
                  <p><strong>Modell:</strong> {results.fan.name}</p>
                  <p><strong>Durchmesser:</strong> {results.fan.diameter}"</p>
                  <p><strong>Luftstrom:</strong> {results.fan.airflow}m³/h</p>
                  <p><strong>Lautstärke:</strong> {results.fan.noise}dB</p>
                  <p><strong>Empfohlen:</strong> {results.recommendedAirflow}m³/h</p>
                  <p><strong>Preis:</strong> {results.fan.price}€</p>
                </div>
              </div>
            </div>

            {/* Empfehlungen */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Empfehlungen & Tipps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">PPFD Optimierung:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Optimal: 400-800 µmol/m²/s</li>
                    <li>• Aktuell: {results.actualPPFD} µmol/m²/s</li>
                    <li>• Lampenhöhe: {results.lampHeight}cm</li>
                    {results.ppfdRating === 'zu_niedrig' && <li className="text-red-600">• Lampe näher bringen oder stärkere Lampe wählen</li>}
                    {results.ppfdRating === 'zu_hoch' && <li className="text-red-600">• Lampe weiter weg oder schwächere Lampe wählen</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Belüftung:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Empfohlen: {results.recommendedAirflow}m³/h</li>
                    <li>• Aktuell: {results.fan.airflow}m³/h</li>
                    <li>• Lautstärke: {results.fan.noise}dB</li>
                    {results.airflowRating === 'zu_schwach' && <li className="text-red-600">• Stärkeren Lüfter wählen</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowkitCalculator;