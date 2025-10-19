"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useCalculatorStore } from "@/lib/store";
import InputsCard from "@/components/InputsCard";
import ResultsCard from "@/components/ResultsCard";
import EvolutionTable from "@/components/EvolutionTable";
import { RefreshCw, Github } from "lucide-react";

// Dynamically import charts to avoid SSR issues
const GrowthChart = dynamic(() => import("@/components/GrowthChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[500px] flex items-center justify-center">
      <p className="text-gray-500">Carregando gráfico...</p>
    </div>
  ),
});

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
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Calculadora de Juros Compostos
              </h1>
              <p className="text-gray-600 mt-1">
                Simule seus investimentos e visualize a evolução do patrimônio
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
              aria-label="Reiniciar calculadora"
              title="Alt+R"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Inputs and Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InputsCard />
            </div>
            <div className="lg:col-span-1">
              <ResultsCard />
            </div>
          </div>

          {/* Growth Chart */}
          <GrowthChart />

          {/* Breakdown Charts */}
          <BreakdownCharts />

          {/* Evolution Table */}
          <EvolutionTable />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                <strong>Aviso:</strong> Esta calculadora tem caráter
                educacional. Os resultados são estimativas e não constituem
                recomendação de investimento.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Versão 1.0.0 • Next.js 14 + TypeScript + Tailwind CSS
              </p>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Ver repositório no GitHub"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

