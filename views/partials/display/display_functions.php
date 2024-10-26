<?php

/**
 * Returns temperature simple widget
 * @param mixed $id id of the widget
 * @return string widget html
 */
function basicTempDisplay(string $id, string $name): string
{
    return <<<HTML
    <div class="col-md-4 col-lg-3 col-xl-3 m-1" id="temp_$id">
        <div class="card text-body" style=" border-radius: 35px;">
            <div class="card-body p-4">
    
                <div class="d-flex">
                    <h5 class="flex-grow-1">$name</h5>
                    <!-- <h6>15:07</h6> -->
                </div>
    
                <div class="d-flex flex-column text-center mt-4 mb-4">
                    <h6 class="display-4 mb-0 font-weight-bold" name="data0"> 13°C </h6>
                    <span class="small" style="color: #868B94" name="data1">Stormy</span>
                </div>
    
                <div class="d-flex align-items-center">
                    <div class="flex-grow-1" style="font-size: 1rem;">
                        <div><i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span class="ms-1" name="data2"> 40 km/h
                            </span>
                        </div>
                        <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span class="ms-1" name="data3"> 84%
                            </span></div>
                        <div><i class="fas fa-sun fa-fw" style="color: #868B94;"></i> <span class="ms-1" name="data4"> 0.2h
                            </span></div>
                    </div>
                </div>
    
            </div>
        </div>
    </div>
HTML;
}
