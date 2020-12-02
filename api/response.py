class Response():
    "Return object accepted by the TopEx application."
    def __init__(self, viz_df = None, data = None, linkage_matrix = None, main_cluster_topics = None, count = None, max_thresh=None, thresh = None, msg=None):
        self.viz_df = viz_df
        self.data = data
        self.linkage_matrix = linkage_matrix
        self.main_cluster_topics = main_cluster_topics
        self.count = count
        self.max_thresh = max_thresh
        self.thresh = thresh
        self.msg = ''

    def __iter__(self):
        yield 'viz_df', self.viz_df
        yield 'data', self.data
        yield 'linkage_matrix', self.linkage_matrix
        yield 'main_cluster_topics', self.main_cluster_topics
        yield 'count', self.count
        yield 'max_thresh', self.max_thresh
        yield 'thresh', self.thresh
        yield 'msg', self.msg