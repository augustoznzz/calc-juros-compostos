"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useCalculatorStore } from "@/lib/store";
import InputsCard from "@/components/InputsCard";
import ResultsCard from "@/components/ResultsCard";
import EvolutionTable from "@/components/EvolutionTable";
import { RefreshCw } from "lucide-react";

// Dynamically import charts to avoid SSR issues
const BreakdownCharts = dynamic(
  () => import("@/components/BreakdownCharts"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[450px] flex items-center justify-center">
        <p className="text-gray-500">Carregando gráficos...</p>
      </div>
    ),
  }
);

export default function Home() {
  const { reset, calculate } = useCalculatorStore();

  // Calculate on mount
  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleReset = () => {
    if (
      window.confirm(
        "Tem certeza que deseja reiniciar? Todos os dados serão perdidos."
      )
    ) {
      reset();
    }
  };

  return (
    <main className="min-h-screen bg-slate-800">
      {/* Header */}
      <header className="bg-slate-700 shadow-lg border-b border-slate-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Calculadora de Juros Compostos
              </h1>
              <p className="text-slate-300 mt-1 text-sm md:text-base">
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              aria-label="Reiniciar calculadora"
              title="Alt+R"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Inputs and Results Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-5">
              <InputsCard />
            </div>
            <div className="xl:col-span-7">
              <ResultsCard />
            </div>
          </div>

          {/* Breakdown Charts */}
          <BreakdownCharts />

          {/* Evolution Table */}
          <EvolutionTable />
        </div>
      </div>
    </main>
  );
}

