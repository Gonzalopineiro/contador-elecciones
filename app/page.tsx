"use client"

import Image from "next/image";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useTheme } from "./context/ThemeContext";
import "./styles.css";

export default function Home() {
  const [porcentaje, setPorcentaje] = useState(0);
  const [votantes, setVotantes] = useState(1);
  const [customVotantes, setCustomVotantes] = useState("");
  const [repuestas, setRepuestas] = useState(1);
  const [customRepuestas, setCustomRepuestas] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Solo mobile
  // Estilos inline para simplicidad, pero se pueden mover a CSS
  return (
  <div className="max-w-sm mx-auto p-6 min-h-screen flex flex-col items-center font-sans">
    <div className="w-full flex justify-between items-center mb-6">
      <h1 className="text-5xl font-bold text-center">Contador Elecciones</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full theme-toggle"
        aria-label="Cambiar modo"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>

      {/* Barra de porcentaje */}
      <div className="w-full mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-base">Porcentaje con 10 mesas</span>
          <span className="text-base">{porcentaje}%</span>
        </div>
        <div className="rounded-lg h-4 w-full progress-bar-bg">
          <div
            className="h-4 rounded-lg transition-all progress-bar"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

  {/* Votantes */}
  <h2 className="text-lg mt-6 mb-2">Votantes</h2>
  <div className="flex gap-2 flex-wrap mb-2">
        {[...Array(10)].map((_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-2 rounded-lg font-medium cursor-pointer border votante-btn ${votantes === i + 1 ? 'active' : ''}`}
            onClick={() => { setVotantes(i + 1); setCustomVotantes(""); if (repuestas > i + 1) setRepuestas(i + 1); }}
          >
            {i + 1}
          </button>
        ))}
        <input
          type="number"
          min={1}
          placeholder="Otro"
          value={customVotantes}
          className="w-16 px-2 py-2 rounded-lg border input-custom"
          onChange={e => {
            const value = Number(e.target.value) || 1;
            setCustomVotantes(e.target.value);
            setVotantes(value);
            if (repuestas > value) setRepuestas(value);
          }}
        />
      </div>

  {/* Voletas repuestas */}
  <h2 className="text-lg mt-6 mb-2">Voletas repuestas</h2>
  <div className="flex gap-2 flex-wrap mb-2">
        {[...Array(10)].map((_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-2 rounded-lg font-medium cursor-pointer border repuesta-btn ${repuestas === i + 1 ? 'active' : ''}`}
            onClick={() => { setRepuestas(i + 1 > votantes ? votantes : i + 1); setCustomRepuestas(""); }}
          >
            {i + 1}
          </button>
        ))}
        <input
          type="number"
          min={1}
          max={votantes}
          placeholder="Otro"
          value={customRepuestas}
          className="w-16 px-2 py-2 rounded-lg border input-custom"
          onChange={e => {
            let value = Number(e.target.value) || 1;
            if (value > votantes) value = votantes;
            setCustomRepuestas(e.target.value);
            setRepuestas(value);
          }}
        />
      </div>

      {/* Botón submit */}
      <button
        className="mt-8 w-full py-3 font-bold text-lg rounded-lg cursor-pointer shadow btn-submit"
        onClick={async () => {
          const supabase = createClient();
          const { error } = await supabase.from("reposiciones").insert({
            mesa_id: "prueba",
            votantes_contados: votantes,
            boletas_repuestas: repuestas,
          });
          if (error) {
            alert("Error al subir los datos: " + error.message);
            return;
          }
          // Consulta directa para calcular el porcentaje
          const { data: queryData, error: queryError } = await supabase
            .from("reposiciones")
            .select("boletas_repuestas, votantes_contados");
          if (queryError) {
            alert("Error al obtener datos: " + queryError.message);
            return;
          }
          const totalBoletas = queryData.reduce((acc, row) => acc + (row.boletas_repuestas || 0), 0);
          const totalVotantes = queryData.reduce((acc, row) => acc + (row.votantes_contados || 0), 0);
          const porcentajeCalc = totalVotantes > 0 ? (totalBoletas / totalVotantes) * 100 : 0;
          setPorcentaje(Number(porcentajeCalc.toFixed(2)));
        }}
      >
        Submit
      </button>

  {/* El porcentaje ahora se actualiza automáticamente */}
    </div>
  );
}
