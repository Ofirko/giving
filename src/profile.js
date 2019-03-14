import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({
    bio,
    first,
    last,
    onClick,
    image = "/assets/iconmonstr-user-20.svg"
}) {
    return (
        <div>
            <div className="bigpic">
                <ProfilePic
                    image={image}
                    first={first}
                    last={last}
                    onClick={onClick}
                />
            </div>
            <div id="profname">
                {first} {last}
            </div>
            <BioEditor bio={bio} />
        </div>
    );
}
