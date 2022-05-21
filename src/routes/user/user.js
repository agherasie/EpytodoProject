const {deleteUser, getUserById, updateUser} = require("./user.query");
const {getTodoByUserId} = require("../todos/todos.query")
const {userExists} = require("../../middleware/notFound")
const auth = require("../../middleware/auth");

async function user(app) {
    app.get('/user', auth, userExists, async (req, res) => {
        const user = await getUserById(req.id);
        res.status(200).json(user)
    });

    app.get('/user/todos', auth, userExists, async (req, res) => {
        const todo = await getTodoByUserId(req.id);
        if (todo.length > 0) {
            res.status(200).json(todo)
        } else {
            res.status(202).json({success: "The user exists but doesn't have any tasks yet"})
        }
    });

    app.put('/users/:id', userExists, auth, async (req, res) => {
        const id = req.params.id;
        const name = req.body.name
        const mail = req.body.email
        const firstname = req.body.firstname
        const password = req.body.password
        try {
            await updateUser(name, mail, firstname, password, id)
            const user = await getUserById(id)
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json({error: "Internal server error"})
        }
    });

    app.get('/users/:id', userExists, auth, async (req, res) => {
        const id = req.params.id;
        try {
            const user = await getUserById(id);
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json({error: "Internal server error"})
        }
    });

    app.delete('/users/:id', userExists, auth, async (req, res) => {
        const id = req.params.id;
        try {
            await deleteUser(id)
            res.status(200).json({success: "Successfully deleted record number: ${id}"})
        } catch (e) {
            res.status(500).json({error: "Internal server error"})
        }
    });
}

module.exports = user