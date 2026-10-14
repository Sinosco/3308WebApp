/* ------------------------- sortOrder --------------------------------------
 * 
 * Given a data value and a data type, return a value that will sort correctly based on type.
 *   "number" -> numeric sort, "text" -> case insensitive alpha sort,
 *   "date"   -> sorts by date, "time" -> "HH:MM:SS" sorts by total seconds.
 * Empty/null/invalid values sort to the TOP.
 */
function sortOrder(data, sortType) {

    sortType = sortType.toUpperCase();

    if (sortType === "NUMBER") {
        if (data === null || data === undefined || data === "") {
            return -9999999999; // put empty entries at the top of the sort.
        }
        var strNum = data + ""; // convert data to string.

        // Remove any formatting characters that may have been there 
        strNum = strNum.replace(/[ ,$]/g, "");

        if (isNaN(strNum)) { // non numeric data
            console.log("trying to sort non-number as number: " + data);
            return -9999999999; // put invalid numeric entries at the top of the sort
        } else { // numeric data
            return Number(strNum); // convert the string back to a number.
        }

    } else if (sortType === "DATE") {
        if (!data || data === "") {
            return -9999999999; // put empty entries at the top of the sort.
        }

        const daysToMilliSecs = 24 * 60 * 60 * 1000;
        const daysTo1970 = 1970 * 365 + Math.floor(1970 / 4);

        var milliSecsFrom1970 = Date.parse(data);
        if (isNaN(data) && !isNaN(milliSecsFrom1970)) {
            var daysFrom1970 = milliSecsFrom1970 / (daysToMilliSecs);
            return (daysFrom1970 + daysTo1970);
        } else {
            console.log("Error in function sortOrder - trying to sort non-date data as date: " + data);
            return -9999999999; // put invalid entries at top if sorting by this column
        }

    } else if (sortType === "TIME") {
        // "00:03:20" -> 200 seconds
        if (data === null || data === undefined || data === "") {
            return -9999999999; // empty at the top
        }
        var parts = String(data).split(":").map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) {
            console.log("Error in function sortOrder - trying to sort non-time data as time: " + data);
            return -9999999999;
        }
        return parts[0] * 3600 + parts[1] * 60 + parts[2];

    } else if (sortType === "TEXT") {
        // case insensitive sort; null/empty sorts first ("" is smallest)
        if (data === null || data === undefined) {
            return "";
        }
        return String(data).toUpperCase();

    } else {
        console.log("Error in function sortOrder - unknown data type: " + sortType +
            ". Data is " + data);
        return data;
    }
};