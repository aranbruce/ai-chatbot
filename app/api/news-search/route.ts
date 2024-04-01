import { NextRequest } from "next/server"; 

export async function GET(request: NextRequest) {
  console.log('GET request received for news-search route')

  // get the parameters from the query string of the request
  const query = request.nextUrl.searchParams.get('query')
  const country = request.nextUrl.searchParams.get('country')
  let freshness = request.nextUrl.searchParams.get('freshness')
  const units = request.nextUrl.searchParams.get('units')
  const count = 5

  console.log('query:', query)
  console.log('country:', country)
  console.log('freshness:', freshness)
  console.log('units:', units)

  const countriesOptions = [
    "AR",
    "AU",
    "AT",
    "BE",
    "BR",
    "CA",
    "CL",
    "DK",
    "FI",
    "FR",
    "DE",
    "HK",
    "IN",
    "ID",
    "IT",
    "JP",
    "KR",
    "MY",
    "MX",
    "NL",
    "NZ",
    "NO",
    "CN",
    "PL",
    "PT",
    "PH",
    "RU",
    "SA",
    "ZA",
    "ES",
    "SE",
    "CH",
    "TW",
    "TH",
    "TR",
    "GB",
    "US",
  ]

  const freshnessOptions = [
    "past-day",
    "past-week",
    "past-month",
    "past-year"
  ]

  const unitsOptions = [
    "metric",
    "imperial"
  ]

  if (!query) {
    return new Response(JSON.stringify({message:'A search query is required'}), { status: 400 })
  }

  if (country && !countriesOptions.includes(country)) {
    return new Response(JSON.stringify({message:'Invalid country code'}), { status: 400 })
  }

  if (freshness && !freshnessOptions.includes(freshness)) {
    return new Response(JSON.stringify({message:'Invalid freshness option'}), { status: 400 })
  } else if (freshness === 'past-day') {
    freshness = 'pd'
  } else if (freshness === 'past-week') {
    freshness = 'pw'
  } else if (freshness === 'past-month') {
    freshness = 'pm'
  } else if (freshness === 'past-year') {
    freshness = 'py'
  }

  if (units && !unitsOptions.includes(units)) {
    return new Response(JSON.stringify({message: 'Invalid units option'}), { status: 400 })
  }

  // call brave API
  const url = `https://api.search.brave.com/res/v1/news/search?q=${query}` +
    `&count=${count}` +
    (country ? `&country=${country}` : '') +
    (freshness ? `&freshness=${freshness}` : '') +
    (units ? `&units=${units}` : '');
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || '',
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: headers
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({message: `Error occurred: ${error}`}), { status: 500 });
  }
}

