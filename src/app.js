import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import ChatMessages from "./chatmessages";

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
        axios
            .get("/user")
            .then(({ data }) => {
                this.setState(data);
            })
            .catch(err => {
                console.log("error", err);
            });
    }
    render() {
        // if (!this.state.id) {
        //     return (
        //         <div>
        //             <Logo />
        //             <h1> 403 </h1>
        //         </div>
        //     );
        // }
        return (
            <div>
                <div id="header">
                    <Logo />
                    <ProfilePic
                        first={this.state.firstname}
                        last={this.state.lastname}
                        onClick={this.showUploader}
                        image={this.state.picurl}
                    />
                </div>
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    bio={this.state.bio}
                                    image={this.state.picurl}
                                    first={this.state.firstname}
                                    last={this.state.lastname}
                                    onClick={this.showUploader}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={ChatMessages} />
                    </div>
                </BrowserRouter>
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

//ProfilePic - alt syntax doesn't work

//Since the bio text is coming from outside itself, the BioEditor component will also need to be passed a function
// that it can call and pass the new bio text when a new bio has been saved.
// This function would be much like the one that Uploader had to be passed so that it could cause the state of App
//  to be updated with the new image url when a new image was uploaded.

//It will still be possible for requests for pages to make it to the server.
// For example, the server will receive a request if a user navigates by typing a url into the browser's location bar
//rather than by clicking a link. For this reason, it is necessary to have a catch-all ('*') route that serves index.html.
//When index.html loads, React Router will determine and automatically render the correct component(s) based on the url.
