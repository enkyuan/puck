import { Button } from '@base-ui/react/button'
import { Field } from '@base-ui/react/field'
import { Input } from '@base-ui/react/input'
import { SearchIcon } from 'blode-icons-react'

function App() {
  return (
    <main>
      <h1>Puck</h1>
      <Field.Root>
        <Field.Label>Search</Field.Label>
        <Input placeholder="Type something" />
      </Field.Root>
      <Button>
        <SearchIcon size={16} /> Search
      </Button>
    </main>
  )
}

export default App
