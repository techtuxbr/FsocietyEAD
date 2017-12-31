
var lessonsDuration = document.getElementsByClassName('duration');
var durationAux;
for(var i = 0; i < lessonsDuration.length; i++){
    durationAux = lessonsDuration[i].innerHTML;
    durationAux = durationAux*0.0166667;
    lessonsDuration[i].innerHTML = Math.trunc(durationAux) + ":"+(Math.trunc((durationAux%1)*60));
}