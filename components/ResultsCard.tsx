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

  return (
    <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6 animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Resultados</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${kpi.bgColor} rounded-xl p-4 transition-transform hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-300">
                    {kpi.label}
                  </p>
                  {kpi.subtitle && (
                    <p className="text-xs text-slate-400">{kpi.subtitle}</p>
                  )}
                </div>
                <div className={`${kpi.bgColor} rounded-lg p-2`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <p className={`text-lg md:text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </motion.div>
          );
        })}

        {/* Time to Goal (if applicable) */}
        {results.timeToGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: kpis.length * 0.1 }}
            className="bg-emerald-900/30 rounded-xl p-4 transition-transform hover:scale-105"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-300">
                  Tempo para Meta
                </p>
                <p className="text-xs text-slate-400">
                  Com os aportes atuais
                </p>
              </div>
              <div className="bg-emerald-900/30 rounded-lg p-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="text-lg md:text-xl font-bold text-emerald-400">
              {formatDuration(results.timeToGoal.months)}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

