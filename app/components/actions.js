/*
 * action 类型
 */
export const INIT_DATA = 'INIT_DATA';
export const SELECT_CELL = 'SELECT_CELL';
export const SELECT_FIELD = 'SELECT_FIELD';
export const UPDATE_OPTION = 'UPDATE_OPTION';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const ADD_FIELD = 'ADD_FIELD';
export const SWITCH_MODE = 'SWITCH_MODE';
export const SELECT_FORM = 'SELECT_FORM';
export const REMOVE_FORM = 'REMOVE_FORM';
export const ADD_FORM = 'ADD_FORM';
export const ADD_ROW = 'ADD_ROW';
export const DELETE_ROW = 'DELETE_ROW';
export const ADD_COL = 'ADD_COL';
export const DELETE_COL = 'DELETE_COL';
export const MERGE_CELL = 'MERGE_CELL';
export const CLEAR_SELECT = 'CLEAR_SELECT';
export const SAVE = 'SAVE';
export const RESET_LAYOUT = 'RESET_LAYOUT';
export const UPDATE_DATA = 'UPDATE_DATA';
export const ADD_NEW_FIELD = 'ADD_NEW_FIELD';




/*
 * 其它的常量哈哈
 */
//export const VisibilityFilters = {
//    SHOW_ALL: 'SHOW_ALL',
//    SHOW_COMPLETED: 'SHOW_COMPLETED',
//    SHOW_ACTIVE: 'SHOW_ACTIVE'
//}

/*
 * action 创建函数
 */

export function initData(data,defaultCol) {
    return { type: INIT_DATA, data,defaultCol }
}

export function selectCell(x,y,z,e) {
    return { type: SELECT_CELL, x,y,z,e }
}

export function selectField(id,e) {
    return { type: SELECT_FIELD, id,e}
}

export function updateOption(data) {
    return { type: UPDATE_OPTION, data }
}

export function removeField(x,y,z,i) {
    return { type: REMOVE_FIELD, x,y,z,i }
}

export function addField(id) {
    return { type: ADD_FIELD, id }
}

export function switchMode(mode) {
    return { type: SWITCH_MODE, mode }
}
export function selectForm(id) {
    return { type: SELECT_FORM, id }
}

export function removeForm(i) {
    return { type: REMOVE_FORM, i }
}

export function addForm(id) {
    return { type: ADD_FORM, id }
}

export function addRow() {
    return { type: ADD_ROW}
}

export function deleteRow() {
    return { type: DELETE_ROW }
}

export function addCol() {
    return { type: ADD_COL}
}

export function deleteCol() {
    return { type: DELETE_COL }
}

export function mergeCell() {
    return { type: MERGE_CELL }
}

export function clearSelect() {
    return { type: CLEAR_SELECT }
}

export function save() {
    return { type: SAVE }
}

export function resetLayout(col) {
    return { type: RESET_LAYOUT,col }
}

export function updateData(data) {
    return { type: UPDATE_DATA,data }
}
export function addNewField(pid) {
    return { type: ADD_NEW_FIELD,pid }
}
