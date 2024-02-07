const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasePath = path.join(__dirname, 'cricketTeam.db')

const app = express()

app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    movieId: dbObject.movie_id,
    movieName: dbObject.movie_name,
    directorId: dbObject.director_id,
    leadActor: dbObject.lead_actor,
  }
}

app.get('/movies/', async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      Movie;`
  const moviesArray = await database.all(getMoviesQuery)
  response.send(
    moviesArray.map(eachMovie => convertDbObjectToResponseObject(eachMovie)),
  )
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMoviesQuery = `
    SELECT 
      * 
    FROM 
      movie
    WHERE 
      movie_id = ${movieId};`
  const movie = await database.get(getMoviesQuery)
  response.send(convertDbObjectToResponseObject(movie))
})

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const postMoviesQuery = `
  INSERT INTO
    movie (director_id, movie_name, lead_actor)
  VALUES
    ('${directorId}', ${movieName}, '${leadActor}');`
  const movie = await database.run(postMoviesQuery)
  response.send('Movie Successfully Added')
})

app.put('/movies/:movieId/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const {movieId} = request.params
  const updateMoviesQuery = `
  UPDATE
    Movie
  SET
    director_Id = '${directorId}',
    movie_Name = ${movieName},
    lead_Actor = '${leadActor}'
  WHERE
    movie_id = ${movieId};`

  await database.run(updatePlayerQuery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMoviesQuery = `
  DELETE FROM
    movie
  WHERE
    movie_id = ${movieId};`
  await database.run(deleteMoviesQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      director
          WHERE 
      director_Id = ${directorId};
            director_Name = ${directorName};`

  const moviesArray = await database.all(getMoviesQuery)
  response.send(
    moviesArray.map(eachMovie => convertDbObjectToResponseObject(eachMovie)),
  )
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      director
          WHERE 
      movie_Name = ${movieName}`

  const moviesArray = await database.all(getMoviesQuery)
 response.send(moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
   )
})

module.exports = app;
console.log(app);
