

/**
 * Created by anderson on 10/03/19.
 */
class ObjectUtils {

    static isEmpty (obj) {
        if (obj == null) return true;
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }

    static stringIsEmpty (str) {
        return str === "" || str === null
    }
}

module.exports = ObjectUtils

