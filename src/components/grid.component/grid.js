import React from "react";
import {
	toDataSourceRequestString,
	translateDataSourceResultGroups,
	groupBy,
} from "@progress/kendo-data-query";
import store from "../../store";
import CryptoJS from "crypto-js";
import { Alert, Button } from "antd";
import moment from "moment";
import {
	setExpandedState,
	setGroupIds,
} from "@progress/kendo-react-data-tools";
import { GridToolbar } from "@progress/kendo-react-grid";
import apiCalls from '../../api/apiCalls'
const filterOperators = {
	text: [
		{ text: "grid.filterContainsOperator", operator: "contains" },
		{ text: "grid.filterNotContainsOperator", operator: "doesnotcontain" },
		{ text: "grid.filterEqOperator", operator: "eq" },
		{ text: "grid.filterNotEqOperator", operator: "neq" },
		{ text: "grid.filterStartsWithOperator", operator: "startswith" },
		{ text: "grid.filterEndsWithOperator", operator: "endswith" },
		{ text: "grid.filterIsEmptyOperator", operator: "isempty" },
		{ text: "grid.filterIsNotEmptyOperator", operator: "isnotempty" },
	],
	numeric: [
		{ text: "grid.filterEqOperator", operator: "eq" },
		{ text: "grid.filterNotEqOperator", operator: "neq" },
	],
	date: [
		{ text: "grid.filterAfterOrEqualOperator", operator: "gte" },
		{ text: "grid.filterAfterOperator", operator: "gt" },
		{ text: "grid.filterBeforeOperator", operator: "lt" },
		{ text: "grid.filterBeforeOrEqualOperator", operator: "lte" },
	],
	datetime: [
		{ text: "grid.filterEqOperator", operator: "eq" },
		{ text: "grid.filterNotEqOperator", operator: "neq" },
		{ text: "grid.filterAfterOrEqualOperator", operator: "gte" },
		{ text: "grid.filterAfterOperator", operator: "gt" },
		{ text: "grid.filterBeforeOperator", operator: "lt" },
		{ text: "grid.filterBeforeOrEqualOperator", operator: "lte" },
	],
	boolean: [{ text: "grid.filterEqOperator", operator: "eq" }],
};


const processWithGroups = (data, group) => {
	const newDataState = groupBy(data, group);
	setGroupIds({
		data: newDataState,
		group: group,
	});
	return newDataState;
};

