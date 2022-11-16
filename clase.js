const fs = require('fs');


module.exports = class Contenedor  {
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }
     
    async save(object){
        try{
            const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const arrObjetos = JSON.parse(data);
            const nuevoProd = object
            object.id = arrObjetos.length +1;
            arrObjetos.push(nuevoProd);
            const nuevoArr = JSON.stringify(arrObjetos);
            await fs.promises.writeFile(this.nombreArchivo, nuevoArr);
            return nuevoProd;
        }catch(err){
            console.log('Hubo un error: ', err)
        }
        
    }

    async getById(numId){
        try{
            const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const arrObjetos = JSON.parse(data);
            let objBuscado = arrObjetos.find((element)=> element.id == numId)
            if(objBuscado){
                return objBuscado;
            }else{
                return 'Producto no encontrado'
            }
        }catch(err){
            console.log('Hubo un error en getById: ', err)
        }
    }

    async replaceById(id, newObject){
        try{
        const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
        const arrObjetos = JSON.parse(data);
        newObject.id = id;
        let indexProdPrevio = arrObjetos.findIndex(element=> element.id == id); 
        if(arrObjetos[indexProdPrevio]){
        arrObjetos[indexProdPrevio] = newObject;
        }else{
            return 'Producto no encontrado'
        }

        
        const guardarArr = JSON.stringify(arrObjetos);
        await fs.promises.writeFile(this.nombreArchivo, guardarArr);
        return newObject;
        }catch(err){
            console.log('Hubo un error en replaceById: ', err)
        }
    }

   async getAll(){
    try{
        const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
        const arrObjetos = JSON.parse(data)
        return arrObjetos;
    }catch(err){
        console.log('Hubo un error: ', err)
    }
    }

    async deleteById(number){
        try{
            const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const arrObjetos = JSON.parse(data)
            const nuevoArr = arrObjetos.filter(element => element.id != number);
            const stringNuevoArr = JSON.stringify(nuevoArr)
            await fs.promises.writeFile(this.nombreArchivo, stringNuevoArr)
        }catch(err){
            console.log('Hubo un error: ', err)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(this.nombreArchivo, "[]")
        }catch(err){
            console.log('Hubo un error: ', err)
        }
    }
}

