# Description

Google recently released Antigravity, a new AI-first IDE based on VS Code. Many developers are migrating to this editor, but the official PlatformIO IDE extension currently does not function correctly out of the box.

# Current Behavior

When installing the PlatformIO extension in Antigravity:

- The extension installs but fails to activate.
- It conflicts with the internal Python environment (Antigravity ships with Python 3.14, which seems to cause stability issues with the current PIO Core bootstrapping).
- The Extension ID is not recognized correctly by the PIO home process, preventing the sidebar from loading.

# Known Workarounds (Community)

Users on the PlatformIO community forums have found temporary fixes by:

- Manually patching `extension.js` to update the Extension ID.
- Forcing the internal `penv` to use a compatible Python version (e.g., 3.11) instead of the IDE's bundled Python 3.14.

# Request

Please add official support for the Google Antigravity environment. This likely involves:

- Whitelisting the Antigravity engine/product ID.
- Ensuring the Python discovery script handles the Antigravity `PATH` correctly.

# Environment

- OS: [e.g., Windows 11 / macOS Sequoia]
- IDE: Google Antigravity (latest release)
- VS Code Core Version: [Check Help > About]

# References

- Community Discussion: https://community.platformio.org/t/google-antigravity-plateform-io-extension-and-pyhton-version-3-14-crash-plateform-io-does-not-start/53419
