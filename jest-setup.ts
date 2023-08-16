import "@testing-library/jest-dom";

import {
  getCurrentPositionMock,
  matchMediaMock,
  addListenerMock,
  addEventListenerMock,
} from "@/__tests__/__mocks__";

getCurrentPositionMock.mockImplementation((_success, rejected) =>
  rejected({
    code: "",
    message: "",
    PERMISSION_DENIED: "",
    POSITION_UNAVAILABLE: "",
    TIMEOUT: "",
  })
);

matchMediaMock.mockImplementation(() => false);
addListenerMock.mockImplementation(
  () => (callback: any) => callback({ matches: false })
);
addEventListenerMock.mockImplementation((_eventType: string, callback: any) =>
  callback({ matches: false })
);
