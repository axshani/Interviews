import { useState } from 'react'
import Header from './Header'
import Table from './Table/Table'
import { getRows } from '../db/rows'

const App = () => {
  const [rows, setRows] = useState(getRows())
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <Table rows={rows} setRows={setRows} searchQuery={searchQuery}/>
    </div>
  )
}

export default App
