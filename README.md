<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/it-at-m/digiwf-load-test">
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

This projects contains load tests for the digiWF platform. For load testing we use k6 and typescript.

Currently, there are only load tests for the digiWF engine. But soon more will follow.

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
export AUTH_URL="<url to your keycloak>"
export USERNAME="<your-ssodev-username>"
export NAME="<your-name>"
export PASSWORD="<your-password-for-ssodev>"
export CLIENT_SECRET="<client-secret>"
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


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

it@m - opensource@muenchendigital.io

Join our [Slack Channel](https://join.slack.com/t/digiwf/shared_invite/zt-14jxazj1j-jq0WNtXp7S7HAwJA7tKgpw) for more
information!

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/it-at-m/digiwf-load-test.svg?style=for-the-badge
[contributors-url]: https://github.com/it-at-m/digiwf-load-test/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/it-at-m/digiwf-load-test.svg?style=for-the-badge
[forks-url]: https://github.com/it-at-m/digiwf-load-test/network/members
[stars-shield]: https://img.shields.io/github/stars/it-at-m/digiwf-load-test.svg?style=for-the-badge
[stars-url]: https://github.com/it-at-m/digiwf-load-test/stargazers
[issues-shield]: https://img.shields.io/github/issues/it-at-m/digiwf-load-test.svg?style=for-the-badge
[issues-url]: https://github.com/it-at-m/digiwf-load-test/issues
[license-shield]: https://img.shields.io/github/license/it-at-m/digiwf-load-test.svg?style=for-the-badge
[license-url]: https://github.com/it-at-m/digiwf-load-test/blob/master/LICENSE
[product-screenshot]: images/screenshot.png

