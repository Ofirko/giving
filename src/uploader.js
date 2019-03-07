import React from "react";

export default function Uploader({ onClick }) {
    return (
        <div>
            <div id="bg" onClick={onClick} />
            <div className="modal">
                <h1>Want to change your image? </h1>
            </div>
        </div>
    );
}
