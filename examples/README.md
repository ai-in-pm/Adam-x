# Quick start examples

This directory bundles some self‑contained examples using the Adam-X. If you have never used the Adam-X before, and want to see it complete a sample task, start with running **camerascii**. You'll see your webcam feed turned into animated ASCII art in a few minutes.

If you want to get started using the Adam-X directly, skip this and refer to the prompting guide.

## Structure

Each example contains the following:
```
example‑name/
├── run.sh           # helper script that launches a new Adam-X session for the task
├── task.yaml        # task spec containing a prompt passed to Adam-X
├── template/        # (optional) starter files copied into each run
└── runs/            # work directories created by run.sh
```

**run.sh**: a convenience wrapper that does three things:
- Creates `runs/run_N`, where *N* is the number of a run.
- Copies the contents of `template/` into that folder (if present).
- Launches the Adam-X with the description from `task.yaml`.

**template/**: any existing files or markdown instructions you would like Adam-X to see before it starts working.

**runs/**: the directories produced by `run.sh`.

## Running an example

1. **Run the helper script**:
```
cd camerascii
./run.sh
```
2. **Interact with the Adam-X**: the CLI will open with the prompt: "*Take a look at the screenshot details and implement a webpage that uses a webcam to style the video feed accordingly…*" Confirm the commands Adam-X requests to generate `index.html`.

3. **Check its work**: when Adam-X is done, open ``runs/run_1/index.html`` in a browser.  Your webcam feed should now be rendered as a cascade of ASCII glyphs. If the outcome isn't what you expect, try running it again, or adjust the task prompt.


## Other examples
Besides **camerascii**, you can experiment with:

- **build‑adam-x‑demo**: recreate the original 2021 Adam-X YouTube demo.
- **impossible‑pong**: where Adam-X creates more difficult levels.
- **prompt‑analyzer**: make a data science app for clustering [prompts](https://github.com/f/awesome-chatgpt-prompts).
