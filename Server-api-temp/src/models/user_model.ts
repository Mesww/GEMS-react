import mongoose, { Collection } from "mongoose";

interface TodoI {
  title: string;
  description: string;
}

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
  },
  { collection: "todos" }
);

interface TodoDocument extends mongoose.Document {
  title: string;
  description: string;
  set(x: TodoI): this; // Define `set` as an instance method
}

// Create the model with type annotations
const Todo = mongoose.model<TodoDocument>("Todo", todoSchema);

// Extend the model with the `set` method
Todo.prototype.set = function (x: TodoI) {
  this.title = x.title;
  this.description = x.description;
  return this.save(); // Save the document to the database
};

// Usage:
const todo = new Todo();
//todo.set({ title: "Some title", description: "Some description" });

export { Todo };
