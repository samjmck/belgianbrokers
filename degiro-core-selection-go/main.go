package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

func main() {
	exchangeToTypeScriptEnumId := map[string]int{
		"Euronext Amsterdam": 	10,
		"Euronext Paris":		15,
		"Euronext Brussels":	11,
		"Xetra":				29,
		"Borsa Italiana S.p.A.": 28,
		"London Stock Exchange (LSE)": 7,
		"Bolsa de Madrid":		26,
	}

	req, err := http.NewRequest("GET", "https://www.degiro.nl/assets/js/data/core-selection-list-nl.csv", nil)
	if err != nil {
		log.Fatalf("could not create req for core selection csv: %v\n", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("could not make req for core selection csv: %v\n", err)
	}

	output := map[int][]string{}

	scanner := bufio.NewScanner(resp.Body)

	defer resp.Body.Close()

	// skip first 2 header lines
	scanner.Scan()
	scanner.Scan()

	// start scanning for other rows
	for scanner.Scan() {
		row := scanner.Text()
		values := strings.Split(row, ",")
		exchange := exchangeToTypeScriptEnumId[values[2]]
		isins, ok := output[exchange]
		if !ok {
			output[exchange] = []string{ values[1] }
		} else {
			output[exchange] = append(isins, values[1])
		}
	}

	jsonBytes, err := json.Marshal(output)
	if err != nil {
		log.Fatalf("could not marshal json: %v\n", err)
	}
	jsonOutput := string(jsonBytes)

	fmt.Println(jsonOutput)
}
