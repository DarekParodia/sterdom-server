<?php

/**
 * Returns temperature simple widget
 * @param string $id id of the widget
 * @param array $data array of string to put into data points
 * @return string widget html
 */
function basicTempDisplay(string $id, string $name = 'name', array $data = array("data0", "data1", "data2", "data3", "data4")): string
{
    while (count($data) < 5) {
        $data[] = '';
    }

    return <<<HTML
    <div class="col-md-4 col-lg-3 col-xl-3 m-1" id="temp_$id">
        <div class="card text-body" style=" border-radius: 35px;">
            <div class="card-body p-4">
    
                <div class="d-flex">
                    <h5 class="flex-grow-1">$name</h5>
                    <!-- <h6>15:07</h6> -->
                </div>
    
                <div class="d-flex flex-column text-center mt-4 mb-4">
                    <h6 class="display-4 mb-0 font-weight-bold" name="data0"> $data[0] </h6>
                    <span class="small" style="color: #868B94" name="data1">$data[1]</span>
                </div>
    
                <div class="d-flex align-items-center">
                    <div class="flex-grow-1" style="font-size: 1rem;">
                        <div><i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span class="ms-1" name="data2"> $data[2]
                            </span>
                        </div>
                        <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span class="ms-1" name="data3"> $data[3]
                            </span></div>
                        <div><i class="fas fa-sun fa-fw" style="color: #868B94;"></i> <span class="ms-1" name="data4"> $data[4]
                            </span></div>
                    </div>
                </div>
    
            </div>
        </div>
    </div>
HTML;
}
/**
 * Returns a span that is configured so javascript can put data into span's innerHTML from sensor
 * @param string $sensorID id of data to get data from
 * @param string $dataID id of data to get data from
 * @return string span html
 */
function getDataPlaceholder(string $sensorID, string $dataID): string
{
    return <<<HTML
    <span class="data-span" data-sensorid="$sensorID" data-dataid="$dataID">$sensorID : $dataID</span>
    HTML;
}
