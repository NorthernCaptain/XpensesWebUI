
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
    for(let item of items) {
        const category = item.category.parent ? item.category.parent : item.category;
        const year = item.tran_date.substring(0,4)
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
    if(data.length > 9) {
        const tail = { name: "Other", shortName: "Oth" }
        for(let lbl of labels) {
            tail[lbl.name] = 0
        }
        while(data.length > 9) {
            const item = data.pop();
            for(let lbl of labels) {
                tail[lbl.name] += (item[lbl.name] ? item[lbl.name] : 0)
            }
        }
        data.push(tail)
    }

    return {data: data, labels: labels}
}