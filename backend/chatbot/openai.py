from datetime import date
import os
import openai
import json

# Initialize the OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT='''You are an AI financial advisor specializing in algorithmic trading strategies. Below are the backtest results provided by the user:
{BACKTEST_RESULTS}  
These results include metrics like profit/loss, Sharpe ratio, drawdown, win rate, risk-reward ratio, and other key performance indicators.

Your role is to provide short, brief results to the user :

Explain the Results: Provide insights into the backtest metrics, highlighting strengths and weaknesses of the strategy.
Identify Issues: Point out areas where the strategy may be underperforming, such as high drawdowns, low win rates, or overfitting.
Suggest Improvements: Offer actionable suggestions to optimize the strategy, such as adjusting risk management, improving entry/exit criteria, or testing across varying market conditions.
Answer User Questions: Respond to specific queries about what went wrong, what worked well, and hypothetical changes to the strategy.
Maintain Neutrality: Provide unbiased, date-driven insights and avoid making financial guarantees.
Be short, concise, user-friendly, and logical in your explanations. Encourage users to experiment and remind them that past performance doesn’t guarantee future results.'''


class ChatDataStore:
    def __init__(self):
        self.messages = []

    def save_message(self, role, message):
        self.messages.append({"role": role, "content": message})

    def get_all_messages(self):
        return self.messages


chat_store = ChatDataStore()

def chat_completion(message, backtest_results):
    try:
        backtest_results_str = json.dumps(backtest_results, indent=4)
        system_prompt = SYSTEM_PROMPT.replace("{BACKTEST_RESULTS}", backtest_results_str)

        if len(chat_store.get_all_messages()) == 0:
            chat_store.save_message("system",system_prompt)

        chat_store.save_message("user",message)
        messages = chat_store.get_all_messages()
        

        response = openai.chat.completions.create(
            model=os.getenv("MODEL"),
            messages=messages,
            # temperature=0.7,
            # max_tokens=1000
        )

        res = response.choices[0].message.content if response.choices else "No response generated"
        chat_store.save_message("assistant", res)

        return res

    except Exception as error:
        print("Error in chat completion:", error)
        return "No response!!!"
