import AddHabitForm from "./components/AddHabitForm"


function App() {

  return (
    <>
    <div>
      <h1 className="text-6xl font-semibold text-center capitalize">habit tracker</h1>
    </div>
    <div className="container py-32">
      <AddHabitForm/>
    </div>
    </>
  )
}

export default App
