<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/it-at-m/digiwf-json-serialization">
    <img src="images/logo.png" alt="Logo" height="200">
  </a>

<h3 align="center">DigiWF Load Testing</h3>

  <p align="center">
    Load tests with k6 for digiwf
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project



<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

This project is built with:

* [K6](https://k6.io/)
* [Typescript](https://www.typescriptlang.org/), [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

Make sure that digiWF engine is running and the processes and json schemas required for the tests are deployed.
To enable auto deployment of test processes activate the `loadtest` profile. 

1. Compile the test sources from typescript to javascript

```
npm run build
```

2. Set required env variables

```
# set required env variables
export ENGINE="http://localhost:39147"
export AUTH_URL="https://ssodev.muenchen.de/auth/realms/P82/protocol/openid-connect/token"
export USERNAME="<your-ssodev-username>"
export NAME="<your-name>"
export PASSWORD="<your-password-for-ssodev>"
export CLIENT_SECRET="0630b79a-19ed-4f98-ac21-533f324e1cad"
```

3. Execute the tests

```
# execute tests
k6 run dist/start-process-test.js
k6 run dist/user-task-test.js
k6 run dist/group-task-test.js
```


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- DOCUMENTATION -->
## Documentation

More details are available under [docs](docs/docs.adoc).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/screenshot.png
