import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import Uploader from "./uploader";
import Profile from "./profile";

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
        this.setState({ picurl: image, uploaderVisible: false });
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
        console.log("state:", this.state);
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
                <div id="header">
                    <Logo />
                    <ProfilePic
                        image={this.state.picurl}
                        first={this.state.firstname}
                        last={this.state.lastname}
                        onClick={this.showUploader}
                    />
                </div>
                <Profile
                    bio={this.state.bio}
                    image={this.state.picurl}
                    first={this.state.firstname}
                    last={this.state.lastname}
                    onClick={this.showUploader}
                />
                {this.state.uploaderVisible && (
                    <Uploader
                        onClick={this.hideUploader}
                        setImage={this.setImage}
                    />
                )}
            </div>
        );
    }
}
