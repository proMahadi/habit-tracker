import AddHabitForm from "./components/AddHabitForm"
import HabitList from "./components/HabitList"


function App() {

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
    <div>
      <h1 className="text-6xl font-semibold text-center capitalize">habit tracker</h1>
    </div>
    <div className="container py-32 px-3">
      <AddHabitForm/>
      <HabitList/>
    </div>
    </main>
  )
}

export default App
