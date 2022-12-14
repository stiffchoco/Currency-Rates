let finalData = null;
      const pairs = [];

      
      async function fetchRateData(currency) {
        const pairs = [];
        $("#group1").empty();
        $("#group2").empty();
        $("#group3").empty();
        $("#length").empty();
        $("#group1").append(" <h1>Group1</h1>");
        $("#group2").append(" <h1>Group2</h1>");
        $("#group3").append(" <h1>Group3</h1>");
        let currencies = ["AUD", "BGN", "CAD", "CHF", "EUR", "USD", "NZD"];
        currencies = currencies.filter((item) => item !== currency);

        const groups = [
          {
            name: "AUD",
            alternates: ["BGN", "CAD", "CHF", "EUR", "USD", "NZD"],
          },
          {
            name: "BGN",
            alternates: ["AUD", "CAD", "CHF", "EUR", "USD", "NZD"],
          },
          {
            name: "CAD",
            alternates: ["AUD", "BGN", "CHF", "EUR", "USD", "NZD"],
          },
          {
            name: "CHF",
            alternates: ["AUD", "BGN", "CAD", "EUR", "USD", "NZD"],
          },
          {
            name: "EUR",
            alternates: ["AUD", "BGN", "CAD", "CHF", "USD", "NZD"],
          },
          {
            name: "USD",
            alternates: ["AUD", "BGN", "CAD", "CHF", "EUR", "NZD"],
          },
          {
            name: "NZD",
            alternates: ["AUD", "BGN", "CAD", "CHF", "EUR", "USD"],
          },
        ];
        let requestPromise = [];
        await groups
          .filter((item) => item.name === currency)
          .forEach(async (e) => {
            let baseName = e.name;
            let ratePairs = [];
            e.alternates.forEach(async (o) => {
              const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${baseName.toLowerCase()}/${o.toLowerCase()}.json`;
              const response = fetch(encodeURI(url));

              ratePairs.push(response);
            });
           
            pairs.push({ name: baseName, ratePairs });
          });
        const resolveAll = await Promise.all(pairs[0].ratePairs);

        let finalValue = [];
        let g1 = [];
        let g2 = [];
        let g3 = [];
        
        resolveAll.forEach(async (e, index) => {
          let resp = e.json();
          finalValue.push(resp);
        });
        finalValue = await Promise.all(finalValue);
        let all = [];

        finalValue.forEach(async (e, index) => {
          const rate = e[currencies[index].toLowerCase()];
         
          all.push({ pair: `${currency}-${currencies[index]}`, rate: rate });
         
          if (rate < 1) {
            g1.push({ base: currency, value: rate, to: currencies[index] });
          }
          if (rate >= 1 && rate < 1.5) {
            g2.push({ base: currency, value: rate, to: currencies[index] });
          }
          if (rate >= 1.5) {
            g3.push({
              base: currency,
              value: rate,
              to: currencies[index],
            });
          }
          finalData = { g1, g2, g3};
         
        });

        
        finalData.g1.map((item) =>
          $("#group1").append(
            `<div>${item.base}-${item.to} : ${item.value}</div>`
          )
        );
        $("#group1").append(`<p>Count : ${finalData.g1.length}</p>`);
        finalData.g2.map((item) =>
          $("#group2").append(
            `<div>${item.base}-${item.to} : ${item.value}</div>`
          )
        );
        $("#group2").append(`<p>Count : ${finalData.g2.length}</p>`);
        finalData.g3.map((item) =>
          $("#group3").append(
            `<div>${item.base}-${item.to} : ${item.value}</div>`
          )
        );
        $("#group3").append(`<p>Count : ${finalData.g3.length}</p>`);
        
        const valid = [];
        for (i = 0; i < all.length; i++) {
          const element = all[i];
          const res = all
            .filter((a) => a.pair !== element.pair)
            .filter((x) => Math.abs(element.rate - x.rate) <= 0.5);
          valid.push({ pair: element.pair, result: res, count: res.length });
        }
       
        const found = valid.sort((a, b) => b.count - a.count)[0];
        $("#length").append(
          `<p>Length of the longest array is : ${found.count}</p>`
        );
       
      }

      
      async function onChangeCurrency() {
        var x = document.getElementById("rates").value;
        await fetchRateData(x);
      }
