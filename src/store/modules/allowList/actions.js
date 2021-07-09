import {
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
  FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
} from 'app/src-electron/app/utils/invoke.types';
import {
  SET_ALLOW_LIST,
  SET_NUMBER_PAGE,
  SET_ROWS_PER_PAGE,
  SET_ROWS_NUMBER,
  SET_FILTER_ALLOW_PLATE,
} from './mutations';

const ALLOW_LIST_TABLE = 'allowList';

export const FETCH_CHECKPOINT_ALLOW_LIST_BY_PAGE = 'allowList/fetchCheckpointAllowListByPage';
export const ADD_ALLOW_PLATE = 'allowList/addAllowPlate';
export const REMOVE_ALLOW_PLATE = 'allowList/removeAllowPlate';
export const SAVE_FILTER_BY_ALLOW_PLATE = 'allowList/saveFilterByAllowPlate';

export const actions = {
  [FETCH_CHECKPOINT_ALLOW_LIST_BY_PAGE]: async (context, dataForAllowListByPage) => {
    const data = {
      tableName: ALLOW_LIST_TABLE,
      page: dataForAllowListByPage.pageNumber,
      rowsPerPage: dataForAllowListByPage.allowListPerPage,
      maskFilter: { column: 'plate', mask: dataForAllowListByPage.allowPlateFilter },
    };
    const allowList = await window.invoke(FETCH_CHECKPOINT_BY_PAGE_CHANNEL, data);
    allowList.tableByPage = allowList.tableByPage.map((el, key) => ({
      ...el,
      num: (dataForAllowListByPage.allowListPerPage * dataForAllowListByPage.pageNumber + 1) + key,
    }));

    context.commit(SET_ROWS_NUMBER, allowList.rowsCount);
    context.commit(SET_ALLOW_LIST, allowList.tableByPage);
    context.commit(SET_NUMBER_PAGE, dataForAllowListByPage.pageNumber + 1);
    context.commit(SET_ROWS_PER_PAGE, dataForAllowListByPage.allowListPerPage);
  },
  [ADD_ALLOW_PLATE]: async (context, allowPlate) => {
    const data = { tableName: ALLOW_LIST_TABLE, rowTable: allowPlate };
    await window.invoke(ADD_ROW_CHANNEL, data);
  },
  [REMOVE_ALLOW_PLATE]: async (context, allowPlateIndex) => {
    const data = { tableName: ALLOW_LIST_TABLE, rowIndex: allowPlateIndex };
    await window.invoke(REMOVE_ROW_CHANNEL, data);
  },
  [SAVE_FILTER_BY_ALLOW_PLATE]: async (context, allowPlateFilter) => {
    context.commit(SET_FILTER_ALLOW_PLATE, allowPlateFilter);
  },
};
