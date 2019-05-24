import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Categories from "./categories";

export default class PostItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.form = {};
        this.userEntry = this.userEntry.bind(this);
        this.submit = this.submit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.gmapsincrem = this.gmapsincrem.bind(this);
    }

    userEntry(e) {
        this[e.target.name] = e.target.value;
    }
    handleFileChange(e) {
        console.log("file chosen", e);
        console.log("this:", this);
        this.form.file = e.target.files[0];
    }
    submit(e) {
        e.preventDefault();
        console.log("upload file running!", this.form);
        var formData = new FormData();
        formData.append("file", this.form.file);
        console.log("formData worked,", formData);
        console.log("chosen location:", this.location);
        for (var i = 0; i < this.state.incremental.length; i++) {
            console.log(this.state.incremental[i].name);
            if (this.state.incremental[i].name == this.location) {
                this.id = this.state.incremental[i].id;
            }
        }
        console.log("chosen location:", this.id);
        let self = this;
        axios
            .post("/itempic", formData)
            .then(function(resp) {
                console.log(resp);
                console.log("this is the image:", resp.data);
                console.log("this is the place id:", self.id);
                axios
                    .post("/postitem", {
                        item: self.item,
                        description: self.description,
                        itemtype: self.itemtype,
                        image: resp.data,
                        location: self.location,
                        locid: self.id
                    })
                    .then(data => {
                        console.log(data);
                    })
                    .catch(data => {
                        console.log("err:", data);
                    });
            })
            .catch(err => {
                console.log("axios error", err);
            });
    }
    gmapsincrem(e) {
        let self = this;
        axios
            .get("/gglmps/" + e.target.value)
            .then(result => {
                console.log("success:", result.data);
                self.setState({
                    incremental: result.data
                });
            })
            .catch(err => console.log("err:", err));
        this[e.target.name] = e.target.value;
    }
    render() {
        return (
            <div className="welcomponent">
                <div className="form">
                    {this.state.error && <div className="error"> Oops! </div>}
                    <h1> Give a new Item! </h1>
                    <form id="postitem">
                        <input
                            name="item"
                            placeholder="Item name"
                            onChange={this.userEntry}
                        />
                        <textarea
                            name="description"
                            placeholder="Item description"
                            onChange={this.userEntry}
                        />
                        <Categories onClick={this.userEntry} />
                        <input
                            type="file"
                            accept="image/*"
                            name="file"
                            id="file"
                            className="inputfile"
                            onChange={this.handleFileChange}
                        />
                        <label for="file">Add an image</label>
                        <input
                            list="results"
                            name="location"
                            placeholder="Pick up location"
                            onChange={this.gmapsincrem}
                        />
                        <datalist id="results">
                            {this.state.incremental &&
                                this.state.incremental.map(res => {
                                    return (
                                        <div
                                            id="friendbox"
                                            key={res.place_id + res.name}
                                        >
                                            <option
                                                value={res.name}
                                                id={res.place_id}
                                            />
                                        </div>
                                    );
                                })}
                        </datalist>
                    </form>
                    <button id="subutton" onClick={this.submit}>
                        Post Item!
                    </button>
                </div>{" "}
            </div>
        );
    }
}
