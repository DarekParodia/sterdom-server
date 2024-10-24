import data_receiver from "./modules/data_receiver.js"

document.addEventListener('DOMContentLoaded', (e) => {
    var temp_displays = $('[id^="temp_"]');
    console.log(temp_displays);

    for (let i = 0; i < temp_displays.length; i++) {
        console.log(temp_displays[i]);
        let children = temp_displays[i].querySelectorAll('*');
        let dataElements = Array.from(children).filter(element => {
            let name = element.getAttribute("name");
            if (!name) return false;
            return name.startsWith("data");
        });
        console.log(dataElements);




        $(dataElements[0]).html("dziala");
    }
})
