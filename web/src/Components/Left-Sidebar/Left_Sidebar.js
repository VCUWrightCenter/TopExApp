import React, { Component } from "react";
import './Left_Sidebar.css'
import Axios from "axios";



class Left_Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = { fileList: "" };
    }

    sendGraphData = (graphData) => {
        this.props.graphData(graphData)
    }


    render() {
        return (
            <div className='sidebar'>
                hello this is the left sidebar
                <div className='fileList'>
                    file list:
                    {this.state.fileList}
                </div>
                <div className='file-input'>
                    <form encType="multipart/form-data">
                        <input type="file" webkitdirectory="" mozdirectory="" multiple name="file" onChange={(e) => this.handleChange(e.target.files)} />
                    </form>
                </div>
            </div>
        );
    }

    //This method takes in the form data, sends it to the api, 
    //and then sends it to the parent element (App) so that
    //it can be passed to the Main component.
    //It must be async so that it does not pass data to App before
    //the data is returned
    async handleChange(files) {
        //console.log(files)
        let formData = new FormData()


        for (var i = 0; i < files.length; i++) {
            formData.append("File" + i, files[i])
        }

        //console.table(files);
        var fr = new FileReader();
        fr.readAsText(files[0]);
        fr.onloadend = () => { console.log(fr.result) }

        let fileList = []
        for (var file in files) {
            fileList.push(files[file].name)
        }
        this.updateFileList(fileList)


        var response = await this.runScript(formData)

        this.sendGraphData(response)

    }

    //Responsible for sending the POST request which runs the script
    async runScript(formData) {
        var cors = "http://127.0.0.1:8080/"
        var url = "http://127.0.0.1:5000/runScript"

        const response = await Axios.post(cors + url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const data = response.data

        return await data
    }

    updateFileList(fileData) {
        this.setState({
            fileList: fileData.toString()
        }, () => { console.log("state changed" + fileData) }
        )
    }
}


export default Left_Sidebar