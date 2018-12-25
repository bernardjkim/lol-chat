import React from "react";
import onClickOutside from "react-onclickoutside";

import languages from "../languages";

//https://github.com/dbilgili/Custom-ReactJS-Dropdown-Components
class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false
    };
  }

  handleClickOutside(e) {
    this.setState({ listOpen: false });
  }

  selectItem = id => {
    this.toggleList();
    this.props.setLanguage(id);
  };

  toggleList = () => {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }));
  };

  render() {
    const { listOpen } = this.state;
    const { title } = this.props;
    return (
      <div className="dd-wrapper">
        {/* 
        NOTE: currently disabled translation feature.
        <div className="dd-header" onClick={() => this.toggleList()}> 
        */}
        <div className="dd-header">
          <div className="dd-header-title">{title}</div>
        </div>
        {listOpen && (
          <ul className="dd-list">
            {languages.map(language => (
              <li
                className="dd-list-item"
                key={language.id}
                onClick={() => this.selectItem(language.id)}
              >
                {language.id}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default onClickOutside(Dropdown);
