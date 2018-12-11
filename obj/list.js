var fs = require("fs");
var path = require("path");


class UniversityList {
  constructor() {
    this.list = this.get();
  }

  add(item) {
    this.list.push(item);
    fs.appendFileSync(path.join(__dirname, "../data/data.txt"), JSON.stringify(item) + "\n");
  }

  get() {
    var data = fs.readFileSync(path.join(__dirname, "../data/data.txt"), "utf-8");
    if (data.length == 0) {
      return [];
    }
    var endData = data.slice(0, data.length - 1).split("\n");


    return endData.map(item => JSON.parse(item));
  }

  find(type, value) {
    var list = this.get();

    return list.filter(item => item[type].toString().indexOf(value.toString()) > -1);
  }

  findByName(keyword){
    var list = this.get();
    var lc = keyword.toLowerCase();
    return list.filter(item => item.name.toLowerCase().includes(lc) || item.fullName.toLowerCase().includes(lc));
  }

  update(id, value) {

    var list = this.list;
    value.id = id;
    this.list.splice(list.map(item => item.id).indexOf(Number(id)), 1, value);

    function saveData(result, item) {
      return result + JSON.stringify(item) + "\n";
    }

    var dataToSave = this.list.reduce(saveData, "");
    fs.writeFileSync(path.join(__dirname, "../data/data.txt"), dataToSave, "utf-8");
  }

  delete(id) {
    var list = this.list;

    function returnId(item) {
      return item.id;
    }

    var no = list.map(returnId).indexOf(id);
    this.list.splice(no, 1);

    function saveData(result, item) {
      return result + JSON.stringify(item) + "\n";
    }

    var dataToSave = this.list.reduce(saveData, "");
    fs.writeFileSync(path.join(__dirname, "../data/data.txt"), dataToSave, "utf-8");
  }

  findByYear(number) {
    var list = this.list;
    var no = list.filter(function (item) {
      return (2018 - Number(item.year.split("/")[2])) >= number;
    });
    return no;
  }
}

module.exports = UniversityList;
