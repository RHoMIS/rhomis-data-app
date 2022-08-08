# RHoMIS 2.0 Front End Application

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

* Looking at setting different environments for development, testing, and production. See [here](https://serverless-stack.com/chapters/environments-in-create-react-app.html), [here](https://www.opcito.com/blogs/managing-multiple-environment-configurations-in-react-app), and [here](https://create-react-app.dev/docs/adding-custom-environment-variables/)
* Testing tutorial available [here](https://www.youtube.com/watch?v=ZmVBCpefQe8). Example testing with API mocks found in [this tutorial](https://testing-library.com/docs/react-testing-library/example-intro/)

* Server mocks made using [this framework](https://github.com/mswjs/examples/tree/master/examples/rest-react)
* [Tutorial](https://tacomanator.medium.com/environments-with-create-react-app-7b645312c09d) on managing the different environments and how to integrate them into builds


# Setup for Local Development

1. Clone this repository
2. Install npm dependencies: `npm i`
3. Run the app: `npm start`
   - By default, it will run on localhost:3000. This is the default for projects created with [Create React App](https://github.com/facebook/create-react-app).
   - You can change the default port by overwriting the .env file:
     - `npm start` will use the `.env.development` file. You can overwrite this locally by copying the file to `.env.development.local`.
     - To update the port, add a new "PORT" variable.
     - For more information on how Create React App handles .env files, see the documentation [here](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env)


This app depends on the [Rhomis Authenticator App](https://github.com/l-gorman/rhomis-authenticator) to manage users and authentication. You should run that node app alongside on another localhost port during development.

