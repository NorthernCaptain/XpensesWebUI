import moment from "moment";

export function groupByMonthYear(items, labels) {
    const months = [
        { name: "Jan"},
        { name: "Feb"},
        { name: "Mar"},
        { name: "Apr"},
        { name: "May"},
        { name: "Jun"},
        { name: "Jul"},
        { name: "Aug"},
        { name: "Sep"},
        { name: "Oct"},
        { name: "Nov"},
        { name: "Dec"},
    ]
    const years = {}
    for(let item of items) {
        const year = item.tran_date.substring(0,4)
        const monIdx = parseInt(item.tran_date.substring(5, 7), 10) - 1
        const mon = months[monIdx]
        mon[year] = (mon[year] ? mon[year] : 0) + item.amount;
        years[year] = (years[year] ? years[year] : 0) + item.amount;
    }
    console.log("Labels", JSON.stringify(labels))
    for(let year in years) {
        let lbl = labels.find(it=> it.name == year)
        if(!lbl) {
            lbl = { name: year, color: "#faafaa"}
            labels.push(lbl)
        }
        lbl.amount = Math.round(years[year]/100)
        for(let item of months) if(item[year]) item[year] = Math.round(item[year]/100)
    }
    labels.sort((a,b) => a.name.localeCompare(b.name))
    return { labels: labels, data: months}
}

export function groupByTopCategoryAndYear(items, labels) {
    const cache = {}
    const keyLen = labels[0].name.length
    for(let item of items) {
        const category = item.category.parent ? item.category.parent : item.category;
        const year = item.tran_date.substring(0,keyLen)
        let cdata = cache[category.id]
        cdata = cdata ? cdata : {category: category}
        cdata[year] = (cdata[year] ? cdata[year] : 0) + item.amount;
        cache[category.id] = cdata
    }

    labels.sort((a,b) => a.name.localeCompare(b.name))

    // to array and sort
    const data = []
    const year = labels[0].name
    const year2 = labels[1]?.name
    for(let key in cache) {
        let item = cache[key];
        item.name = item.category.name
        item.shortName = item.name.substr(0, 4)
        let yv = item[year] ? Math.round(item[year]/100) : 0
        item[year] = yv
        if(year2 && year !== year2) {
            let yv2 = item[year2] ? Math.round(item[year2]/100) : 0
            item[year2] = yv2
        }
        data.push(item)
    }
    data.sort((a, b)=> {
        let av = a[year]
        av = av ? av : 0
        let bv = b[year]
        bv = bv ? bv : 0
        return bv - av
    })

    //compress the tail
    if(data.length > 11) {
        const tail = { name: "Other", shortName: "Oth" }
        for(let lbl of labels) {
            tail[lbl.name] = 0
        }
        while(data.length > 11) {
            const item = data.pop();
            for(let lbl of labels) {
                tail[lbl.name] += (item[lbl.name] ? item[lbl.name] : 0)
            }
        }
        data.push(tail)
    }

    return {data: data, labels: labels}
}

export function filterExpensesByCategories(data, categories) {
    let cache = {}
    for(let item of categories) cache[item.id] = true
    let ret = []
    for(let item of data) {
        if(cache[item.category.id] ||
            (item.category.parent && cache[item.category.parent.id]))
            ret.push(item)
    }
    return ret
}

export function cumulativeYearGroup(data, labels) {
    let cache = {}
    let keyLen = labels[0].name.length
    let ret = []
    //prefill for each day of year
    for(let i=1;i<=53;i++) {
        const item = { name: `Week ${i}`}
        cache[i] = item
        ret.push(item)
    }

    //set first date amount = 0
    for(let lbl of labels) {
        cache[1][lbl.name] = 0
        cache[lbl.name] = 1
    }

    for(let item of data) {
        const day = moment(item.tran_date).week()
        const year = item.tran_date.substring(0,keyLen)
        const prevIdx = cache[year]
        for(let idx = prevIdx + 1;idx<=day;idx++) {
            cache[idx][year] = cache[prevIdx][year]
        }
        cache[day][year] += item.amount
        cache[year] = day
    }

    for(let item of ret) {
        for(let lbl of labels) {
            let val = Math.round(item[lbl.name]/100)
            item[lbl.name] = isNaN(val) ? null : val
        }
    }
    return {data: ret, labels: labels}
}

export function groupByDays(data) {
    let cache = {}
    for(let item of data) {
        const day = item.tran_date.substring(0, 10)
        let cdata = cache[day]
        if(!cdata) {
            cdata = {name: day, items: [], amount: 0}
            cache[day] = cdata
        }
        cdata.amount += item.amount
        cdata.items.push(item)
    }
    let ret = []
    let now = moment()
    for(let key in cache) {
        let item = cache[key]
        let date = moment(item.name)
        item.date = date
        item.name = date.year() === now.year() ? date.format("MMM DD, ddd") : date.format("MMM DD, ddd YYYY")
        item.amount = Math.round(item.amount/100)
        ret.push(item)
    }

    ret.sort((a,b) => {
        if(a.date.isBefore(b.date)) return -1
        if(a.date.isAfter(b.date)) return 1
        return 0
    })
    return ret
}