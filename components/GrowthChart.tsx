"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCalculatorStore } from "@/lib/store";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";

export default function GrowthChart() {
  const { results, capitalization } = useCalculatorStore();

  const chartData = useMemo(() => {
    if (!results || !results.periods || results.periods.length === 0) {
      return [];
    }

    // Add initial point
    const data = [
      {
        period: 0,
        periodLabel: formatPeriodLabel(0, capitalization),
        totalInvested: results.periods[0]?.initialBalance || 0,
        futureValue: results.periods[0]?.initialBalance || 0,
      },
    ];

    // Add all periods
    results.periods.forEach((p) => {
      data.push({
        period: p.period,
        periodLabel: formatPeriodLabel(p.period, capitalization),
        totalInvested: p.totalInvested,
        futureValue: p.finalBalance,
      });
    });

    return data;
  }, [results, capitalization]);

  if (!results || chartData.length === 0) {
    return (
      <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">
          Evolução do Patrimônio
        </h2>
        <div className="h-80 flex items-center justify-center text-slate-400">
          Configure os parâmetros para ver o gráfico
        </div>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { periodLabel: string };
    }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-600 border border-slate-500 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-white mb-2">
            {payload[0].payload.periodLabel}
          </p>
          <p className="text-sm text-blue-400">
            Valor Futuro: {formatCurrency(payload[1]?.value || 0)}
          </p>
          <p className="text-sm text-purple-400">
            Total Investido: {formatCurrency(payload[0]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-white mb-4">
        Evolução do Patrimônio
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="periodLabel"
            stroke="#cbd5e1"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#cbd5e1"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "14px", color: "#cbd5e1" }} />
          <Line
            type="monotone"
            dataKey="totalInvested"
            stroke="#a855f7"
            strokeWidth={2}
            name="Total Investido"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="futureValue"
            stroke="#60a5fa"
            strokeWidth={3}
            name="Valor Futuro"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

