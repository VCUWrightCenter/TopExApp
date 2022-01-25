//This is a utility function that is used to read in file contents
export function getFileContents(file) {
    return new Promise((resolve, reject) => {
        let contents = ""
        const reader = new FileReader()
        reader.onloadend = function (e) {
            contents = e.target.result
            resolve(contents)
        }
        reader.onerror = function (e) {
            reject(e)
        }
        reader.readAsText(file)
    })
}

export function promptForFileName() {
    let name = null
    while (true) {
        name = prompt("Enter name for export file", "export")
        if (name == null) { //cancel
            return;
        }
        else if (name === "") { //blank name
            alert("Name cannot be empty!")
        }
        else { // Valid name
            break;
        }
    }
    return name;
}

export function exportCommaDelimited(body, filename) {
    let blob = new Blob([body], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportPipeDelimited(body, filename) {
    let blob = new Blob([body], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.tsv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Deterministically generate color for each cluster
export const getClusterColor = (d) => {
    return '#' + ('00000' + (Math.abs(Math.cos(d.cluster)) * (1 << 24) | 0).toString(16)).slice(-6);
}

//This is what is called when you click the 'export as png' button under the graphs
export const exportSVGAsPNG = (id) => {
    let name = promptForFileName();
    require('save-svg-as-png').saveSvgAsPng(document.getElementById(id), name + ".png")
}

function getDropdownList(array, dropdownid) {
    return array.map((m, ix) => {
        return {
            key: m,
            text: m,
            value: m,
            dropdownid: ix === 0 ? dropdownid : null
        }
    })
}

export function getVisualizationMethods(dropdownid) { 
    const options = ['umap', 'svd', 'tsne', 'mds'];
    return getDropdownList(options, dropdownid); 
}

export function getClusteringMethods(dropdownid) { 
    const options = ['hac', 'kmeans'];
    return getDropdownList(options, dropdownid); 
}

export function getDistanceMetric(dropdownid) { 
    const options = ['correlation','cosine','euclidean'];
    return getDropdownList(options, dropdownid); 
}

export function getVectorizationMethod(dropdownid) { 
    const options = ['svd', 'tfidf','umap'];
    return getDropdownList(options, dropdownid); 
}

export function getTfidfCorpus(dropdownid) { 
    const options = ['both', 'clustering','expansion'];
    return getDropdownList(options, dropdownid); 
}

//This is used to get the highest cluster number from a dataframe.
export function getMax(data) {
    return Math.max(...data.map(x => x.cluster))
}

export function createPointObject(data, cluster_topics, i) {
    return {
        cluster: data.cluster[i],
        cluster_topic: cluster_topics[data.cluster[i]],
        doc_name: data.doc_name[i],
        label: data.label[i],
        phrase: data.phrase[i],
        raw_sent: data.text[i],
        x: data.x[i],
        y: data.y[i],
        valid: data.valid[i]
    }
}

//This is used to format the data for the wordcloud graph. 
export function getWordClouds(data) {
    let tokenCounter = {}
    data.forEach(sent => {
        sent.phrase.forEach(token => {
            // Initialize dictionary for cluster
            if (!(sent.cluster in tokenCounter)) {
                tokenCounter[sent.cluster] = {};
            }

            // Initialize dictionary for token within cluster
            if (!(token in tokenCounter[sent.cluster])) {
                tokenCounter[sent.cluster][token] = 1;
            } else {
                tokenCounter[sent.cluster][token] += 1;
            }
        });
    });

    let clusterTokenDict = {}
    for (let cluster in tokenCounter) {
        let tokenCounts = []
        for (let token in tokenCounter[cluster]) {
            if (tokenCounter[cluster][token] !== 1) {
                tokenCounts.push({ 'phrase': token, 'value': tokenCounter[cluster][token], "cluster": cluster })
            }
        }
        clusterTokenDict[cluster] = tokenCounts
    }
    return clusterTokenDict
}

