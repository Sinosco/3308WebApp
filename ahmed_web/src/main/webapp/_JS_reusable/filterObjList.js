// given an object list (refList) and an input value (searchKey), 
// return a new object list that only has those objects that have 
// properties that contain searchKey. Any image filenames are excluded
// from the search (e.g., any string that contains .JPG or .PNG). 

function filterObjList (refList, searchKey) {

    // Return true if any property of obj contains searchKey. Otherwise, return false.
    function isToShow(obj, searchKey) {

        // show the object if searchKey is empty
        if (!searchKey || searchKey.length === 0) {
            return true;
        }

        // convert search key to upper case (will convert values also to upper case before comparing).
        var searchKeyUpper = searchKey.toUpperCase();

        for (var prop in obj) {

            // null/undefined values can't match anything; numbers need converting to text.
            if (obj[prop] === null || obj[prop] === undefined) {
                continue;
            }
            var propValUpper = String(obj[prop]).toUpperCase();

            // Do not try to find a match for Table cells that hold images. 
            if (!propValUpper.includes(".JPG") && !propValUpper.includes(".PNG")) {

                if (propValUpper.includes(searchKeyUpper)) {
                    return true;
                }
            } // excluding image tds
        }
        return false;
    } // isToShow 

    // Entry Point filterObjList
    if (!searchKey || searchKey === "") {
        // copy (not a pointer to the original) so React sees the state change
        return refList.slice();
    }

    var newList = refList.filter(obj => isToShow(obj, searchKey));

    console.log("filterObjList: filtered (newList) is on the next line: ");
    console.log(newList);
    return newList;
} // filterObjList