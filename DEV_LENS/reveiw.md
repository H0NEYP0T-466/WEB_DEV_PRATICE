The code you provided has a couple of issues, likely typos and missing a keyword if this is Lua:

1.  **Parameter Mismatch:** You defined the function with parameters `a` and `d` (`function add(a,d)`), but then you tried to add `a` and `b` (`return a+b`). The variable `b` is not defined within the scope of this function.
2.  **Missing `end` (Lua):** In Lua, every `function` definition needs to be closed with an `end` keyword.

Assuming you meant to add the two given parameters (`a` and `d`), here's the corrected version in **Lua**:

```lua
function add(a, d)
    return a + d
end
```

**Explanation of Corrections:**

*   **`return a + d`**: Changed `b` to `d` to correctly use the second parameter that was defined for the function.
*   **`end`**: Added the closing `end` keyword, which is mandatory for function definitions in Lua.

**How to use it:**

```lua
-- Define the function
function add(a, d)
    return a + d
end

-- Call the function and print the result
local result1 = add(5, 3)
print("5 + 3 =", result1) -- Output: 5 + 3 = 8

local result2 = add(10, -2)
print("10 + -2 =", result2) -- Output: 10 + -2 = 8
```

---

If this was intended for **JavaScript** (which has similar function syntax but doesn't use `end`):

```javascript
function add(a, d) {
  return a + d;
}

// How to use it in JavaScript:
console.log(add(5, 3));   // Output: 8
console.log(add(10, -2)); // Output: 8
```
In JavaScript, the missing `b` would result in a `ReferenceError: b is not defined`. The `function` uses curly braces `{}` instead of `end`.