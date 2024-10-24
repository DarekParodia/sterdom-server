<?php

require_once('render_object.php');

class Header implements RenderObject
{
    public function render(): string
    {
        return <<<HTML
            <header>
                
            </header>
        HTML;
    }
}
