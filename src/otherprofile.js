import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("id:", this.props.match.params.id);
        console.log("mount happens");
        axios
            .get("/difuser/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log("back from the axios:", data);
                if (data.isCurrent) {
                    this.props.history.push("/");
                }
                this.setState(data);
                console.log(this.state);
                if (this.state.picurl === null) {
                    this.setState({ picurl: "/assets/iconmonstr-user-20.svg" });
                }
                if (this.state.bio === null) {
                    this.setState({
                        bio: "This user haven't added their bio yet."
                    });
                }
            })
            .catch(err => {
                console.log("error", err);
            });
    }

    render() {
        return (
            <div>
                <div className="bigpic">
                    <img id="profpic" src={this.state.picurl} />
                </div>
                <div id="deets">
                    <div id="profname">
                        {this.state.firstname} {this.state.lastname}
                    </div>
                    <p> {this.state.bio} </p>
                </div>
            </div>
        );
    }
}
