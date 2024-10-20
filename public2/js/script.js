console.log("to aqui materialize")

url =
  "/pessoas";
fetch(url)
.then((res) => {
  return res.json();
})
.then((pessoas) => {
  console.log(pessoas);
});