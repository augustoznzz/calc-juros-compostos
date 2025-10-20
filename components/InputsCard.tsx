"use client";

import { useState, useEffect } from "react";
import { useCalculatorStore } from "@/lib/store";
import { monthlyToAnnual, annualToMonthly } from "@/lib/finance";
import { formatNumberWithSeparators, parseNumberWithSeparators, formatPercentage, parsePercentage } from "@/lib/format";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VariableContributions from "./VariableContributions";

export default function InputsCard() {
  const {
    initialInvestment,
    contribution,
    contributionFrequency,
    interestRate,
    interestBase,
    period,
    periodUnit,
    inflationRate,
    targetValue,
    showAdvanced,
    setInitialInvestment,
    setContribution,
    setContributionFrequency,
    setInterestRate,
    setInterestBase,
    setPeriod,
    setPeriodUnit,
    setInflationRate,
    setTargetValue,
    setShowAdvanced,
  } = useCalculatorStore();

  // Local state for interest rate string to allow comma input
  const [interestRateString, setInterestRateString] = useState(formatPercentage(interestRate));

  // Update local state when store value changes
  useEffect(() => {
    setInterestRateString(formatPercentage(interestRate));
  }, [interestRate]);

  // Calculate equivalent rate
  const equivalentRate =
    interestBase === "monthly"
      ? monthlyToAnnual(interestRate)
      : annualToMonthly(interestRate / 100) * 100;

  return (
    <div className="bg-slate-700 rounded-2xl shadow-lg p-4 md:p-6 animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
        Dados
      </h2>

      <div className="space-y-4 md:space-y-6">
        {/* Initial Investment */}
        <div>
          <label
            htmlFor="initial-investment"
            className="block text-sm font-medium text-slate-200 mb-2"
          >
            Investimento Inicial (R$)
          </label>
          <input
            id="initial-investment"
            type="text"
            value={formatNumberWithSeparators(initialInvestment)}
            onChange={(e) => {
              const parsedValue = parseNumberWithSeparators(e.target.value);
              setInitialInvestment(parsedValue || 0);
            }}
            placeholder="0"
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400"
            aria-label="Investimento inicial em reais"
          />
        </div>

        {/* Contribution */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Contribution */}
          <div className="flex-1">
            <label
              htmlFor="contribution"
              className="block text-sm font-medium text-slate-200 mb-2"
            >
              Aporte Recorrente (R$)
            </label>
            <div className="flex gap-2">
              <input
                id="contribution"
                type="text"
                value={formatNumberWithSeparators(contribution)}
                onChange={(e) => {
                  const parsedValue = parseNumberWithSeparators(e.target.value);
                  setContribution(parsedValue || 0);
                }}
                placeholder="0"
                className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400"
                aria-label="Valor do aporte recorrente"
              />
              <select
                value={contributionFrequency}
                onChange={(e) =>
                  setContributionFrequency(
                    e.target.value as "monthly" | "yearly" | "none"
                  )
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none"
                aria-label="Frequência do aporte"
              >
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
                <option value="none">Nenhum</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interest Rate and Period in one row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Interest Rate */}
          <div className="flex-1">
            <label
              htmlFor="interest-rate"
              className="block text-sm font-medium text-slate-200 mb-2"
            >
              Taxa de Juros (%)
            </label>
            <div className="flex gap-2">
              <input
                id="interest-rate"
                type="text"
                value={interestRateString}
                onChange={(e) => {
                  const value = e.target.value;
                  setInterestRateString(value);
                  
                  // Only update store if value is valid
                  if (value === "" || value === ",") {
                    setInterestRate(0);
                  } else {
                    const parsedValue = parsePercentage(value);
                    if (parsedValue !== null) {
                      setInterestRate(parsedValue);
                    }
                  }
                }}
                placeholder="0"
                className="w-28 sm:w-32 md:flex-1 px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400"
                aria-label="Taxa de juros"
              />
              <select
                value={interestBase}
                onChange={(e) =>
                  setInterestBase(e.target.value as "monthly" | "yearly")
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none"
                aria-label="Base da taxa de juros"
              >
                <option value="monthly">a.m.</option>
                <option value="yearly">a.a.</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ≈ {equivalentRate.toFixed(2)}%{" "}
              {interestBase === "monthly" ? "a.a." : "a.m."}
            </p>
          </div>

          {/* Period */}
          <div className="flex-1">
            <label
              htmlFor="period"
              className="block text-sm font-medium text-slate-200 mb-2"
            >
              Período
            </label>
            <div className="flex gap-2">
              <input
                id="period"
                type="number"
                min="1"
                value={period || ''}
                onChange={(e) => setPeriod(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-24 sm:w-28 md:flex-1 px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400"
                aria-label="Duração do período"
              />
              <select
                value={periodUnit}
                onChange={(e) =>
                  setPeriodUnit(e.target.value as "months" | "years")
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none"
                aria-label="Unidade do período"
              >
                <option value="months">Meses</option>
                <option value="years">Anos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-expanded={showAdvanced}
          aria-controls="advanced-options"
        >
          <span className="font-medium text-slate-200">Opções Avançadas</span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              id="advanced-options"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Inflation Rate */}
              <div>
                <label
                  htmlFor="inflation-rate"
                  className="block text-sm font-medium text-slate-200 mb-2"
                >
                  Inflação Anual (%)
                </label>
                <input
                  id="inflation-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={inflationRate || ''}
                  onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400"
                  aria-label="Taxa de inflação anual"
                />
              </div>

              {/* Variable Contributions */}
              <div>
                <VariableContributions />
              </div>

              {/* Target Value */}
              <div>
                <label
                  htmlFor="target-value"
                  className="block text-sm font-medium text-slate-200 mb-2"
                >
                  Meta de Valor Futuro (R$) - Opcional
                </label>
                <input
                  id="target-value"
                  type="text"
                  value={formatNumberWithSeparators(targetValue)}
                  onChange={(e) => {
                    const parsedValue = parseNumberWithSeparators(e.target.value);
                    setTargetValue(parsedValue);
                  }}
                  placeholder="Ex: 100.000"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400"
                  aria-label="Meta de valor futuro"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Calcularemos o tempo necessário para atingir este valor
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

