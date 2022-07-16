import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ICompareEle } from '../types/ICompareEle';

const compareEleAdapter = createEntityAdapter<ICompareEle>({
  selectId: (compareEle) => compareEle.id,
});

const INITIAL_STATE = {
  ...compareEleAdapter.getInitialState(),
  isComparing: false,
  useIndex: [] as number[],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState: INITIAL_STATE,
  reducers: {
    setIsComparing(state, { payload }: { payload: boolean }) {
      state.isComparing = payload;
    },
    setContent(state, { payload }: { payload: ICompareEle[] }) {
      compareEleAdapter.setAll(state, payload);
    },
    toggleUsedIndex(state, { payload }: { payload: number }) {
      if (state.useIndex.includes(payload)) {
        state.useIndex = state.useIndex.filter((x) => x !== payload);
      } else {
        state.useIndex.push(payload);
      }
    },
    removeContent(state, { payload }: { payload: number }) {
      compareEleAdapter.removeOne(state, payload);
      state.useIndex = state.useIndex.filter((x) => x !== payload);
    },
    copyTo(
      state,
      { payload: { id, key } }: { payload: { id: number; key: string } }
    ) {
      const sourceIndex = state.useIndex[0];
      if (sourceIndex === undefined) return;
      const source = state.entities[sourceIndex]!.content;

      state.entities[id]!.content[key] = source[key];
    },
    changeContent(
      state,
      {
        payload: { id, key, value },
      }: {
        payload: { id: number; key: string; value: string };
      }
    ) {
      state.entities[id]!.content[key] = value;
    },
    swap(state, { payload }: { payload: [number, number] }) {
      [state.useIndex[payload[0]], state.useIndex[payload[1]]] = [
        state.useIndex[payload[1]],
        state.useIndex[payload[0]],
      ];
    },
  },
});

const {
  reducer,
  actions: {
    setIsComparing: setIsComparingAction,
    setContent: setContentAction,
    copyTo: copyToAction,
    changeContent: changeContentAction,
    removeContent: removeContentAction,
    toggleUsedIndex: toggleUsedIndexAction,
    swap: swapAction,
  },
} = compareSlice;
export {
  reducer as compareReducer,
  setIsComparingAction,
  setContentAction,
  copyToAction,
  changeContentAction,
  removeContentAction,
  toggleUsedIndexAction,
  swapAction,
};
export const { selectById: selectContentById } = compareEleAdapter.getSelectors(
  (state: RootState) => state.compare
);
