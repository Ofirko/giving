import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { Link } from "react-router-dom";
import { fetchItems, filterCategory, addDistance } from "./actions.js";
import IteModal from "./itemodal";
import Categories from "./categories";

class ItemsQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = { chosenItem: false, catocat: false };
        this.itemodal = this.itemodal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.userKeySearch = this.userKeySearch.bind(this);
        this.categorySearch = this.categorySearch.bind(this);
        this.getgeo = this.getgeo.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(fetchItems());
    }
    itemodal(id) {
        this.setState({
            chosenItem: true,
            item_id: id
        });
    }
    hideModal() {
        this.setState({
            chosenItem: false
        });
    }
    categorySearch(e) {
        console.log("should i repop?", this.state.catocat);
        let cat = e.target.value;
        if (this.state.catocat) {
            this.props.dispatch(fetchItems()).then(() => {
                console.log("new search:", cat);
                this.props.dispatch(filterCategory(cat));
            });
        } else {
            this.props.dispatch(filterCategory(e.target.value));
        }
        this.setState({
            catocat: true
        });
    }
    userKeySearch(e) {
        if (e.target.value == "") {
            this.keyword = undefined;
        } else {
            this.keyword = e.target.value;
        }
        this.props.dispatch(fetchItems(this.keyword));
    }

    getgeo() {
        navigator.geolocation.getCurrentPosition(showPosition);
        let self = this;
        let dist = {};
        function showPosition(position) {
            for (var i = 0; i < self.props.items.length; i++) {
                let distance = getDistanceFromLatLonInKm(
                    position.coords.latitude,
                    position.coords.longitude,
                    self.props.items[i].lat,
                    self.props.items[i].lng
                );
                console.log(distance * 1000);
                dist[self.props.items[i].id] = Math.floor(distance * 1000);
            }
            self.props.dispatch(addDistance(dist));

            function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1); // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) *
                        Math.cos(deg2rad(lat2)) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            }
            function deg2rad(deg) {
                return deg * (Math.PI / 180);
            }
        }
        // if (navigator.geolocation) {
        // } else {
        //     NAMEOFELEMENT.innerHTML = "Geolocation is not supported by this browser.";
        // }
        // NAMEOFELEMENT.innerHTML =
        //    "Latitude: " +
        // + "<br>Longitude: " +
    }

    render() {
        const { items } = this.props;
        console.log("items:", items);
        if (!items) {
            return null;
        }
        items.sort((a, b) => a.distance - b.distance);
        return (
            <div id="search">
                <div id="searchbar">
                    <h1> Search for items </h1>
                    <input
                        id="keywords"
                        name="keywords"
                        placeholder="Search by Keywords"
                        onChange={this.userKeySearch}
                    />
                    <Categories onClick={this.categorySearch} />
                    <button onClick={this.getgeo}>Sort by distance</button>
                </div>
                <div id="searchbox">
                    {items.length != 0 &&
                        items.map(item => {
                            return (
                                <div key={item.id}>
                                    <div
                                        className="itembox"
                                        onClick={() => this.itemodal(item.id)}
                                    >
                                        <img
                                            className="itempic"
                                            src={item.itempicurl}
                                        />
                                        <h1> {item.title} </h1>
                                        {item.distance && (
                                            <h2 className="distance">
                                                {item.distance < 1000
                                                    ? item.distance +
                                                      " Meters away"
                                                    : Math.floor(
                                                          item.distance / 100
                                                      ) /
                                                          10 +
                                                      " Kilometers away"}
                                            </h2>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
                {this.state.chosenItem && (
                    <IteModal
                        onClick={this.hideModal}
                        current={this.state.item_id}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state.data);
    return {
        items: state.data
    };
};

export default connect(mapStateToProps)(ItemsQuery);
