// This is the jinx lib.js.

// When extending this file, keep in mind these functions shall lie here till eternity.
// I don't care if theyre broken, you are not removing it. You can add a print statement
// bitching about deprecation, but that function is staying there. If you refactor
// a function, make sure that no inputs or outputs change.

// Keep these things in mind when adding functions here. Your dogshit code is going to
// get deployed alongside EVERY. SINGLE. ONE of your exploits after you add it here.


// Now that being said, I will still put dogshit here :)
export function parsePayloadArg(args) {
    let data = {};
    if (args.length == 0) {
        return data;
    }
    eval('data = ' + args.join());
    return data;
}