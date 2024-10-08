export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({ 'icon' : IDL.Text, 'name' : IDL.Text });
  const Time = IDL.Int;
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'completedAt' : IDL.Opt(Time),
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'completeTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getDefaultCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
