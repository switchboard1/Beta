import moment from 'moment'

export function filterCategories(filter, categories) {
  let filteredList = [...categories]

  // Filter status
  if (filter.status !== 'all') {
    const filtered = filteredList.filter(
      (category) => category.brewery_type === filter.status
    )
    filteredList = filtered
  }

  // Search
  if (filter.search !== '') {
    const searchList = []
    const searchTerm = filter.search.toLowerCase()
    for (let i = 0; i < filteredList.length; i++) {
      if (
        (filteredList[i].name !== null &&
          filteredList[i].name.toLowerCase().includes(searchTerm)) ||
        (filteredList[i].city !== null &&
          filteredList[i].city.toLowerCase().includes(searchTerm))
      ) {
        searchList.push(filteredList[i])
      }
    }
    filteredList = searchList
  }

  return filteredList
}

export function orderLeads(order, categories) {
  const orderedList = [...categories]

  if (order === 'createdAt') {
    orderedList.sort(function(a, b) {
      const unixA = moment(a.createdAt).unix()
      const unixB = moment(b.createdAt).unix()
      return unixA < unixB ? -1 : 1
    })
  } else {
    orderedList.sort(function(a, b) {
      const nameA = a[order] ? a[order].toLowerCase() : 'zzz'
      const nameB = b[order] ? b[order].toLowerCase() : 'zzz'
      return nameA < nameB ? -1 : 1
    })
  }

  return orderedList
}
