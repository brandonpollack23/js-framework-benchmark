import { createSignal, createSelector, batch } from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";

let idCounter = 1;
const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ],
  colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ],
  nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const label = `${adjectives[_random(adjectives.length)]} ${
      colours[_random(colours.length)]
    } ${nouns[_random(nouns.length)]}`;
    data[i] = {
      id: idCounter++,
      label,
    };
  }
  return data;
}

const Button = ({ id, text, fn }) => (
  <div class="col-sm-6 smallpad">
    <button
      id={id}
      class="btn btn-primary btn-block"
      type="button"
      onClick={fn}
    >
      {text}
    </button>
  </div>
);

const App = () => {
  const [data, setData] = createStore([]),
    [selected, setSelected] = createSignal(null),
    run = () => setData(buildData(1000)),
    runLots = () => setData(buildData(10000)),
    add = () => setData((d) => [...d, ...buildData(1000)]),
    update = () =>
      batch(() => {
        for (let i = 0; i < data.length; i += 10)
          setData(i, "label", (l) => l + " !!!");
      }),
    swapRows = () => {
      let tmp = data[1];
      setData(1, data[998]);
      setData(998, tmp);
    },
    clear = () => setData([]),
    remove = (id) =>
      setData(
        data.findIndex((d) => d.id === id),
        undefined
      ),
    isSelected = createSelector(selected);

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>SolidJS Keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <For each={data}>
            {(row) => {
              let rowId = row.id;
              return (
                <tr class={isSelected(rowId) ? "danger" : ""}>
                  <td class="col-md-1" textContent={rowId} />
                  <td class="col-md-4">
                    <a onClick={[setSelected, rowId]} textContent={row.label} />
                  </td>
                  <td class="col-md-1">
                    <a onClick={[remove, rowId]}>
                      <span
                        class="glyphicon glyphicon-remove"
                        aria-hidden="true"
                      />
                    </a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};

render(App, document.getElementById("main"));
