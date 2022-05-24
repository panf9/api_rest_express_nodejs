const express = require('express')
const Joi = require('joi')

const app = express()

// Hacemos uso de un MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

let usuarios = [
    {id:1, nombre:'Frank'},
    {id:2, nombre:'José'},
    {id:3, nombre:'Luis'}
]

app.get('/api/usuarios', (req, res)=>{
    res.send(usuarios)
})


app.get('/api/usuario/:id', (req, res)=>{
    let usuario = encontrarUsuario(req.params.id)

    if(!usuario) res.status(404).send('El cliente no existe')
    res.send(usuario.nombre)
})

app.post('/api/usuario', (req, res)=>{
    // // Validación de datos
    // if(!req.body.nombre || req.body.nombre.length <= 2){
    //     // 400 es un Bad request
    //     res.status(400).send("Debe ingresar un nombre mínimo de 3 letras...")
    //     return
    // }

    const {error, value} = validarUsario(req.body.nombre)
    
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario)
        res.send(usuario)
    }
    else{
        res.status(400).send(error.details[0].message)
    }
    
})


app.put('/api/usuario/:id', (req, res)=>{
    // Encontrar el usuario a modificar
    let usuario = encontrarUsuario(req.params.id)

    if(!usuario){
        res.status(400).send("Usuario no encontrado")
        return
    } 

    const {error, value} = validarUsario(req.body.nombre)
    
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }
    usuario.nombre = value.nombre;
    res.send(usuario)
})

app.delete('/api/usuario/:id', (req, res)=>{
    let usuario = encontrarUsuario(req.params.id)

    if(!usuario){
        res.status(400).send("Usuario no encontrado")
        return
    }
    let index = usuarios.indexOf(usuario)
    usuarios.splice(index,1)

    res.send(usuario)


})



const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Servidor escuchando en el puerto ${port}`)
})

// Funciones comunes
function encontrarUsuario(id){
    return(usuarios.find(u => u.id === parseInt(id)))
}

function validarUsario(nombre) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
    })

    return schema.validate({ nombre: nombre });
}