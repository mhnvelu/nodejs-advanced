//Pseudocode for NodeJS event loop implementation

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// execute the file - node myfile.js
// New timers, tasks, operations are recorded from myfile running
myfile.runContents();

//Event loop is similar to while loop
// Entire body executes in one 'tick'

function shouldContinue() {
  // Check 1 : Any pending setTimeout, setInterval, setImmediate ?
  // Check 2 : Any pending OS tasks? (Like http server listening on port)
  // Check 3 : Any pending long running operations? (Like fs module)
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

while (shouldContinue()) {
  // Step 1 :    Node looks at pendingTimers and sees if any functions are
  // ready to be called. Only setTimeout, setInterval
  // Step 2 :   Node looks at pendingOSTasks, pendingOperations and calls relevant callbacks.
  // Step 3 :   Pause execution, Continue when
  // - a new pendingOSTasks is done
  // - a new pendingOperations is done
  // - a timer ia about to complete
  // Step 4 :   Look at pendingTimers. Call any setImmediate
  // Step 5 : Handle any 'close' events
}

// Back to terminal
