pip freeze | xargs pip uninstall -y
pip install Flask Flask-Cors gensim gunicorn matplotlib numpy==1.21.0 openpyxl pandas plotly pymed scipy scispacy sklearn spacy textblob umap-learn
pip freeze > requirements.txt
