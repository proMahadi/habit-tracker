import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/Button";
import { FaCheckCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { fetchHabits, Habit,  removeHabitFromSupabase, toggleHabitCompletionInSupabase, updateHabitStreaks } from "@/redux/app/habit/habitSlice";
// import { fetchHabits, Habit, removeHabit,  toggleHabit } from "@/redux/app/habit/habitSlice";
import { Progress } from "./ui/Progress";
import { useEffect } from "react";

const HabitList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);

  const today = new Date().toISOString().split("T")[0];

  const dispatch = useDispatch<AppDispatch>();

  // const getStreak = (habit: Habit) => {
  //   let streak = 0;
  //   const currentDate = new Date();

  //   while (true) {
  //     const dateString = currentDate.toISOString().split("T")[0];

  //     if (habit.completedDates.includes(dateString)) {
  //       streak++;
  //       currentDate.setDate(currentDate.getDate() - 1);
  //     } else {
  //       break;
  //     }
  //   }
  //   return streak;
  // };

  const getStreak = (habit: Habit) => {
    let streak = 0;
    // const currentDate = new Date();
    const completedDates = habit.completedDates.map(date => new Date(date));
  
    // Sort completed dates in descending order
    completedDates.sort((a, b) => b.getTime() - a.getTime());
  
    let previousDate = null;
  
    for (const date of completedDates) {
      if (previousDate === null) {
        streak = 1; // Start streak
      } else {
        const difference = (previousDate.getTime() - date.getTime()) / (1000 * 3600 * 24);
        if (difference === 1) {
          streak++; // Increment streak if consecutive day
        } else {
          break; // Break streak if gap is more than 1 day
        }
      }
      previousDate = date;
    }
  
    return streak;
  };

  const updateStreaksDaily = () => {
    const today = new Date().toISOString().split("T")[0];
  
    // Loop through all habits and check if they have a streak
    habits.forEach((habit) => {
      const completedDates = habit.completedDates;
      const lastCompletedDate = completedDates[completedDates.length - 1];
  
      // If the habit was not completed today, reset the streak
      if (lastCompletedDate !== today) {
        // Reset streak if no completion today
        habit.completedDates = []; 
      }
    });
  
    // Update Supabase with new streaks
    dispatch(updateHabitStreaks(habits)); // You'd need to implement an action to update habits
  };
  

  // useEffect(() => {
  //   // Fetch habits from Supabase when the app loads
  //   dispatch(fetchHabits());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchHabits());
    updateStreaksDaily(); // Reset streaks if necessary
  }, [dispatch]);

  return (
    <div className="sm:max-w-[500px] md:max-w-[800px] mx-auto">
      <ul className="flex flex-col gap-y-6">
        {habits.map((habit) => (
          <li
            className="py-2 px-6 w-full border shadow rounded-md "
            key={habit.id}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">
              <div>
                <h3 className="text-2xl bold capitalize">{habit.name}</h3>
                <p className="text-sm text-gray-400 capitalize">
                  {habit.frequency}
                </p>
              </div>
              <div className="flex gap-x-1">
                <Button
                  onClick={() =>
                    dispatch(toggleHabitCompletionInSupabase({ id: habit.id, date: today }))
                  }
                  className={`bg-transparent hover:bg-transparent border ${
                    habit.completedDates.includes(today)
                      ? "text-green-500 border-green-500"
                      : "text-blue-500 border-blue-500"
                  }`}
                >
                  <FaCheckCircle />
                  <span>
                    {habit.completedDates.includes(today)
                      ? "Completed"
                      : "Mark Completed"}
                  </span>
                </Button>
                <Button
                  onClick={() => dispatch(removeHabitFromSupabase(habit.id))}
                  className={`bg-transparent hover:bg-transparent border text-red-500 border-red-500`}
                >
                  <TiDelete />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-black font-medium capitalize">
                current streak : {getStreak(habit)} days
              </p>
              <Progress className="mt-4" value={(getStreak(habit)/30)*100}/>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitList;
