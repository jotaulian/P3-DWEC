<?php
if(!empty($_POST['op'])){
    $operacion = (int)filter_input(INPUT_POST, 'op');   // $_POST['op']
    $idPokemon = (int)filter_input(INPUT_POST, 'id');
    $nombrePokemon = filter_input(INPUT_POST, 'nombre',FILTER_SANITIZE_STRING);

    // conexión BBDD
    $servidor = 'localhost';
    $usuario = 'studium';
    $clave = 'studium__';
    $baseDeDatos = 'studium_dwc_p3';
    $conexion = new mysqli($servidor, $usuario, $clave, $baseDeDatos);
    if (mysqli_connect_error()) {
        die('Error de Conexion (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
    }
    $conexion->set_charset("utf8");

    $codigo = 0;
    $respuesta = null;
    switch($operacion){
        case 1: // Leer
            $sql = 'SELECT * FROM pokemons';
            $result = $conexion->query($sql);
            $respuesta = [];
            if((int)$result->num_rows){
                while($row = $result->fetch_assoc()){
                    $respuesta[] = $row;
                }
                $codigo = 203;
            }else{
                $codigo = 502;
            }
            break;

        case 2: // Insertar
            $sql = 'SELECT * FROM pokemons WHERE idPokemon = "'.$idPokemon.'"';
            $result = $conexion->query($sql);
            if((int)$result->num_rows){
                $codigo = 510;
            }else if(!empty($idPokemon) && !empty($nombrePokemon)){
                $sql = 'INSERT INTO pokemons VALUES ('.$idPokemon.',"'.$nombrePokemon.'")';
                $result = $conexion->query($sql);
                $codigo = 204;
            }else{
                $result = false;
            }

            if(!$result){
                $codigo = 503;
            }
            break;

        case 3: // Borrar
            if(!empty($idPokemon)){
                $sql = 'DELETE FROM pokemons WHERE idPokemon = "'.$idPokemon.'"';
                $result = $conexion->query($sql);
            }else{
                $result = false;
            }
            if($result){
                $codigo = 206;
            }else{
                $codigo = 505;
            }
            break;
    }

    // Devolvemos el resultado
    if(!empty($codigo)){
        echo json_encode(['code' => $codigo,'data' => $respuesta]);
    }else{
        echo json_encode(['code' => (int)$codigo,'data' => 'Error al procesar la respuesta.']);
    }
}