import { useState } from "react";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Button } from "./ui/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {  addHabitToSupabase } from "@/redux/app/habit/habitSlice";
// import { addHabit} from "@/redux/app/habit/habitSlice";

const AddHabitForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(
        addHabitToSupabase({
          name,
          frequency,
        })
        // addHabit({
        //   name,
        //   frequency,
        // })
      );
      setName("");
      setFrequency("daily");
    }
  };
  return (
    <form className="sm:max-w-[500px] md:max-w-[800px] mx-auto" onSubmit={handleSubmit}>
      <Input
        value={name}
        type="text"
        placeholder="enter habit name"
        className="capitalize border-black outline-none "
        onChange={(e) => setName(e.target.value)}
      />
      <div className="my-8">
        <label htmlFor="frequency" className="font-medium text-2xl">
          Frequency
        </label>
        <Select
          value={frequency}
          onValueChange={(value) => setFrequency(value as "daily" | "weekly")}
        >
          <SelectTrigger className="focus:outline-none mt-6 border-black">
            <SelectValue placeholder="Select Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit" className="w-full mt-4 hover:bg-blue-500 ">
          Add Habit
        </Button>
      </div>
    </form>
  );
};

export default AddHabitForm;
