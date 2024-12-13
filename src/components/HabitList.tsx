import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/Button";
import { FaCheckCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { toggleHabit } from "@/redux/app/habit/habitSlice";

const HabitList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);

  const today = new Date().toISOString().split("T")[0];

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="sm:max-w-[500px] md:max-w-[800px] mx-auto">
      <ul className="flex flex-col gap-y-6">
        {habits.map((habit) => (
          <li
            className="py-2 px-6 w-full border shadow rounded-md flex items-center justify-between"
            key={habit.id}
          >
            <div>
              <h3 className="text-2xl bold capitalize">{habit.name}</h3>
              <p className="text-sm text-gray-400 capitalize">
                {habit.frequency}
              </p>
            </div>
            <div className="flex gap-x-1">
              <Button
              onClick={()=>
                dispatch(toggleHabit({id:habit.id, date:today}))
              }
                className={`bg-transparent hover:bg-transparent border ${
                  habit.completedDates.includes(today)
                    ? "text-green-500 border-green-500"
                    : "text-blue-500 border-blue-500"
                }`}
              >
                <FaCheckCircle />
                <span>
                {
                  habit.completedDates.includes(today)
                    ? "Completed"
                    : "Mark Completed"
                }
                </span>
              </Button>
              <Button
                className={`bg-transparent hover:bg-transparent border text-red-500 border-red-500`}
              >
                <TiDelete />
                <span>Delete</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitList;
