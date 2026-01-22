const habitats = [
  { id: "bosque", name: "Bosques", icon: "🌲", pts: 2 },
  { id: "montana1", name: "Montaña (H1)", icon: "⛰️", pts: 1 },
  { id: "montana2", name: "Montaña (H2)", icon: "⛰️⛰️", pts: 3 },
  { id: "montana3", name: "Montaña (H3)", icon: "⛰️⛰️⛰️", pts: 7 },
  { id: "rio", name: "Río", icon: "🌊", pts: 1 },
  { id: "campo", name: "Campos", icon: "🌾", pts: 5 },
  { id: "pueblo", name: "Pueblos", icon: "🏠", pts: 3 }
];

const animals = [
  { id: "oso", name: "Oso", pts: [2, 5, 8] },
  { id: "lobo", name: "Lobo", pts: [4, 9] },
  { id: "rana", name: "Rana", pts: [2, 4, 7] },
  { id: "ciervo", name: "Ciervo", pts: [3, 7, 12] },
  { id: "zorro", name: "Zorro", pts: [3, 5] },
  { id: "nutria", name: "Nutria", pts: [5, 10] }
];

const spirits = [
  { id: "esp_rio", name: "Espíritu del Río", link: "rio" },
  { id: "esp_montana", name: "Espíritu de la Cumbre", link: "montana3" },
  { id: "esp_bosque", name: "Espíritu del Bosque", link: "bosque" }
];