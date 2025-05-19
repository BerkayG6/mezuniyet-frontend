import axios from "axios";
import * as cheerio from "cheerio";
import React, { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://yokatlas.yok.gov.tr/2019/content/lisans-dynamic/1000_1.php?y=106510077"
        );

        // HTML'i cheerio ile işleme
        const $ = cheerio.load(data);

        // Tablodan verileri al ve JSON formatına dönüştür
        const tableData = [];
        $("table tr").each((index, element) => {
          if (index === 0) return; // Başlık satırını atla

          const row = $(element)
            .find("td")
            .map((_, cell) => $(cell).text().trim())
            .get();

          tableData.push({
            osymProgramKodu: row[0],
            universiteTuru: row[1],
            universiteFakulte: row[2],
            puanTuru: row[3],
            bursTuru: row[4],
            genelKontenjan: row[5],
            okulBirincisiKontenjani: row[6],
            toplamKontenjan: row[7],
            genelKontenjanaYerlesen: row[8],
            okulBirincisiKontenjaninaYerlesen: row[9],
            toplamYerlesen: row[10],
            sonPuan: row[11],
            sonBasariSirasi: row[12],
            tavanPuan: row[13],
            tavanBasariSirasi: row[14],
          });
        });

        console.log(tableData); // JSON formatındaki veriler
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Check the console for JSON data!</div>;
};

export default App;
