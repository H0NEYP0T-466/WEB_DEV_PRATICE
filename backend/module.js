function hey()
{
    console.log('Hey there!');
    console.log('This is a simple function in the backend module.');
}
function heyAgain()
{
    console.log('Hey again!');
    console.log('This function is called after the first one.');
}
function heyOnceMore()
{
    console.log('Hey once more!');
    console.log('This is the last function in the backend module.');
}

module.exports = {
    hey,
    heyAgain,
    heyOnceMore
};