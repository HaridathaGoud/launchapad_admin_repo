import * as React from 'react'
import {
  GridColumnMenuSort,
  GridColumnMenuFilter,
  GridColumnMenuItemGroup,
  GridColumnMenuItemContent,
} from '@progress/kendo-react-grid'
export class ColumnMenu extends React.Component {
  state = {
    columns: this.props.columns,
    columnsExpanded: false,
    filterExpanded: false,
    resetColumnsExpanded: false,
  }
  onToggleColumn = (id) => {
    this.setState({
      columns: this.state.columns.map((column) => {
        return column.orderIndex === id
          ? {
              ...column,
              show: !column.show,
            }
          : column
      }),
    })
  }
  onCheckAll = (event) => {
    event.preventDefault()
    const allColumns = this.props.columns.map((col) => {
      return {
        ...col,
        show: true,
      }
    })
    this.setState(
      {
        columns: allColumns,
      },
    )
  }
  onApply = (event) => {
    if (event) {
      event.preventDefault()
    }
    this.props.onColumnsApply(this.state.columns)
    if (this.props.onCloseMenu) {
      this.props.onCloseMenu()
    }
  }
  onResetToDefaultExpand = () => {
    this.setState({
      ...this.state,
      resetColumnsExpanded: true,
      columnsExpanded: false,
      resetColumnsExpanded: false,
    })
  }
  onMenuItemClick = () => {
    const value = !this.state.columnsExpanded
    this.setState({
      columnsExpanded: value,
      filterExpanded: value ? false : this.state.filterExpanded,
      resetColumnsExpanded: false,
    })
  }
  onFilterExpandChange = (value) => {
    this.setState({
      filterExpanded: value,
      columnsExpanded: value ? false : this.state.columnsExpanded,
      resetColumnsExpanded: false,
    })
  }
  render() {
    const oneVisibleColumn =
      this.state.columns.filter((c) => c.show)?.length === 1
    return (
      <div>
        {this.props.column?.field !== 'caseids' &&
          this.props.column?.field !== '' && (
            <GridColumnMenuSort {...this.props} />
          )}
        {this.props.column?.field !== 'caseids' &&
          this.props.column?.field !== '' && (
            <GridColumnMenuFilter
              {...this.props}
              onExpandChange={this.onFilterExpandChange}
              expanded={this.state.filterExpanded}
            />
          )}
        <GridColumnMenuItemGroup>
          <GridColumnMenuItemContent show={this.state.columnsExpanded}>
            <div className={'k-column-list-wrapper'}>
              <form onSubmit={this.onApply} onReset={this.onCheckAll}>
                <div className={'k-column-list'}>
                  {this.state.columns
                    .slice()
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map(
                      (column) =>
                        !column.locked && (
                          <div
                            key={column.orderIndex}
                            className={'k-column-list-item'}
                          >
                            <span>
                              <input
                                id={`column-visiblity-show-${column.orderIndex}`}
                                className="k-checkbox k-checkbox-md k-rounded-md green"
                                type="checkbox"
                                readOnly={true}
                                disabled={column.show && oneVisibleColumn}
                                checked={column.show}
                                onClick={() => {
                                  this.onToggleColumn(column.orderIndex)
                                }}
                              />
                              <label
                                htmlFor={`column-visiblity-show-${column.orderIndex}`}
                                className="k-checkbox-label"
                                style={{
                                  userSelect: 'none',
                                }}
                              >
                                {column.title}
                              </label>
                            </span>
                          </div>
                        ),
                    )}
                </div>
                <div className={'k-actions k-hstack k-justify-content-stretch'}>
                  <button
                    type={'reset'}
                    className={
                      'k-button k-button-md k-rounded-md k-button-solid k-button-solid-base'
                    }
                  >
                    Check All
                  </button>
                  <button className={'k-button k-primary'}>APPLY</button>
                </div>
              </form>
            </div>
          </GridColumnMenuItemContent>
          <GridColumnMenuItemContent show={this.state.resetColumnsExpanded}>
            <div className={'k-actions k-hstack k-justify-content-stretch'}>
              <button
                className={
                  'k-button k-button-md k-rounded-md k-button-solid k-button-solid-base'
                }
                onClick={() => {
                  this.setState({ ...this.state, resetColumnsExpanded: false })
                  if (this.props.onCloseMenu) {
                    this.props.onCloseMenu()
                  }
                }}
              >
                Cancel
              </button>
              <button
                className={'k-button k-primary'}
                onClick={() => {
                  this.props.resetToDefault()
                  if (this.props.onCloseMenu) {
                    this.props.onCloseMenu()
                  }
                }}
              >
                CONFIRM
              </button>
            </div>
          </GridColumnMenuItemContent>

        </GridColumnMenuItemGroup>
      </div>
    )
  }
}
