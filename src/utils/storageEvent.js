const orignalSetItem = window.localStorage.setItem;
window.localStorage.setItem = function(key, newValue, dispatchEvent=false){
    if( dispatchEvent ){
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        setItemEvent.changedKey = key;
        window.dispatchEvent(setItemEvent);
    }
    
    orignalSetItem.apply(this,[key, newValue]);
}

/*
window.addEventListener("setItemEvent", function (e) {
    alert(e.newValue);
});
localStorage.setItem("nm","1234");
*/