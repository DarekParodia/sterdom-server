<?php

interface RenderObject
{
    /**
     * Returns processed html string of current element
     * @return string
     */
    public function render(): string;
}
