import { useState } from "react"
import { Input } from "./ui/Input";


const AddHabitForm:React.FC = () => {

    const [name,setName]=useState<string>("");
    const [frequency,setFrequency]=useState<"daily" | "weekly">("daily")
  return (
    <div className="max-w-[500px]">
        <Input type="text" placeholder="enter habit name" className="capitalize"/>
    </div>
  )
}

export default AddHabitForm