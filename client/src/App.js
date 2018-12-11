import React, { Component } from 'react';
import axios from "axios"
import './App.css';
import {browserHistory} from "./router";
import {AppLayout} from "./app-layout";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      year: 0,
      searchType: 0,
      list: []
    };
    axios.get("/api/list").then((res) => {

      this.setState({list: res.data})
    })
  }

  applySearch = () => {
    let {name, year, searchType} = this.state;
    if(searchType === 0){
      axios.post("/api/by-name", {name}).then(res => {
        this.setState({list: res.data})
      })

    }else{
      axios.post("/api/by-year", {year}).then(res => {
        this.setState({list: res.data})
      })
    }
  };

  handleDelete = (uID) => {
    axios.delete("/api/delete/"+uID).then(() => {
      this.setState({list: this.state.list.filter(each => each.id !== uID)})
    })
  };

  render() {
    let {name, year, searchType, list = []} = this.state;

    return (
      <AppLayout
        title="List"
      >
        <div className="actions">
          <div className="row mb-4">
            <div className="input-group col-4">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Filter type</label>
              </div>
              <select className="custom-select" id="inputGroupSelect01"
                      onChange={e => this.setState({searchType: Number(e.target.value)})}
                      value={searchType}
              >
                <option value="0">Name</option>
                <option value="1">Year</option>
              </select>
            </div>
          </div>
          <div className="row">
            {searchType === 0 ? (
              <div className="input-group input-group mb-3 col-4">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-sm">Name</span>
                </div>
                <input type="text"
                       className="form-control"
                       aria-label="Small"
                       aria-describedby="inputGroup-sizing-sm"
                       value={name}
                       onChange={e => this.setState({name: e.target.value})}
                />
              </div>
            ) : (
              <div className="input-group input-group mb-3 col-4">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-sm">Year</span>
                </div>
                <input type="text"
                       className="form-control"
                       aria-label="Small"
                       aria-describedby="inputGroup-sizing-sm"
                       value={year}
                       onChange={e => this.setState({year: e.target.value})}
                />
              </div>
            )}
            <button className="btn btn-primary align-self-baseline"
                    onClick={this.applySearch}
            >
              Search
            </button>
            <button className="add-u btn-primary btn col-3 offset-2 btn-block align-self-baseline"
                    onClick={() => browserHistory.push("/new")}
            >
              Add University
            </button>
          </div>



        </div>

        <table className="u-list">
          <thead>
          <tr>
            <th>Name</th>
            <th>Full name</th>
            <th>Year</th>
            <th>Address</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {list.length ? list.map((u) => (
            <tr key={u.id}
                className="each-u"
                onClick={e => browserHistory.push("/edit/"+u.id)}
            >
              <td>{u.name}</td>
              <td>{u.fullName}</td>
              <td>{u.year}</td>
              <td>{u.address}</td>
              <td>
                <button className="btn btn-danger text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.handleDelete(u.id)
                        }}
                >
                  Delete
                </button>
              </td>
            </tr>
          )): (
            <tr >
              <p className="text-dark text-left pl-2">
                No data
              </p>
            </tr>
          )}
          </tbody>

        </table>
      </AppLayout>

    );
  }
}

export default App;
