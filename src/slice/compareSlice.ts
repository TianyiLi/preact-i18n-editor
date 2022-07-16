import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ICompareEle } from '../types/ICompareEle';

const compareEleAdapter = createEntityAdapter<ICompareEle>({
  selectId: (compareEle) => compareEle.id,
});

const INITIAL_STATE = {
  ...compareEleAdapter.getInitialState(),
  isComparing: false,
  groupLocale: false,
  localSetup: {} as Record<string, true>,
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
    toggleGroupLocale(state) {
      state.groupLocale = !state.groupLocale;
    },
    addLocale(state, { payload }: { payload: string }) {
      state.localSetup[payload] = true;
    },
    removeLocale(state, { payload }: { payload: string }) {
      delete state.localSetup[payload];
    },
    setLocale(state, { payload }: { payload: { id: number; locale?: string } }) {
      if (payload.locale) {
        state.entities[payload.id]!.expectedLocale = payload.locale;
      } else {
        delete state.entities[payload.id]!.expectedLocale
      }
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

export const {
  reducer,
  actions: {
    setIsComparing: setIsComparingAction,
    setContent: setContentAction,
    copyTo: copyToAction,
    changeContent: changeContentAction,
    removeContent: removeContentAction,
    toggleUsedIndex: toggleUsedIndexAction,
    swap: swapAction,
    setLocale: setLocaleAction,
    addLocale: addLocaleAction,
    removeLocale: removeLocaleAction,
  },
} = compareSlice;
export { reducer as compareReducer };
export const { selectById: selectContentById } = compareEleAdapter.getSelectors(
  (state: RootState) => state.compare
);
