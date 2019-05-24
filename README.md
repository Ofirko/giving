# giving
A React.js based Social Network for giving away stuff you don't need in Berlin.


## Tech Stack
React.js, Redux, Node.js, PostgreSQL, Express.js, AWS, Google Maps API, HTML and CSS.


## Key Features

  ### Item Location using Google Maps API & GeoLocation API
  
  When uploading an item, the user can add its location and is shown an icremental search based on the Google Maps API's quering feature, showing Berlin addresses first. 
  
  When looking for an item, the user can press a "Sort by Distance" button. 
  The user is then prompted with a request to know his location, built using GeoLocation, 
  and then the item component is re-populated, sorted by distance, with the distance shown to the user.
  
## Additional Features

### Registration & Login

### Profile Pic Uploader & Bio Editor
*using AWS

### Befriending other users & Viewing your friends

### General chat using Socket.io

### Item posting component
Listing the Item's title, category, subcategory, description, picture, in addition to the location incremental search.

### Item viewing component
Viewing all items, filtering by category or by textual quering in addition the the distance feature.

### View posted items by distance
