import React from "react";

export default function Categories({ onClick }) {
    return (
        <div id="categories">
            <select name="itemtype" form="postitem" onChange={onClick}>
                <option value="" disabled selected hidden>
                    All Categories
                </option>
                <optgroup label="Household Appliances">
                    <option value="Fridges">Fridges</option>
                    <option value="Ovens">Ovens</option>
                    <option value="Coffee Machines">Coffee Machines</option>
                </optgroup>
                <optgroup label="Electronics">
                    <option value="TVs">TVs</option>
                    <option value="Tablets & Readers">Tablets & Readers</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Computers">Computers</option>
                    <option value="Gaming Consoles">Gaming Consoles</option>
                </optgroup>
                <optgroup label="Furniture">
                    <option value="Closets">Closets</option>
                    <option value="Sofas">Sofas</option>
                    <option value="Beds & Mattresses">Beds & Mattresses</option>
                    <option value="Washers & Dryers">Washers & Dryers</option>
                </optgroup>
                <optgroup label="House & Garden">
                    <option value="Plants">Plants</option>
                    <option value="Artwork">Artwork</option>
                    <option value="Kitchen Utensils">Kitchen Utensils</option>
                </optgroup>
                <optgroup label="Clothing">
                    <option value="Mens">Mens</option>
                    <option value="Womens">Womens</option>
                    <option value="Childrens">Childrens</option>
                    <option value="Non-Gendered">Non-Gendered</option>
                </optgroup>
                <optgroup label="Misc">
                    <option value="Bikes">Bikes</option>
                </optgroup>
            </select>
        </div>
    );
}
