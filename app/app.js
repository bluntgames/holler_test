// each of the app entry points
module.exports = {
    webcam: function() {
        console.log('test web');
        require('./webcam.js');
    },
    driving: function() {
        console.log('test driving');
        require('./driving.js');
    },
    instancing: function() {
        require('./instancing.js');
    }
}