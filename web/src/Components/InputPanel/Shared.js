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