import uuid
from flask import Blueprint, request, jsonify
from auth.routes import token_required
from agenticAI.insights import generate_insights
# from reports.builder import save_report
from models.backtest import BacktestModel
from backtest.utils import add_technical_indicators, transform_data, fetch_price_history_by_interval
from backtest.backtest import backtest_strategy
from backtest.report_generator import ReportGenerator
from datetime import datetime
from backtest.strategy import Strategy
from backtest.main import Coin
import pandas as pd
import os
import json

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
            print(config)
            print("Hellooooo")
            coins = [config["ticker"]]
            print("Hellooooo")

            start_date_object = datetime.strptime(config['start_date'], "%Y-%m-%d")
            print("Hellooooo")
            end_date_object = datetime.strptime(config['end_date'], "%Y-%m-%d")
            print("Hellooooo")

            start_time = int(start_date_object.timestamp())*1000
            end_time = int(end_date_object.timestamp())*1000
            print("Hellooooo")

            interval = config['interval']
            coin_objects = []
            print("Hellooooo")

            for coin in coins:
                df = None
                PAIR = coin.upper()
                # if os.path.exists(f'../data/{PAIR}.csv'):
                #     df = pd.read_csv(f'../data/{PAIR}.csv')
                #     # df = calculate_technical_indicators(df)
                # else:
                prices = fetch_price_history_by_interval(PAIR, interval, start_time, end_time)
                df = transform_data(prices, PAIR)
                    #save to file
                # df.to_csv(f'../data/{PAIR}.csv', index=False)

                
                coin_objects.append(Coin(coin, PAIR, df))

            print("Hellooooo")
            df = add_technical_indicators(df, config['custom_indicators'])
            print("Hellooooo")

            
            # Run backtest
            strategy = Strategy(config)  # Your strategy initialization
            
            print("Worldssss")
            # Run the backtest
            for t in range(len(coin_objects[0].df)):
                print(t)
                for coin in coin_objects:
                    print(coin.df.iloc[t]["candle_return"])
                    current_data = coin.df.iloc[t]
                    if len(current_data) > 0:
                        backtest_strategy(coin, current_data, strategy)

            print("Worldssss")
            # Generate report
            if len(Coin.all_trades) > 0:
                print("Helloooooooo")
                report_generator = ReportGenerator(Coin.all_trades, initial_balance=1)
                report_filename = f"backtest_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                report_path = f"reports/{report_filename}"
                print("Helloooooooo")
                report = report_generator.generate_full_report()
                report["symbol"] = config["ticker"]
                # save report to file
                with open("test.json", 'w') as f:
                    json.dump(report, f)
                insights = generate_insights(report)
                print("Helloooooooo")

                # generate random id
                report_id = str(uuid.uuid4())
                # report_generator.save_report("reports",report_id,report,insights)
                print("Helloooooooo")

                # report_id = save_report(report_path,report_filename)

                # Store in MongoDB
                backtest_id = backtest_model.create_backtest(
                    user_id="123",
                    # user_id=current_user['_id'],
                    input_params=config,
                    results=report,
                    report_id=report_filename,
                    insights=insights['insights']
                )

                return jsonify({
                    "status": "success",
                    "backtest_id": backtest_id,
                    "report_url": f"/report/{report_filename}",
                    "data":report,
                    "insights":insights
                }), 200
            else:
                return jsonify({
                    "status": "success",
                    "message": "No trades generated"
                }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @backtest_routes.route('/backtest/<backtest_id>', methods=['GET'])
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
            # if result['user_id'] != current_user['_id']:
            #     return jsonify({
            #         "status": "error",
            #         "message": "Unauthorized"
            #     }), 403

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