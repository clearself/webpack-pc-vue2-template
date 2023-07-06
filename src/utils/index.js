/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    if (classString.indexOf(className) > -1) {
        return
    }
    let arr = classString.split(' ')
    let newArr = arr.map(item => {
        if (item.indexOf('custom') > -1) {
            item = className
        }
        return item
    })

    // const nameIndex = classString.indexOf(className)
    // if (nameIndex === -1) {
    //     if (classString === '') {
    //         classString += '' + className
    //     } else {
    //         classString += ' ' + className
    //     }
    // } else {
    //     classString =
    //   classString.substr(0, nameIndex) +
    //   classString.substr(nameIndex + className.length)
    // }
    element.className = newArr.join(' ')
}
