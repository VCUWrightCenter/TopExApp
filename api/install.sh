pip freeze | xargs pip uninstall -y
pip install Flask Flask-Cors gensim gunicorn matplotlib plotly pymed scipy sklearn spacy textblob umap-learn
pip freeze > requirements.txt
python -m spacy download en_core_web_sm
