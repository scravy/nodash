Turns a sychronous function into an asynchronous function.

Example:

	var asyncMin = async(Math.min);
	async(3, 17, function (result, error) { result === 3; });
	
This function is exceptional in the sense that it does not follow several
conventions in nodash. It accepts a function with an arbitrary number of arguments
and turns it into a function with one more argument that accepts a callback as
its last argument. The exceptional thing here is that the functions may have
arbitrary numbers of arguments.

It is also worth mentioning that the resulting function is not curried and 
can not be curried using `curried`.