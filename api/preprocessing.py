import os
import spacy
from pandas import DataFrame
import internal
from scispacy.abbreviation import AbbreviationDetector
from scispacy.linking import EntityLinker

# nlp = spacy.load('en_core_web_sm', disable=["parser","ner"])
nlp = spacy.load('en_core_sci_sm', disable=["parser"])
nlp.add_pipe("sentencizer") # Add sentence break parser
nlp.add_pipe("scispacy_linker", config={"resolve_abbreviations": True, "linker_name": "mesh"})
linker = nlp.get_pipe("scispacy_linker")

def token_filter(token, stopwords:list, custom_stopwords_only:bool=False):
    "Filters out stopwords and tokens without alpha characters"
    include_token = any(map(token.shape_.__contains__, ['X','x'])) and token.lemma_ not in stopwords \
        and token.text.lower() not in stopwords

    if not custom_stopwords_only and include_token:
        include_token = not token.is_stop

    return include_token

def normalize_entity(entity):
    name = ''
    if len(entity._.kb_ents) > 0 and entity._.kb_ents[0][1] > .8:
        cui = entity._.kb_ents[0][0]
        linked = linker.kb.cui_to_entity[cui]
        name = linked.canonical_name
    else:
        name = entity.lemma_
    return name.lower()

def preprocess_docs(doc_df:DataFrame, save_results:bool=False, file_name:str=None, stop_words_file:str=None,
                stop_words_list:list=None, custom_stopwords_only:bool=False, ner:bool=False):
    """
    Imports and pre-processes the documents from the `raw_docs` dataframe
    Document pre-processing is handled in [`tokenize_and_stem`](/topex/preprocessing#tokenize_and_stem).
    `path_to_file_list` is a path to a text file containing a list of files to be processed separated by line breaks.
    Returns (DataFrame, DataFrame)
    """
    # 1) Get Stopwords
    stopwords = get_stop_words(stop_words_file=stop_words_file,stop_words_list=stop_words_list)

    # 2) Process docs with spaCy
    texts = list(doc_df.text)
    docs = list(nlp.pipe(texts))

    # 3) Create DataFrame of documents
    # Remove stopwords and any token without alpha characters
    doc_df['tokens'] = [[token.lemma_.lower() for token in doc if token_filter(token,stopwords,custom_stopwords_only)] for doc in docs]

    # 4) Create DataFrame of sentences
    rows = []
    corpus_tokens = []
    for doc_id, doc in enumerate(docs):
        doc_tokens = []
        for sent_id, sent in enumerate(doc.sents):
            uid = f"doc.{doc_id}.sent.{sent_id}"
            if ner==True:
                # Perform NER instead of tokenization
                sent_tokens = [normalize_entity(e) for e in sent.ents]
                lemmas = sent_tokens
                tags = ['NOUN' for t in sent_tokens]
            else:
                # Remove stopwords and any token without alpha characters
                sent_tokens = list([token for token in sent if token_filter(token,stopwords,custom_stopwords_only=False)])
                lemmas = [t.lemma_.lower() for t in sent_tokens]
                tags = [t.pos_ for t in sent_tokens]
            rows.append((uid,doc_id,sent_id,sent.text,lemmas,tags))
            doc_tokens = doc_tokens + sent_tokens
        corpus_tokens.append(doc_tokens)
    data = DataFrame(rows, columns=['id','doc_id','sent_id','text','tokens','pos_tags'])

    # Optionally save the results to disk
    if save_results:
        internal.sentences_to_disk(data, file_name)

    return data, doc_df

def get_stop_words(stop_words_file:str=None, stop_words_list:list=None):
    "Gets a list of all custom stop words"
   # Load custom stop words from file if given
    custom_stop_words = set()
    if stop_words_file is not None:
        if os.path.isfile(stop_words_file):
            with open(stop_words_file, encoding="utf-8") as file:
                custom_stop_words |= set(file.read().strip().split('\n'))

    if stop_words_list is not None:
        custom_stop_words |= set(stop_words_list)

    return list(set([w.lower() for w in custom_stop_words]))