import supabase from "@/supabaseClient";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completedDates: string[];
  createdAt: string;
  rejectValue?: string
}

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HabitState = {
  habits: [],
  isLoading: false,
  error: null,
};

export const fetchHabits = createAsyncThunk("habits/fetchHabits", async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from("habits").select("*");

  if (error) {
    return rejectWithValue(error.message);
  }

  return data as Habit[]; // Return the data as a list of habits
});



export const addHabitToSupabase = createAsyncThunk<
Habit, // This is the return type when the action is fulfilled
  { name: string; frequency: "daily" | "weekly" }, // The argument type for the thunk
  { rejectValue: string } // This defines the type of the rejection value (error message)
>(
  "habits/addHabit",
  async (habitData: { name: string; frequency: "daily" | "weekly" }, { rejectWithValue }) => {
    const { data, error } = await supabase.from("habits").insert([
      {
        name: habitData.name,
        frequency: habitData.frequency,
        completedDates: [],
        createdAt: new Date().toISOString(),
      },
    ])
    .select("*");

    if (error) {
      return rejectWithValue(error.message);
    }
    
    if (data && data.length > 0) {
      return data[0]; // Return the first inserted row
    } else {
      throw new Error("No data returned from Supabase");
    }

    // if (data !== null && data !== undefined) {
    //   return data[0]; // Return the first element if data is not null
    // } else {
    //   // Handle the case where data is null or undefined
    //   throw new Error('Data is null or undefined');
    // }
     // Return the newly created habit
  }
);

export const removeHabitFromSupabase = createAsyncThunk(
  "habits/removeHabit",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      return rejectWithValue(error.message);
    }

    return id; // Return the ID of the removed habit
  }
);


// export const toggleHabitCompletionInSupabase = createAsyncThunk(
//   "habits/toggleHabit",
//   async (toggleData: { id: string; date: string }, { rejectWithValue }) => {
//     // Fetch the existing habit from Supabase
//     const { data, error: fetchError } = await supabase
//       .from("habits")
//       .select("completedDates")
//       .eq("id", toggleData.id)
//       .single();

//     if (fetchError) {
//       return rejectWithValue(fetchError.message);
//     }

//     const completedDates: string[] = data.completedDates;
//     const dateIndex = completedDates.indexOf(toggleData.date);

//     // Toggle the date
//     if (dateIndex > -1) {
//       completedDates.splice(dateIndex, 1); // Remove date if it exists
//     } else {
//       completedDates.push(toggleData.date); // Add date if it doesn't exist
//     }

//     // Update the habit in Supabase
//     const { error: updateError } = await supabase
//       .from("habits")
//       .update({ completedDates })
//       .eq("id", toggleData.id);

//     if (updateError) {
//       return rejectWithValue(updateError.message);
//     }

//     return { id: toggleData.id, completedDates }; // Return updated data
//   }
// );

export const toggleHabitCompletionInSupabase = createAsyncThunk(
  "habits/toggleHabit",
  async (toggleData: { id: string; date: string }, { rejectWithValue }) => {
    // Fetch the existing habit from Supabase
    const { data, error: fetchError } = await supabase
      .from("habits")
      .select("completedDates")
      .eq("id", toggleData.id)
      .single();

    if (fetchError) {
      return rejectWithValue(fetchError.message);
    }

    const completedDates: string[] = data.completedDates;
    const dateIndex = completedDates.indexOf(toggleData.date);

    // Toggle the date
    if (dateIndex > -1) {
      completedDates.splice(dateIndex, 1); // Remove date if it exists
    } else {
      completedDates.push(toggleData.date); // Add date if it doesn't exist
    }

    // Check if the habit streak is broken (i.e., if any days are missed)
    completedDates.sort(); // Sort completedDates in ascending order
    const now = new Date().toISOString().split("T")[0]; // Get today's date

    // If the streak is broken, reset the streak count
    if (!completedDates.includes(now)) {
      completedDates.length = 0; // Reset completed dates if the habit was not completed today
    }

    // Update the habit in Supabase
    const { error: updateError } = await supabase
      .from("habits")
      .update({ completedDates })
      .eq("id", toggleData.id);

    if (updateError) {
      return rejectWithValue(updateError.message);
    }

    return { id: toggleData.id, completedDates }; // Return updated data
  }
);





const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    updateHabitStreaks: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
    // addHabit: (
    //   state,
    //   action: PayloadAction<{ name: string; frequency: "daily" | "weekly" }>
    // ) => {
    //   const newHabit: Habit = {
    //     id: Date.now().toString(),
    //     name: action.payload.name,
    //     frequency: action.payload.frequency,
    //     completedDates: [],
    //     createdAt: new Date().toISOString(),
    //   };

    //   state.habits.push(newHabit);
    // },
    // toggleHabit: (
    //   state,
    //   action: PayloadAction<{ id: string; date: string }>
    // ) => {
    //   const habit = state.habits.find((h) => h.id === action.payload.id);

    //   if (habit) {
    //     const index = habit.completedDates.indexOf(action.payload.date);
    //     if (index > -1) {
    //       habit.completedDates.splice(index, 1);
    //     } else {
    //       habit.completedDates.push(action.payload.date);
    //     }
    //   }
    // },
    // removeHabit: (state, action: PayloadAction<{ id: string }>) => {
    //   const index = state.habits.findIndex((h) => h.id === action.payload.id);
    //   state.habits.splice(index, 1);
    // },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchHabits.pending, (state) => {
  //       state.isLoading = true;
  //     })
  //     .addCase(fetchHabits.fulfilled, (state, action) => {
  //       state.isLoading = false;
  //       state.habits = action.payload;
  //     })
  //     .addCase(fetchHabits.rejected, (state, action) => {
  //       state.isLoading = false;
  //       state.error = action.error.message || "failed to fetch habits";
  //     });
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Failed to fetch habits";
      })
      .addCase(addHabitToSupabase.fulfilled, (state, action) => {
        if (action.payload) {
          // Ensure action.payload is a Habit object and add it to state.habits
          state.habits.push(action.payload);
        }
        // state.habits.push(action.payload); // here is the error
      })
      .addCase(addHabitToSupabase.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to add habit";
      })
      .addCase(removeHabitFromSupabase.fulfilled, (state, action) => {
        state.habits = state.habits.filter((habit) => habit.id !== action.payload);
      })
      .addCase(removeHabitFromSupabase.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to remove habit";
      })
      .addCase(toggleHabitCompletionInSupabase.fulfilled, (state, action) => {
        const habit = state.habits.find((h) => h.id === action.payload.id);
        if (habit) {
          habit.completedDates = action.payload.completedDates;
        }
      })
      .addCase(toggleHabitCompletionInSupabase.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to toggle habit completion";
      });
  },
});

// export const { addHabit, toggleHabit, removeHabit } = habitSlice.actions;
export const { updateHabitStreaks } = habitSlice.actions;
export default habitSlice.reducer;
