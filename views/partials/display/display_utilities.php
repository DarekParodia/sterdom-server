<?php
require_once('display_functions.php');
function callDisplayFunction(string $function, string $id, string $name): string
{
    return $function($id, $name);
}

function parseLayout($layout_path): string
{
    $json_str = file_get_contents(filename: $layout_path);
    $json = json_decode($json_str, true);
    $output = "";

    for ($i = 0; $i < count($json); $i++) {
        $name = $json[$i]['name'];
        $id = $json[$i]['id'];
        $function = $json[$i]['display_function'];
        $output = $output . callDisplayFunction($function, $id, $name);
    }
    return $output;
}
