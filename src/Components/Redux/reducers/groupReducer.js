import { createSlice } from '@reduxjs/toolkit';

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
  },
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    addMember: (state, action) => {
      const { groupId, member } = action.payload;
      const group = state.groups.find(g => g.id === groupId);
      if (group) {
        group.members.push(member);
      }
    },
    addExpense: (state, action) => {
      const { groupId, expense } = action.payload;
      const group = state.groups.find(g => g.id === groupId);
      if (group) {
        group.expenses.push(expense);
      }
    },
  },
});

export const { addGroup, addMember, addExpense } = groupSlice.actions;

export default groupSlice.reducer;
