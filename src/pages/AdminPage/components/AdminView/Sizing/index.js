import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

import * as immutable from 'object-path-immutable';

// Components
import AdminModals from "components/AdminModals";
import { ApparelSizing, SneakerSizing } from 'components/AdminComponents/Sizing';
import { ShowConfirmNotif } from "functions";

// Fields
import { ExpansionPanel } from "fields";

const PRODUCT_CATEGORIES = {
    sneakers: {
        label: "Sneakers",
        id: "sneakers",
        size_range: {
            us: [ 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 
                8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 
                14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19 ]
        },
        gender: {
            men: {
                id: 'men',
                label: 'Men'
            },
            women: {
                id: 'women',
                label: 'Women'
            },
            infant: {
                id: 'infant',
                label: 'Infant'
            },
        }
    },
    apparel: {
        label: "Apparel",
        id: "apparel",
        size_range: {
            us: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]
        },
        gender: {
            men: {
                id: 'men',
                label: 'Men'
            },
            women: {
                id: 'women',
                label: 'Women'
            },
            unisex: {
                id: 'unisex',
                label: 'Unisex'
            },
        }
    }
}

class Sizing extends Component {

    state = { 
        showExpandableContent: {
            sneakers: true,
            apparel: true
        },
        showCreateItemModal: false,
        selectedProductCategory: '',
        selectedGender: '',
    }

    async componentDidMount() {
        const { actionCreators } = AdminDuck;
        const { getSizing } = actionCreators;
        const { success, message } = await this.props.dispatch(getSizing());
        if (success) {
            // this.confirmNotif = ShowConfirmNotif({
            //   message,
            //   type: "success"
            // })
          } else {
            this.confirmNotif = ShowConfirmNotif({
              message,
              type: "error"
            })
          }
    }

    onRefreshAfterChanges = async () => {
        const { actionCreators } = AdminDuck;
        const { getSizing } = actionCreators;
        const { success, message } = await this.props.dispatch(getSizing());
        if (success) {
          this.confirmNotif = ShowConfirmNotif({
            message,
            type: "success"
          })
        } else {
          this.confirmNotif = ShowConfirmNotif({
            message,
            type: "error"
          })
        }
      }

    onShowCreateItemModal = (selectedProductCategory, selectedGender) => {
        this.setState({ selectedProductCategory, selectedGender }, () => this.setState({ showCreateItemModal: true }));
    }

    onHideCreateItemModal = () => {
        this.setState({ selectedProductCategory: '', selectedGender: '', showCreateItemModal: false });
    }

    // call action creator
    onUpdateAfterSizingCreated = ({ created, message }) => {
        if (created) {
          this.confirmNotif = ShowConfirmNotif({
            message,
            type: "success"
          });
          this.setState({ showCreateItemModal: false }, () => this.onRefreshAfterChanges());
        } else {
          this.confirmNotif = ShowConfirmNotif({
            message,
            type: "error"
          });
          this.setState({ showCreateItemModal: false });
        }
      }

    renderCreateModal = () => (
        <AdminModals.SizingModal
            onCloseModal={this.onHideCreateItemModal}
            onUpdateAfterSizingCreated={this.onUpdateAfterSizingCreated}
            productCategory={this.state.selectedProductCategory}
            size_range={PRODUCT_CATEGORIES[this.state.selectedProductCategory].size_range}
            gender={this.state.selectedGender}
        />
      );

    renderCategory = (productCategory) => {
        const { sizing } = this.props;
        switch(productCategory) {
            case "sneakers": 
                return (<SneakerSizing 
                    sizingInfo={PRODUCT_CATEGORIES["sneakers"]} 
                    productCategory={PRODUCT_CATEGORIES["sneakers"].id} 
                    onShowCreateSizingModal={this.onShowCreateItemModal} 
                    data={sizing["sneakers"]} 
                />)
            case 'apparel':
                return (<ApparelSizing 
                    sizingInfo={PRODUCT_CATEGORIES["apparel"]} 
                    productCategory={"apparel"} 
                    onShowCreateSizingModal={this.onShowCreateItemModal} 
                    data={sizing["apparel"]}
                />)
            default: 
                return null;
        }
    }

    renderSections = () => (
        Object.keys(PRODUCT_CATEGORIES).map(productCategory => {
            return (
                <ExpansionPanel
                    isExpandable
                    moduleTitle={PRODUCT_CATEGORIES[productCategory].label}
                    onClickExpandButton={() => this.setState({ 
                        showExpandableContent: immutable.set(this.state.showExpandableContent, productCategory, 
                            !!!this.state.showExpandableContent[productCategory]) })}
                    showExpandableContent={this.state.showExpandableContent[productCategory]}
                    key={productCategory}
                >
                    {this.renderCategory(productCategory)}
                </ExpansionPanel>
            )
            
        })
    )
        

    render() {
        return (
            <div>
                {this.state.showCreateItemModal && this.renderCreateModal()}
                {this.renderSections()}
            </div>
        )
    }
}


const mapStateToProps = state => {
    const { duckName } = AdminDuck;
    return {
      sizing: state[duckName].sizing.data,
    };
  };

export default connect(mapStateToProps)(Sizing);

Sizing.propTypes = {
    sizing: PropTypes.object
}

Sizing.defaultProps = {
    sizing: {
        sneakers: {},
        apparel: {}
    }
}