import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ICompareEle } from '../types/ICompareEle';
import { genBack } from '../utils/getFile';

import copy from 'copy-to-clipboard';

const compareEleAdapter = createEntityAdapter<ICompareEle>({
  selectId: (compareEle) => compareEle.id,
});

const INITIAL_STATE = {
  ...compareEleAdapter.getInitialState(),
  isComparing: false,
  namespaceSetup: {} as Record<string, Record<string, number>>,
  totalNamespace: [] as string[],
  totalLocales: [] as string[],
  usedNamespace: [] as string[],
  usedLocale: [] as string[],
};

export const exportAction = createAsyncThunk<
  void,
  number,
  {
    state: RootState;
  }
>('compareSlice/export', async (id, thunkApi) => {
  const content = thunkApi.getState().compare.entities[id]!.content;

  const blob = new Blob([JSON.stringify(genBack(content))], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'export.json';
  link.click();
  URL.revokeObjectURL(url);
});

export const copyAction = createAsyncThunk<void, number, { state: RootState }>(
  'compare/copy',
  (id, thunkApi) => {
    const content = thunkApi.getState().compare.entities[id]!.content;

    if (!content) return;
    copy(JSON.stringify(genBack(content), null, 2));
    alert('Copied!');
  }
);

const compareSlice = createSlice({
  name: 'compare',
  initialState: INITIAL_STATE,
  reducers: {
    setIsComparing(state, { payload }: { payload: boolean }) {
      state.isComparing = payload;
    },
    setContent(state, { payload }: { payload: ICompareEle[] }) {
      compareEleAdapter.upsertMany(state, payload);
      payload.forEach((item) => {
        state.namespaceSetup[item.fileName] ??= {};
        state.namespaceSetup[item.fileName][item.expectedLocale] = item.id;
      });
      if (state.ids.length) {
        state.totalNamespace = [
          ...new Set(state.ids.map((id) => state.entities[id]!.fileName)),
        ];
        state.totalLocales = [
          ...new Set(state.ids.map((id) => state.entities[id]!.expectedLocale)),
        ];
      }
    },
    toggleUsedAllNamespace(state) {
      if (state.usedNamespace.length === state.totalNamespace.length) {
        state.usedNamespace = [];
      } else {
        state.usedNamespace = state.totalNamespace;
      }
    },
    toggleUsedAllLocale(state) {
      if (state.usedLocale.length === state.totalLocales.length) {
        state.usedLocale = [];
      } else {
        state.usedLocale = state.totalLocales;
      }
    },
    toggleUsedNamespace(state, { payload }: { payload: string }) {
      if (state.usedNamespace.includes(payload)) {
        state.usedNamespace = state.usedNamespace.filter((x) => x !== payload);
      } else {
        state.usedNamespace.push(payload);
      }
    },
    toggleUsedLocale(state, { payload }: { payload: string }) {
      if (state.usedLocale.includes(payload)) {
        state.usedLocale = state.usedLocale.filter((x) => x !== payload);
      } else {
        state.usedLocale.push(payload);
      }
    },
    copyTo(
      state,
      { payload: { id, key } }: { payload: { id: number; key: string } }
    ) {
      const sourceNamespaceIndex = state.usedNamespace[0];
      const sourceLocaleIndex = state.usedLocale[0];
      if (sourceNamespaceIndex === undefined && sourceLocaleIndex === undefined)
        return;
      const sourceId =
        state.namespaceSetup[sourceNamespaceIndex][sourceLocaleIndex];
      const source = state.entities[sourceId]!.content;

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
    swapNamespace(state, { payload }: { payload: [number, number] }) {
      [state.usedNamespace[payload[0]], state.usedNamespace[payload[1]]] = [
        state.usedNamespace[payload[1]],
        state.usedNamespace[payload[0]],
      ];
    },
    swapLocale(state, { payload }: { payload: [number, number] }) {
      [state.usedLocale[payload[0]], state.usedLocale[payload[1]]] = [
        state.usedLocale[payload[1]],
        state.usedLocale[payload[0]],
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
    toggleUsedAllNamespace: toggleUsedAllNamespaceAction,
    toggleUsedAllLocale: toggleUsedAllLocaleAction,
    toggleUsedNamespace: toggleUsedNamespaceAction,
    toggleUsedLocale: toggleUsedLocaleAction,
    swapNamespace: swapNamespaceAction,
    swapLocale: swapLocaleAction,
  },
} = compareSlice;
export { reducer as compareReducer };
export const { selectById: selectContentById } = compareEleAdapter.getSelectors(
  (state: RootState) => state.compare
);
