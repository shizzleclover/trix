import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to {{projectName}}
        </h1>
        <p className="text-gray-600 mb-8">
          Built with React{{#if typescript}} + TypeScript{{/if}}{{#if styling}} + {{styling}}{{/if}}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Count: {count}
          </button>
          
          <p className="text-sm text-gray-500">
            Edit src/App.tsx and save to reload
          </p>
        </div>
      </div>
    </div>
  )
}

export default App