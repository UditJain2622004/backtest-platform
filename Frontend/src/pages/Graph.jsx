import React, { useState } from 'react';
import { WinLossRatio } from '../components/Graph/WinLossRatio';
import { MonthlyReturns } from '../components/Graph/MonthlyReturns';
import { MonthlyWinRate } from '../components/Graph/MonthlyWinRate';
import { DurationProfitScatter } from '../components/Graph/DurationProfitScatter';
import { StreakMetrics } from '../components/Graph/StreakMetrics';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Download, TrendingUp, LineChart, Brain, BarChart3, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import data from '../data.json';

export function Graph() {
  const { basic_metrics, time_metrics, trade_analysis, streak_metrics } = data;
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'monthly', name: 'Monthly Analysis', icon: '📅' },
    { id: 'detailed', name: 'Detailed Analysis', icon: '📈' },
    { id: 'ai_insight', name: 'AI Insight', icon: <Brain className="w-5 h-5 text-purple-500" /> },
    { id: 'download', name: 'Download Report', icon: <Download className="w-5 h-5 text-blue-500" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WinLossRatio
              winningTrades={basic_metrics.winning_trades}
              losingTrades={basic_metrics.losing_trades}
            />
            <StreakMetrics
              streakMetrics={streak_metrics}
            />
          </div>
        );
      case 'monthly':
        const monthlyMetrics = time_metrics?.monthly_metrics || {};
        const avgMonthlyReturn = monthlyMetrics.avg_monthly_return || 0;
        const bestMonth = monthlyMetrics.best_month || { return: 0, month: 'N/A' };
        const worstMonth = monthlyMetrics.worst_month || { return: 0, month: 'N/A' };
        const profitableMonths = monthlyMetrics.profitable_months || 0;

        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-medium">Monthly Performance</h3>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {avgMonthlyReturn}%
                  </div>
                  <div className="text-sm text-gray-500">Average Monthly Return</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <ArrowUpCircle className="w-5 h-5" />
                  <h3 className="font-medium">Best Month</h3>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {bestMonth.return}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {bestMonth.month}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <ArrowDownCircle className="w-5 h-5" />
                  <h3 className="font-medium">Worst Month</h3>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {worstMonth.return}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {worstMonth.month}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-medium">Profitable Months</h3>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {profitableMonths}%
                  </div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MonthlyReturns
                  monthlyMetrics={monthlyMetrics}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <MonthlyWinRate
                  monthlyMetrics={monthlyMetrics}
                />
              </motion.div>
            </div>
          </div>
        );
      case 'detailed':
        return (
          <div className="grid grid-cols-1 gap-6">
            <DurationProfitScatter
              tradeDetails={trade_analysis.trade_details}
            />
          </div>
        );
      case 'ai_insight':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">AI Strategy Analysis</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-gray-700">AI-powered analysis of your trading strategy will appear here...</p>
              </div>
            </div>
          </div>
        );
      case 'download':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Download className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Download Options</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200 text-left">
                <h4 className="font-medium text-blue-700 mb-1">PDF Report</h4>
                <p className="text-sm text-gray-600">Download complete analysis as PDF</p>
              </button>
              <button className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-200 text-left">
                <h4 className="font-medium text-green-700 mb-1">Excel Export</h4>
                <p className="text-sm text-gray-600">Export data to Excel spreadsheet</p>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trading Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive analysis of your trading strategy
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
              Last updated: {new Date(data.report_generated).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <nav className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeSection === section.id
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }
              `}
            >
              <span className="mr-2">{section.icon}</span>
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">Total Return</div>
            <div className={`text-2xl font-bold ${basic_metrics.total_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {basic_metrics.total_return}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {basic_metrics.win_rate}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">Largest Win</div>
            <div className="text-2xl font-bold text-green-600">
              {basic_metrics.largest_win}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-sm font-medium text-gray-500 mb-1">Largest Loss</div>
            <div className="text-2xl font-bold text-red-600">
              {basic_metrics.largest_loss}%
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        {renderContent()}
      </motion.div>
    </div>
  );
} 