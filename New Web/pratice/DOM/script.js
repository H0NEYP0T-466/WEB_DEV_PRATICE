let a=document.querySelector("#dom")
let b =document.querySelector("#bulb")
a.addEventListener("click",onof)
let flag=0
function onof()
{
    if(flag == 0)
    {
        b.style.backgroundColor="yellow"
        flag=1
    }
    else if(flag ==1)
    {
        b.style.backgroundColor="black"
        flag=0
    }


}
