"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useCalculatorStore } from "@/lib/store";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";

const COLORS = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b"];

export default function BreakdownCharts() {
  const { results, capitalization } = useCalculatorStore();

  const compositionData = useMemo(() => {
    if (!results) return [];

    return [
      {
        name: "Principal + Aportes",
        value: results.totalInvested,
        color: COLORS[0],
      },
      {
        name: "Juros",
        value: results.totalInterest,
        color: COLORS[1],
      },
    ];
  }, [results]);

  const interestByPeriodData = useMemo(() => {
    if (!results || !results.periods) return [];

    // Sample data - show every N periods for readability
    const periods = results.periods;
    const step = Math.max(1, Math.floor(periods.length / 20));

    return periods
      .filter((_, index) => index % step === 0 || index === periods.length - 1)
      .map((p) => ({
        period: p.period,
        periodLabel: formatPeriodLabel(p.period, capitalization),
        interest: p.interest,
      }));
  }, [results, capitalization]);

  if (!results) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Composição Final
          </h2>
          <div className="h-80 flex items-center justify-center text-gray-500">
            Configure os parâmetros para ver o gráfico
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Juros por Período
          </h2>
          <div className="h-80 flex items-center justify-center text-gray-500">
            Configure os parâmetros para ver o gráfico
          </div>
        </div>
      </div>
    );
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = (
        (data.value / results.futureValueNominal) *
        100
      ).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-800 mb-1">
            {payload[0].payload.periodLabel}
          </p>
          <p className="text-sm text-blue-600">
            Juros: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Composition Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Composição Final
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={compositionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => {
                const percentage = (
                  (entry.value / results.futureValueNominal) *
                  100
                ).toFixed(0);
                return `${entry.name}: ${percentage}%`;
              }}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {compositionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Interest by Period Bar Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Juros por Período
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={interestByPeriodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="periodLabel"
              stroke="#6b7280"
              style={{ fontSize: "11px" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "11px" }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="interest" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

