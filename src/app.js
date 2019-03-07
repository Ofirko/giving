import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uploaderVisible: false };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    showUploader() {
        this.setState({
            uploaderVisible: true
        });
    }
    hideUploader() {
        this.setState({
            uploaderVisible: false
        });
    }

    setImage(image) {
        this.setState({ image, uploaderVisible: false });
    }

    componentDidMount() {
        console.log("mount happens");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("back from the axios:", data);
                this.setState(data);
            })
            .catch(err => {
                console.log("error", err);
            });
    }
    render() {
        if (!this.state.id) {
            return (
                <div>
                    <Logo />
                    <h1> hi </h1>
                </div>
            );
        }
        return (
            <div>
                <Logo />
                <ProfilePic
                    image={this.state.image}
                    first={this.state.first}
                    last={this.state.last}
                    onClick={this.showUploader}
                />
                {this.state.uploaderVisible && (
                    <Uploader onClick={this.hideUploader} />
                )}
            </div>
        );
    }
}
