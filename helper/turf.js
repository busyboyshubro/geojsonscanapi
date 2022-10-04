const turf = require('@turf/turf');

const mappingClass = [{ classId: 101, className: "House" },
                    { classId: 102, className: "Parking Area" },
                    { classId: 103, className: "Shopping Mall" }]

const getClassName = (classId) => {
   const filteredClassName = mappingClass.filter((c) => {
        if (c.classId == classId) {
            return c;
        }
    });
    if(filteredClassName.length == 0){
        return "House";
    }else {
        return filteredClassName[0].className;
    }
}

const parseVectors = (vectors) => {
    // testing 
    // var polygon = turf.polygon(vectors);
    var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
    var area = turf.area(polygon);
    console.log(area);

    var line = turf.lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
    var perimeter = turf.length(line, {units: 'miles'});
    console.log(perimeter);
}

module.exports = {
    mappingClass,
    getClassName,
    parseVectors
}