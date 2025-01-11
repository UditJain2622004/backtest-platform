import pandas as pd
import requests
import time

def calculate_sma(data, period):
    """Calculate Simple Moving Average"""
    return data.rolling(window=period).mean()

def calculate_tr(data):
    """Calculate True Range"""
    high = data['High']
    low = data['Low']
    close = data['Close'].shift(1)
    
    tr1 = high - low
    tr2 = abs(high - close)
    tr3 = abs(low - close)
    
    tr = pd.DataFrame([tr1, tr2, tr3]).max()
    return tr

def calculate_atr(data, period=14):
    """Calculate Average True Range"""
    tr = calculate_tr(data)
    return tr.rolling(window=period).mean()

def calculate_rsi(data, period=14):
    """Calculate Relative Strength Index"""
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(data, fast=12, slow=26, signal=9):
    """Calculate MACD and Signal Line"""
    exp1 = data.ewm(span=fast, adjust=False).mean()
    exp2 = data.ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    return macd, signal_line

def calculate_roc(data, period=10):
    """Calculate Rate of Change"""
    return ((data - data.shift(period)) / data.shift(period)) * 100

def calculate_candle_return(data):
    """Calculate single candle return percentage"""
    return (data['Close'] - data['Open']) / data['Open'] * 100

def add_technical_indicators(df, indicators):
    """
    Add specified technical indicators to dataframe
    
    Parameters:
    df: pandas DataFrame with OHLCV data
    indicators: list of indicator names to calculate
    
    Returns:
    df: DataFrame with added indicators
    """
    indicator_functions = {
        'sma_20': lambda x: calculate_sma(x['Close'], 20),
        'sma_50': lambda x: calculate_sma(x['Close'], 50),
        'sma_200': lambda x: calculate_sma(x['Close'], 200),
        'volume_sma_5': lambda x: calculate_sma(x['Volume'], 5),
        'volume_ma_20': lambda x: calculate_sma(x['Volume'], 20),
        'volume_sma_50': lambda x: calculate_sma(x['Volume'], 50),
        'tr': calculate_tr,
        'atr': lambda x: calculate_atr(x, 14),
        'rsi': lambda x: calculate_rsi(x['Close'], 14),
        'candle_return': calculate_candle_return
    }
    
    # Special handling for MACD since it returns multiple values
    if 'macd' in indicators or 'signal' in indicators:
        macd_line, signal_line = calculate_macd(df['Close'])
        df['macd'] = macd_line
        df['signal'] = signal_line
        
        # Remove from indicators list since already handled
        indicators = [i for i in indicators if i not in ['macd', 'signal']]
    
    # Calculate other indicators
    for indicator in indicators:
        if indicator in indicator_functions:
            df[indicator] = indicator_functions[indicator](df)
    
    return df

# Update the existing calculate_technical_indicators function
def calculate_technical_indicators(df):
    """Calculate all available technical indicators"""
    all_indicators = [
        'sma_20', 'sma_50', 'sma_200',
        'volume_sma_5', 'volume_ma_20', 'volume_sma_50',
        'tr', 'atr', 'rsi', 'macd', 'signal',
        'roc', 'candle_return'
    ]
    
    return add_technical_indicators(df, all_indicators) 


def transform_data(prices, PAIR):
    print(f"Retrieved {len(prices)} candles.")
    
    # Convert to DataFrame for easier processing
    df = pd.DataFrame(prices, columns=[
        "Open time", "Open", "High", "Low", "Close", "Volume",
        "Close time", "Quote asset volume", "Number of trades",
        "Taker buy base asset volume", "Taker buy quote asset volume", "Ignore"
    ])
    
    # Convert numeric columns
    numeric_columns = ["Open", "High", "Low", "Close", "Volume", 
                      "Quote asset volume", "Number of trades",
                      "Taker buy base asset volume", "Taker buy quote asset volume"]
    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Convert timestamps
    df["Open time"] = pd.to_datetime(df["Open time"], unit="ms")
    df["Close time"] = pd.to_datetime(df["Close time"], unit="ms")
    

    
    return df


def fetch_price_history_by_limit(symbol, BASE_URL, interval="1m", limit=180):
    """Fetch historical price data for a given symbol."""
    endpoint = f"{BASE_URL}/api/v3/klines"
    params = {
        "symbol": symbol,
        "interval": interval,
        "limit": limit
    }
    response = requests.get(endpoint, params=params)
    response.raise_for_status()
    return response.json()

def fetch_price_history_by_interval(symbol, interval, start_time, end_time=None):
    """Fetch large historical data using pagination."""
    url = "https://api.binance.com/api/v3/klines"
    all_klines = []

    while True:
        params = {
            "symbol": symbol,
            "interval": interval,
            "startTime": start_time,
            "limit": 1000,  # Maximum per request
        }
        if end_time:
            params["endTime"] = end_time

        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            break  # No more data to fetch
        
        all_klines.extend(data)
        start_time = data[-1][6] + 1  # Start time for next request

        # Break if we've reached the end_time
        if end_time and start_time >= end_time:
            break

        time.sleep(0.1)  # Prevent hitting rate limits

    return all_klines