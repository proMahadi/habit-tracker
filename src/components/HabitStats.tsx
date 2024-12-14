import { fetchHabits, Habit } from "@/redux/app/habit/habitSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Progress } from "./ui/Progress";

const HabitStats: React.FC = () => {
  const { habits, isLoading, error } = useSelector(
    (state: RootState) => state.habits
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchHabits());
  }, []);

  const getCompletedToday=()=>{
    const today = new Date().toISOString().split("T")[0];
    return habits.filter((habit)=>habit.completedDates.includes(today)).length
  }


    const getStreak = (habit: Habit) => {
      let streak = 0;
      const currentDate = new Date();
  
      while (true) {
        const dateString = currentDate.toISOString().split("T")[0];
  
        if (habit.completedDates.includes(dateString)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    };

    const getLongestStreak =()=>{
        return Math.max(...habits.map(getStreak),0)
    }


  if (isLoading) {
    return <Progress className="sm:max-w-[500px] md:max-w-[800px] mx-auto my-10" value={80}/>;
  }
  if (error) {
    return <h1 className="text-6xl text-red-500 mx-auto my-10 uppercase">error!</h1>
  }
  return (
    <div className="sm:max-w-[500px] md:max-w-[800px] mx-auto">
      <div className="py-2 px-6 w-full border shadow rounded-md mt-8 flex flex-col gap-y-4 ">
        <h3 className="text-2xl bold capitalize">habit statistics</h3>
        <p className="capitalize">total habits : {habits.length}</p>
        <p className="capitalize">completed today : {getCompletedToday()}</p>
        <p className="capitalize">longest streak : {getLongestStreak()}</p>
      </div>
    </div>
  );
};

export default HabitStats;
