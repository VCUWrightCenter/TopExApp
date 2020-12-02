//This is a utility function that is used to read in file contents
export function getFileContents(file) {
    console.log('getFileContents', file);
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
    const options = ['svd', 'tfidf','umap','pretrained','local'];
    return getDropdownList(options, dropdownid); 
}

export function getTfidfCorpus(dropdownid) { 
    const options = ['both', 'clustering','expansion'];
    return getDropdownList(options, dropdownid); 
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
