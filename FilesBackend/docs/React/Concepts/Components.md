# React Components

## **React Components High-Level Overview**

### **What is a React Component?**

A **component** is a reusable building block that returns UI.\
Think of components as **functions that describe what the UI looks like**.

They control:

* **Structure** (HTML/JSX)

* **Data flow** (via props)

* **Behavior** (via event handlers)

* **Reactivity** (via state + rendering cycle)

### **Why Components?**

React encourages **modular UI** by letting you break apps into small pieces:

* Navbar

* Button

* Card

* Todo List

* Todo Item

* Page layouts

Each component:\
✔ is reusable\
✔ is independent\
✔ is testable\
✔ can be composed together to make bigger UIs

### **Two Types of Components**

#### **1. Presentational Components (UI-focused)**

* Mostly markup + styles

* Receive data via props

* Don’t contain complex logic

Example: `Button`, `Card`, `Avatar`, `Title`

#### **2. Container Components (logic-focused)**

* Manage data and behavior

* Fetch, transform, or store state

* Render presentational components

Example:\
`TodoListContainer` → loads todos + passes them into `TodoList`.

### **How Components Work Together**

React apps are **trees of components**:

`App`\
`├── Navbar`\
`├── Sidebar`\
`└── Page`\
`├── CardList`\
`│ ├── Card`\
`│ ├── Card`\
`└── Footer`

Data flows **top → down** through props.

### **What Causes a Component to Render?**

A component re-renders when:

* **Its props change**

* **Its state changes**

* **Its parent re-renders**

(You’ll cover state and hooks in your “UI hooks” section later.)

## **Component-Specific Concepts**

Now, here are the *essentials* for understanding React components at a deeper level — without introducing hooks yet.

### **1. Component Syntax**

```React
function ComponentName() {
  return <div>Hello</div>;
}
```

Rules:

* Must start with a **capital letter**

* Must return **JSX**

* Must be **pure** (same input → same output)

### **2. Props (Component Inputs)**

Props are how you **configure** components. Props can be used like arguments to a component. In the below example, the prop is an object with a name property that is a string. Making multiple Welcome components with different names will render those names dynamically. If a parent component has multiple children components, it can pass data to them.

```text
function Welcome({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}

//-------------- in parent component

  <Welcome name="Daylen" />
  <Welcome name="Bob" />
```

Props are:

* Read-only

* Passed from parent → child

* Great for reusability

### **3. Children (Nested JSX)**

Makes a component a “wrapper”:

```text
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

Use:

<Card>
  <h1>Title</h1>
  <p>Details</p>
</Card>
```

### **4. Conditional Rendering**

Render different UI based on conditions:

```text
{isLoggedIn ? <Dashboard /> : <Login />}

// Or inline:

{count > 0 && <span>You have items</span>}
```

### **5. Rendering Lists**

Components often repeat UI:

```text
function TodoList({ todos }: { todos: string[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo}>{todo}</li>
      ))}
    </ul>
  );
}
```

Common rules:

* Always set a **key**

* Keys must be **stable & unique**

### **6. Events (OnClick, OnChange, etc.)**

```text
function Button({ onClick, text }: { onClick: () => void; text: string }) {
  return <button onClick={onClick}>{text}</button>;
}

Use:

<Button text="Save" onClick={() => console.log("saved")} />
```

### **7. Composing Components Together**

Larger UI = smaller components put together:

```text
function UserCard({ name, avatarUrl }: { name: string; avatarUrl: string }) {
  return (
    <div className="user-card">
      <img src={avatarUrl} />
      <p>{name}</p>
    </div>
  );
}

Then used inside a parent:

<UserCard name="Daylen" avatarUrl="/me.png" />
```

### **8. Component File Structure Pattern**

Most teams organize like this:

```text
src/
  components/
    Button/
      Button.tsx
      Button.css
      index.ts
    Card/
      Card.tsx
      Card.css
      index.ts
```

A component folder usually contains:

* the component

* its styles

* its variations

* maybe tests

* an `index.ts` for clean exports

### **9. Component Export Patterns**

### Named export:

```text
export function Navbar() { ... }
```

### Default export:

```text
export default function Navbar() { ... }
```

### Barrel export:

```text
export * from './Navbar';
export * from './Logo';

Then you import cleanly:

import { Navbar, Logo } from "@/components";
```

### **10. Component Types You Will Commonly Build**

### Presentational

Pure UI, props only\
Example: Button, Input, Badge, Avatar, Card

### Container

Logic + data + state\
Example: TodoListContainer, AuthProvider

### Layout

Defines page layout\
Example: Sidebar, Header, PageWrapper

### Pages

Full screens in a router\
Example: HomePage, DashboardPage
