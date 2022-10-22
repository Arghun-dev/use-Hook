import { useState, experimental_use as use, Suspense } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

const getLocation = new Promise((resolve) => {
  navigator.geolocation.getCurrentPosition((position) => {
    resolve({
      lat: position.coords.latitude,
      lang: position.coords.longitude
    })
  })
})

const fetchUsers = fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json())

const cachedFetches = {};
const cachedFetch = (url) => {
  if (!cachedFetches[url]) {
    cachedFetches[url] = fetch(url).then(async(res) => ({
      status: res.status,
      data: res.status === 200 ? await res.json() : null
    }))
  }

  return cachedFetches[url]
}

const Detail = ({ userId }) => {
  const data = use(cachedFetch(`https://jsonplaceholder.typicode.com/users/${userId}`))
  
  return <div>{data.name}</div>
}

const GEO = () => {
  const data = use(getLocation);

  return <div>{JSON.stringify(data)}</div>
}

const Users = () => {
  const [selected, setSelected] = useState(null);
  const data = use(fetchUsers)

  return data.map((user) => (
    <>
      <div key={user.id} onClick={() => setSelected(user.id)} style={{ border: '1px solid white', borderRadius: 4, marginBottom: 24, cursor: 'pointer' }}>
        <h1>username: {user.username}</h1>
        <h2>email: {user.email}</h2>
      </div>
      {selected === user.id && <Detail userId={selected} />}
    </>
    
  ))
}

function App() {
  return (
    <div className="App">
      <Suspense>
        <GEO />
        <Users />
      </Suspense>
    </div>
  )
}

export default App
