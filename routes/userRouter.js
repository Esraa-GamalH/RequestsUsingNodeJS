const express = require('express');
const userRouter = express.Router();
const db = require('../service/db');
const { createValidator } = require('express-joi-validation');
const validator = createValidator({ passError: true });
const { taskSchema, updateTaskSchema } = require('../validators');


// GET /todos -> Fetch all to-do items.
userRouter.get('/', async (req, res)=>{
    const results = await db.query('select * from tasks');
    res.send(results);
});


// GET /todos/:id -> Fetch one to-do item with this id.
userRouter.get('/:id', async (req, res, next)=>{
    const {id} = req.params;
    try{
        const IsExist = await db.query(`SELECT id FROM tasks WHERE id = ?`, [id]);
                if (IsExist.length == 0){
                    const error = new Error('Id not Exist');
                    error.status = 400;
                    throw error;
                }
                else{
                    const results = await db.query('select * from tasks where id=?',[id]);
                    res.send(results);
                }
    } catch(error){
        next(error);
    }
});


// POST /todos -> Add a new to-do item. 
userRouter.post('/', validator.body(taskSchema), async(req, res, next)=>{
    try {
        console.log(req.body);
        
        const {id, title, status} = req.body;
        const results = await db.query('INSERT INTO tasks (id, title, status) VALUES (?, ?, ?)', [id, title, status]);

        if(!results?.affectedRows){
            const error = new Error();
            error.status = 501;
            error.message = 'server error';
            throw error;
        } 

        res.send({success: true})
    } catch (error) {
        next(error);
    }
});


// PUT /todos -> Update an existing to-do item.
userRouter.put('/', validator.body(updateTaskSchema) ,async(req, res, next)=>{

    try {
        console.log(req.body);
        const {id, title, status} = req.body;

        if (!id) {
            const error = new Error('Id is required for updating a record');
            error.status = 400;
            throw error;
        }
        else{
            const IsExist = await db.query(`SELECT id FROM tasks WHERE id = ?`, [id]);
            if (IsExist.length == 0){
                const error = new Error('Id not Exist');
                error.status = 400;
                throw error;
            }
            else{
                if (status && !title){
                    console.log("status: ",status);
                    const results = await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
                } 
                else if (title && !status){
                    console.log("id: ",id);
                    const results = await db.query('UPDATE tasks SET title = ? WHERE id = ?', [title, id]);
                }
                else if (status && title){
                    const results = await db.query('UPDATE tasks SET title = ?, status = ? WHERE id = ?', [title, status, id]);
                }
                else{
                    res.send("No Updates Happened");
                }
            }
        }
        res.send({success: true});

    } catch (error) {
        next(error);
    }
});


// DELETE /todos/:id ->  Delete a to-do item.
userRouter.delete('/:id', async(req, res)=>{
    const {id} = req.params;
    const result = await db.query(`DELETE FROM tasks WHERE id = ${id}`);
    res.send("record deleted successfully");
});


module.exports = userRouter;