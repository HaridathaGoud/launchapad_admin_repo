import * as React from "react";
import {
    GridColumn,
    Grid,
    GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { withState } from "./grid";
import { ColumnMenu } from "./columnMenu";
import Moment from "react-moment";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import { Button, Modal, Tooltip, message } from "antd";
import { projectApi } from "../../api";
import store from "../../store";

const StatefullGrid = withState(Grid);
const CustomLockedCell = (props, customCell) => {
    const field = props.field || "";
    const value = props.dataItem[field];
    const navigationAttributes = useTableKeyboardNavigation(props.id);
    return (
        <td
            style={props.style} // this applies styles that lock the column at a specific position
            className={props.className} // this adds classes needed for locked columns
            colSpan={props.colSpan}
            role={"gridcell"}
            aria-colindex={props.ariaColumnIndex}
            aria-selected={props.isSelected}
            {...{
                [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex,
            }}
            {...navigationAttributes}>
            {customCell ? customCell(props) : value}
        </td>
    );
};

class List extends React.Component {
    listener;
    constructor(props) {
        super(props);
        this.eleRef = React.createRef();
        this.state = {
            columns: this.props?.columns || [],
            layoutHasChanged: false,
            dataState: {},
            loading: true,
            isBtnLoading: false,
            featureId: store.getState().permissions?.currentScreenTabId || store.getState().permissions?.currentScreenId,
            customerId: store.getState().userConfig?.userProfileInfo?.id,
            saveGridModalIsVisible: store.getState().saveGridModal?.saveGridModalIsVisible,
            username: store.getState().userConfig?.userProfileInfo?.userName
        };
        this.handleColumnReorder = this.handleColumnReorder.bind(this);
    }

    refreshGrid() {
        this.eleRef.current?.refreshGrid();
    }
    renderDate = (props) => {
        if (props.dataItem[props.field]) {
            return (
                <td>
                    <Moment format="DD/MM/YYYY">
                        {this.convertUTCToLocalTime(props?.dataItem[props.field])}
                    </Moment>
                </td>
            );
        } else {
            return <td>{props.dataItem[props.field]}</td>;
        }
    };
    renderDateTime = (props) => {
        if (props.dataItem[props.field]) {
            return (
                <td>
                    <Moment format="DD/MM/YYYY hh:mm:ss A" globalLocal={true}>
                        {this.convertUTCToLocalTime(props?.dataItem[props.field])}
                    </Moment>
                </td>
            );
        } else {
            return <td>{props.dataItem[props.field]}</td>;
        }
    };
    convertUTCToLocalTime = (dateString) => {
        let date = new Date(dateString);
        const milliseconds = Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );
        return new Date(milliseconds).toISOString();
    };
    renderNumber = () => {
        return (
            <td>
                {" "}
            </td>
        );
    };

    gridFilterData = (column) => {
        if (column.filterType === "date") {
            if (column.isShowTime) {
                return this.renderDateTime;
            } else {
                return this.renderDate;
            }
        } else if (column.filterType === "number") {
            return this.renderNumber;
        } else if (column.filterType === "datetime") {
            return this.renderDateTime;
        } else {
            return null;
        }
    };

    onColumnsApply = (columnsState) => {
        this.setState({
            ...this.state,
            columns: columnsState,
            layoutHasChanged: true
        });
    };
    resetToDefault = () => {
        const columnsFromProps = this?.props?.columns?.map((col, indx) => ({ ...col, show: true, orderIndex: indx, originalIndex: indx }))
        const initialDataState = { filter: undefined, sort: undefined, skip: 0, take: this.props?.pSize ? this.props.pSize : 10, group: [] }
        this.setState({
            ...this.state,
            columns: columnsFromProps,
            dataState: initialDataState,
            layoutHasChanged: true,
        })
        this.eleRef.current?.resetToDefault(initialDataState);
    }
    CustomGroupHeaderCell = (props) => {
        return (<th>
            <span>{props.title}</span>
            {props.filtered && (
                <span className="k-icon k-i-filter" style={{ marginLeft: '5px' }} />
            )}
        </th>)
    }

    CustomOrGroupHeaderCell = (props, column) => {
        if (props.rowType === "groupHeader") {
            return null;
        }
        if (column.locked) {
            return CustomLockedCell(props, column.customCell)
        }
        if (column.customCell) {
            return column.customCell(props)
        }
    }

    gridChildrenData = (column, indx) => {
        if (column.children) {
            return (
                <GridColumn
                    key={indx}
                    locked={column.locked}
                    columnMenu={(props) => (
                        <ColumnMenu
                            {...props}
                            columns={this.state.columns}
                            onColumnsApply={this.onColumnsApply}
                            resetToDefault={this.resetToDefault}
                        />
                    )}
                    children={column.children}
                    field={column.field}
                    title={column.title}
                    width={column.width}
                    cell={column.customCell || this.gridFilterData(column)}
                    filter={column.filterType || "text"}
                    format="{0:#,0.##########}"
                    reorderable={!column.locked}
                    orderIndex={column.orderIndex}
                />
            );
        } else {
            return (
                <GridColumn
                    key={indx}
                    locked={column.locked}
                    columnMenu={(props) => (
                        <ColumnMenu
                            {...props}
                            columns={this.state.columns}
                            onColumnsApply={this.onColumnsApply}
                            resetToDefault={this.resetToDefault}
                        />
                    )}
                    field={column.field}
                    title={column.title}
                    width={column.width}
                    cell={(!column?.locked && !column?.customCell) ? this.gridFilterData(column) : (props) => this.CustomOrGroupHeaderCell(props, column)}
                    filter={column.filterType || "text"}
                    format="{0:#,0.##########}"
                    reorderable={!column.locked}
                    orderIndex={column.orderIndex}
                />
            );
        }
    };

    handleColumnReorder = (event) => {
        for (let i = 0; i < event.columns.length; i++) {
            if (event.columns[i].reorderable === true) {
                break
            }
            if (event.columns[i].orderIndex !== i) {
                return
            }
        }

        let columnsToSave = [];
        if (this.state.columns.length === event.columns.length) {
            for (let i in this.state.columns) {
                const col = { ...this.state.columns[i], orderIndex: event.columns[i]?.orderIndex }
                columnsToSave.push(col)
            }
        } else {
            let newArr = []
            let toMinus = 0;
            for (let i in this.state.columns) {
                let colToPush
                if (this.state.columns[i].show) {
                    colToPush = { ...this.state.columns[i], orderIndex: event.columns[i - toMinus]?.orderIndex }
                } else {
                    colToPush = { ...this.state.columns[i] }
                    toMinus++
                }
                newArr.push(colToPush)
            }
            newArr.sort((a, b) => a.orderIndex - b.orderIndex);
            newArr = newArr?.map((column, indx) => ({ ...column, orderIndex: indx }))
            newArr.sort((a, b) => a.originalIndex - b.originalIndex);
            columnsToSave = newArr
        }

        this.setState({
            ...this.state,
            columns: columnsToSave,
            layoutHasChanged: true,
        })
    }

    dataStateChangeHandler = (dataState) => {
        let pageSizeToDisplay = dataState.take ? dataState.take : "All"
        this.setState({ ...this.state, dataState: { ...dataState, take: pageSizeToDisplay }, layoutHasChanged: true })
    }

    onSaveHandler = async () => {
        const columnsToSave = this.state?.columns?.map((column) => {
            return {
                ...column,
                customCell: column.customCell ? column.field : null,
            }
        })

        this.setState({ ...this.state, isBtnLoading: true })

        const saveGridLayoutData = async (obj) => {
            const res = await projectApi.post(`${process.env.REACT_APP_GRID_API}MetaData/SaveMetaData`, obj);
            if (res.status === 200) {
                this.setState({ ...this.state, isBtnLoading: false, layoutHasChanged: false })

                this.statusSuccess()
            } else {
                this.setState({ ...this.state, isBtnLoading: false })
            }
        };

        const metaData = {
            columns: columnsToSave,
            dataState: this.state.dataState
        }

        const obj = {
            "customerId": this.state.customerId,
            "featureId": this.state.featureId,
            "metaData": JSON.stringify(metaData),
            "createdBy": this.state.username
        }
    }

    statusSuccess = () => {
        message.destroy();
        message.success({
            content: 'Layout saved successfully',
            className: 'custom-msg',
            duration: 4
        });
    };

    render() {
        const { url, additionalParams } = this.props;

        return (
            <div>
                <Modal
                    visible={this.state.saveGridModalIsVisible}
                    onCancel={this.cancelHandler}
                    title={'Save Grid Layout?'}
                    maskClosable={false}
                    closeIcon={
                        <Tooltip title="Close">
                            <span className="icon md x c-pointer" />
                        </Tooltip>
                    }
                    footer={
                        <>
                            <Button
                                type="primary"
                                className="primary-btn cancel-btn"

                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                className="primary-btn ml-8"
                                onClick={this.onSaveHandler}
                                loading={this.state.isBtnLoading}
                                disabled={!this.state.layoutHasChanged}
                            >
                                Save
                            </Button>
                        </>
                    }
                >
                    {<p className="fs-16 mb-0">{this.state.layoutHasChanged ? 'Are you sure you want to save the layout?' : 'Layout has not been edited'}</p>}
                </Modal>


                <StatefullGrid
                    reorderable={this.props.columnsIsNotReorderable ? false : true}
                    groupable={false} // set to false temporarily until API call is fixed
                    cellRender={this.cellRender}
                    onColumnReorder={this.handleColumnReorder}
                    url={url}
                    additionalParams={additionalParams}
                    ref={this.eleRef}
                    callback={this.callback}
                    {...this.props}
                    getDataStateFromChild={this.dataStateChangeHandler}
                    dataState={this.state.dataState}
                >

                    {(this.props.columns)?.map((column, indx) =>  this.gridChildrenData(column, indx))}

                </StatefullGrid>

            </div>
        );
    }
}

export default List;

