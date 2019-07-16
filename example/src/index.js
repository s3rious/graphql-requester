import CountryList from "./components/CountryList";

window.addEventListener("load", () => {
  const countryList = new CountryList(document.getElementById("countryList"));

  countryList.render();
});
