module.exports = (router, db, mongojs, jwt, config) => {
	// router.use((req, res, next)=>{
	//     let authorization = req.get('Authorization');
	//     if(authorization){
	//         jwt.verify(authorization, config.JWT_SECRET, (error, decoded)=>{
	//             if(error){
	//                 res.status(401).send({message:"Unauthorized access: " + error.message});
	//             }else{
	//                 let userType = decoded.userType;
	//                 if(userType == 'admin'){
	//                     next();
	//                 }else{
	//                     res.status(401).json({message: "Unauthorized access: Not valid user"});
	//                 }
	//             }
	//         });
	//     }else{
	//         res.status(401).json("Unauthorized aceess");
	//     }
	// });
	/**
	 * @swagger
	 * /admin/movies:
	 *  post:
	 *   tags:
	 *    - movies
	 *   name: addMovies
	 *   summary: Add a new movie to the system
	 *   security:
	 *    - bearerAuth: []
	 *   consumes:
	 *    - application/json
	 *   parameters:
	 *    - in: body
	 *      name: body
	 *      description: Movie object
	 *      required: true
	 *      schema:
	 *       $ref: "#/definitions/Movie"
	 *   responses:
	 *    200:
	 *     description: Insert a single movie in the system
	 *    400:
	 *     description: Invalid user request
	 *    401:
	 *     description: Unauthorized access
	 *    500:
	 *     description: Something is wrong with the service. Please contact the system administrator
	 */

	router.post("/movies", (req, res) => {
		db.movies.insert(
			{ category: mongojs.ObjectId(req.body.category), title: req.body.title, year: req.body.year },
			(error, docs) => {
				if (error) {
					res.status(400).json(`Post failed, reason: ${error.errmsg}`);
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /admin/movies/{id}:
	 *  put:
	 *   tags:
	 *    - movies
	 *   name: updateMovies
	 *   summary: Update a movie in system
	 *   security:
	 *    - bearerAuth: []
	 *   consumes:
	 *    - application/json
	 *   parameters:
	 *    - name: id
	 *      in: path
	 *      description: ID of the movie
	 *      required: true
	 *      type: string
	 *      default: '5ddafd87f4b0066950a9b60f'
	 *    - in: body
	 *      name: body
	 *      description: Movie object
	 *      required: true
	 *      schema:
	 *       $ref: "#/definitions/Movie"
	 *   responses:
	 *    200:
	 *     description: Return the movie updated from the system
	 *    400:
	 *     description: Invalid user request
	 *    401:
	 *     description: Unauthorized access
	 *    500:
	 *     description: Something is wrong with the service. Please contact the system administrator
	 */

	router.put("/movies/:id", (req, res) => {
		id = req.params.id;
		db.movies.findAndModify(
			{
				query: { _id: mongojs.ObjectId(id) },
				update: { $set: { category: mongojs.ObjectId(req.body.category), title: req.body.title, year: req.body.year } },
				new: true
			},
			(error, doc) => {
				if (error) {
					res.status(400).json(`Update failed, reason: ${error.errmsg}`);
				}
				res.json(doc);
			}
		);
	});

	/**
	 * @swagger
	 * /admin/movies/{id}:
	 *  delete:
	 *   tags:
	 *    - movies
	 *   name: deleteMovieById
	 *   summary: Delete a movie form the system by its ID
	 *   security:
	 *    - bearerAuth: []
	 *   produces:
	 *    - application/json
	 *   parameters:
	 *    - name: id
	 *      in: path
	 *      description: ID of the movie
	 *      required: true
	 *      type: string
	 *      default: '5ddafd87f4b0066950a9b60f'
	 *   responses:
	 *    200:
	 *     description: Returns the deleted movie from the system
	 *    400:
	 *     description: Invalid user request
	 *    401:
	 *     description: Unauthorized access
	 *    500:
	 *     description: Something is wrong with the service. Please contact the system administrator
	 */

	router.delete("/movies/:id", (req, res) => {
		id = req.params.id;
		db.movies.remove({ _id: mongojs.ObjectId(id) }, [true], (error, doc) => {
			if (error) {
				res.status(400).json(`Delete failed, reason: ${error.errmsg}`);
			}
			res.json(doc);
		});
	});
};
