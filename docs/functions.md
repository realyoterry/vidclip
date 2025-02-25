# Functions

### `getConfig()`
> Gets the current configuration settings of the recorder.
- **Arguments:** `None`
- **Returns:** An object with the current recording options
- **Type:** Getter function

Example usage:

```js
console.log(recorder.getConfig()); // current recorder configuration
```

---

### `start({ stopAfter })`
> Starts the recording process. Optionally, you can specify a duration to stop after.
- **Arguments:**
    - `{ stopAfter? }` (optional) → Type: `number` (in seconds)
- **Returns**: None
- **Type:** Public function

Example usage:

```javascript
recorder.start({ stopAfter: 5 }); // stop after 5 seconds
```

::: info
There is no need to call `stop()` if you have set the `stopAfter` value.
:::

---

### `stop(force?)`
> Stops the recording process and terminates the FFmpeg process.
- **Arguments:**
    - `force?` (optional) → Type: `boolean` (uses `SIGKILL` instead of `SIGINT`)
- **Returns:** `None`
- **Type:** Public function

Example usage:

```javascript
recorder.stop();
```

::: danger
Only set `force` to `true` when necessary, as `SIGKILL` immediately terminates the process without allowing FFmpeg to clean up resources, which may result in incomplete or corrupted recordings.
:::

---

Now you're all set to create your own video recorder!
