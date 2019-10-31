import React, { Component } from "react";
import './Left_Sidebar.css'
import Axios from "axios";

class Left_Sidebar extends Component {
    render() {
        return (
            <div className='sidebar'>
                hello this is the left sidebar
                <form encType="multipart/form-data">
                    <input type="file" multiple name="file"  onChange={(e) => this.handleChange(e.target.files)} />
                </form>
            </div>

        );
    }

    handleChange(files) {
        console.log(files)
        let formData = new FormData()

        for(var i =0; i  < files.length; i++){
            formData.append("File" + i, files[i])
        }
        console.log(formData)


        console.table(files);
        var fr = new FileReader();
        fr.readAsText(files[0]);
        fr.onloadend = () => { console.log(fr.result) }


        var cors = "http://127.0.0.1:8080/"
        var url = "http://127.0.0.1:5000/test"

        Axios.post(cors + url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log('done')
            })


        //fr.readAsDataURL(file);
    }
}


export default Left_Sidebar