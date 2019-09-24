class DbUtils {
  static filter (item) {
    let data = {}
    let keys = Object.keys(item)
    keys.forEach((k) => {
      let type = 'S'
      if (item[k].hasOwnProperty('N')) {
        type = 'N'
      } else if (item[k].hasOwnProperty('B')) {
        type = 'B'
      }

      data[k] = (item[k][type] === 'null') ? null : item[k][type]
    })

    return data
  }

  static removeNullAndEmptyValues (item) {
    let filteredData = {}
    let keys = Object.keys(item)
    keys.forEach((k) => {
      let subItem = item[k]
      let sKeys = Object.keys(subItem)
      let key = sKeys[0]
      let value = item[k][key]
      if (value !== null && value !== undefined && value !== '' && value !== [] && value !== {}) {
        filteredData[k] = {}
        filteredData[k][key] = value
      }

    })

    return filteredData
  }
}

module.exports = DbUtils
