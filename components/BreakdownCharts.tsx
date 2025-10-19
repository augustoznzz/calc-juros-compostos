"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { useCalculatorStore } from "@/lib/store";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";

const COLORS = ["#a855f7", "#60a5fa", "#34d399", "#fbbf24"];

export default function BreakdownCharts() {
  const { results, capitalization } = useCalculatorStore();
  const [patrimonioView, setPatrimonioView] = useState<"monthly" | "yearly">("monthly");

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

    // Calculate average interest
    const totalInterest = periods.reduce((sum, p) => sum + p.interest, 0);
    const averageInterest = totalInterest / periods.length;

    return periods
      .filter((_, index) => index % step === 0 || index === periods.length - 1)
      .map((p) => ({
        period: p.period,
        periodLabel: formatPeriodLabel(p.period, capitalization),
        interest: p.interest,
        averageInterest: averageInterest,
      }));
  }, [results, capitalization]);

  const patrimonioEvolutionData = useMemo(() => {
    if (!results || !results.periods || results.periods.length === 0) return [];

    const periods = results.periods;
    
    if (patrimonioView === "monthly") {
      // Show all months (or sample if too many)
      const step = Math.max(1, Math.floor(periods.length / 24));
      return periods
        .filter((_, index) => index % step === 0 || index === periods.length - 1)
        .map((p) => ({
          period: p.period,
          periodLabel: formatPeriodLabel(p.period, capitalization),
          balance: p.finalBalance,
          invested: p.totalInvested,
        }));
    } else {
      // Group by year (every 12 periods for monthly capitalization)
      const periodsPerYear = capitalization === "monthly" ? 12 : 1;
      const yearlyData = [];
      
      for (let i = 0; i < periods.length; i += periodsPerYear) {
        const period = periods[i];
        if (period) {
          yearlyData.push({
            period: Math.floor(period.period / periodsPerYear) + 1,
            periodLabel: `Ano ${Math.floor(period.period / periodsPerYear) + 1}`,
            balance: period.finalBalance,
            invested: period.totalInvested,
          });
        }
      }
      
      // Add last period if not already included
      const lastPeriod = periods[periods.length - 1];
      if (lastPeriod && (periods.length - 1) % periodsPerYear !== 0) {
        yearlyData.push({
          period: Math.ceil(lastPeriod.period / periodsPerYear),
          periodLabel: `Ano ${Math.ceil(lastPeriod.period / periodsPerYear)}`,
          balance: lastPeriod.finalBalance,
          invested: lastPeriod.totalInvested,
        });
      }
      
      return yearlyData;
    }
  }, [results, capitalization, patrimonioView]);

  if (!results) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              Composição Final
            </h2>
            <div className="h-80 flex items-center justify-center text-slate-400">
              Configure os parâmetros para ver o gráfico
            </div>
          </div>
          <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              Juros por Período
            </h2>
            <div className="h-80 flex items-center justify-center text-slate-400">
              Configure os parâmetros para ver o gráfico
            </div>
          </div>
        </div>
        <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">
            Evolução do Patrimônio
          </h2>
          <div className="h-80 flex items-center justify-center text-slate-400">
            Configure os parâmetros para ver o gráfico
          </div>
        </div>
      </div>
    );
  }

  const CustomPieTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { name: string; value: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = (
        (data.value / results.futureValueNominal) *
        100
      ).toFixed(1);
      return (
        <div className="bg-slate-600 border border-slate-500 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-sm text-slate-300">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { periodLabel: string; averageInterest: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-600 border border-slate-500 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-white mb-1">
            {payload[0].payload.periodLabel}
          </p>
          <p className="text-sm text-blue-400">
            Juros: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-purple-400 mt-1">
            Média: {formatCurrency(payload[0].payload.averageInterest)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPatrimonioTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { periodLabel: string; balance: number; invested: number };
      dataKey: string;
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-600 border border-slate-500 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-white mb-1">
            {data.periodLabel}
          </p>
          <p className="text-sm text-green-400">
            Patrimônio: {formatCurrency(data.balance)}
          </p>
          <p className="text-sm text-purple-400">
            Investido: {formatCurrency(data.invested)}
          </p>
          <p className="text-sm text-blue-400">
            Juros: {formatCurrency(data.balance - data.invested)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* First Row: Composition and Interest Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Composition Pie Chart */}
        <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">
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
              <Legend wrapperStyle={{ fontSize: "14px", color: "#cbd5e1" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Interest by Period Bar Chart */}
        <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">
            Juros por Período
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={interestByPeriodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="periodLabel"
                stroke="#cbd5e1"
                style={{ fontSize: "11px" }}
              />
              <YAxis
                stroke="#cbd5e1"
                style={{ fontSize: "11px" }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px", color: "#cbd5e1" }} />
              <Bar dataKey="interest" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Juros" />
              <Line 
                type="monotone" 
                dataKey="averageInterest" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={{ fill: "#a855f7", r: 3 }}
                name="Média de Juros"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row: Patrimônio Evolution Chart - Full Width */}
      <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white">
            Evolução do Patrimônio
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPatrimonioView("monthly")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                patrimonioView === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-600 text-slate-300 hover:bg-slate-500"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPatrimonioView("yearly")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                patrimonioView === "yearly"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-600 text-slate-300 hover:bg-slate-500"
              }`}
            >
              Anual
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={patrimonioEvolutionData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="periodLabel"
              stroke="#cbd5e1"
              style={{ fontSize: "11px" }}
            />
            <YAxis
              stroke="#cbd5e1"
              style={{ fontSize: "11px" }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomPatrimonioTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px", color: "#cbd5e1" }} />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#a855f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInvested)"
              name="Total Investido"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#34d399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBalance)"
              name="Patrimônio Total"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

