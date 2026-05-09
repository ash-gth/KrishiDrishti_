import { createContext, useContext, useReducer, useCallback } from 'react';
import { detectDisease, getHistory, deleteHistoryRecord } from '../services/api';
import toast from 'react-hot-toast';

// ─── State Shape ────────────────────────────────────────────────────
const initialState = {
  // Detection
  currentDetection: null,
  detectionLoading: false,
  uploadProgress: 0,
  previewUrl: null,
  selectedFile: null,

  // History
  history: [],
  historyTotal: 0,
  historyPage: 1,
  historyPageSize: 20,
  historyLoading: false,
  historyFilter: { plant: '', disease: '' },

  // UI
  apiStatus: 'unknown', // 'ok' | 'error' | 'unknown'
};

// ─── Action Types ────────────────────────────────────────────────────
const A = {
  SET_SELECTED_FILE:    'SET_SELECTED_FILE',
  SET_PREVIEW_URL:      'SET_PREVIEW_URL',
  DETECTION_START:      'DETECTION_START',
  DETECTION_PROGRESS:   'DETECTION_PROGRESS',
  DETECTION_SUCCESS:    'DETECTION_SUCCESS',
  DETECTION_FAIL:       'DETECTION_FAIL',
  CLEAR_DETECTION:      'CLEAR_DETECTION',
  HISTORY_START:        'HISTORY_START',
  HISTORY_SUCCESS:      'HISTORY_SUCCESS',
  HISTORY_FAIL:         'HISTORY_FAIL',
  HISTORY_DELETE:       'HISTORY_DELETE',
  SET_HISTORY_FILTER:   'SET_HISTORY_FILTER',
  SET_HISTORY_PAGE:     'SET_HISTORY_PAGE',
  SET_API_STATUS:       'SET_API_STATUS',
};

// ─── Reducer ─────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case A.SET_SELECTED_FILE:
      return { ...state, selectedFile: action.payload };
    case A.SET_PREVIEW_URL:
      return { ...state, previewUrl: action.payload };

    case A.DETECTION_START:
      return { ...state, detectionLoading: true, uploadProgress: 0, currentDetection: null };
    case A.DETECTION_PROGRESS:
      return { ...state, uploadProgress: action.payload };
    case A.DETECTION_SUCCESS:
      return { ...state, detectionLoading: false, uploadProgress: 100, currentDetection: action.payload };
    case A.DETECTION_FAIL:
      return { ...state, detectionLoading: false, uploadProgress: 0 };

    case A.CLEAR_DETECTION:
      return { ...state, currentDetection: null, previewUrl: null, selectedFile: null, uploadProgress: 0 };

    case A.HISTORY_START:
      return { ...state, historyLoading: true };
    case A.HISTORY_SUCCESS:
      return {
        ...state,
        historyLoading: false,
        history: action.payload.results,
        historyTotal: action.payload.total,
        historyPage: action.payload.page,
        historyPageSize: action.payload.page_size,
      };
    case A.HISTORY_FAIL:
      return { ...state, historyLoading: false };

    case A.HISTORY_DELETE:
      return {
        ...state,
        history: state.history.filter(r => r.id !== action.payload),
        historyTotal: state.historyTotal - 1,
      };

    case A.SET_HISTORY_FILTER:
      return { ...state, historyFilter: { ...state.historyFilter, ...action.payload }, historyPage: 1 };
    case A.SET_HISTORY_PAGE:
      return { ...state, historyPage: action.payload };
    case A.SET_API_STATUS:
      return { ...state, apiStatus: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── File Selection ────────────────────────────────────────────────
  const selectFile = useCallback((file) => {
    if (!file) return;
    dispatch({ type: A.SET_SELECTED_FILE, payload: file });
    const url = URL.createObjectURL(file);
    dispatch({ type: A.SET_PREVIEW_URL, payload: url });
  }, []);

  // ── Disease Detection ──────────────────────────────────────────────
  const runDetection = useCallback(async (file) => {
    const targetFile = file || state.selectedFile;
    if (!targetFile) {
      toast.error('Please select an image first.');
      return;
    }
    dispatch({ type: A.DETECTION_START });
    try {
      const result = await detectDisease(targetFile, (progress) => {
        dispatch({ type: A.DETECTION_PROGRESS, payload: progress });
      });
      dispatch({ type: A.DETECTION_SUCCESS, payload: result });
      toast.success('Detection complete!', { icon: '🌿' });
      return result;
    } catch (err) {
      dispatch({ type: A.DETECTION_FAIL });
      toast.error(err.message || 'Detection failed. Is the backend running?');
    }
  }, [state.selectedFile]);

  const clearDetection = useCallback(() => {
    dispatch({ type: A.CLEAR_DETECTION });
  }, []);

  // ── History ───────────────────────────────────────────────────────
  const fetchHistory = useCallback(async (overrides = {}) => {
    dispatch({ type: A.HISTORY_START });
    try {
      const params = {
        page: state.historyPage,
        pageSize: state.historyPageSize,
        ...state.historyFilter,
        ...overrides,
      };
      const data = await getHistory(params);
      dispatch({ type: A.HISTORY_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: A.HISTORY_FAIL });
      toast.error('Could not load history.');
    }
  }, [state.historyPage, state.historyPageSize, state.historyFilter]);

  const removeRecord = useCallback(async (id) => {
    try {
      await deleteHistoryRecord(id);
      dispatch({ type: A.HISTORY_DELETE, payload: id });
      toast.success('Record deleted.');
    } catch {
      toast.error('Could not delete record.');
    }
  }, []);

  const setHistoryFilter = useCallback((filter) => {
    dispatch({ type: A.SET_HISTORY_FILTER, payload: filter });
  }, []);

  const setHistoryPage = useCallback((page) => {
    dispatch({ type: A.SET_HISTORY_PAGE, payload: page });
  }, []);

  // ─── Context Value ───────────────────────────────────────────────
  const value = {
    ...state,
    // Actions
    selectFile,
    runDetection,
    clearDetection,
    fetchHistory,
    removeRecord,
    setHistoryFilter,
    setHistoryPage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
