import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        // this.form = {};
        // this.handleFileChange = this.handleFileChange.bind(this);
        // this.uploadFile = this.uploadFile.bind(this);
        // this.onClick = this.onClick.bind(this);

        this.state = {
            addBtnVis: !props.bio ? true : undefined,
            editBtnVis: props.bio ? true : undefined,
            editBoxVis: false,
            bio: props.bio ? props.bio : undefined
        };
        this.bioScreen = this.bioScreen.bind(this);
        this.bioEntry = this.bioEntry.bind(this);
        this.sendBio = this.sendBio.bind(this);
    }
    bioScreen() {
        console.log("edit bio");
        this.setState({
            addBtnVis: false,
            editBtnVis: false,
            editBoxVis: true
        });
    }
    bioEntry(e) {
        console.log(this.state);
        console.log(e.target.value);
        this.setState({
            bio: e.target.value
        });
    }

    sendBio() {
        axios
            .post("/postBio", {
                bio: this.state.bio
            })
            .then(({ data }) => {
                console.log("bio updated");
                console.log(data);
                console.log("bio:", this.state.bio);
                this.setState({
                    addBtnVis: undefined,
                    editBtnVis: true,
                    editBoxVis: false,
                    bio: this.state.bio ? this.state.bio : undefined
                });
            });
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
                {this.state.editBtnVis && (
                    <div>
                        <h1> {this.state.bio} </h1>
                        <button id="bioedi" onClick={this.bioScreen}>
                            EDIT
                        </button>
                    </div>
                )}
                {this.state.addBtnVis && (
                    <button id="bioeditor" onClick={this.bioScreen}>
                        {" "}
                        Add your bio now!{" "}
                    </button>
                )}
                {this.state.editBoxVis && (
                    <div>
                        <textarea
                            id="bioput"
                            name="bio"
                            value={this.state.bio}
                            onChange={this.bioEntry}
                        />{" "}
                        <button onClick={this.sendBio}> SAVE </button>
                    </div>
                )}
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
