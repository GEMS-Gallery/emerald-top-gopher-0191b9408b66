import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";

actor {
  // Define the Task type with category
  type Task = {
    id: Nat;
    description: Text;
    category: Text;
    completed: Bool;
    completedAt: ?Time.Time;
  };

  // Stable variables
  stable var taskId: Nat = 0;
  stable var tasks: [Task] = [];
  stable var defaultCategories: [Text] = ["Work", "Personal", "Shopping", "Health", "Finance"];

  // Add a new task with category
  public func addTask(description: Text, category: Text) : async Nat {
    let newTask: Task = {
      id = taskId;
      description = description;
      category = category;
      completed = false;
      completedAt = null;
    };
    tasks := Array.append(tasks, [newTask]);
    taskId += 1;
    taskId - 1
  };

  // Complete a task
  public func completeTask(id: Nat) : async Bool {
    let updatedTasks = Array.map<Task, Task>(tasks, func (task) {
      if (task.id == id) {
        {
          id = task.id;
          description = task.description;
          category = task.category;
          completed = true;
          completedAt = ?Time.now();
        }
      } else {
        task
      }
    });
    tasks := updatedTasks;
    true
  };

  // Delete a task
  public func deleteTask(id: Nat) : async Bool {
    let filteredTasks = Array.filter<Task>(tasks, func (task) { task.id != id });
    if (tasks.size() != filteredTasks.size()) {
      tasks := filteredTasks;
      true
    } else {
      false
    }
  };

  // Get all tasks
  public query func getTasks() : async [Task] {
    tasks
  };

  // Get all categories (default + user-created)
  public query func getCategories() : async [Text] {
    let userCategories = Array.foldLeft<Task, [Text]>(tasks, [], func (acc, task) {
      if (Array.find<Text>(acc, func (cat) { cat == task.category }) == null) {
        Array.append(acc, [task.category])
      } else {
        acc
      }
    });
    Array.append(defaultCategories, userCategories)
  };

  // Get default categories
  public query func getDefaultCategories() : async [Text] {
    defaultCategories
  };
}
