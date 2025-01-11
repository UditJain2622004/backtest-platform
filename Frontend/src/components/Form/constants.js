export const constants = {
  indicators: [
    { id: 'ma', name: 'Moving Average', params: ['period', 'type'] },
    { id: 'rsi', name: 'RSI', params: ['period'] },
    { id: 'macd', name: 'MACD', params: ['fastPeriod', 'slowPeriod', 'signalPeriod'] },
    { id: 'bb', name: 'Bollinger Bands', params: ['period', 'stdDev'] },
    { id: 'ema', name: 'EMA', params: ['period'] },
    { id: 'stoch', name: 'Stochastic', params: ['kPeriod', 'dPeriod', 'smooth'] }
  ],

  comparisonOperators: [
    { value: 'crosses_above', label: 'Crosses Above' },
    { value: 'crosses_below', label: 'Crosses Below' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'equals', label: 'Equals' }
  ],

  arithmeticOperators: [
    { value: '+', label: 'Add (+)' },
    { value: '-', label: 'Subtract (-)' },
    { value: '*', label: 'Multiply (×)' },
    { value: '/', label: 'Divide (÷)' },
  ]
}; 