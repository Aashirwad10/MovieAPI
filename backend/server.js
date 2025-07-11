import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Movie from "./models/movies.js";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/api/movies", async(req, res) => {
    const movie = req.body;
    if(!movie.name || !movie.rating || !movie.description || !movie.cast || !movie.runtime){
        return res.status(400).json({success: false, message: "Missing required fields"});
    }
    try{
        const newMovie = new Movie(movie);
        await newMovie.save();
        return res.status(201).json({success: true, message: "Movie created successfully", data: newMovie});
    }catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"});    
    }
});

app.delete("/api/movies/:id", async (req, res) => {
    const {id} = req.params;
    try{
        await Movie.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Movie deleted successfully"});
    }catch(error){
        res.status(500).json({success: false, message: "Movie not found"});
    }
});

app.get("/api/movies", async (req, res) => {
    try{
        const movie = await Movie.find({});
        res.status(200).json({sucess: true, data: movie});
    }catch(error){
        res.status(500).json({sucess: false, message: error.message});
    }
});

app.listen(5000, () => {
    connectDB();
    console.log("Server is running on port 5000");
});


