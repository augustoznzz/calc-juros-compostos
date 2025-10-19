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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Tabela de Evolução
        </h2>
        <p className="text-gray-500 text-center py-8">
          Configure os parâmetros para ver a tabela
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Tabela de Evolução</h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          aria-label="Exportar para CSV"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Período
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Saldo Inicial
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Aporte
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Juros
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Saldo Final
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((period, index) => (
              <tr
                key={period.period}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatPeriodLabel(period.period, capitalization)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {formatCurrency(period.initialBalance)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {formatCurrency(period.contribution)}
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                  {formatCurrency(period.interest)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                  {formatCurrency(period.finalBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
              aria-label="Próxima página"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

