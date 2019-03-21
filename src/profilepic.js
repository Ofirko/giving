import React from "react";

export default function ProfilePic({ first, last, onClick, image }) {
    console.log("image is:", image);
    if (image === null || image === undefined) {
        image = "/assets/iconmonstr-user-20.svg";
    }
    return (
        <div>
            <img
                id="profpic"
                src={image}
                alt={`${first} ${last}`}
                onClick={onClick}
            />
        </div>
    );
}
