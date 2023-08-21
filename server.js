const express = require('express');
const path = require('path')
const savedjson = require('./db/db.json')
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//SET INDEX
app.get('/',(req,res)=>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/notes',(req,res)=>
res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('/api/notes', (req,res)=>
 res.sendFile(path.join(__dirname, '/db/db.json'))
)
//POST

app.post('/api/notes',(req,res)=>{
    console.log(`${req.method} request received`)

    const note = { 
        title: req.body.title, 
        text: req.body.text,
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedData = JSON.parse(data);
          note.id = parsedData.length + 1
          console.log(note.id)
          parsedData.push(note);
          console.log(parsedData)
          fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) =>{
            err ? console.error(err) : console.info(`\nData written`)
            res.json(note)
          }
          
          )
        }
    });


})


app.delete('/api/notes/:note',(req,res)=>{
    const id = req.params.note;

    fs.readFile('./db/db.json','utf8', (err, data) => {
        if (err){
            console.log(err)
        }else{
            const parseit = JSON.parse(data);
            const deleted = parseit.filter(some => some.id != id)
            fs.writeFile('./db/db.json', JSON.stringify(deleted), (err) =>{
                err ? console.error(err) : console.info(`\nData written`)
                res.json(id)
            })
        }
    })
})


app.listen(PORT,()=>
    console.log(`App listening at http://localhost:${PORT}`)
)