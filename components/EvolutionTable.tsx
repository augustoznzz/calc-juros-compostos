"use client";

import { useState, useMemo } from "react";
import { useCalculatorStore } from "@/lib/store";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const ROWS_PER_PAGE = 12;

export default function EvolutionTable() {
  const { results, capitalization } = useCalculatorStore();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    if (!results?.periods) return 0;
    return Math.ceil(results.periods.length / ROWS_PER_PAGE);
  }, [results]);

  const paginatedData = useMemo(() => {
    if (!results?.periods) return [];
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return results.periods.slice(start, end);
  }, [results, currentPage]);

  const exportCSV = () => {
    if (!results?.periods) return;

    const headers = [
      "Período",
      "Saldo Inicial",
      "Aporte",
      "Juros",
      "Saldo Final",
    ];

    const rows = results.periods.map((p) => [
      formatPeriodLabel(p.period, capitalization),
      p.initialBalance.toFixed(2),
      p.contribution.toFixed(2),
      p.interest.toFixed(2),
      p.finalBalance.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "evolucao-patrimonio.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!results || !results.periods || results.periods.length === 0) {
    return (
      <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">
          Tabela de Evolução
        </h2>
        <p className="text-slate-400 text-center py-8">
          Configure os parâmetros para ver a tabela
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <h2 className="text-lg md:text-xl font-bold text-white">Tabela de Evolução</h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 text-sm"
          aria-label="Exportar para CSV"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-600 border-b border-slate-500">
              <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-slate-200">
                Período
              </th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-semibold text-slate-200">
                Saldo Inicial
              </th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-semibold text-slate-200">
                Aporte
              </th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-semibold text-slate-200">
                Juros
              </th>
              <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-semibold text-slate-200">
                Saldo Final
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((period, index) => (
              <tr
                key={period.period}
                className={`border-b border-slate-600 hover:bg-slate-600 transition-colors ${
                  index % 2 === 0 ? "bg-slate-700" : "bg-slate-800"
                }`}
              >
                <td className="px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium text-white">
                  {formatPeriodLabel(period.period, capitalization)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-slate-300 text-right">
                  {formatCurrency(period.initialBalance)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-slate-300 text-right">
                  {formatCurrency(period.contribution)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-green-400 text-right font-medium">
                  {formatCurrency(period.interest)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-white text-right font-semibold">
                  {formatCurrency(period.finalBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 md:mt-6 pt-4 border-t border-slate-600 gap-4">
          <p className="text-sm text-slate-300">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              aria-label="Próxima página"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

