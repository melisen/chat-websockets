//backend
const express = require('express');
const handlebars = require('express-handlebars');
const {Server: HTTPServer} = require("http")
const {Server: IOServer} = require("socket.io")

const app = express();
const httpServer = new HTTPServer(app)
const io = new IOServer(httpServer)

const Contenedor = require('./clase.js');
const arrayProductos = new Contenedor('./productos.txt');
const Mensajes = new Contenedor('./mensajes.txt')

app.use(express.static('views'))

//*HANDLEBARS
// views
app.set('views', './views/')

//view engine

 const hbs = handlebars.engine({
   extname: "hbs",
   layoutsDir: "./views/layouts/",
 });
 app.engine("hbs", hbs);

 app.set("view engine", "hbs")

 //middlewares
 app.use(express.urlencoded({extended: true}))
 app.use(express.json())






//' FRONTEND
// ver formulario para cargar productos (debajo se irá creando la tabla dinámica):
app.get('/', async (req, res)=>{
    const listaProductos = await arrayProductos.getAll();
    if(listaProductos){
        res.render("main", { layout: "vista-productos", productos: listaProductos });
    }else{
        res.render("main", {layout: "error"})
    }
})




//' BACKEND


//*WEBSOCKET para tabla de productos

//'1) conexión del lado del servidor
io.on('connection', async (socket) =>{

    console.log(`conectado ${socket.id}`)

    socket.emit("mensajes", await Mensajes.getAll())
    socket.emit("productos", await arrayProductos.getAll())

    //' 3) escuchar un mensaje de un cliente (un objeto de producto)
    socket.on('new_prod', async (data) =>{
        await arrayProductos.save(data)
        const listaActualizada = await arrayProductos.getAll();
        //' 4) y propagarlo a todos los clientes: enviar mensaje a todos los usuarios conectados: todos pueden ver la tabla actualizada en tiempo real
        io.sockets.emit('productos', listaActualizada)
    })

    //*WEBSOCKET para recibir y guardar nuevo mensaje, y enviar el array de mensajes
    socket.on('new_msg', data=>{
        Mensajes.save(data);
        const listaMensajes = Mensajes.getAll()
        //enviar mensaje a todos los usuarios conectados:
        io.sockets.emit('mensajes', listaMensajes)
    })
})








httpServer.listen(8080, ()=>{
    console.log('servidor de express iniciado')
})