
exports.getDate = function () {

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const options = {
     weekday: 'long', 
     month: 'long', day: 'numeric' 
    };

const today  = new Date()

return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {


    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
    const options = {
         weekday: 'long', 
        };
    
    let today  = new Date()
    
    return today.toLocaleDateString("en-US", options);
    
    }