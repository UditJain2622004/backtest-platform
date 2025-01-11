from flask import Blueprint, request, jsonify
from auth.routes import token_required
from models.backtest import BacktestModel
from backtest.utils import add_technical_indicators, transform_data, fetch_price_history_by_interval
from backtest.backtest import backtest_strategy
from backtest.report_generator import ReportGenerator
from datetime import datetime
from backtest.strategy import Strategy
from backtest.main import Coin
import pandas as pd
import os

backtest_routes = Blueprint('backtest_routes', __name__)
backtest_model = None

def init_routes(db):
    global backtest_model
    backtest_model = BacktestModel(db)

    @backtest_routes.route('/backtest', methods=['POST'])
    # @token_required
    def run_backtest():
        try:
            config = request.get_json()
            print("Hello")

            coins = [config["ticker"]]

            start_date_object = datetime.strptime(config['start_date'], "%Y-%m-%d")
            end_date_object = datetime.strptime(config['end_date'], "%Y-%m-%d")

            start_time = int(start_date_object.timestamp())*1000
            end_time = int(end_date_object.timestamp())*1000

            interval = config['interval']
            coin_objects = []

            for coin in coins:
                df = None
                PAIR = coin.upper()+"USDT"
                if os.path.exists(f'../data/{PAIR}.csv'):
                    df = pd.read_csv(f'../data/{PAIR}.csv')
                    # df = calculate_technical_indicators(df)
                else:
                    prices = fetch_price_history_by_interval(PAIR, interval, start_time, end_time)
                    df = transform_data(prices, PAIR)
                    #save to file
                    # df.to_csv(f'../data/{PAIR}.csv', index=False)

                
                coin_objects.append(Coin(coin, PAIR, df))


            df = add_technical_indicators(df, config['custom_indicators'])

            
            # Run backtest
            strategy = Strategy(config)  # Your strategy initialization
            
            # Run the backtest
            for t in range(len(coin_objects[0].df)):
                for coin in coin_objects:
                    current_data = coin.df.iloc[t]
                    if len(current_data) > 0:
                        backtest_strategy(coin, current_data, strategy)

            # Generate report
            if len(Coin.all_trades) > 0:
                report_generator = ReportGenerator(Coin.all_trades, initial_balance=1)
                report_filename = f"backtest_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                report_path = f"reports/{report_filename}"
                report_generator.save_report(report_path)

                # Store in MongoDB
                backtest_id = backtest_model.create_backtest(
                    user_id="123",
                    # user_id=current_user['_id'],
                    input_params=config,
                    results=report_generator.generate_full_report(),
                    report_id=report_filename
                )

                return jsonify({
                    "status": "success",
                    "backtest_id": backtest_id,
                    "report_url": f"/report/{report_filename}"
                }), 200
            else:
                return jsonify({
                    "status": "error",
                    "message": "No trades generated"
                }), 400

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @backtest_routes.route('/get_result/<backtest_id>', methods=['GET'])
    @token_required
    def get_backtest_result(current_user, backtest_id):
        try:
            result = backtest_model.get_backtest(backtest_id)
            if not result:
                return jsonify({
                    "status": "error",
                    "message": "Backtest not found"
                }), 404

            # Check if user owns this backtest
            if result['user_id'] != current_user['_id']:
                return jsonify({
                    "status": "error",
                    "message": "Unauthorized"
                }), 403

            return jsonify({
                "status": "success",
                "data": result
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    return backtest_routes 