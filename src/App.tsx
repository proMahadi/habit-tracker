import AddHabitForm from "./components/AddHabitForm"
import HabitList from "./components/HabitList"
import HabitStats from "./components/HabitStats"


function App() {

  return (
    <main className=" flex flex-col justify-center items-center">
    <div>
      <h1 className="text-6xl font-semibold text-center capitalize">habit tracker</h1>
    </div>
    <div className="container py-20 px-3">
      <AddHabitForm/>
      <HabitList/>
      <HabitStats/>
    </div>
    </main>
  )
}

export default App
