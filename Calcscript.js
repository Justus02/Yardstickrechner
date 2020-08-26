/* 
    Created on : 18.08.2020, 21:36:47
    Author     : Justus
*/
window.onload = setup;
function calculate(e)
{
    var parent = e.target.parentNode.parentNode.parentNode;
    var gemtime = parent.getElementsByClassName("gem")[0];
    var zähltime = parent.getElementsByClassName("zähl")[0];
    var yardstick = parent.getElementsByClassName("yardstick")[0];
    var valuewithout = gemtime.value.replace(/:/g,'');
    if(valuewithout.length !== 6 || yardstick.value === "" || parseInt(yardstick.value)<50 || parseInt(yardstick.value) > 300)
        return;
    var hours = parseInt(valuewithout.substr(0,2));
    var mins = parseInt(valuewithout.substr(2,2));
    var secs = parseInt(valuewithout.substr(4,2));
    var total = calctotalsecs(hours,mins,secs);
    var realtotal = calculatecountsecs(total,parseInt(yardstick.value));
    var res = calculatestring(realtotal);
    zähltime.value = res;
}

function calctotalsecs(hours,mins,secs)
{
    return hours*3600+mins*60+secs;
}
function calculatecountsecs(secs,yardstick)
{
    return Math.floor(secs/yardstick*100);
}
function calculatestring(secs)
{
    var realhours = String(Math.floor(secs/3600));
    var realmins = String(Math.floor((secs-realhours*3600)/60));
    var realsecs = String(Math.round(secs-realhours*3600-realmins*60));
    var time = [realhours,realmins,realsecs];
    for(i = 0;i<3;i++)
    {
        if(time[i].length < 2)
        {
            var additive = "0";
            additive = additive.concat(String(time[i]));
            time[i] = additive;
        }
    }
    var res = time.join(':');
    return res;
}
function setup()
{
    var toCloneCalc = document.getElementsByClassName("Calculator")[0];
    var contentdiv = document.getElementById("content");
    window.defaultCalc = toCloneCalc.cloneNode(true);
    window.parenttoCalc = contentdiv;
}
function addCalc()
{
    let clonedFromDefault = window.defaultCalc.cloneNode(true);
    let idAddition = Math.floor(window.parenttoCalc.childNodes.length - 2);
    clonedFromDefault.querySelectorAll('[id="name"]')[0].id += idAddition;
    let nameLabel = clonedFromDefault.querySelectorAll('[id="namelabel"]')[0];
    let newNameFor = nameLabel.getAttribute("for") + idAddition;
    nameLabel.setAttribute("for",newNameFor);
    clonedFromDefault.querySelectorAll('[id="yardstick"]')[0].id += idAddition;
    let yardstickLabel = clonedFromDefault.querySelectorAll('[id="yardsticklabel"]')[0];
    let newYardstickFor = yardstickLabel.getAttribute("for") + idAddition;
    yardstickLabel.setAttribute("for",newYardstickFor);
    clonedFromDefault.querySelectorAll('[id="gem"]')[0].id += idAddition;
    let gemLabel = clonedFromDefault.querySelectorAll('[id="gemlabel"]')[0];
    let newGemFor = gemLabel.getAttribute("for") + idAddition;
    gemLabel.setAttribute("for",newGemFor);
    clonedFromDefault.querySelectorAll('[id="zähl"]')[0].id += idAddition;
    let zählLabel = clonedFromDefault.querySelectorAll('[id="zähllabel"]')[0];
    let newZählFor = zählLabel.getAttribute("for") + idAddition;
    zählLabel.setAttribute("for",newZählFor);
    window.parenttoCalc.appendChild(clonedFromDefault);
}
function removeCalc()
{
    if(window.parenttoCalc.childNodes.length > 1)
    {
        window.parenttoCalc.removeChild(window.parenttoCalc.lastChild);
    }
}
function sortByCountTime()
{
    var calcs = window.parenttoCalc.childNodes;
    var origcalcs = [...calcs];
    var sequence = [];
    var countTimes = [];
    var orderedTimes = [];
    for(let i=0;i<calcs.length;i++)
    {
        let curTime = calcs[i].getElementsByClassName("zähl")[0].value;
        var valuewithout = curTime.replace(/:/g,'');
        if(valuewithout.length !== 6 )
        {   
            countTimes.push(86400);
            continue;
        }
        var hours = parseInt(valuewithout.substr(0,2));
        var mins = parseInt(valuewithout.substr(2,2));
        var secs = parseInt(valuewithout.substr(4,2));
        var total = calctotalsecs(hours,mins,secs);
        countTimes.push(total);
    }
    orderedTimes = [...countTimes];
    orderedTimes.sort(function(a, b){return a - b;});
    for(let i=0;i<countTimes.length;i++)
    {
        //get how many times the value at index i already appeared
        //in countTimes
        var count = 0;
        if(i !== 0)
        { 
            for(let j=0;j<i;j++)
            {
                if(countTimes[j] === countTimes[i])
                {
                    count++;
                }
            }
        }
        
        //get first index of countTimes[i] in orderedTimes
        
        var firstindex = orderedTimes.indexOf(countTimes[i]);
        sequence.push(firstindex+count);
    }
    for(let i=0;i<calcs.length;i++)
    {
        window.parenttoCalc.childNodes[sequence[i]].after(origcalcs[i]);
    }
}