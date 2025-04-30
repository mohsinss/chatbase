'use client';

import React, { useState } from 'react';
import { X, Calculator, DollarSign, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavingsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleDemo: () => void;
}

export default function SavingsCalculator({ isOpen, onClose, onScheduleDemo }: SavingsCalculatorProps) {
  const [agents, setAgents] = useState<number>(10);
  const [ticketsPerDay, setTicketsPerDay] = useState<number>(100);
  const [avgResponseTime, setAvgResponseTime] = useState<number>(10);
  const [avgSalary, setAvgSalary] = useState<number>(45000);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const calculateSavings = () => {
    // Assumptions based on industry averages:
    // - Chatbot can handle 60% of routine queries
    // - Response time reduced by 80%
    // - Agent efficiency increased by 40%
    
    const ticketsPerYear = ticketsPerDay * 260; // 260 working days
    const currentCost = (agents * avgSalary);
    const automatedTickets = ticketsPerYear * 0.6;
    const timesSaved = (automatedTickets * avgResponseTime) / 60; // Convert to hours
    const costPerHour = avgSalary / 2080; // 2080 working hours per year
    const timeSavingsCost = timesSaved * costPerHour;
    
    // Calculate reduced headcount needed while maintaining service quality
    const newAgentsNeeded = Math.ceil(agents * 0.6);
    const staffingSavings = (agents - newAgentsNeeded) * avgSalary;
    
    const totalSavings = staffingSavings + timeSavingsCost;
    const roi = (totalSavings / currentCost) * 100;

    return {
      annualSavings: Math.round(totalSavings),
      roi: Math.round(roi),
      automatedTickets: Math.round(automatedTickets),
      hoursReturned: Math.round(timesSaved)
    };
  };

  const savings = calculateSavings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Calculate Your AI Chatbot Savings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Input Your Numbers</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Support Agents
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={agents}
                    onChange={(e) => setAgents(Number(e.target.value))}
                    className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Average Tickets Per Day
                </label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={ticketsPerDay}
                    onChange={(e) => setTicketsPerDay(Number(e.target.value))}
                    className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Average Response Time (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={avgResponseTime}
                    onChange={(e) => setAvgResponseTime(Number(e.target.value))}
                    className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Average Agent Salary ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                    className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-6">Projected Annual Savings</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600">
                    ${savings.annualSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Estimated Annual Savings</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{savings.roi}%</div>
                    <div className="text-sm text-gray-600">ROI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {savings.automatedTickets.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Tickets Automated/Year</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {savings.hoursReturned.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Hours Saved/Year</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={onScheduleDemo}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  >
                    Schedule Demo to Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-2">Calculation Assumptions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>60% of routine queries can be automated</li>
              <li>Response time reduced by 80% for automated queries</li>
              <li>Agent efficiency increased by 40%</li>
              <li>260 working days per year</li>
              <li>2080 working hours per year per agent</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 