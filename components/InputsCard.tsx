"use client";

import { useCalculatorStore } from "@/lib/store";
import { monthlyToAnnual, annualToMonthly } from "@/lib/finance";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputsCard() {
  const {
    initialInvestment,
    contribution,
    contributionFrequency,
    interestRate,
    interestBase,
    period,
    periodUnit,
    capitalization,
    inflationRate,
    adminFeeRate,
    targetValue,
    showAdvanced,
    setInitialInvestment,
    setContribution,
    setContributionFrequency,
    setInterestRate,
    setInterestBase,
    setPeriod,
    setPeriodUnit,
    setCapitalization,
    setInflationRate,
    setAdminFeeRate,
    setTargetValue,
    setShowAdvanced,
  } = useCalculatorStore();

  // Calculate equivalent rate
  const equivalentRate =
    interestBase === "monthly"
      ? monthlyToAnnual(interestRate)
      : annualToMonthly(interestRate / 100) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dados de Entrada
      </h2>

      <div className="space-y-6">
        {/* Initial Investment */}
        <div>
          <label
            htmlFor="initial-investment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Investimento Inicial (R$)
          </label>
          <input
            id="initial-investment"
            type="number"
            min="0"
            step="100"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
            aria-label="Investimento inicial em reais"
          />
        </div>

        {/* Contribution */}
        <div>
          <label
            htmlFor="contribution"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Aporte Recorrente (R$)
          </label>
          <div className="flex gap-2">
            <input
              id="contribution"
              type="number"
              min="0"
              step="50"
              value={contribution}
              onChange={(e) => setContribution(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
              aria-label="Valor do aporte recorrente"
            />
            <select
              value={contributionFrequency}
              onChange={(e) =>
                setContributionFrequency(
                  e.target.value as "monthly" | "yearly" | "none"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
              aria-label="Frequência do aporte"
            >
              <option value="monthly">Mensal</option>
              <option value="yearly">Anual</option>
              <option value="none">Nenhum</option>
            </select>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label
            htmlFor="interest-rate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Taxa de Juros (%)
          </label>
          <div className="flex gap-2">
            <input
              id="interest-rate"
              type="number"
              min="0"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
              aria-label="Taxa de juros"
            />
            <select
              value={interestBase}
              onChange={(e) =>
                setInterestBase(e.target.value as "monthly" | "yearly")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
              aria-label="Base da taxa de juros"
            >
              <option value="monthly">a.m.</option>
              <option value="yearly">a.a.</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ≈ {equivalentRate.toFixed(2)}%{" "}
            {interestBase === "monthly" ? "a.a." : "a.m."}
          </p>
        </div>

        {/* Period */}
        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Período
          </label>
          <div className="flex gap-2">
            <input
              id="period"
              type="number"
              min="1"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
              aria-label="Duração do período"
            />
            <select
              value={periodUnit}
              onChange={(e) =>
                setPeriodUnit(e.target.value as "months" | "years")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
              aria-label="Unidade do período"
            >
              <option value="months">Meses</option>
              <option value="years">Anos</option>
            </select>
          </div>
        </div>

        {/* Capitalization */}
        <div>
          <label
            htmlFor="capitalization"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Capitalização
          </label>
          <select
            id="capitalization"
            value={capitalization}
            onChange={(e) =>
              setCapitalization(e.target.value as "monthly" | "yearly")
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
            aria-label="Frequência de capitalização"
          >
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          aria-expanded={showAdvanced}
          aria-controls="advanced-options"
        >
          <span className="font-medium text-gray-700">Opções Avançadas</span>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
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
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Inflação Anual (%)
                </label>
                <input
                  id="inflation-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
                  aria-label="Taxa de inflação anual"
                />
              </div>

              {/* Admin Fee Rate */}
              <div>
                <label
                  htmlFor="admin-fee"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Taxa de Administração Anual (%)
                </label>
                <input
                  id="admin-fee"
                  type="number"
                  min="0"
                  step="0.1"
                  value={adminFeeRate}
                  onChange={(e) => setAdminFeeRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
                  aria-label="Taxa de administração anual"
                />
              </div>

              {/* Target Value */}
              <div>
                <label
                  htmlFor="target-value"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Meta de Valor Futuro (R$) - Opcional
                </label>
                <input
                  id="target-value"
                  type="number"
                  min="0"
                  step="1000"
                  value={targetValue || ""}
                  onChange={(e) =>
                    setTargetValue(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="Ex: 100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all focus-visible:outline-none"
                  aria-label="Meta de valor futuro"
                />
                <p className="text-xs text-gray-500 mt-1">
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

