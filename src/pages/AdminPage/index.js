import React, { Component } from 'react';
import AdminNavBar from "components/AdminNavBar";
import AdminPageContainer from "./components/AdminPageContainer";
import { connect } from "react-redux";
import Style from "./style.module.scss";

import AdminUIDuck from "stores/ducks/Admin/UI.duck";

//  Import components 
import AdminView from "./components/AdminView";

const mapNavBarIDs = {
    brands: <AdminView.Brands />,
    designers: <AdminView.Designers />,
    apparel: <AdminView.Apparel />,
    sneakers: <AdminView.Sneakers />,
    sizing: <AdminView.Sizing />
}

class Admin extends Component {

    renderPageContent = () => {
        const { activeNavbarItemId } = this.props;
        return mapNavBarIDs[activeNavbarItemId];
    }

    render() {
        return (
            <div className={Style.container}>
                <AdminNavBar />
                <AdminPageContainer>
                    {this.renderPageContent()}
                </AdminPageContainer>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { duckName } = AdminUIDuck;
    return {
      activeNavbarItemId: state[duckName].activeNavbarItemId
    };
  };
  


export default connect(mapStateToProps)(Admin);