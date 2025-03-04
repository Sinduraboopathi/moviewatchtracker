import React, { useState } from "react";
import MovieList from "./MovieList"; 
import MovieCardList from "./MovieCardList"; 
import { Button } from "@mui/material";

const MovieWatchTracker = () => {
  const [viewMode, setViewMode] = useState("card"); 

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
      >
        Switch to {viewMode === "card" ? "Table View" : "Card View"}
      </Button>

      {viewMode === "card" ? <MovieCardList /> : <MovieList />}
    </div>
  );
};

export default MovieWatchTracker;
