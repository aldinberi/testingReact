module.exports = (router, db, mongojs) => {
	// router.get('/movies', (req, res) =>{
	//     db.movies.find({}, (error, docs)=>{
	//         if(error){
	//             res.status(400).json(`Get failed, reason: ${error.errmsg}`);
	//         }
	//         res.json(docs);
	//     });
	// });

	/**
	 * @swagger
	 * /movies:
	 *   get:
	 *    tags:
	 *    - movies
	 *    name: movies
	 *    summary: Get all movies in system
	 *    produces:
	 *     - application/json
	 *    responses:
	 *     200:
	 *      description: List of all stores in system
	 *     500:
	 *      description: Something is worng with service please contact system
	 *
	 */

	router.get("/movies", (req, res) => {
		db.movies.aggregate(
			[
				{ $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "categoryName" } },
				{ $unwind: "$categoryName" },
				{ $project: { title: 1, year: 1, category: "$categoryName.category" } }
			],
			(error, docs) => {
				if (error) {
					res.status(400).json(`Get failed, reason: ${error.errmsg}`);
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /movies/categories:
	 *   get:
	 *    tags:
	 *    - movies
	 *    name: movies
	 *    summary: Get all categories and number of movies in them
	 *    produces:
	 *     - application/json
	 *    responses:
	 *     200:
	 *      description: List of all categories and number of movies in them
	 *     500:
	 *      description: Something is worng with service please contact system
	 *
	 */

	router.get("/movies/categories", (req, res) => {
		db.movies.aggregate(
			[
				{ $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category_name" } },
				{ $unwind: "$category_name" },
				{ $project: { category: "$category_name.category" } },
				{ $group: { _id: "$category", total_num: { $sum: 1 } } }
			],
			(error, docs) => {
				if (error) {
					res.status(400).json(`Get failed, reason: ${error.errmsg}`);
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /categories:
	 *   get:
	 *    tags:
	 *    - movies
	 *    name: movies
	 *    summary: Get all categories  in them
	 *    produces:
	 *     - application/json
	 *    responses:
	 *     200:
	 *      description: List of all categories and number of movies in them
	 *     500:
	 *      description: Something is worng with service please contact system
	 *
	 */

	router.get("/categories", (req, res) => {
		db.categories.find({}, (error, docs) => {
			if (error) {
				res.status(400).json(`Get failed, reason: ${error.errmsg}`);
			}
			res.json(docs);
		});
	});

	// router.get('/movies/:id', (req, res) =>{
	//     id = req.params.id;
	//     db.movies.findOne({_id: mongojs.ObjectId(id)}, (error, doc) =>{
	//         if(error){
	//             res.status(400).json(`Get failed, reason: ${error.errmsg}`);
	//         }
	//         res.json(doc);
	//     });
	// });

	/**
	 * @swagger
	 * /movies/{id}:
	 *  get:
	 *   tags:
	 *    - movies
	 *   name: getMovieById
	 *   summary: Get a movie form the system by its ID
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
	 *     description: List a single store from the system
	 *    400:
	 *     description: Invalid user request
	 *    401:
	 *     description: Unauthorized access
	 *    500:
	 *     description: Something is wrong with the service. Please contact the system administrator
	 */

	router.get("/movies/:id", (req, res) => {
		id = req.params.id;
		db.movies.aggregate(
			[
				{ $match: { _id: mongojs.ObjectId(id) } },
				{ $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "categoryName" } },
				{ $unwind: "$categoryName" },
				{ $project: { title: 1, year: 1, category: "$categoryName.category" } }
			],
			(error, doc) => {
				if (error) {
					res.status(400).json(`Ger failed, reason : ${error.errmsg}`);
				}
				res.json(doc);
			}
		);
	});
};
