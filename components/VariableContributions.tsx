"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/lib/store";
import { formatNumberWithSeparators, parseNumberWithSeparators } from "@/lib/format";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VariableContribution } from "@/lib/finance";

export default function VariableContributions() {
  const { variableContributions, addVariableContribution, removeVariableContribution, updateVariableContribution } = useCalculatorStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    amount: 0,
    startPeriod: "",
    endPeriod: "",
    periodType: "months" as "months" | "years",
  });

  const handleSave = () => {
    if (formData.amount && formData.startPeriod && formData.endPeriod) {
      const amount = formData.amount;
      const startPeriod = Number(formData.startPeriod);
      const endPeriod = Number(formData.endPeriod);

      if (amount > 0 && startPeriod > 0 && endPeriod >= startPeriod) {
        if (editingId) {
          // Update existing contribution
          updateVariableContribution(editingId, {
            amount,
            startPeriod,
            endPeriod,
            periodType: formData.periodType,
          });
        } else {
          // Add new contribution
          addVariableContribution({
            amount,
            startPeriod,
            endPeriod,
            periodType: formData.periodType,
          });
        }
        
        // Reset form
        setFormData({
          amount: 0,
          startPeriod: "",
          endPeriod: "",
          periodType: "months",
        });
        setIsAdding(false);
        setEditingId(null);
      }
    }
  };

  const handleEdit = (contribution: VariableContribution) => {
    setFormData({
      amount: contribution.amount,
      startPeriod: contribution.startPeriod.toString(),
      endPeriod: contribution.endPeriod.toString(),
      periodType: contribution.periodType,
    });
    setEditingId(contribution.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData({
      amount: 0,
      startPeriod: "",
      endPeriod: "",
      periodType: "months",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">
          Aportes Personalizados
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-600 rounded-lg p-4 space-y-3">
              {/* Title */}
              <h4 className="text-sm font-semibold text-white border-b border-slate-500 pb-2">
                {editingId ? "Editar Aporte" : "Novo Aporte"}
              </h4>
              
              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  value={formatNumberWithSeparators(formData.amount)}
                  onChange={(e) => {
                    const parsedValue = parseNumberWithSeparators(e.target.value);
                    setFormData({ ...formData, amount: parsedValue || 0 });
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400 text-sm"
                />
              </div>

              {/* Period Type */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tipo de Período
                </label>
                <select
                  value={formData.periodType}
                  onChange={(e) => setFormData({ ...formData, periodType: e.target.value as "months" | "years" })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none text-sm"
                >
                  <option value="months">Meses</option>
                  <option value="years">Anos</option>
                </select>
              </div>

              {/* Start and End Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Do {formData.periodType === "months" ? "Mês" : "Ano"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.startPeriod}
                    onChange={(e) => setFormData({ ...formData, startPeriod: e.target.value })}
                    placeholder="1"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Até o {formData.periodType === "months" ? "Mês" : "Ano"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.endPeriod}
                    onChange={(e) => setFormData({ ...formData, endPeriod: e.target.value })}
                    placeholder="12"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible:outline-none placeholder-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-500 hover:bg-slate-400 text-white rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editingId ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List of Variable Contributions */}
      {variableContributions.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {variableContributions.map((contribution) => (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-600 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    R$ {formatNumberWithSeparators(contribution.amount)}
                  </p>
                  <p className="text-xs text-slate-300">
                    {contribution.periodType === "months" ? "Meses" : "Anos"} {contribution.startPeriod} a {contribution.endPeriod}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(contribution)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                    aria-label="Editar aporte"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeVariableContribution(contribution.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Remover aporte"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {variableContributions.length === 0 && !isAdding && (
        <p className="text-xs text-slate-400 text-center py-4">
          Nenhum aporte personalizado configurado
        </p>
      )}
    </div>
  );
}

