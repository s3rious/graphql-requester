// tslint:disable: no-console

import { Requester, dataExtract } from "graphql-requester";
import * as _css from "./index.css";

const logger = (ctx) => {
  console.log('Request started', `\n name: ${ctx.name}`, `\n query: ${ctx.query}`)
  const time = `Request for "${ctx.name}" finished after`
  console.time(time)

  ctx.call.then(() => {
    console.timeEnd(time)
  })
}

const request = Requester({
  middlewares: [dataExtract, logger],
  url: "https://countries.trevorblades.com/"
});

export default class CountryList {
  constructor(elem) {
    if (!elem) {
      return;
    }
    this.elem = elem;
    this.countries = null;
  }

  render() {
    if (!this.countries) {
      return request("countries", `{
        countries {
          name
          emoji
          phone
        }
      }`).then(
        ({ countries }) => {
          this.countries = countries
            .sort((left, right) => parseInt(left.phone, 10) - parseInt(right.phone, 10))
            .map(({ emoji, name }) => ({ emoji, name }));

          this.render();
        },
        ({ error }) => {
          console.error(error);

          this.countries = [
            {
              emoji: "🇺🇸",
              name: "United States" 
            },
            {
              emoji: "🇷🇺",
              name: "Russia"
            },
            {
              emoji: "🇺🇦",
              name: "Ukraine"
            },
            {
              emoji: "🇮🇱",
              name: "Israel"
            }
          ];

          this.render();
        }
      );
    }

    if (this.elem) {
      const countries = this.countries
        .map(({ name, emoji }) => `
          <li data-emoji="${emoji}">${name}</li>
        `)
        .join("");

      this.elem.innerHTML = `
        <ul data-component="CountryList">
          ${countries}
        </ul>
      `;
    }
  }
}
