$(window).on("load", function() {
    let contenedorTabla = $('#contenedor-tabla');

    // CARGAR JSON
    $("#cargar").on("click", function() {
        $("#contenedor").html('');
        contenedorTabla.html('');
        contenedorTabla.append(`<table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Tipos</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>`);

        let cuerpoTabla = $("#table-body");
        

        let id = $('#poke-id').val();
        let nombre = $('#poke-nombre').val();

        $.getJSON("pokedex.json", function(datos) {
            if(nombre){
                $.each(datos, function(i,pokemon) {
                if(pokemon.name.english == nombre){
                    cuerpoTabla
                        .append(
                            `<tr>
                            <th>${pokemon.id}</th>
                            <td class="nombre">${pokemon.name.english}</td>
                            <td>${pokemon.type}</td>
                            <td><button type="button" class="btn btn-outline-success rounded-0" id="seleccionar">Seleccionar</button></td>
                        </tr>`
                        )
                    }
                })
            }
            else if(id){
                $.each(datos, function(i,pokemon) {
                if(pokemon.id <= id){
                    cuerpoTabla
                        .append(
                            `<tr>
                            <th>${pokemon.id}</th>
                            <td class="nombre">${pokemon.name.english}</td>
                            <td>${pokemon.type}</td>
                            <td><button type="button" class="btn btn-outline-success rounded-0" id="seleccionar">Seleccionar</button></td>
                        </tr>`
                        )
                    }
                })
            }else{
                $.each(datos, function(i,pokemon) {
                    cuerpoTabla
                        .append(
                            `<tr>
                            <th>${pokemon.id}</th>
                            <td class="nombre">${pokemon.name.english}</td>
                            <td>${pokemon.type}</td>
                            <td><button type="button" class="btn btn-outline-success rounded-0" id="seleccionar">Seleccionar</button></td>
                        </tr>`
                        )
            })
            }
        })
    })

    /* SELECCIONAR POKEMON */
    $(document).on("click", "#seleccionar", function(event) {
        let idSeleccionado = $(this).parent().parent().children("th").text();
        let nombreSeleccionado = $(this).parent().parent().children("td.nombre").text();
        let operacion = 2;
        
        // Llamada ajax
        $.post("/assets/action.php", { op:operacion,id:idSeleccionado,nombre:nombreSeleccionado}, function (respuestaJSON) {
            console.log(respuestaJSON);
            let respuesta = JSON.parse(respuestaJSON);
            let contenido = '';
            switch(respuesta.code){
                case 204: 
                    contenido = crearAlerta('success','Se ha insertado el registro.');
                    break;
                
                case 503:
                    contenido = crearAlerta('danger','No se ha podido insertar el registro.');

                case 510:
                    contenido = crearAlerta('danger','El registro ya se encuentra guardado.');
                    break;
            }
            $("#contenedor").html(contenido);
        }); 

    })
    
    // MOSTRAR SELECCIONADOS
    $("#mostrar").on("click", function() {
        $("#contenedor").html('');
        contenedorTabla.html('');
        contenedorTabla.append(`<table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>`);

        let cuerpoTabla = $("#table-body");
        let operacion = 1;

        // Llamada ajax
        $.post("/assets/action.php", { op:operacion}, function (respuestaJSON) {
            console.log(respuestaJSON);
            let respuesta = JSON.parse(respuestaJSON);
            let contenido = '';
            switch(respuesta.code){
                case 203: 
                    $.each(respuesta.data, function() {
                    cuerpoTabla.append(
                            `<tr>
                            <th>${this.idPokemon}</th>
                            <td>${this.nombrePokemon}</td>
                            <td><button type="button" class="btn btn-outline-danger rounded-0" id="borrar">Borrar</button></td>
                        </tr>`
                        )
                    })
                    break;
                
                case 502:
                    contenido = crearAlerta('warning','No hay registros para mostrar.');
                    break;
            }

            $("#contenedor").html(contenido);
        });


    })

    /* BORRAR POKEMON */
    $(document).on("click", "#borrar", function(event) {
        let fila = $(this).parent().parent();
        let idSeleccionado = $(this).parent().parent().children("th").text();
        let operacion = 3;
        
        // Llamada ajax
        $.post("/assets/action.php", { op:operacion,id:idSeleccionado}, function (respuestaJSON) {
            console.log(respuestaJSON);
            let respuesta = JSON.parse(respuestaJSON);
            let contenido = '';
            switch(respuesta.code){
                case 206: 
                    fila.remove();
                    contenido = crearAlerta('success','Se ha borrado el registro.');
                    break;
                
                case 505:
                    contenido = crearAlerta('danger','No se ha podido borrar el registro.');
                    break;
            }
            $("#contenedor").html(contenido);
        }); 

    })

    function crearAlerta(tipo,texto){
    return '<div class="alert alert-'+tipo+' mt-5" role="alert">'+texto+'</div>';
    }
})