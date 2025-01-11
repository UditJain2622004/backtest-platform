import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  DollarSign,
  Percent,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function UnderstandingMetrics() {
  const metrics = [
    {
      title: "Win Rate",
      icon: <Percent className="w-6 h-6" />,
      description: "Percentage of profitable trades relative to total trades",
      formula: "(Winning Trades / Total Trades) × 100",
      importance: "Indicates strategy's consistency in generating profitable trades",
      example: "A win rate of 60% means 60 out of 100 trades are profitable",
      color: "blue"
    },
    {
      title: "Risk/Reward Ratio",
      icon: <Activity className="w-6 h-6" />,
      description: "Relationship between potential profit and potential loss",
      formula: "Average Win / Average Loss",
      importance: "Helps evaluate if the risk taken is worth the potential reward",
      example: "1:2 ratio means potential profit is twice the risk taken",
      color: "green"
    },
    {
      title: "Maximum Drawdown",
      icon: <ArrowDown className="w-6 h-6" />,
      description: "Largest peak-to-trough decline in account value",
      formula: "((Peak Value - Trough Value) / Peak Value) × 100",
      importance: "Measures worst-case scenario and risk management effectiveness",
      example: "30% drawdown means account dropped 30% from its peak",
      color: "red"
    },
    {
      title: "Sharpe Ratio",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Risk-adjusted return measurement",
      formula: "(Strategy Return - Risk-Free Rate) / Standard Deviation",
      importance: "Evaluates return considering the risk taken",
      example: "Higher ratio indicates better risk-adjusted performance",
      color: "purple"
    }
  ];

  const advancedMetrics = [
    {
      title: "Profit Factor",
      value: "2.5",
      description: "Ratio of gross profit to gross loss",
      trend: "up"
    },
    {
      title: "Average Trade Duration",
      value: "4.2h",
      description: "Mean time trades are held",
      trend: "neutral"
    },
    {
      title: "Recovery Factor",
      value: "3.1",
      description: "Net profit relative to max drawdown",
      trend: "up"
    },
    {
      title: "Expectancy",
      value: "$245",
      description: "Average profit per trade",
      trend: "up"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Understanding Trading Metrics
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master the key performance indicators that help you evaluate and improve your trading strategies
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Metrics Dashboard */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Advanced Performance Metrics
              </h2>
              <p className="text-lg text-gray-600">
                Deeper insights into your trading performance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advancedMetrics.map((metric, index) => (
                <AdvancedMetricCard key={index} {...metric} />
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Tips for Using Metrics Effectively
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Consider multiple metrics together for a complete picture",
                      "Track metrics over different timeframes",
                      "Compare metrics against market benchmarks",
                      "Use metrics to identify areas for improvement"
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function MetricCard({ title, icon, description, formula, importance, example, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
          <p className="text-gray-600">{description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Formula</h4>
          <p className="text-gray-600 font-mono bg-gray-50 p-2 rounded">{formula}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Why It's Important</h4>
          <p className="text-gray-600">{importance}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Example</h4>
          <p className="text-gray-600">{example}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AdvancedMetricCard({ title, value, description, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className={`text-sm ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </motion.div>
  );
} 