import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
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
