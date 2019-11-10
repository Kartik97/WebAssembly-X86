var text = "";
var count=0;
var batchNo=0;
var batch=1000;
var emptyCount = 0;
var timer;

function sendData()
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/user", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
    //xhr.send(data);
    //text='{"DATA":['+text+']}';
    text='{"'+batchNo+'":['+text+']}';
    //console.log(text);
    xhr.send(JSON.stringify(JSON.parse(text)));
    // xhr.onreadystatechange = function() {
    // if (xhr.readyState == XMLHttpRequest.DONE) {
    //         alert(xhr.responseText);
    //     }
    // }

    text="";
    count=0;
    batchNo++;
    updateTimer();
}

function closeServer(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/shutdown", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify("{DATA:Server_Close}"));
    //window.close();
}

function sendLastData(){
    sendData();
    //setTimeout(closeServer(), 5000);
    closeServer();
}

timer = setInterval(sendLastData,5000);
function updateTimer(){
    clearInterval(timer);
    timer = setInterval(sendLastData,5000);

}   

// var timer;
// function sendDataCheck(){
//     console.log("Success")
//     if(text === "" && emptyCount === 20){
//         clearInterval(timer);
//         console.log(count);
//         emptyCount = 20;
//         //closeServer();
//     }
//     else if(text === "")
//         emptyCount++;
//     else{
//         sendData();
//         emptyCount=0;
//     }
// }

// if(emptyCount!=20)
//     timer = setInterval(sendDataCheck,800);

function incCount(){
     count++;
     console.log(count);
     if(count==batch)
         sendData();
}

