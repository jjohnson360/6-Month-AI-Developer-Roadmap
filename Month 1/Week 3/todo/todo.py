#!/usr/bin/env python3
"""
CLI To-Do List
A simple task manager with text-file persistence.
"""

import os

TODO_FILE = "tasks.txt"

def load_tasks():
    if not os.path.exists(TODO_FILE):
        return []
    with open(TODO_FILE, "r") as f:
        return [line.strip() for line in f.readlines()]

def save_tasks(tasks):
    with open(TODO_FILE, "w") as f:
        for task in tasks:
            f.write(f"{task}\n")

def list_tasks(tasks):
    if not tasks:
        print("\nYour to-do list is empty.")
        return
    print("\n--- Current Tasks ---")
    for idx, task in enumerate(tasks, 1):
        print(f"{idx}. {task}")

def main():
    tasks = load_tasks()
    
    while True:
        print("\n=== To-Do Manager ===")
        print("1. View Tasks")
        print("2. Add Task")
        print("3. Remove Task")
        print("4. Exit")
        
        choice = input("Choose an option (1-4): ").strip()
        
        if choice == '1':
            list_tasks(tasks)
        elif choice == '2':
            task_text = input("Enter the task description: ").strip()
            if task_text:
                tasks.append(task_text)
                save_tasks(tasks)
                print(f"Added: '{task_text}'")
            else:
                print("Task cannot be empty.")
        elif choice == '3':
            list_tasks(tasks)
            if tasks:
                try:
                    num = int(input("Enter task number to remove: "))
                    if 1 <= num <= len(tasks):
                        removed = tasks.pop(num - 1)
                        save_tasks(tasks)
                        print(f"Removed: '{removed}'")
                    else:
                        print("Invalid task number.")
                except ValueError:
                    print("Please enter a valid number.")
        elif choice == '4':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please select between 1 and 4.")

if __name__ == "__main__":
    main()