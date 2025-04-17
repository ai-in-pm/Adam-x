/**
 * To-Do List functionality for Adam-X
 * 
 * This module provides to-do list management capabilities integrated with Adam-X.
 */

import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

// Define the structure of a to-do item
export interface TodoItem {
  id: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdDate: string;
  dueDate?: string;
}

// Define the structure of the to-do list
export interface TodoList {
  items: TodoItem[];
}

// Path to the to-do list data file
const TODO_DATA_FILE = path.join(homedir(), '.adam-x', 'todo.json');

/**
 * Ensure the Adam-X configuration directory exists
 */
function ensureConfigDir(): void {
  const configDir = path.dirname(TODO_DATA_FILE);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

/**
 * Load the to-do list from the data file
 * @returns The to-do list
 */
export function loadTodoList(): TodoList {
  ensureConfigDir();
  
  if (!fs.existsSync(TODO_DATA_FILE)) {
    return { items: [] };
  }
  
  try {
    const data = fs.readFileSync(TODO_DATA_FILE, 'utf-8');
    return JSON.parse(data) as TodoList;
  } catch (error) {
    console.error(`Error loading to-do list: ${error}`);
    return { items: [] };
  }
}

/**
 * Save the to-do list to the data file
 * @param todoList The to-do list to save
 */
export function saveTodoList(todoList: TodoList): void {
  ensureConfigDir();
  
  try {
    fs.writeFileSync(TODO_DATA_FILE, JSON.stringify(todoList, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error saving to-do list: ${error}`);
  }
}

/**
 * Add a new item to the to-do list
 * @param description The description of the to-do item
 * @param priority The priority of the to-do item
 * @param dueDate The due date of the to-do item (optional)
 * @returns The updated to-do list
 */
export function addTodoItem(
  description: string,
  priority: 'high' | 'medium' | 'low' = 'medium',
  dueDate?: string
): TodoList {
  const todoList = loadTodoList();
  
  const newItem: TodoItem = {
    id: Date.now().toString(),
    description,
    completed: false,
    priority,
    createdDate: new Date().toISOString().split('T')[0],
    dueDate
  };
  
  todoList.items.push(newItem);
  saveTodoList(todoList);
  
  return todoList;
}

/**
 * List all to-do items
 * @param showCompleted Whether to show completed items
 * @returns The to-do list items
 */
export function listTodoItems(showCompleted: boolean = true): TodoItem[] {
  const todoList = loadTodoList();
  
  if (!showCompleted) {
    return todoList.items.filter(item => !item.completed);
  }
  
  return todoList.items;
}

/**
 * Mark a to-do item as completed
 * @param id The ID of the to-do item to mark as completed
 * @returns The updated to-do list
 */
export function markTodoItemCompleted(id: string): TodoList {
  const todoList = loadTodoList();
  
  const item = todoList.items.find(item => item.id === id);
  if (item) {
    item.completed = true;
    saveTodoList(todoList);
  }
  
  return todoList;
}

/**
 * Remove completed to-do items
 * @returns The updated to-do list
 */
export function removeCompletedTodoItems(): TodoList {
  const todoList = loadTodoList();
  
  todoList.items = todoList.items.filter(item => !item.completed);
  saveTodoList(todoList);
  
  return todoList;
}

/**
 * Format a to-do item for display
 * @param item The to-do item to format
 * @returns The formatted to-do item
 */
export function formatTodoItem(item: TodoItem): string {
  const status = item.completed ? '✓' : '□';
  const prioritySymbols: Record<string, string> = {
    high: '❗',
    medium: '⚠️',
    low: 'ℹ️'
  };
  const prioritySymbol = prioritySymbols[item.priority] || '';
  const dueStr = item.dueDate ? ` (Due: ${item.dueDate})` : '';
  
  return `${status} ${prioritySymbol} ${item.description}${dueStr}`;
}
