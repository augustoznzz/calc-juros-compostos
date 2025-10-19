"use client";

import { useCalculatorStore } from "@/lib/store";
import { formatCurrency, formatPercent, formatDuration } from "@/lib/format";
import {
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsCard() {
  const { results } = useCalculatorStore();

  if (!results) {
    return (
      <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6 animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Resultados</h2>
        <p className="text-slate-400 text-center py-8">
          Configure os parâmetros para ver os resultados
        </p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Valor Futuro",
      value: formatCurrency(results.futureValueNominal),
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-900/30",
    },
    {
      label: "Valor Futuro",
      value: formatCurrency(results.futureValueReal),
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30",
      subtitle: "Descontada inflação",
    },
    {
      label: "Total Investido",
      value: formatCurrency(results.totalInvested),
      icon: PiggyBank,
      color: "text-purple-400",
      bgColor: "bg-purple-900/30",
    },
    {
      label: "Juros Totais",
      value: formatCurrency(results.totalInterest),
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-900/30",
    },
    {
      label: "Rentabilidade",
      value: formatPercent(results.netReturn),
      icon: Target,
      color: "text-indigo-400",
      bgColor: "bg-indigo-900/30",
    },
  ];

  // Separate KPIs into two rows
  const firstRowKpis = kpis.slice(0, 3); // Valor Futuro, Valor Futuro Descontada inflação, Total Investido
  const secondRowKpis = kpis.slice(3); // Juros Totais, Rentabilidade

  return (
    <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6 animate-fade-in min-h-[400px] flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Resultados</h2>

      <div className="flex flex-col gap-6 flex-1">
        {/* First Row: Valor Futuro, Valor Futuro Descontada inflação, Total Investido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {firstRowKpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${kpi.bgColor} rounded-xl p-4 md:p-6 transition-transform hover:scale-105 flex flex-col justify-between h-full`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-medium text-slate-300">
                      {kpi.label}
                    </p>
                    {kpi.subtitle && (
                      <p className="text-xs md:text-sm text-slate-400">{kpi.subtitle}</p>
                    )}
                  </div>
                  <div className={`${kpi.bgColor} rounded-lg p-2`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${kpi.color}`} />
                  </div>
                </div>
                <p className={`text-xl font-bold ${kpi.color} break-words`}>
                  {kpi.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Second Row: Juros Totais, Rentabilidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondRowKpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 3) * 0.1 }}
                className={`${kpi.bgColor} rounded-xl p-4 md:p-6 transition-transform hover:scale-105 flex flex-col justify-between h-full`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-medium text-slate-300">
                      {kpi.label}
                    </p>
                    {kpi.subtitle && (
                      <p className="text-xs md:text-sm text-slate-400">{kpi.subtitle}</p>
                    )}
                  </div>
                  <div className={`${kpi.bgColor} rounded-lg p-2`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${kpi.color}`} />
                  </div>
                </div>
                <p className={`text-xl font-bold ${kpi.color} break-words`}>
                  {kpi.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Time to Goal (if applicable) - Full width at bottom */}
        {results.timeToGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: kpis.length * 0.1 }}
            className="bg-emerald-900/30 rounded-xl p-4 md:p-6 transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm md:text-base font-medium text-slate-300">
                  Tempo para Meta
                </p>
                <p className="text-xs md:text-sm text-slate-400">
                  Com os aportes atuais
                </p>
              </div>
              <div className="bg-emerald-900/30 rounded-lg p-2 mr-4">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-emerald-400">
                {formatDuration(results.timeToGoal.months)}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

