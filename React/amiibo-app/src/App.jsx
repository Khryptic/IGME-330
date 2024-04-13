import { useEffect, useMemo, useState } from "react";
import './App.css'
import { loadXHR } from "./ajax";
import { readFromLocalStorage, writeToLocalStorage } from "./storage";
import Footer from './Footer';
import Header from './Header';
import AmiiboList from "./AmiiboList";
import AmiiboSearchUI from "./AmiiboSearchUI";

// app "globals" and utils
const baseurl = "https://www.amiiboapi.com/api/amiibo/?name=";

const App = () => {
  const savedTerm = useMemo(() => readFromLocalStorage("term") || "", []); 
  const [term, setTerm] = useState(savedTerm);
  const [results, setResults] = useState([]);
  useEffect(() => {
    writeToLocalStorage("term", term);
  }, [term]);

  const searchAmiibo = (name, callback) => {
    loadXHR(`${baseurl}${name}`, callback);
  };

  const parseAmiiboResult = xhr => {
    // get the `.responseText` string
    const string = xhr.responseText;

    // declare a json variable
    let json;

    // try to parse the string into a json object
    json = JSON.parse(string);

    setResults(json.amiibo);
  };

  return <>
    <Header title="Amiibo Finder" />
    <main>
      <AmiiboSearchUI
        term={term}
        setTermFun={setTerm}
        searchFun={searchAmiibo}
        callbackFun={parseAmiiboResult}
      />
      <AmiiboList results={results} />
    </main>
    <Footer
      name="Edward Numrich"
      year={new Date().getFullYear()}
    />
  </>;
};

export default App;