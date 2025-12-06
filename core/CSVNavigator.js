import { parseCSV } from "./csvParser.js";
import * as storage from "./storage.js";
import { extractCoords } from "./coordinates.js";
import { computeGoogleMapsUrl } from "./maps.js";

export default class CSVNavigator {
  constructor(storageKey = "csvNavigatorData") {
    this.csvData = [];
    this.csvHeaders = [];
    this.currentIndex = 0;
    this.storageKey = storageKey;
  }

  loadCSVText(csvText) {
    const { headers, rows } = parseCSV(csvText);
    this.csvHeaders = headers;
    this.csvData = rows;
    this.currentIndex = 0;
  }

  saveToLocalStorage() {
    const data = {
      csvData: this.csvData,
      csvHeaders: this.csvHeaders,
      currentIndex: this.currentIndex,
    };
    storage.save(this.storageKey, data);
  }

  loadFromLocalStorage() {
    const saved = storage.load(this.storageKey);
    if (saved) {
      this.csvData = saved.csvData || [];
      this.csvHeaders = saved.csvHeaders || [];
      this.currentIndex = saved.currentIndex || 0;
      return true;
    }
    return false;
  }

  hasData() {
    return this.csvData.length > 0;
  }

  getCurrentRow() {
    if (!this.hasData()) return null;
    return this.csvData[this.currentIndex];
  }

  getNextRow() {
    if (!this.hasData()) return null;
    if (this.currentIndex < this.csvData.length - 1) {
      this.currentIndex++;
    }
    return this.getCurrentRow();
  }

  getPreviousRow() {
    if (!this.hasData()) return null;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    return this.getCurrentRow();
  }

  skipRow() {
    if (!this.hasData()) return null;

    for (let i = this.currentIndex + 1; i < this.csvData.length; i++) {
      const row = this.csvData[i];
      if (!row.name || row.name.trim() === "") {
        this.currentIndex = i;
        return row;
      }
    }

    return this.getCurrentRow();
  }

  goToRow(rowIndex) {
    if (!this.hasData()) return null;
    if (rowIndex < 0 || rowIndex >= this.csvData.length) return null;
    this.currentIndex = rowIndex;
    return this.getCurrentRow();
  }

  getTotalRows() {
    return this.csvData.length;
  }

  getCurrentCoordinates() {
    if (!this.hasData()) return null;
    return extractCoords(this.getCurrentRow(), this.csvHeaders);
  }

  getGoogleMapsUrl() {
    const coords = this.getCurrentCoordinates();
    if (!coords) return null;
    return computeGoogleMapsUrl(coords.lat, coords.lon);
  }
}

