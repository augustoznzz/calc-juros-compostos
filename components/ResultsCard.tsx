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
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h2>
        <p className="text-gray-500 text-center py-8">
          Configure os parâmetros para ver os resultados
        </p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Valor Futuro (Nominal)",
      value: formatCurrency(results.futureValueNominal),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Valor Futuro (Real)",
      value: formatCurrency(results.futureValueReal),
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: "Descontada inflação",
    },
    {
      label: "Total Investido",
      value: formatCurrency(results.totalInvested),
      icon: PiggyBank,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Juros Totais",
      value: formatCurrency(results.totalInterest),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Rentabilidade Líquida",
      value: formatPercent(results.netReturn),
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  <p className="text-sm font-medium text-gray-600">
                    {kpi.label}
                  </p>
                  {kpi.subtitle && (
                    <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                  )}
                </div>
                <div className={`${kpi.bgColor} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </motion.div>
          );
        })}

        {/* Time to Goal (if applicable) */}
        {results.timeToGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: kpis.length * 0.1 }}
            className="bg-emerald-50 rounded-xl p-4 transition-transform hover:scale-105"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Tempo para Meta
                </p>
                <p className="text-xs text-gray-500">
                  Com os aportes atuais
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatDuration(results.timeToGoal.months)}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

