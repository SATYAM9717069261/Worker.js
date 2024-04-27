onmessage = function (oEvent) {
  console.log("::Start Prime Calculation from worker::");
  console.log("::Stop Prime Calculation from worker::");
  postMessage("Complete ");
};
