<?php
require_once('display_functions.php');
function callDisplayFunction(string $function, string $id, string $name, array $data = array()): string
{
    return $function($id, $name, $data);
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

        $data_array = array();

        foreach ($json[$i]['data_fields'] as &$el) {
            $d = "";

            if (!empty($el['text'])) {
                $d .= $el['text'];
            }

            if (!empty($el['sensor_id']) && !empty($el['sensor_id'])) {
                $d .= getDataPlaceholder($el['sensor_id'], $el['sensor_data']);
            }
            $data_array[] = $d;
        }

        $output = $output . callDisplayFunction($function, $id, $name, $data_array);
    }
    return $output;
}
