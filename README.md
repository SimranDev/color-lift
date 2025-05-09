# Color Lift

Color Lift is a modern browser extension designed to help developers and designers work with color palettes efficiently. It provides tools for picking, managing, and utilizing colors in various formats, making it an essential utility for anyone working on UI/UX design or front-end development.

## Features

- **Color Picker**: Easily pick colors from the screen using the integrated eye-dropper tool.
- **Predefined Palettes**: Access popular color palettes like Material, Nord, Radix, and Tailwind.
- **Favorites Management**: Save and manage your favorite colors and palettes.
- **Format Toggle**: Switch between different color formats (e.g., HEX, RGB, HSL) effortlessly.
- **Recent Colors**: Quickly access recently used colors.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: Ensures type safety and better developer experience.
- **Tailwind CSS**: For styling and responsive design.
- **WXT**: A framework for building modern web applications.
- **PNPM**: For fast and efficient package management.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/color-lift.git
   ```

2. Navigate to the project directory:

   ```bash
   cd color-lift
   ```

3. Install dependencies using PNPM:

   ```bash
   pnpm install
   ```

4. Build the project:

   ```bash
   pnpm build
   ```

5. Load the extension in your browser:

   - **For Chrome**:

     1. Open `chrome://extensions/` in your browser.
     2. Enable "Developer mode" in the top-right corner.
     3. Click "Load unpacked" and select the `dist` folder from the project directory.

   - **For Firefox**:
     1. Open `about:debugging#/runtime/this-firefox` in your browser.
     2. Click "Load Temporary Add-on..." and select any file from the `dist` folder.

6. The extension should now be loaded and ready to use.

## Usage

1. Use the color picker tool to select colors from your screen.
2. Browse through predefined palettes or create your own.
3. Save your favorite colors for quick access.
4. Toggle between different color formats as needed.

## Contributing

Contributions are welcome! If you'd like to contribute to Color Lift, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add new feature"
   ```

4. Push to your branch:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by popular design tools and frameworks.
- Thanks to the open-source community for their contributions.

---

Feel free to explore, use, and contribute to Color Lift. Happy designing!
