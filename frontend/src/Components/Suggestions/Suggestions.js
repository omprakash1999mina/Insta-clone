import { Avatar } from "@material-ui/core";
import React from "react";
import pp1 from "../../images/pp1.png";
import "./Suggestions.css";
class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="suggestions">
          <div className="suggestions__header">Suggestions for you</div>
          <div className="suggestion_body">
            <div className="suggestion_body__person">
              <Avatar src="" />
              <div className="Suggestion_frnd">parashuram.__</div>
            </div>
            <div className="suggestion_body__person">
              <Avatar src="" />
              <div className="Suggestion_frnd">royal_iitian</div>
            </div>
            <div className="suggestion_body__person">
              <Avatar src={""} />
              <div className="Suggestion_frnd">sai__prasad__07</div>
            </div>
            <div className="suggestion_body__person">
              <Avatar src={""} />
              <div className="Suggestion_frnd">_simply_ritik</div>
            </div>
            <div className="suggestion_body__person">
              <Avatar src={""} />
              <div className="Suggestion_frnd">imkashishh</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Suggestions;
