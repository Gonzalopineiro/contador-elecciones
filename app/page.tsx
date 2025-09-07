"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { useTheme } from "./context/ThemeContext";
import "./styles.css";

export default function Home() {
  const [porcentaje, setPorcentaje] = useState(0);
  const [votantes, setVotantes] = useState(1);
  const [customVotantes, setCustomVotantes] = useState("");
  const [repuestas, setRepuestas] = useState(1);
  const [customRepuestas, setCustomRepuestas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga inicial
  const { theme, toggleTheme } = useTheme();

  // Tipo para los datos de reposición
  interface Reposicion {
    boletas_repuestas: number | null;
    votantes_contados: number | null;
  }

  // Función para calcular el porcentaje basado en los datos
  const calcularPorcentaje = (data: Reposicion[]): number => {
    const totalBoletas = data.reduce((acc: number, row: Reposicion) => acc + (row.boletas_repuestas || 0), 0);
    const totalVotantes = data.reduce((acc: number, row: Reposicion) => acc + (row.votantes_contados || 0), 0);
    const porcentajeCalc = totalVotantes > 0 ? (totalBoletas / totalVotantes) * 100 : 0;
    return Number(porcentajeCalc.toFixed(2));
  };

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reposiciones")
          .select("boletas_repuestas, votantes_contados");

        if (error) {
          console.error("Error al obtener datos:", error);
          return;
        }

        if (data && data.length > 0) {
          setPorcentaje(calcularPorcentaje(data));
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // Solo mobile
  // Estilos inline para simplicidad, pero se pueden mover a CSS
  return (
  <div className="max-w-sm mx-auto p-6 min-h-screen flex flex-col items-center font-sans">
    <div className="w-full flex justify-between items-center mb-6">
      <h1 className="text-5xl font-bold text-center">Contador Elecciones</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full border theme-toggle"
        aria-label="Cambiar modo"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>

      {/* Barra de porcentaje */}
      <div className="w-full mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-base">Porcentaje de mesas totales</span>
          <span className="text-base">
            {isLoading ? <span className="loading-text">Cargando...</span> : `${porcentaje}%`}
          </span>
        </div>
        <div className="rounded-lg h-4 w-full progress-bar-bg">
          <div
            className="h-4 rounded-lg transition-all progress-bar"
            style={{ width: isLoading ? '0%' : `${porcentaje}%` }}
          />
        </div>
        {isLoading && <p className="text-sm mt-1 text-center loading-text">Cargando datos iniciales...</p>}
      </div>

  {/* Votantes */}
  <h2 className="text-lg mt-6 mb-2">Votantes que pasaron a cuarto oscuro</h2>
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
  <h2 className="text-lg mt-6 mb-2">Boletas repuestas</h2>
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
        disabled={isSubmitting || isLoading} // Desactivar el botón mientras se procesa o carga
        onClick={async () => {
          // Evitar múltiples envíos
          if (isSubmitting) return;
          
          setIsSubmitting(true); // Indicar que está en proceso
          
          try {
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
            
            // Usar la función reutilizable para calcular el porcentaje
            setPorcentaje(calcularPorcentaje(queryData));
          } catch (err) {
            console.error("Error durante el envío:", err);
            alert("Error inesperado durante el envío");
          } finally {
            setIsSubmitting(false); // Restablecer el estado cuando se completa
          }
        }}
      >
        {isSubmitting ? "Enviando..." : "Submit"}
      </button>

  {/* El porcentaje ahora se actualiza automáticamente */}
    </div>
  );
}
