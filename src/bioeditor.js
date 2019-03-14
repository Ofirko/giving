import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        // this.form = {};
        // this.handleFileChange = this.handleFileChange.bind(this);
        // this.uploadFile = this.uploadFile.bind(this);
        // this.onClick = this.onClick.bind(this);
    }
    bioScreen() {
        console.log("edit bio");
    }
    // uploadFile(e) {
    //     let self = this;
    //     e.preventDefault();
    //     console.log("upload file running!");
    //     var formData = new FormData();
    //     formData.append("file", this.form.file);
    //     console.log("formData worked");
    //     axios
    //         .post("/upload", formData)
    //         .then(function(resp) {
    //             console.log(resp);
    //             console.log("this is the image:", resp.data[0].picurl);
    //             self.props.setImage(resp.data[0].picurl);
    //         })
    //         .catch(err => {
    //             console.log("axios error", err);
    //         });
    // }
    render() {
        return (
            <div>
                <button id="bioeditor" onClick={this.bioScreen}>
                    {" "}
                    Add your bio now!{" "}
                </button>
            </div>
        );
    }
}
// <div id="bg" onClick={this.props.onClick} />
// <div className="modal">
//     <h1>Want to change your image? </h1>
//     <input
//         type="file"
//         accept="image/*"
//         name="file"
//         onChange={this.handleFileChange}
//     />
