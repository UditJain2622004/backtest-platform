from flask import Flask, send_file, request, render_template_string, jsonify
from flask_cors import CORS
from auth.routes import auth, token_required
from reports.builder import ReportManager, ReportBuilder
from routes.backtest_routes import backtest_routes, init_routes
from auth.models import Database
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize database
db = Database()

# Initialize routes with database
init_routes(db)

# Register blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(backtest_routes, url_prefix='/api')

@app.route('/')
def index():
    reports_dir = ReportBuilder.get_reports_dir()  # Use the shared method
    reports = []
    
    if os.path.exists(reports_dir):
        for filename in os.listdir(reports_dir):
            if filename.endswith('.html'):
                report_id = filename.replace('report_', '').replace('.html', '')
                created_time = datetime.fromtimestamp(
                    os.path.getctime(os.path.join(reports_dir, filename))
                ).strftime('%Y-%m-%d %H:%M:%S')
                
                reports.append({
                    'id': report_id,
                    'created': created_time,
                    'html_url': f'/report/{report_id}?format=html&download=true',
                    'pdf_url': f'/report/{report_id}?format=pdf'
                })
    
    # Simple HTML template to list reports
    template = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Trading Strategy Reports</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .report-list { margin: 20px 0; }
            .report-item { 
                padding: 15px;
                border: 1px solid #ddd;
                margin: 10px 0;
                border-radius: 5px;
            }
            .download-links a {
                display: inline-block;
                padding: 5px 15px;
                background: #2196F3;
                color: white;
                text-decoration: none;
                border-radius: 3px;
                margin-right: 10px;
            }
            .timestamp { color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <h1>Trading Strategy Reports</h1>
        <div class="report-list">
            {% if reports %}
                {% for report in reports %}
                    <div class="report-item">
                        <p class="timestamp">Generated: {{ report.created }}</p>
                        <div class="download-links">
                            <a href="{{ report.html_url }}">Download HTML</a>
                            <a href="{{ report.pdf_url }}">Download PDF</a>
                            <a href="/report/{{ report.id }}" target="_blank">View Online</a>
                        </div>
                    </div>
                {% endfor %}
            {% else %}
                <p>No reports available.</p>
            {% endif %}
        </div>
    </body>
    </html>
    """
    
    return render_template_string(template, reports=reports)

@app.route('/report/<report_id>')
def get_report(report_id):
    format = request.args.get('format', 'html')
    download = request.args.get('download', 'false').lower() == 'true'
    
    report_path = ReportManager.get_report_path(report_id, format)
    
    if os.path.exists(report_path):
        if download or format == 'pdf':
            filename = f'trading_report_{report_id}.{format}'
            return send_file(
                report_path,
                mimetype='application/pdf' if format == 'pdf' else 'text/html',
                as_attachment=True,
                download_name=filename
            )
        else:
            return send_file(report_path)
    
    return f"Report not found at: {report_path}", 404

# User profile route
@app.route('/get_profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user), 200

if __name__ == "__main__":
    app.run(debug=True) 