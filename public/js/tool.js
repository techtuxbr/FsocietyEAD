
var lessonsDuration = document.getElementsByClassName('duration');
var durationAux;
for(var i = 0; i < lessonsDuration.length; i++){
    durationAux = lessonsDuration[i].innerHTML;
    durationAux = durationAux*0.0166667;
    var minutesAux;
    var secondsAux;
    minutesAux = Math.trunc(durationAux); 
    secondsAux = (Math.trunc((durationAux%1)*60));

    if(minutesAux < 10){
        minutesAux = minutesAux.toString();
        minutesAux = "0" + minutesAux;
    }

    if(secondsAux < 10){
        secondsAux = secondsAux.toString();
        secondsAux = "0"+secondsAux;
    }

    lessonsDuration[i].innerHTML = minutesAux + ":" + secondsAux;

}