export function withState(WrappedGrid) {
	return class StatefullGrid extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				dataState: { skip: 0, take:this.props?.pSize|| 10},
				additionalParams: null,
				data: [],
				group: [],
				isLoading: false,
				collapsedState: [],
				gridStatus: null
			};
			this.excelRef = React.createRef();	
		}
		numberWithCommas(x) {
			x = (typeof x) == 'string' ? x : x.toString();
			var arParts = x.split('.');
			var intPart = parseInt(arParts[0]).toLocaleString();
			var decPart = (arParts?.length > 1 ? arParts[1] : '');

			return '' + intPart + (decPart ? ('.' + decPart) : '');
		}

		expandChange = (event) => {
			const item = event.dataItem;
			if (item.groupId) {
				const newCollapsedIds = !event.value
					? [...this.state.collapsedState, item.groupId]
					: this.state.collapsedState.filter(
						(groupId) => groupId !== item.groupId
					);
				this.setState({
					collapsedState: newCollapsedIds,
				});
			}
		};

		onGroupsToggle = () => {
			let collapseAllState = []
			if (this.state.result) {
				for (let i in this.state.result) {
					collapseAllState.push(this.state.result[i].groupId)
				}
			}
			const newCollapsedState = this.state.collapsedState?.length
				? []
				:
				collapseAllState
			this.setState({
				collapsedState: newCollapsedState,
			});
		};

		refreshGrid() {
			this.fetchData(this.state.dataState);
		}
		resetToDefault(initialDataState) {
			this.setState({ ...this.state, dataState: initialDataState, group: initialDataState.group })
			this.fetchData(initialDataState)
		}

		loadingPanel = (
			<div className="k-loading-mask">
				<span className="k-loading-text">Loading</span>
				<div className="k-loading-image"></div>
				<div className="k-loading-color"></div>
			</div>
		);
		render() {
			const dataToShow = (this.state.result)
				? this.state.result
				: this.state.data;
			const newData = setExpandedState({
				data: dataToShow,
				collapsedIds: this.state.collapsedState,
			});
			return (
				<div style={{ position: "relative" }}>
					{this.state.isLoading && this.loadingPanel}
					{this.state.error && (
						<Alert
							style={{ marginBottom: 10, marginTop: 10 }}
							type="error"
							description={this.state?.error}
							showIcon
						/>
					)}

					{this.props.showExcelExport ? (
						<ExcelExport
							data={newData}
							fileName={this.props?.pKey + ".xlsx"}
							ref={(exporter) => {
								this.excelRef = exporter;
							}}>
							<WrappedGrid
								filterOperators={filterOperators}
								pageable={{ pageSizes: [5, 10, 20, 30, 40, 50, "All"] }}
								{...this.props}
								total={this.state.total}
								data={newData}
								skip={this.state.dataState.skip}
								pageSize={this.state.dataState.take}
								filter={this.state.dataState.filter}
								sort={this.state.dataState.sort}
								onDataStateChange={this.handleDataStateChange}>
								{this.state.dataState.group?.length !== 0 && (
									<GridToolbar>
										<Button
											className="primary-btn"
											style={{ backgroundColor: "yellow" }}
											onClick={this.onGroupsToggle}>
											{this.state.collapsedState?.length ? "Expand" : "Collapse"}{" "}
											Groups
										</Button>
									</GridToolbar>
								)}
								{this.props.children}
							</WrappedGrid>
						</ExcelExport>
					) : (
						<WrappedGrid
							resizable={true}
							filterOperators={filterOperators}
							pageable={{ pageSizes: [5, 10, 20, 30, 40, 50, "All"] }}
							{...this.props}
							total={this.state.total}
							data={newData}
							skip={this.state.dataState.skip}
							pageSize={this.state.dataState.take}
							filter={this.state.dataState.filter}
							sort={this.state.dataState.sort}
							 onDataStateChange={this.handleDataStateChange}
							>
							
						</WrappedGrid>
					)}
				</div>
			);
		}

		componentDidMount() {
			this.fetchData(this.state.dataState);
		}
		handleDataStateChange = (changeEvent) => {
			const isObjectEqual = (obj1, obj2) => {
				const obj1Keys = Object.keys(obj1);
				const obj2Keys = Object.keys(obj2);
				if (obj1Keys?.length !== obj2Keys?.length) return false;
				for (const key of obj1Keys) {
					if (obj1[key] !== obj2[key]) return false;
				}
				return true;
			}
			const didArrayChange = (arr1, arr2) => {
				if ((arr1 === undefined && arr2 === undefined) || (arr1 && !arr1?.length && !arr2) || (arr2 && !arr2?.length && !arr1)) {
					return false;
				}
				if (!arr1 || !arr2) return true;
				if (arr1?.length !== arr2?.length) return true;
				for (let i = 0; i < arr1?.length; i++) {
					if (!isObjectEqual(arr1[i], arr2[i])) return true;
				}
				return false;
			};
			const applyDataToGrid = (changeEvent) => {
				let _dataState = changeEvent.dataState;
				if (isNaN(_dataState.take)) {
					_dataState.take = this.state.total;
				}
				this.setState({ dataState: _dataState });
				this.fetchData(_dataState);
			}

			const { group: prevGroup } = this.state.dataState
			const { group: eventGroup } = changeEvent.dataState
			applyDataToGrid(changeEvent)

			if (didArrayChange(prevGroup, eventGroup)) {
				const newDataState = processWithGroups(this.state.ungroupedData?.length > 0 ? this.state.ungroupedData : this.state.data, changeEvent.dataState.group);
				this.setState({
					collapsedState: [],
					result: changeEvent.dataState.group?.length > 0 ? newDataState : undefined,
					group: changeEvent.dataState.group,
				});
			}
			this.props.getDataStateFromChild(changeEvent.dataState)
		};
		_encrypt(msg, key) {
			msg = typeof msg == "object" ? JSON.stringify(msg) : msg;
			var salt = CryptoJS.lib.WordArray.random(128 / 8);

			key = CryptoJS.PBKDF2(key, salt, {
				keySize: 256 / 32,
				iterations: 10,
			});

			var iv = CryptoJS.lib.WordArray.random(128 / 8);

			var encrypted = CryptoJS.AES.encrypt(msg, key, {
				iv: iv,
				padding: CryptoJS.pad.Pkcs7,
				mode: CryptoJS.mode.CBC,
			});
			return salt.toString() + iv.toString() + encrypted.toString();
		}
		fetchData(dataState) {
			if (dataState.filter) {
				dataState.filter.filters?.map((item) => {
					item.filters?.map((value) => {
						if (
							value.operator === "gte" ||
							value.operator === "gt" ||
							value.operator === "lte" ||
							value.operator === "lt"
						) {
							value.value = value.value
								? value.operator === "lte" || value.operator === "gt"
									? new Date(moment(value.value).format("YYYY-MM-DDT23:59:59"))
									: new Date(moment(value.value).format("YYYY-MM-DDT00:00:00"))
								: null;
						}
					});
				});
			}
			this.setState({ ...this.state, isLoading: true });
			const {
				oidc: { user },
			} = store.getState();
			let queryStr = `${toDataSourceRequestString(dataState)}`; // Serialize the state.
			const hasGroups = dataState.group && dataState.group?.length;
			if (this.props.additionalParams) {
				let _additionalParams = "";
				for (let key in this.props.additionalParams) {
					_additionalParams =
						_additionalParams + `/${this.props.additionalParams[key]}`;
				}
				queryStr = _additionalParams + "?" + queryStr;
			} else {
				queryStr = "?" + queryStr;
			}
			const base_url = this.props.url;
			const Authorization = `Bearer ${user.access_token}`;
			const init = {
				method: "GET",
				accept: "application/json",
				headers: {
					Authorization: Authorization,
				},
			};
			fetch(`${base_url}${queryStr}`, init)
				.then(response => {
					
					this.setState({ ...this.state, gridStatus: response.status })
					return response.json()
				})
				.then(({ data, total }) => {
					function extractObjectsWithId(items) {
						let result = [];
						items.forEach(item => {
							if (item.items) {
								result = result.concat(extractObjectsWithId(item.items));
							} else if (item.id) {
								result.push(item);
							}
						});
						return result;
					}
					const originalData = (data && this.state.group?.length > 0) ? extractObjectsWithId(data) : [];
					const result = processWithGroups(this.state.group?.length > 0 ? originalData : data, this.state.group);
					this.setState({
						ungroupedData: originalData,
						data: hasGroups ? translateDataSourceResultGroups(data) : data,
						total,
						dataState,
						isLoading: false,
						result: this.state.group?.length > 0 ? result : undefined,
					});
				})
				.catch(err => {
					if (this.state?.gridStatus === 401) {
						this.props.history.push("/accessdenied");
					} else {

						this.setState({ ...this.state, error: apiCalls.isErrorDispaly(err), isLoading: false })
					}

				});
		}
	}
}

