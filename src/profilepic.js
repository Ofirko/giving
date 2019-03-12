import React from "react";

export default function ProfilePic({
    first,
    last,
    onClick,
    image = "/assets/iconmonstr-user-20.svg"
}) {
    return (
        <div>
            <img
                id="profpic"
                src={image}
                alt="${first} ${last}"
                onClick={onClick}
            />
            <h1>here</h1>
        </div>
    );
}

// <label htmlfor="file">Browse</label>
// <input type="file" id="file" onChange={e => {
// const fd = new FormData;
// fs.append('file', e.target.files[0])
// }}>
//IN THE DB QUERY - IM UPDATING AN EXISTING ROW IN USERS INSTEAD OF INSERTING INTO IMAGES
