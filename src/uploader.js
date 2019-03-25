import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.form = {};
        this.handleFileChange = this.handleFileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        // this.onClick = this.onClick.bind(this);
    }
    handleFileChange(e) {
        console.log("file chosen", e);
        this.form.file = e.target.files[0];
    }
    uploadFile(e) {
        let self = this;
        e.preventDefault();
        console.log("upload file running!");
        var formData = new FormData();
        formData.append("file", this.form.file);
        console.log("formData worked");
        axios
            .post("/upload", formData)
            .then(function(resp) {
                console.log(resp);
                console.log("this is the image:", resp.data[0].picurl);
                self.props.setImage(resp.data[0].picurl);
            })
            .catch(err => {
                console.log("axios error", err);
            });
    }
    render() {
        return (
            <div>
                <div id="bg" onClick={this.props.onClick} />
                <div className="modal form">
                    <h1>Want to change your image? </h1>
                    <input
                        type="file"
                        accept="image/*"
                        name="file"
                        id="file"
                        className="inputfile"
                        onChange={this.handleFileChange}
                    />
                    <label for="file">Choose a file</label>
                    <button onClick={this.uploadFile}> Upload! </button>
                </div>
            </div>
        );
    }
}
