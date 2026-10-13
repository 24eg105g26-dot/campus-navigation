const express = require("express");
const cors = require("cors");

const locations = require("./data/locations");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Campus Navigation API is running"
    });
});

// Get all campus locations
app.get("/api/locations", (req, res) => {
    res.json(locations);
});

// Get one location by ID
app.get("/api/locations/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const location = locations.find(place => place.id === id);

    if (!location) {
        return res.status(404).json({
            message: "Location not found"
        });
    }

    res.json(location);
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});