Wasabi.analysis = {
    start(location) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"start", "param": {}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"start", "param": {}}';
        //count++;
        //if(count==batch)
        //    sendData();
        //console.log(text);
        incCount();
        //console.log(location, "start");
    },

    nop(location) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"nop", "param": {}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"nop", "param": {}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, "nop");
    },

    unreachable(location) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"unreachable", "param": {}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"unreachable", "param": {}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, "unreachable");
    },

    if_(location, condition) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"if_", "param": {"cond":"'+condition+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"if_", "param": {"cond":"'+condition+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        //incCount();
        //console.log(location, "if, condition =", condition);
    },

    br(location, target) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"br", "param": {"targetFun":"'+target.location["func"]+'","targetInst":"'+target.location["instr"]+'","label":"'+target.label+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"br", "param": {"targetFun":"'+target.location["func"]+'","targetInst":"'+target.location["instr"]+'","label":"'+target.label+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, "br, to label", target.label, "(==", target.location, ")");
    },

    br_if(location, conditionalTarget, condition) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"br_if", "param": {"targetFun":"'+conditionalTarget.location["func"]+'","targetInst":"'+conditionalTarget.location["instr"]+'","label":"'+conditionalTarget.label+'","cond":"'+condition+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"br_if", "param": {"targetFun":"'+conditionalTarget.location["func"]+'","targetInst":"'+conditionalTarget.location["instr"]+'","label":"'+conditionalTarget.label+'","cond":"'+condition+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, "br_if, (conditionally) to label", conditionalTarget.label, "(==", conditionalTarget.location, "), condition =", condition);
    },

    br_table(location, table, defaultTarget, tableIdx) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"br_table", "param": {"defaultTarget":"'+defaultTarget+'","tableIdx":"'+tableIdx+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"br_table", "param": {"defaultTarget":"'+defaultTarget+'","tableIdx":"'+tableIdx+'"}}';
        //console.log(text);        
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, "br_table, table =", table, ", default target =", defaultTarget, ", table index =", tableIdx);
    },

    begin(location, type) {
        // if(type!="if")
        //     if(text === "")
        //         text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"begin", "param": {"type":"'+type+'"}}';
        //     else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"begin", "param": {"type":"'+type+'"}}';
        if(type!="if")
            if(text === "")
                text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"begin", "param": {}}';
            else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"begin", "param": {}}';    
        incCount();
        //console.log(location, "begin", type);
    },

    // ifLocation === location of the matching if block for else
    end(location, type, beginLocation, ifLocation) {
        // if(text === "")
        //     text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"end", "param": {"type":"'+type+'","beginLoc":"'+beginLocation["func"]+'","beginInst":"'+beginLocation["instr"]+'"}}';
        // else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"end", "param": {"type":"'+type+'","beginLoc":"'+beginLocation["func"]+'","beginInst":"'+beginLocation["instr"]+'"}}';
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"end", "param": {}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"end", "param": {}}';    
        incCount();
        //console.log(location, "end", type, "(begin @", beginLocation, ", if begin @", ifLocation, ")");
    },

    drop(location, value) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"drop", "param": {"value":"'+value+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"drop", "param": {"value":"'+value+'"}}';
        //console.log(text);
        //count++;
        //if(count==batch)
        //    sendData();
        incCount();
        //console.log(location, "drop, value =", value);
    },

    select(location, cond, first, second) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"select", "param": {"cond":"'+cond+'","first":"'+first+'","second":"'+second+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"select", "param": {"cond":"'+cond+'","first":"'+first+'","second":"'+second+'"}}';
        //console.log(text);
        //count++;
        //if(count==batch)
        //    sendData();
        incCount();
        //console.log(location, "select, condition =", cond, "first =", first, "second =", second);
    },

    // indirectTableIdx === undefined iff direct call, for indirect calls it is a number
    call_pre(location, targetFunc, args, indirectTableIdx) {
        //if(indirectTableIdx === undefined){
            if(text === "")
                text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"call", "param": {"target":"'+targetFunc+'","args":"'+args+'"}}';
            else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"call", "param": {"target":"'+targetFunc+'","args":"'+args+'"}}';
        //}
        //console.log(text);
        //count++;
        //if(count==batch)
        //    sendData();
        incCount();
        //console.log(location, (indirectTableIdx === undefined ? "direct" : "indirect"), "call", "to func #", targetFunc, "args =", args);
    },

    call_post(location, values) {
        //console.log(location, "call result =", values);
    },

    return_(location, values) {
        //if(text === "")
        //    text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"return", "param": {"value":"'+values+'"}}';
        //else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"return", "param": {"value":"'+values+'"}}';
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"return", "param": {}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"return", "param": {}}';
        //console.log(text);
        //count++;
        //if(count==batch)
        //    sendData();
        incCount();
        //console.log(location, (location.instr === -1) ? "implicit" : "explicit", "return, values = ", values);
    },

    const_(location, op, value) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"value":"'+value+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"value":"'+value+'"}}';
        //console.log(text);
        //count++;
        //if(count==batch)
        //    sendData();
        incCount();
        //console.log(location, op, "value =", value);
    },

    unary(location, op, input, result) {
        // if(text === "")
        //     text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+input+'","value":"'+result+'"}}';
        // else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+input+'","value":"'+result+'"}}';
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+input+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+input+'"}}';
        incCount();
        //console.log(location, op, "input =", input, "result =", result);
    },

    binary(location, op, first, second, result) {
        // if(text === "")
        //     text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+first+'","i2":"'+second+'","value":"'+result+'"}}';
        // else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+first+'","i2":"'+second+'","value":"'+result+'"}}';
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+first+'","i2":"'+second+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"i1":"'+first+'","i2":"'+second+'"}}';

        incCount();
        //console.log(location, op, "first =", first, " second =", second, "result =", result);
    },

    load(location, op, memarg, value) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"addr":"'+memarg["addr"]+'","value":"'+value+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'","param": {"addr":"'+memarg["addr"]+'","value":"'+value+'"}}';
       incCount();
        //console.log(location, op, "value =", value, "from =", memarg);
    },

    store(location, op, memarg, value) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"addr":"'+memarg["addr"]+'","value":"'+value+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'","param": {"addr":"'+memarg["addr"]+'","value":"'+value+'"}}';
        //console.log(text);
        //count++;
        //if(count==batch)
        //    sendData();
        incCount();
        //console.log(location, op, "value =", value, "to =", memarg);
    },

    memory_size(location, currentSizePages) {
        // if(text === "")
        //     text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"memory_size", "param": {"currPageSize":"'+currentSizePages+'"}}';
        // else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"memory_size", "param": {"currPageSize":"'+currentSizePages+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        //incCount();
        //console.log(location, "memory_size, size (in pages) =", currentSizePages);
    },

    memory_grow(location, byPages, previousSizePages) {
        // if(text === "")
        //     text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"memory_grow", "param": {"by":"'+byPages+'","currPageSize":"'+previousSizePages+'"}}';
        // else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"memory_grow", "param": {"by":"'+byPages+'","currPageSize":"'+previousSizePages+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        //incCount();
        //console.log(location, "memory_grow, delta (in pages) =", byPages, "previous size (in pages) =", previousSizePages);
    },

    local(location, op, localIndex, value) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"index":"'+localIndex+'","value":"'+value+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'","param":{"index":"'+localIndex+'","value":"'+value+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, op, "local #", localIndex, "value =", value); 
    },

    global(location, op, globalIndex, value) {
        if(text === "")
            text += '{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'", "param": {"index":"'+globalIndex+'","value":"'+value+'"}}';
        else text += ',{"func":"'+location["func"]+'","inst":"'+location["instr"]+'","instruction":"'+op+'","param":{"index":"'+globalIndex+'","value":"'+value+'"}}';
        //console.log(text);
        // count++;
        // if(count==batch)
        //     sendData();
        incCount();
        //console.log(location, op, "global #", globalIndex, "value =", value);
    },
};