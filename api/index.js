const express = require("express");
const mongojs = require("mongojs");
const body_parser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("./config");
const port = 3001;
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const app = express();

const db = mongojs(config.MONGODB_URL);

app.use(body_parser.json());

app.use(cors());

const swaggerDefinition = {
	info: {
		title: "Movies Swagger API documentation",
		version: "1.0.0"
	},
	host: config.SWAGGER_HOST,
	basePath: "/",
	securityDefinitions: {
		bearerAuth: {
			type: "apiKey",
			name: "Authorization",
			scheme: "bearer",
			in: "header"
		}
	}
};

const options = {
	swaggerDefinition,
	apis: ["./index.js", "./routes/*.js", "./models/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

app.get("/swagger.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let admin_router = express.Router();
require("./routes/admin.js")(admin_router, db, mongojs, jwt, config);
app.use("/admin", admin_router);

let public_router = express.Router();
require("./routes/public.js")(public_router, db, mongojs);
app.use(public_router);

/**
 * @swagger
 * /login:
 *  post:
 *   tags:
 *    - login
 *   name: login
 *   summary: Login to the system
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: body
 *      description: Login object
 *      required: true
 *      schema:
 *       $ref: "#/definitions/Login"
 *   responses:
 *    200:
 *     description: Successful login
 *    400:
 *     description: Invalid user request
 *    500:
 *     description: Something is wrong with the service. Please contact the system administrator
 */

app.post("/login", (req, res) => {
	console.log(req.body);
	db.users.findOne(req.body, { username: 1, userType: 1 }, (error, doc) => {
		if (error) {
			res.status(400).json({ message: `Can not login, reason: ${error.errmsg}` });
		}
		if (doc) {
			let jwtToken = jwt.sign(
				{
					...doc,
					exp: Math.floor(Date.now() / 1000) + 3600
				},
				config.JWT_SECRET
			);
			res.json(jwtToken);
		} else {
			res.status(400).json({ message: `Can not login, invalid information` });
		}
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
